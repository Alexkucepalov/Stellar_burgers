import { describe, it, expect } from '@jest/globals';
import orderReducer, { initialState } from '../services/reducers/orderReducer';
import { createOrder, clearOrder } from '../services/reducers/orderReducer';

describe('order reducer', () => {
    // Тест начального состояния
    it('should return initial state', () => {
        expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    // Тест начала создания заказа
    it('should handle createOrder.pending', () => {
        const action = {
            type: createOrder.pending.type
        };
        const expectedState = {
            ...initialState,
            loading: true,
            error: null,
            orderNumber: null
        };
        expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест успешного создания заказа
    it('should handle createOrder.fulfilled', () => {
        const orderNumber = 12345;
        const action = {
            type: createOrder.fulfilled.type,
            payload: orderNumber
        };
        const expectedState = {
            ...initialState,
            orderNumber,
            loading: false,
            error: null
        };
        expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест ошибки создания заказа
    it('should handle createOrder.rejected', () => {
        const errorMessage = 'Failed to create order';
        const action = {
            type: createOrder.rejected.type,
            payload: errorMessage
        };
        const expectedState = {
            ...initialState,
            loading: false,
            error: errorMessage,
            orderNumber: null
        };
        expect(orderReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест очистки заказа
    it('should handle clearOrder', () => {
        const stateWithOrder = {
            ...initialState,
            orderNumber: 12345,
            error: 'Some error'
        };
        const action = clearOrder();
        const result = orderReducer(stateWithOrder, action);

        expect(result.orderNumber).toBeNull();
        expect(result.error).toBeNull();
    });
}); 