import React, { useState } from 'react';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { API_URL } from '@utils/constants';
import s from './home.module.scss';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
	addIngredient,
	moveIngredient,
} from '@services/reducers/constructorReducer';

const Home = () => {
	const dispatch = useAppDispatch();
	const { items: ingredients, error } = useAppSelector(
		(state) => state.ingredients
	);

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
			console.log('Dragged ingredient:', draggedIngredient);
			if (draggedIngredient) {
				dispatch(addIngredient(draggedIngredient));
			} else {
				console.error(
					'Ingredient not found for draggableId:',
					result.draggableId
				);
			}
		}
	};

	return (
		<main className={s.app}>
			{error && <p>{error}</p>}

			<DragDropContext onDragEnd={handleDrop}>
				<section className={s.burgerContainer}>
					<BurgerIngredients />
					<BurgerConstructor />
				</section>
			</DragDropContext>
		</main>
	);
};

export default Home;
