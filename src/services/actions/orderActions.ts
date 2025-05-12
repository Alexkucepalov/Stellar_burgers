import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '@utils/api';

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (ingredients: string[], { rejectWithValue }) => {
		try {
			const data = await request('orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
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
