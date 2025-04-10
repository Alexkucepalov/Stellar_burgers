import React, { useEffect, useState } from 'react';
import { AppHeader } from '@components/app-header/app-header';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { API_URL } from '@utils/constants';
import s from './app.module.scss';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/actions/ingredientsActions';
import {
	addIngredient,
	moveIngredient,
} from '@services/reducers/constructorReducer';

const App = () => {
	const dispatch = useAppDispatch();
	const { items: ingredients, error } = useAppSelector(
		(state) => state.ingredients
	);

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

	const handleDrop = (result: DropResult) => {
		const { source, destination } = result;

		if (!destination) {
			return;
		}

		const isSameContainer = source.droppableId === destination.droppableId;
		const isMovingToConstructor =
			source.droppableId === 'ingredients' &&
			destination.droppableId === 'constructor';

		if (isSameContainer && source.droppableId === 'constructor') {
			dispatch(
				moveIngredient({
					from: source.index,
					to: destination.index,
				})
			);
			return;
		}

		if (isMovingToConstructor) {
			const draggedIngredient = ingredients.find(
				(item) => item._id === result.draggableId
			);
			if (draggedIngredient) {
				dispatch(addIngredient(draggedIngredient));
			}
		}
	};

	return (
		<main className={s.app}>
			{error && <p>{error}</p>}
			<header>
				<AppHeader />
			</header>

			<DragDropContext onDragEnd={handleDrop}>
				<section className={s.burgerContainer}>
					<BurgerIngredients ingredients={ingredients} />
					<BurgerConstructor />
				</section>
			</DragDropContext>
		</main>
	);
};

export default App;
