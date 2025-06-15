import React, { useEffect, useRef, useState } from 'react';
import s from './burger-ingredients.module.scss';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import {
	CurrencyIcon,
	Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal } from '../modal/modal';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Ingredient } from '@utils/types';
import { useAppSelector } from '@services/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerIngredients: React.FC = () => {
	const ingredients = useAppSelector((state) => state.ingredients.items);
	const { items, bun } = useAppSelector((state) => state.burgerConstructor);

	const [current, setCurrent] = React.useState('one');

	const containerRef = useRef<HTMLDivElement>(null);
	const bunsRef = useRef<HTMLHeadingElement>(null);
	const saucesRef = useRef<HTMLHeadingElement>(null);
	const fillingsRef = useRef<HTMLHeadingElement>(null);

	const buns = ingredients.filter((item) => item.type === 'bun');
	const sauces = ingredients.filter((item) => item.type === 'sauce');
	const mains = ingredients.filter((item) => item.type === 'main');

	const navigate = useNavigate();
	const location = useLocation();

	const handleScroll = () => {
		const bunsTop = bunsRef.current?.getBoundingClientRect().top || 0;
		const saucesTop = saucesRef.current?.getBoundingClientRect().top || 0;
		const fillingsTop = fillingsRef.current?.getBoundingClientRect().top || 0;

		if (bunsTop < window.innerHeight / 2) {
			setCurrent('one');
		}
		if (saucesTop < window.innerHeight / 2) {
			setCurrent('two');
		}
		if (fillingsTop < window.innerHeight / 2) {
			setCurrent('three');
		}
	};

	const scrollToSection = (ref: React.RefObject<HTMLHeadingElement>) => {
		if (containerRef.current && ref.current) {
			containerRef.current.scrollTo({
				top: ref.current.offsetTop - containerRef.current.offsetTop,
				behavior: 'smooth',
			});
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleIngredientClick = (ingredient: Ingredient) => {
		navigate(`/ingredients/${ingredient._id}`, { state: { background: location } });
	};

	// подсчет количества ингредиентов
	const getIngredientCount = (id: string): number | null => {
		if (bun && bun._id === id) {
			return 2; // верхняя и нижняя булка
		}
		if (!items || items.length === 0) {
			return null; // если items пустой, возвращаем null
		}
		// считаем количество ингредиентов с одинаковым _id
		return items.filter((item) => item._id === id).length || null;
	};

	return (
		<div className={s.container}>
			<p className='text text_type_main-large pb-5'>Соберите бургер</p>
			<div className='pb-10' style={{ display: 'flex' }}>
				<Tab
					value='one'
					active={current === 'one'}
					onClick={() => {
						setCurrent('one');
						scrollToSection(bunsRef);
					}}>
					Булки
				</Tab>
				<Tab
					value='two'
					active={current === 'two'}
					onClick={() => {
						setCurrent('two');
						scrollToSection(saucesRef);
					}}>
					Соусы
				</Tab>
				<Tab
					value='three'
					active={current === 'three'}
					onClick={() => {
						setCurrent('three');
						scrollToSection(fillingsRef);
					}}>
					Начинки
				</Tab>
			</div>

			<div ref={containerRef} className={s.ingredients}>
				<Droppable droppableId='ingredients' isDropDisabled={true}>
					{(provided) => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
							<h2 ref={bunsRef} className='text text_type_main-medium'>
								Булки
							</h2>
							<div className={s.ingredientRow}>
								{buns.map((ingredient, index) => (
									<Draggable
										key={ingredient._id}
										draggableId={ingredient._id}
										index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className={s.ingredient}
												onClick={() => handleIngredientClick(ingredient)}>
												<img
													src={ingredient.image}
													alt={ingredient.name}
													className={s.image}
												/>
												<div className={s.info}>
													<p className={s.price}>
														{ingredient.price} <CurrencyIcon type='primary' />
													</p>
													<p className={s.name}>{ingredient.name}</p>
												</div>
												{getIngredientCount(ingredient._id) !== null && (
													<Counter
														count={getIngredientCount(ingredient._id) as number}
														size='default'
													/>
												)}
											</div>
										)}
									</Draggable>
								))}
							</div>

							<h2 ref={saucesRef} className='text text_type_main-medium'>
								Соусы
							</h2>
							<div className={s.ingredientRow}>
								{sauces.map((ingredient, index) => (
									<Draggable
										key={ingredient._id}
										draggableId={ingredient._id}
										index={buns.length + index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className={s.ingredient}
												onClick={() => handleIngredientClick(ingredient)}>
												<img
													src={ingredient.image}
													alt={ingredient.name}
													className={s.image}
												/>
												<div className={s.info}>
													<p className={s.price}>
														{ingredient.price} <CurrencyIcon type='primary' />
													</p>
													<p className={s.name}>{ingredient.name}</p>
												</div>
												{getIngredientCount(ingredient._id) !== null && (
													<Counter
														count={getIngredientCount(ingredient._id) as number}
														size='default'
													/>
												)}
											</div>
										)}
									</Draggable>
								))}
							</div>

							<h2 ref={fillingsRef} className='text text_type_main-medium'>
								Начинки
							</h2>
							<div className={s.ingredientRow}>
								{mains.map((ingredient, index) => (
									<Draggable
										key={ingredient._id}
										draggableId={ingredient._id}
										index={buns.length + sauces.length + index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className={s.ingredient}
												onClick={() => handleIngredientClick(ingredient)}>
												<img
													src={ingredient.image}
													alt={ingredient.name}
													className={s.image}
												/>
												<div className={s.info}>
													<p className={s.price}>
														{ingredient.price} <CurrencyIcon type='primary' />
													</p>
													<p className={s.name}>{ingredient.name}</p>
												</div>
												{getIngredientCount(ingredient._id) !== null && (
													<Counter
														count={getIngredientCount(ingredient._id) as number}
														size='default'
													/>
												)}
											</div>
										)}
									</Draggable>
								))}
							</div>
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		</div>
	);
};
