import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient } from '@utils/types';

interface ConstructorState {
	items: (Ingredient & { uniqueId: string })[];
	bun: (Ingredient & { uniqueId: string }) | null;
}

const initialState: ConstructorState = {
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

				if (ingredient.type === 'bun') {
					console.log('Adding bun:', ingredient);
					return {
						...state,
						bun: ingredient,
					};
				}

				console.log('Adding ingredient to items:', ingredient);

				const existingIngredient = state.items?.find(
					(item) => item._id === ingredient._id
				);

				return {
					...state,
					items: existingIngredient
						? state.items.map((item) =>
								item._id === ingredient._id
									? { ...item, count: (item.count || 0) + 1 }
									: item
						  )
						: state.items
						? [...state.items, { ...ingredient, count: 1 }]
						: [{ ...ingredient, count: 1 }],
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
			if (!state.items) return;

			const index = state.items.findIndex(
				(item) => item.uniqueId === action.payload
			);

			if (index !== -1) {
				const ingredient = state.items[index];

				state.items =
					ingredient.count && ingredient.count > 1
						? state.items.map((item, i) =>
								i === index ? { ...item, count: item.count! - 1 } : item
						  )
						: state.items.filter((_, i) => i !== index);
			}
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
