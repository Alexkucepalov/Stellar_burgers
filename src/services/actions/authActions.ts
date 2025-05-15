import { createAsyncThunk } from '@reduxjs/toolkit';
import { request, refreshToken } from '@utils/api';

// Регистрация пользователя
export const registerUser = createAsyncThunk(
	'auth/register',
	async (
		{
			email,
			password,
			name,
		}: { email: string; password: string; name: string },
		{ rejectWithValue }
	) => {
		try {
			const data = await request('auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, name }),
			});
			localStorage.setItem('refreshToken', data.refreshToken);
			localStorage.setItem('accessToken', data.accessToken);
			return data;
		} catch (err: any) {
			return rejectWithValue(err.message);
		}
	}
);

// Авторизация пользователя
export const loginUser = createAsyncThunk(
	'auth/login',
	async (
		{ email, password }: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const data = await request('auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			localStorage.setItem('refreshToken', data.refreshToken);
			localStorage.setItem('accessToken', data.accessToken);
			return data;
		} catch (err: any) {
			return rejectWithValue(err.message);
		}
	}
);

// Выход из системы
export const logoutUser = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			const refreshToken = localStorage.getItem('refreshToken');
			if (!refreshToken) throw new Error('No refresh token found');
			const data = await request('auth/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: refreshToken }),
			});
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('accessToken');
			return data;
		} catch (err: any) {
			return rejectWithValue(err.message);
		}
	}
);

// Получение данных пользователя
export const fetchUser = createAsyncThunk(
	'auth/fetchUser',
	async (_, { rejectWithValue }) => {
		try {
			const accessToken = localStorage.getItem('accessToken');
			if (!accessToken) throw new Error('Access token отсутствует');
			const data = await request('auth/user', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken,
				},
			});
			return data.user;
		} catch (err: any) {
			if (err.message === 'jwt expired') {
				const newAccessToken = await refreshToken();
				const data = await request('auth/user', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: newAccessToken,
					},
				});
				return data.user;
			}
			return rejectWithValue(err.message);
		}
	}
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
	'auth/updateUser',
	async (
		{ email, name, password }: { email: string; name: string; password?: string },
		{ rejectWithValue }
	) => {
		try {
			const accessToken = localStorage.getItem('accessToken');
			if (!accessToken) throw new Error('Access token отсутствует');
			const data = await request('auth/user', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: accessToken,
				},
				body: JSON.stringify({ email, name, ...(password && { password }) }),
			});
			return data.user;
		} catch (err: any) {
			if (err.message === 'jwt expired') {
				const newAccessToken = await refreshToken();
				const data = await request('auth/user', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: newAccessToken,
					},
					body: JSON.stringify({ email, name, ...(password && { password }) }),
				});
				return data.user;
			}
			return rejectWithValue(err.message);
		}
	}
);
