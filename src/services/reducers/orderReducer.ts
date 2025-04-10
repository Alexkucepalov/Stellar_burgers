import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface OrderResponse {
	name: string;
	order: {
		number: number;
	};
	success: boolean;
}

interface OrderState {
	orderNumber: number | null;
	loading: boolean;
	error: string | null;
}

const initialState: OrderState = {
	orderNumber: null,
	loading: false,
	error: null,
};

// fсинхронный экшен для создания заказа
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

			const data: OrderResponse = await response.json();

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

const orderReducer = createSlice({
	name: 'order',
	initialState,
	reducers: {
		clearOrder: (state) => {
			state.orderNumber = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.orderNumber = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.orderNumber = action.payload;
				state.loading = false;
				state.error = null;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
				state.orderNumber = null;
			});
	},
});

export const { clearOrder } = orderReducer.actions;
export default orderReducer.reducer;
