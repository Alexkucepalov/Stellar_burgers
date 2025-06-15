import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '@utils/api';
import { RootState } from '../store';

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (ingredients: string[], { rejectWithValue, getState }) => {
		try {
			const state = getState() as RootState;
			const accessToken = state.auth.accessToken;

			const headers: HeadersInit = {
				'Content-Type': 'application/json',
			};

			if (accessToken) {
				headers['Authorization'] = `Bearer ${accessToken}`;
			}

			const data = await request('orders', {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({ ingredients }),
			});
			return data.order.number;
		} catch (err) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			}
			return rejectWithValue('Произошла неизвестная ошибка');
		}
	}
);
