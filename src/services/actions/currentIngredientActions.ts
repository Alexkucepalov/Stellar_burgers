import { createAction } from '@reduxjs/toolkit';
import { Ingredient } from '@utils/types';

export const setCurrentIngredient = createAction<Ingredient>(
	'currentIngredient/setCurrentIngredient'
);

export const clearCurrentIngredient = createAction(
	'currentIngredient/clearCurrentIngredient'
);
