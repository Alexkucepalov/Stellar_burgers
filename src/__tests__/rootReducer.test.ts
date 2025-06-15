import { describe, it, expect } from '@jest/globals';
import { rootReducer } from '../services/reducers/rootReducer';

describe('root reducer', () => {
    // Тест начального состояния
    it('should return initial state', () => {
        const initialState = rootReducer(undefined, { type: 'unknown' });
        
        // Проверяем наличие всех необходимых частей состояния
        expect(initialState).toHaveProperty('ingredients');
        expect(initialState).toHaveProperty('burgerConstructor');
        expect(initialState).toHaveProperty('order');
        expect(initialState).toHaveProperty('auth');
        expect(initialState).toHaveProperty('ws');
        expect(initialState).toHaveProperty('wsAuth');

        // Проверяем начальные значения
        expect(initialState.ingredients).toEqual({
            items: [],
            loading: false,
            error: null
        });

        expect(initialState.burgerConstructor).toEqual({
            items: [],
            bun: null
        });

        expect(initialState.order).toEqual({
            orderNumber: null,
            loading: false,
            error: null
        });

        expect(initialState.auth).toEqual({
            user: null,
            accessToken: null,
            loading: false,
            error: null,
            isAuthChecked: false
        });

        expect(initialState.ws).toEqual({
            wsConnected: false,
            orders: [],
            total: null,
            totalToday: null,
            error: undefined
        });

        expect(initialState.wsAuth).toEqual({
            wsConnected: false,
            orders: [],
            total: null,
            totalToday: null,
            error: undefined
        });
    });
}); 