import { describe, it, expect } from '@jest/globals';
import { wsAuthReducer, initialState } from '../services/reducers/wsAuthReducer';
import {
    WS_AUTH_CONNECTION_SUCCESS,
    WS_AUTH_CONNECTION_ERROR,
    WS_AUTH_CONNECTION_CLOSED,
    WS_AUTH_GET_MESSAGE
} from '../services/actions/wsActions';
import { IOrder } from '../utils/types';

describe('wsAuth reducer', () => {
    // Тест начального состояния
    it('should return initial state', () => {
        expect(wsAuthReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    // Тест успешного подключения
    it('should handle WS_AUTH_CONNECTION_SUCCESS', () => {
        const action = {
            type: WS_AUTH_CONNECTION_SUCCESS.type
        };
        const expectedState = {
            ...initialState,
            wsConnected: true,
            error: undefined
        };
        expect(wsAuthReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест ошибки подключения
    it('should handle WS_AUTH_CONNECTION_ERROR', () => {
        const errorMessage = 'Connection failed';
        const action = {
            type: WS_AUTH_CONNECTION_ERROR.type,
            payload: errorMessage
        };
        const expectedState = {
            ...initialState,
            wsConnected: false,
            error: errorMessage
        };
        expect(wsAuthReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест закрытия соединения
    it('should handle WS_AUTH_CONNECTION_CLOSED', () => {
        const mockOrders: IOrder[] = [
            {
                _id: '1',
                ingredients: ['ingredient1', 'ingredient2'],
                status: 'done',
                name: 'Test Order 1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                number: 1
            },
            {
                _id: '2',
                ingredients: ['ingredient3', 'ingredient4'],
                status: 'pending',
                name: 'Test Order 2',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                number: 2
            }
        ];
        const stateWithData = {
            ...initialState,
            wsConnected: true,
            orders: mockOrders,
            total: 100,
            totalToday: 10,
            error: 'Some error'
        };
        const action = {
            type: WS_AUTH_CONNECTION_CLOSED.type
        };
        const expectedState = {
            ...initialState,
            wsConnected: false,
            error: undefined,
            orders: [],
            total: null,
            totalToday: null
        };
        expect(wsAuthReducer(stateWithData, action)).toEqual(expectedState);
    });

    // Тест получения сообщения
    it('should handle WS_AUTH_GET_MESSAGE', () => {
        const mockOrders: IOrder[] = [
            {
                _id: '1',
                ingredients: ['ingredient1', 'ingredient2'],
                status: 'done',
                name: 'Test Order 1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                number: 1
            },
            {
                _id: '2',
                ingredients: ['ingredient3', 'ingredient4'],
                status: 'pending',
                name: 'Test Order 2',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                number: 2
            }
        ];
        const mockTotal = 100;
        const mockTotalToday = 10;
        const action = {
            type: WS_AUTH_GET_MESSAGE.type,
            payload: {
                orders: mockOrders,
                total: mockTotal,
                totalToday: mockTotalToday
            }
        };
        const expectedState = {
            ...initialState,
            orders: mockOrders,
            total: mockTotal,
            totalToday: mockTotalToday
        };
        expect(wsAuthReducer(initialState, action)).toEqual(expectedState);
    });
}); 