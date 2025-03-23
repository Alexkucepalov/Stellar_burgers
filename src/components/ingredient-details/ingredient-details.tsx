import React from 'react';
import s from './ingredient-details.module.scss';
import PropTypes from 'prop-types';

interface IngredientDetailsProps {
    ingredient: {
        name: string;
        image: string;
        calories: number;
        proteins: number;
        fat: number;
        carbohydrates: number;
    };
}

export const IngredientDetails: React.FC<IngredientDetailsProps> = ({ ingredient }) => {
    return (
        <div className={s.container}>
            <h2 className="text text_type_main-large">Детали ингредиента</h2>
            <img src={ingredient.image} alt={ingredient.name} className={s.image} />
            <p className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</p>
            <div className={s.nutrients}>
                <div className={s.nutrient}>
                    <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
                    <p className="text text_type_digits-default text_color_inactive">{ingredient.calories}</p>
                </div>
                <div className={s.nutrient}>
                    <p className="text text_type_main-default text_color_inactive">Белки, г</p>
                    <p className="text text_type_digits-default text_color_inactive">{ingredient.proteins}</p>
                </div>
                <div className={s.nutrient}>
                    <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
                    <p className="text text_type_digits-default text_color_inactive">{ingredient.fat}</p>
                </div>
                <div className={s.nutrient}>
                    <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
                    <p className="text text_type_digits-default text_color_inactive">{ingredient.carbohydrates}</p>
                </div>
            </div>
        </div>
    );
};

IngredientDetails.propTypes = {
    ingredient: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        calories: PropTypes.number.isRequired,
        proteins: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        carbohydrates: PropTypes.number.isRequired
    }).isRequired
}; 