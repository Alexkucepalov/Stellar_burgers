import { createReducer } from '@reduxjs/toolkit';
import {
	setCurrentIngredient,
	clearCurrentIngredient,
} from '../actions/currentIngredientActions';
import { Ingredient } from '@utils/types';

interface CurrentIngredientState {
	item: Ingredient | null;
}

export const initialState: CurrentIngredientState = {
	item: null,
};

const currentIngredientReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(setCurrentIngredient, (state, action) => {
			state.item = action.payload;
		})
		.addCase(clearCurrentIngredient, (state) => {
			state.item = null;
		});
});

export default currentIngredientReducer;
