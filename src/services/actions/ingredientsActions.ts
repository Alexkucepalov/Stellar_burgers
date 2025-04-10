import { createAsyncThunk } from '@reduxjs/toolkit';
import { Ingredient } from '@utils/types';

export const fetchIngredients = createAsyncThunk(
	'ingredients/fetchIngredients',
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch(
				'https://norma.nomoreparties.space/api/ingredients'
			);

			if (!response.ok) {
				throw new Error('Failed to fetch ingredients');
			}

			const data = await response.json();

			if (!data.success) {
				throw new Error('API response was not successful');
			}

			return data.data as Ingredient[];
		} catch (err: unknown) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			}
			return rejectWithValue('An unknown error occurred');
		}
	}
);
