import { createReducer, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
  WS_AUTH_CONNECTION_SUCCESS,
  WS_AUTH_CONNECTION_ERROR,
  WS_AUTH_CONNECTION_CLOSED,
  WS_AUTH_GET_MESSAGE,
  TWsAuthActions
} from '../actions/wsActions';
import { IOrder } from '../../utils/types';

interface IWsAuthState {
  wsConnected: boolean;
  orders: IOrder[];
  total: number | null;
  totalToday: number | null;
  error: string | undefined;
}

const initialState: IWsAuthState = {
  wsConnected: false,
  orders: [],
  total: null,
  totalToday: null,
  error: undefined
};

export const wsAuthReducer = createReducer(initialState, (builder: ActionReducerMapBuilder<IWsAuthState>) => {
  builder
    .addCase(WS_AUTH_CONNECTION_SUCCESS, (state: IWsAuthState) => {
      state.wsConnected = true;
      state.error = undefined;
    })
    .addCase(WS_AUTH_CONNECTION_ERROR, (state: IWsAuthState, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.error = action.payload;
    })
    .addCase(WS_AUTH_CONNECTION_CLOSED, (state: IWsAuthState) => {
      state.wsConnected = false;
      state.error = undefined;
      state.orders = [];
      state.total = null;
      state.totalToday = null;
    })
    .addCase(WS_AUTH_GET_MESSAGE, (state: IWsAuthState, action: PayloadAction<{ orders: IOrder[], total: number, totalToday: number }>) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
    });
}); 