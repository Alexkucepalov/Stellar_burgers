import { createSlice } from '@reduxjs/toolkit';
import { fetchIngredients } from '../actions/ingredientsActions';
import { Ingredient } from '@utils/types';

interface IngredientsState {
	items: Ingredient[];
	loading: boolean;
	error: string | null;
}

const initialState: IngredientsState = {
	items: [],
	loading: false,
	error: null,
};

const ingredientsSlice = createSlice({
	name: 'ingredients',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default ingredientsSlice.reducer;
