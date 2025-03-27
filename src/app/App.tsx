import React, { useEffect, useState } from 'react';
import { AppHeader } from '@components/app-header/app-header';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { API_URL } from '@utils/constants';
import { Ingredient } from '@utils/types';
import s from './app.module.scss';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

const App = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [constructorIngredients, setConstructorIngredients] = useState<Ingredient[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                const data = await response.json();
                const formattedIngredients: Ingredient[] = data.data.map((item: any) => ({
                    _id: item._id,
                    name: item.name,
                    type: item.type,
                    image: item.image,
                    price: item.price,
                    calories: item.calories,
                    proteins: item.proteins,
                    fat: item.fat,
                    carbohydrates: item.carbohydrates,
                    uniqueId: undefined
                }));
                setIngredients(formattedIngredients);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Неизвестная ошибка');
                }
            }
        };

        fetchIngredients();
    }, []);

    const handleDrop = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        const isSameContainer = source.droppableId === destination.droppableId;
        const isMovingToConstructor = source.droppableId === 'ingredients' && destination.droppableId === 'constructor';

        if (isSameContainer && source.droppableId === 'constructor') {
            setConstructorIngredients(items => {
                const newItems = [...items];
                const [movedItem] = newItems.splice(source.index, 1);
                newItems.splice(destination.index, 0, movedItem);
                return newItems;
            });
            return;
        }

        if (isMovingToConstructor) {
            const ingredient = ingredients.find(ing => ing._id === result.draggableId);
            const isValidIngredient = ingredient?.type === 'sauce' || ingredient?.type === 'main';

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
	);
};

export default App; 