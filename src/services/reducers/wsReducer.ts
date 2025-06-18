import { createReducer } from '@reduxjs/toolkit';
import {
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSED,
  WS_GET_MESSAGE,
  TWsActions,
  IWSConnectionErrorAction,
  IWSGetMessageAction
} from '@services/actions/wsActions';

interface IWsState {
  wsConnected: boolean;
  orders: any[];
  total: number | null;
  totalToday: number | null;
  error: string | undefined;
}

export const initialState: IWsState = {
  wsConnected: false,
  orders: [],
  total: null,
  totalToday: null,
  error: undefined,
};

export const wsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(WS_CONNECTION_SUCCESS, (state) => {
      state.wsConnected = true;
      state.error = undefined;
    })
    .addCase(WS_CONNECTION_ERROR, (state, action) => {
      state.wsConnected = false;
      state.error = action.payload;
    })
    .addCase(WS_CONNECTION_CLOSED, (state) => {
      state.wsConnected = false;
      state.error = undefined;
      state.orders = [];
      state.total = null;
      state.totalToday = null;
    })
    .addCase(WS_GET_MESSAGE, (state, action) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
    });
}); 