import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsReducer';
import constructorReducer from './constructorReducer';
import currentIngredientReducer from './currentIngredientReducer';
import orderReducer from './orderReducer';

export const rootReducer = combineReducers({
	ingredients: ingredientsReducer,
	constructor: constructorReducer,
	currentIngredient: currentIngredientReducer,
	order: orderReducer,
});
