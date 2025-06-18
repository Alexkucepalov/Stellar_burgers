import { describe, it, expect } from '@jest/globals';
import constructorReducer, { initialState } from '../services/reducers/constructorReducer';
import { addIngredient, removeIngredient, moveIngredient, clearConstructor } from '../services/reducers/constructorReducer';
import { Ingredient } from '../utils/types';

describe('constructor reducer', () => {
    // Тест начального состояния
    it('should return initial state', () => {
        expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    // Тест добавления булки
    it('should handle adding a bun', () => {
        const mockBun: Ingredient = {
            _id: '1',
            name: 'Test Bun',
            type: 'bun',
            proteins: 10,
            fat: 5,
            carbohydrates: 20,
            calories: 200,
            price: 100,
            image: 'test-bun.jpg'
        };

        const action = addIngredient(mockBun);
        const result = constructorReducer(initialState, action);

        expect(result.bun).toBeDefined();
        expect(result.bun?.name).toBe(mockBun.name);
        expect(result.bun?.uniqueId).toBeDefined();
        expect(result.items).toEqual([]);
    });

    // Тест добавления ингредиента
    it('should handle adding an ingredient', () => {
        const mockIngredient: Ingredient = {
            _id: '2',
            name: 'Test Ingredient',
            type: 'main',
            proteins: 15,
            fat: 8,
            carbohydrates: 25,
            calories: 250,
            price: 150,
            image: 'test-ingredient.jpg'
        };

        const action = addIngredient(mockIngredient);
        const result = constructorReducer(initialState, action);

        expect(result.items).toHaveLength(1);
        expect(result.items[0].name).toBe(mockIngredient.name);
        expect(result.items[0].uniqueId).toBeDefined();
        expect(result.bun).toBeNull();
    });

    // Тест удаления ингредиента
    it('should handle removing an ingredient', () => {
        const mockIngredient: Ingredient = {
            _id: '2',
            name: 'Test Ingredient',
            type: 'main',
            proteins: 15,
            fat: 8,
            carbohydrates: 25,
            calories: 250,
            price: 150,
            image: 'test-ingredient.jpg'
        };

        const addAction = addIngredient(mockIngredient);
        const stateWithIngredient = constructorReducer(initialState, addAction);
        const removeAction = removeIngredient(stateWithIngredient.items[0].uniqueId);
        const result = constructorReducer(stateWithIngredient, removeAction);

        expect(result.items).toHaveLength(0);
    });

    // Тест перемещения ингредиента
    it('should handle moving an ingredient', () => {
        const mockIngredient1: Ingredient = {
            _id: '2',
            name: 'Test Ingredient 1',
            type: 'main',
            proteins: 15,
            fat: 8,
            carbohydrates: 25,
            calories: 250,
            price: 150,
            image: 'test-ingredient-1.jpg'
        };

        const mockIngredient2: Ingredient = {
            _id: '3',
            name: 'Test Ingredient 2',
            type: 'main',
            proteins: 20,
            fat: 10,
            carbohydrates: 30,
            calories: 300,
            price: 200,
            image: 'test-ingredient-2.jpg'
        };

        const addAction1 = addIngredient(mockIngredient1);
        const stateWithIngredient1 = constructorReducer(initialState, addAction1);
        const addAction2 = addIngredient(mockIngredient2);
        const stateWithTwoIngredients = constructorReducer(stateWithIngredient1, addAction2);

        const moveAction = moveIngredient({ from: 0, to: 1 });
        const result = constructorReducer(stateWithTwoIngredients, moveAction);

        expect(result.items).toHaveLength(2);
        expect(result.items[0].name).toBe(mockIngredient2.name);
        expect(result.items[1].name).toBe(mockIngredient1.name);
    });

    // Тест очистки конструктора
    it('should handle clearing the constructor', () => {
        const mockBun: Ingredient = {
            _id: '1',
            name: 'Test Bun',
            type: 'bun',
            proteins: 10,
            fat: 5,
            carbohydrates: 20,
            calories: 200,
            price: 100,
            image: 'test-bun.jpg'
        };

        const mockIngredient: Ingredient = {
            _id: '2',
            name: 'Test Ingredient',
            type: 'main',
            proteins: 15,
            fat: 8,
            carbohydrates: 25,
            calories: 250,
            price: 150,
            image: 'test-ingredient.jpg'
        };

        const addBunAction = addIngredient(mockBun);
        const stateWithBun = constructorReducer(initialState, addBunAction);
        const addIngredientAction = addIngredient(mockIngredient);
        const stateWithBunAndIngredient = constructorReducer(stateWithBun, addIngredientAction);

        const clearAction = clearConstructor();
        const result = constructorReducer(stateWithBunAndIngredient, clearAction);

        expect(result).toEqual(initialState);
    });
}); 