import { describe, it, expect, beforeEach } from '@jest/globals';
import authReducer, { initialState } from '../services/reducers/authReducer';
import {
    registerUser,
    loginUser,
    logoutUser,
    fetchUser,
    updateUser,
    setAccessToken,
} from '../services/actions/authActions';

describe('auth reducer', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    // Тест начального состояния
    it('should return initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    // Тест успешной регистрации
    it('should handle registerUser.fulfilled', () => {
        const mockUser = { email: 'test@test.com', name: 'Test User' };
        const mockToken = 'test-token';
        const action = {
            type: registerUser.fulfilled.type,
            payload: { user: mockUser, accessToken: mockToken }
        };
        const expectedState = {
            ...initialState,
            user: mockUser,
            accessToken: mockToken,
            isAuthChecked: true
        };
        expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест успешного входа
    it('should handle loginUser.fulfilled', () => {
        const mockUser = { email: 'test@test.com', name: 'Test User' };
        const mockToken = 'test-token';
        const action = {
            type: loginUser.fulfilled.type,
            payload: { user: mockUser, accessToken: mockToken }
        };
        const expectedState = {
            ...initialState,
            user: mockUser,
            accessToken: mockToken,
            isAuthChecked: true
        };
        expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест успешного выхода
    it('should handle logoutUser.fulfilled', () => {
        const stateWithUser = {
            ...initialState,
            user: { email: 'test@test.com', name: 'Test User' },
            accessToken: 'test-token',
            isAuthChecked: true
        };
        const action = {
            type: logoutUser.fulfilled.type,
            payload: {}
        };
        const expectedState = {
            ...initialState,
            isAuthChecked: true
        };
        expect(authReducer(stateWithUser, action)).toEqual(expectedState);
    });

    // Тест начала загрузки данных пользователя
    it('should handle fetchUser.pending', () => {
        const action = {
            type: fetchUser.pending.type
        };
        const expectedState = {
            ...initialState,
            loading: true,
            error: null
        };
        expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест успешной загрузки данных пользователя
    it('should handle fetchUser.fulfilled', () => {
        const mockUser = { email: 'test@test.com', name: 'Test User' };
        const mockToken = 'test-token';
        localStorage.setItem('accessToken', mockToken);
        
        const action = {
            type: fetchUser.fulfilled.type,
            payload: mockUser
        };
        const expectedState = {
            ...initialState,
            loading: false,
            user: mockUser,
            accessToken: mockToken,
            isAuthChecked: true
        };
        expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест ошибки загрузки данных пользователя
    it('should handle fetchUser.rejected', () => {
        const errorMessage = 'Test error';
        const action = {
            type: fetchUser.rejected.type,
            error: { message: errorMessage }
        };
        const expectedState = {
            ...initialState,
            loading: false,
            error: errorMessage,
            user: null,
            accessToken: null,
            isAuthChecked: true
        };
        expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    // Тест обновления данных пользователя
    it('should handle updateUser.fulfilled', () => {
        const mockUser = { email: 'updated@test.com', name: 'Updated User' };
        const action = {
            type: updateUser.fulfilled.type,
            payload: mockUser
        };
        const stateWithUser = {
            ...initialState,
            user: { email: 'test@test.com', name: 'Test User' }
        };
        const expectedState = {
            ...stateWithUser,
            user: mockUser
        };
        expect(authReducer(stateWithUser, action)).toEqual(expectedState);
    });

    // Тест установки токена доступа
    it('should handle setAccessToken', () => {
        const mockToken = 'new-test-token';
        const action = {
            type: setAccessToken.type,
            payload: mockToken
        };
        const expectedState = {
            ...initialState,
            accessToken: mockToken
        };
        expect(authReducer(initialState, action)).toEqual(expectedState);
    });
}); 