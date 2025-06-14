import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
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
			// Очищаем токены перед попыткой регистрации, чтобы исключить их влияние на 403 ошибку
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');

			const data = await request('auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, name }),
			});
			localStorage.setItem('refreshToken', data.refreshToken);
			const accessToken = data.accessToken.startsWith('Bearer ') ? data.accessToken.split(' ')[1] : data.accessToken;
			localStorage.setItem('accessToken', accessToken);
			return data;
		} catch (err: unknown) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			}
			return rejectWithValue('Неизвестная ошибка регистрации');
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
			const accessToken = data.accessToken.startsWith('Bearer ') ? data.accessToken.split(' ')[1] : data.accessToken;
			localStorage.setItem('accessToken', accessToken);
			return data;
		} catch (err: unknown) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			}
			return rejectWithValue('Неизвестная ошибка авторизации');
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
		} catch (err: unknown) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			}
			return rejectWithValue('Неизвестная ошибка выхода');
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
					'Authorization': `Bearer ${accessToken}`,
				},
			});
			console.log('fetchUser fulfilled, user data:', data.user);
			return data.user;
		} catch (err: unknown) {
			console.log('fetchUser rejected, error:', err);
			if (err instanceof Error && err.message === 'jwt expired') {
				console.log('JWT expired, attempting refresh token...');
				const newAccessToken = await refreshToken();
				console.log('New access token after refresh:', newAccessToken);
				const data = await request('auth/user', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${newAccessToken}`,
					},
				});
				console.log('fetchUser fulfilled after refresh, user data:', data.user);
				return data.user;
			}
			return rejectWithValue(err instanceof Error ? err.message : 'Неизвестная ошибка получения данных пользователя');
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
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ email, name, ...(password && { password }) }),
			});
			return data.user;
		} catch (err: unknown) {
			if (err instanceof Error && err.message === 'jwt expired') {
				const newAccessToken = await refreshToken();
				const data = await request('auth/user', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${newAccessToken}`,
					},
					body: JSON.stringify({ email, name, ...(password && { password }) }),
				});
				return data.user;
			}
			return rejectWithValue(err instanceof Error ? err.message : 'Неизвестная ошибка обновления данных пользователя');
		}
	}
);

export const setAccessToken = createAction<string | null>('auth/setAccessToken');
