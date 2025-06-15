import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient } from '@utils/types';

interface ConstructorState {
	items: (Ingredient & { uniqueId: string })[];
	bun: (Ingredient & { uniqueId: string }) | null;
}

export const initialState: ConstructorState = {
	items: [],
	bun: null,
};

const constructorSlice = createSlice({
	name: 'constructor',
	initialState,
	reducers: {
		addIngredient: {
			reducer: (
				state: ConstructorState,
				action: PayloadAction<Ingredient & { uniqueId: string }>
			) => {
				const ingredient = action.payload;

				// если добавляется булка
				if (ingredient.type === 'bun') {
					console.log('Adding bun:', ingredient);
					return {
						...state,
						bun: ingredient,
					};
				}

				// если добавляется соус или начинка
				console.log('Adding ingredient to items:', ingredient);
				return {
					...state,
					//items: [...state.items, ingredient],
					items: state.items ? [...state.items, ingredient] : [ingredient],
				};
			},
			prepare: (ingredient: Ingredient) => {
				const uniqueId = `${ingredient._id}-${Date.now()}-${Math.random()}`;
				console.log('Generated uniqueId:', uniqueId);
				return {
					payload: {
						...ingredient,
						uniqueId,
					},
				};
			},
		},
		removeIngredient: (
			state: ConstructorState,
			action: PayloadAction<string>
		) => {
			state.items = state.items.filter(
				(item) => item.uniqueId !== action.payload
			);
		},
		moveIngredient: (
			state: ConstructorState,
			action: PayloadAction<{ from: number; to: number }>
		) => {
			const { from, to } = action.payload;

			if (
				from >= 0 &&
				to >= 0 &&
				from < state.items.length &&
				to < state.items.length
			) {
				const newItems = [...state.items];
				const [removed] = newItems.splice(from, 1);
				newItems.splice(to, 0, removed);
				state.items = newItems;
			}
		},
		clearConstructor: (state) => {
			state.items = [];
			state.bun = null;
		},
	},
});

export const {
	addIngredient,
	removeIngredient,
	moveIngredient,
	clearConstructor,
} = constructorSlice.actions;

export default constructorSlice.reducer;
