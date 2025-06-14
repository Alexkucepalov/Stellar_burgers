import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsReducer';
import constructorReducer from './constructorReducer';
import orderReducer from './orderReducer';
import authReducer from './authReducer';
import { wsReducer } from './wsReducer';
import { wsAuthReducer } from '././wsAuthReducer';

export const rootReducer = combineReducers({
	ingredients: ingredientsReducer,
	burgerConstructor: constructorReducer,
	order: orderReducer,
	auth: authReducer,
	ws: wsReducer,
	wsAuth: wsAuthReducer,
});
