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
			<header>
				<AppHeader />
			</header>

<<<<<<< HEAD
			<DragDropContext onDragEnd={handleDrop}>
				<section className={s.burgerContainer}>
					<BurgerIngredients />
					<BurgerConstructor />
				</section>
			</DragDropContext>
		</main>
=======
            if (ingredient && isValidIngredient) {
                setConstructorIngredients(items => {
                    const newItems = [...items];
                    newItems.splice(destination.index, 0, {
                        ...ingredient,
                        uniqueId: `${ingredient._id}-${Date.now()}`
                    });
                    return newItems;
                });
            }
        }
    };

	return (
		<div className={s.app}>
			{error && <p>{error}</p>}
			<AppHeader />
			<DragDropContext onDragEnd={handleDrop}>
				<main className={s.burgerContainer}>
					<BurgerIngredients
						ingredients={ingredients}
						setIngredients={setIngredients}
					/>
					<BurgerConstructor ingredients={constructorIngredients} />
				</main>
			</DragDropContext>
		</div>
>>>>>>> 62ba743d8c651a9bafbb80da46d53b8675794dde
	);
};

export default App;
