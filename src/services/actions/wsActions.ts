import { createAction } from '@reduxjs/toolkit';
import { IWsMessagePayload } from '@utils/types';

// Общие действия для WebSocket
export const WS_CONNECTION_START = createAction<string>('WS_CONNECTION_START');
export const WS_CONNECTION_SUCCESS = createAction('WS_CONNECTION_SUCCESS');
export const WS_CONNECTION_ERROR = createAction<string>('WS_CONNECTION_ERROR');
export const WS_CONNECTION_CLOSED = createAction('WS_CONNECTION_CLOSED');
export const WS_GET_MESSAGE = createAction<IWsMessagePayload>('WS_GET_MESSAGE');
export const WS_SEND_MESSAGE = createAction<any>('WS_SEND_MESSAGE');

// Действия для авторизованного WebSocket
export const WS_AUTH_CONNECTION_START = createAction<string>('WS_AUTH_CONNECTION_START');
export const WS_AUTH_CONNECTION_SUCCESS = createAction('WS_AUTH_CONNECTION_SUCCESS');
export const WS_AUTH_CONNECTION_ERROR = createAction<string>('WS_AUTH_CONNECTION_ERROR');
export const WS_AUTH_CONNECTION_CLOSED = createAction('WS_AUTH_CONNECTION_CLOSED');
export const WS_AUTH_GET_MESSAGE = createAction<IWsMessagePayload>('WS_AUTH_GET_MESSAGE');
export const WS_AUTH_SEND_MESSAGE = createAction<any>('WS_AUTH_SEND_MESSAGE');

// Определения типов действий для использования в редьюсерах
export interface IWSConnectionStartAction {
  type: 'WS_CONNECTION_START';
  payload: string;
}

export interface IWSConnectionSuccessAction {
  type: 'WS_CONNECTION_SUCCESS';
}

export interface IWSConnectionErrorAction {
  type: 'WS_CONNECTION_ERROR';
  payload: string;
}

export interface IWSConnectionClosedAction {
  type: 'WS_CONNECTION_CLOSED';
}

export interface IWSGetMessageAction {
  type: 'WS_GET_MESSAGE';
  payload: IWsMessagePayload;
}

export interface IWSSendMessageAction {
  type: 'WS_SEND_MESSAGE';
  payload: any;
}

export interface IWSAuthConnectionStartAction {
  type: 'WS_AUTH_CONNECTION_START';
  payload: string;
}

export interface IWSAuthConnectionSuccessAction {
  type: 'WS_AUTH_CONNECTION_SUCCESS';
}

export interface IWSAuthConnectionErrorAction {
  type: 'WS_AUTH_CONNECTION_ERROR';
  payload: string;
}

export interface IWSAuthConnectionClosedAction {
  type: 'WS_AUTH_CONNECTION_CLOSED';
}

export interface IWSAuthGetMessageAction {
  type: 'WS_AUTH_GET_MESSAGE';
  payload: IWsMessagePayload;
}

export interface IWSAuthSendMessageAction {
  type: 'WS_AUTH_SEND_MESSAGE';
  payload: any;
}

export type TWsActions =
  | IWSConnectionStartAction
  | IWSConnectionSuccessAction
  | IWSConnectionErrorAction
  | IWSConnectionClosedAction
  | IWSGetMessageAction
  | IWSSendMessageAction;

export type TWsAuthActions =
  | IWSAuthConnectionStartAction
  | IWSAuthConnectionSuccessAction
  | IWSAuthConnectionErrorAction
  | IWSAuthConnectionClosedAction
  | IWSAuthGetMessageAction
  | IWSAuthSendMessageAction;

// Типы для WebSocket действий
export interface IWebSocketActions {
  wsConnectionStart: typeof WS_CONNECTION_START;
  wsConnectionSuccess: typeof WS_CONNECTION_SUCCESS;
  wsConnectionError: typeof WS_CONNECTION_ERROR;
  wsConnectionClosed: typeof WS_CONNECTION_CLOSED;
  wsGetMessage: typeof WS_GET_MESSAGE;
  wsSendMessage?: typeof WS_SEND_MESSAGE;
}

// Типы для авторизованных WebSocket действий
export interface IWebSocketAuthActions {
  wsConnectionStart: typeof WS_AUTH_CONNECTION_START;
  wsConnectionSuccess: typeof WS_AUTH_CONNECTION_SUCCESS;
  wsConnectionError: typeof WS_AUTH_CONNECTION_ERROR;
  wsConnectionClosed: typeof WS_AUTH_CONNECTION_CLOSED;
  wsGetMessage: typeof WS_AUTH_GET_MESSAGE;
  wsSendMessage?: typeof WS_AUTH_SEND_MESSAGE;
}

export const wsConnectionStart = createAction<string, string>('ws/connectionStart');
export const wsConnectionSuccess = createAction('ws/connectionSuccess');
export const wsConnectionError = createAction<string, string>('ws/connectionError');
export const wsConnectionClosed = createAction('ws/connectionClosed');
export const wsGetMessage = createAction<IWsMessagePayload, string>('ws/getMessage');
export const wsSendMessage = createAction<IWsMessagePayload, string>('ws/sendMessage'); 