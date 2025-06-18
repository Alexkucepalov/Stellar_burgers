import { describe, it, expect } from '@jest/globals';
import currentIngredientReducer, { initialState } from '../services/reducers/currentIngredientReducer';
import { setCurrentIngredient, clearCurrentIngredient } from '../services/actions/currentIngredientActions';
import { Ingredient } from '../utils/types';

describe('currentIngredient reducer', () => {
    // Тест начального состояния
    it('should return initial state', () => {
        expect(currentIngredientReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    // Тест установки текущего ингредиента
    it('should handle setCurrentIngredient', () => {
        const mockIngredient: Ingredient = {
            _id: '1',
            name: 'Test Ingredient',
            type: 'main',
            proteins: 15,
            fat: 8,
            carbohydrates: 25,
            calories: 250,
            price: 150,
            image: 'test-ingredient.jpg'
        };

        const action = setCurrentIngredient(mockIngredient);
        const result = currentIngredientReducer(initialState, action);

        expect(result.item).toEqual(mockIngredient);
    });

    // Тест очистки текущего ингредиента
    it('should handle clearCurrentIngredient', () => {
        const stateWithIngredient = {
            ...initialState,
            item: {
                _id: '1',
                name: 'Test Ingredient',
                type: 'main',
                proteins: 15,
                fat: 8,
                carbohydrates: 25,
                calories: 250,
                price: 150,
                image: 'test-ingredient.jpg'
            }
        };

        const action = clearCurrentIngredient();
        const result = currentIngredientReducer(stateWithIngredient, action);

        expect(result.item).toBeNull();
    });
}); 