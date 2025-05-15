import React, { useEffect } from 'react';
import s from './ingredient-details.module.scss';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/hooks';
import { fetchIngredients } from '@services/actions/ingredientsActions';

export const IngredientDetails = () => {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const {
		items: ingredients,
		loading,
		error,
	} = useAppSelector((state) => state.ingredients);
	const ingredient = ingredients.find((item) => item._id === id);

	useEffect(() => {
		if (!ingredients.length && !loading) {
			dispatch(fetchIngredients());
		}
	}, [dispatch, ingredients.length, loading]);

	if (loading) {
		return <p>Загрузка...</p>;
	}

	if (error) {
		return <p>Ошибка загрузки ингредиентов</p>;
	}

	if (!ingredients.length) {
		return <p>Загрузка...</p>;
	}

	return (
		<div className={s.container}>
			<h2 className='text text_type_main-large'>Детали ингредиента</h2>
			<img src={ingredient?.image} alt={ingredient?.name} className={s.image} />
			<p className='text text_type_main-medium mt-4 mb-8'>{ingredient?.name}</p>
			<div className={s.nutrients}>
				<div className={s.nutrient}>
					<p className='text text_type_main-default text_color_inactive'>
						Калории,ккал
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient?.calories}
					</p>
				</div>
				<div className={s.nutrient}>
					<p className='text text_type_main-default text_color_inactive'>
						Белки, г
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient?.proteins}
					</p>
				</div>
				<div className={s.nutrient}>
					<p className='text text_type_main-default text_color_inactive'>
						Жиры, г
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient?.fat}
					</p>
				</div>
				<div className={s.nutrient}>
					<p className='text text_type_main-default text_color_inactive'>
						Углеводы, г
					</p>
					<p className='text text_type_digits-default text_color_inactive'>
						{ingredient?.carbohydrates}
					</p>
				</div>
			</div>
		</div>
	);
};
