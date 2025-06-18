import { describe, it, expect } from '@jest/globals';
import ingredientsReducer, { initialState } from '../services/reducers/ingredientsReducer';
import { fetchIngredients } from '../services/actions/ingredientsActions';
import { Ingredient } from '../utils/types';

describe('ingredients reducer', () => {
    // Тест начального состояния
    it('should return initial state', () => {
        expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    // Тест начала загрузки ингредиентов
    it('should handle fetchIngredients.pending', () => {
        const action = {
            type: fetchIngredients.pending.type
        };
        const expectedState = {
            ...initialState,
            loading: true,
            error: null
        };
        expect(ingredientsReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест успешной загрузки ингредиентов
    it('should handle fetchIngredients.fulfilled', () => {
        const mockIngredients: Ingredient[] = [
            {
                _id: '1',
                name: 'Test Ingredient 1',
                type: 'bun',
                proteins: 10,
                fat: 5,
                carbohydrates: 20,
                calories: 200,
                price: 100,
                image: 'test-image-1.jpg'
            },
            {
                _id: '2',
                name: 'Test Ingredient 2',
                type: 'main',
                proteins: 15,
                fat: 8,
                carbohydrates: 25,
                calories: 250,
                price: 150,
                image: 'test-image-2.jpg'
            }
        ];

        const action = {
            type: fetchIngredients.fulfilled.type,
            payload: mockIngredients
        };
        const expectedState = {
            ...initialState,
            items: mockIngredients,
            loading: false
        };
        expect(ingredientsReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест ошибки загрузки ингредиентов
    it('should handle fetchIngredients.rejected', () => {
        const errorMessage = 'Failed to fetch ingredients';
        const action = {
            type: fetchIngredients.rejected.type,
            payload: errorMessage
        };
        const expectedState = {
            ...initialState,
            loading: false,
            error: errorMessage
        };
        expect(ingredientsReducer(initialState, action)).toEqual(expectedState);
    });
}); 