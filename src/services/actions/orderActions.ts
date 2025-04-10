import { createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (ingredients: string[], { rejectWithValue }) => {
		try {
			const response = await fetch(
				'https://norma.nomoreparties.space/api/orders',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ ingredients }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || 'Произошла ошибка при создании заказа'
				);
			}

			const data = await response.json();

			if (!data.success) {
				throw new Error('Не удалось создать заказ');
			}

			return data.order.number;
		} catch (err) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			}
			return rejectWithValue('Произошла неизвестная ошибка');
		}
	}
);
