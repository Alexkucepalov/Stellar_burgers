import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import { refreshToken } from "@utils/api";
import { RootState, AppDispatch } from "../store";
import { fetchUser, setAccessToken } from "@services/actions/authActions";
import { IWsMessagePayload } from "@utils/types";

// Определяем общий интерфейс для структуры WebSocket действий
// Это позволяет принимать как WS_CONNECTION_*, так и WS_AUTH_CONNECTION_* создателей действий
export interface IWebSocketActions {
  wsConnectionStart: ActionCreatorWithPayload<string, string>;
  wsConnectionSuccess: ActionCreatorWithoutPayload<string>;
  wsConnectionError: ActionCreatorWithPayload<string, string>;
  wsConnectionClosed: ActionCreatorWithoutPayload<string>;
  wsGetMessage: ActionCreatorWithPayload<IWsMessagePayload, string>;
  wsSendMessage?: ActionCreatorWithPayload<IWsMessagePayload, string>;
}

export const socketMiddleware = (wsActions: IWebSocketActions): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;
    let isConnected = false;
    let reconnectTimeout: number = 0;
    let url: string = '';
    let wsConnectionStartAction: ActionCreatorWithPayload<string, string>;
    let shouldAttemptReconnect = true;

    return (next) => (action) => {
      const dispatch: AppDispatch = store.dispatch;
      const { wsConnectionStart, wsConnectionSuccess, wsConnectionError, wsConnectionClosed, wsGetMessage, wsSendMessage } = wsActions;

      if (wsConnectionStart.match(action)) {
        if (socket) {
          socket.close(1000, 'Reconnecting');
          socket = null;
        }
        
        url = action.payload;
        wsConnectionStartAction = wsConnectionStart;
        const accessToken = (store.getState() as RootState).auth.accessToken;
        
        const wsUrl = url.includes('/orders') && accessToken 
          ? `${url}?token=${accessToken}`
          : url;
        
        console.log('WebSocket URL:', wsUrl);
        console.log('Access Token (from store):', accessToken);
        console.log('Creating new WebSocket with URL:', wsUrl, 'and accessToken from store:', accessToken);
        socket = new WebSocket(wsUrl);
        isConnected = true;
        shouldAttemptReconnect = true;
      }

      if (socket) {
        socket.onopen = (event: Event) => {
          console.log('WebSocket connection opened');
          dispatch(wsConnectionSuccess());
          isConnected = true;
          if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = 0;
          }
        };

        socket.onerror = (event: Event) => {
          console.error('WebSocket error:', event);
          dispatch(wsConnectionError(`WebSocket Error: ${event.type || 'unknown'} ${(event instanceof ErrorEvent && event.message) ? '- ' + event.message : ''}`));
        };

        socket.onmessage = (event: MessageEvent) => {
          let { data } = event;
          
          try {
            const parsedData = JSON.parse(data);
            console.log('WebSocket received data:', parsedData);
            
            if (parsedData.message === 'Invalid or missing token' || parsedData.message === 'jwt expired') {
              console.error('WebSocket auth error: Token invalid or missing, attempting refresh.', parsedData);
              shouldAttemptReconnect = false;
              socket?.close(1000, 'Token refresh initiated');
              socket = null;

              refreshToken().then((newAccessToken) => {
                console.log('Token refreshed successfully.');
                dispatch(setAccessToken(newAccessToken));

                console.log('Verifying new token with fetchUser...');
                dispatch(fetchUser()).then(() => {
                  console.log('fetchUser successful with new token, reconnecting WebSocket.');
                  shouldAttemptReconnect = true;
                  dispatch(wsConnectionStartAction(url));
                }).catch((fetchErr: unknown) => {
                  console.error('fetchUser failed with new token, not reconnecting WebSocket:', fetchErr);
                  dispatch(wsConnectionError('Ошибка авторизации: недействительный токен, не удалось проверить Redux store'));
                  isConnected = false; 
                  shouldAttemptReconnect = false;
                });
              }).catch((err: unknown) => { 
                console.error('Error refreshing token, cannot reconnect:', err);
                dispatch(wsConnectionError('Ошибка авторизации: недействительный токен, не удалось обновить'));
                isConnected = false; 
                shouldAttemptReconnect = false;
              });
              return;
            }

            if (parsedData.success) {
              console.log('WebSocket success data:', parsedData);
              dispatch(wsGetMessage(parsedData));
            } else {
              console.error('WebSocket error data:', parsedData);
              dispatch(wsConnectionError(parsedData.message || 'Ошибка получения данных'));
            }
          } catch (e) {
            console.error("socketMiddleware: Error parsing JSON data:", e, "Original data:", data);
          }
        };

        socket.onclose = (event: CloseEvent) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          if (event.code !== 1000) {
            dispatch(wsConnectionError(`WebSocket закрыт с ошибкой: Код ${event.code}, Причина: ${event.reason || 'Неизвестно'}`));
          }
          
          isConnected = false;

          if (shouldAttemptReconnect && event.code !== 1000 && url) {
            console.log('Attempting to reconnect WebSocket in 3 seconds...');
            reconnectTimeout = window.setTimeout(() => {
              dispatch(wsConnectionStart(url));
            }, 3000); 
          } else {
            console.log('WebSocket reconnect not attempted due to conditions.');
            dispatch(wsConnectionClosed());
          }
        };

        if (wsSendMessage && wsSendMessage.match(action)) {
          console.log('Sending WebSocket message:', action.payload);
          socket.send(JSON.stringify(action.payload));
        }
      }

      next(action);
    };
  };
};