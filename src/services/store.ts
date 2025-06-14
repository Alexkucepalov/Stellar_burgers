import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers/rootReducer';
import { socketMiddleware, IWebSocketActions } from './middleware/socketMiddleware';
import { 
  WS_CONNECTION_START,
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSED,
  WS_GET_MESSAGE,
  WS_SEND_MESSAGE,
  WS_AUTH_CONNECTION_START,
  WS_AUTH_CONNECTION_SUCCESS,
  WS_AUTH_CONNECTION_ERROR,
  WS_AUTH_CONNECTION_CLOSED,
  WS_AUTH_GET_MESSAGE,
  WS_AUTH_SEND_MESSAGE
} from './actions/wsActions';

const wsActions: IWebSocketActions = {
  wsConnectionStart: WS_CONNECTION_START,
  wsConnectionSuccess: WS_CONNECTION_SUCCESS,
  wsConnectionError: WS_CONNECTION_ERROR,
  wsConnectionClosed: WS_CONNECTION_CLOSED,
  wsGetMessage: WS_GET_MESSAGE,
  wsSendMessage: WS_SEND_MESSAGE,
};

const wsAuthActions: IWebSocketActions = {
  wsConnectionStart: WS_AUTH_CONNECTION_START,
  wsConnectionSuccess: WS_AUTH_CONNECTION_SUCCESS,
  wsConnectionError: WS_AUTH_CONNECTION_ERROR,
  wsConnectionClosed: WS_AUTH_CONNECTION_CLOSED,
  wsGetMessage: WS_AUTH_GET_MESSAGE,
  wsSendMessage: WS_AUTH_SEND_MESSAGE,
};


export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(socketMiddleware(wsActions), socketMiddleware(wsAuthActions)),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;