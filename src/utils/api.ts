const BASE_URL = 'https://norma.nomoreparties.space/api';

interface RequestOptions extends RequestInit {
	headers?: HeadersInit;
}

export const request = async (endpoint: string, options: RequestOptions = {}) => {
	const url = `${BASE_URL}/${endpoint}`;
	const headers = {
		'Content-Type': 'application/json',
		...(options.headers || {}),
	};

	console.log('Отправка запроса:', url);
	console.log('Метод:', options.method);
	console.log('Заголовки:', headers);
	console.log('Тело запроса:', options.body);

	const response = await fetch(url, {
		...options,
		headers,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: 'Ошибка сети' }));
		throw new Error(error.message || `Ошибка ${response.status}`);
	}

	return response.json();
};

export const refreshToken = async (): Promise<string> => {
	try {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			throw new Error('No refresh token found');
		}

		const response = await fetch(`${BASE_URL}/auth/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: refreshToken }),
		});

		if (!response.ok) {
			throw new Error('Failed to refresh token');
		}

		const data = await response.json();
		const accessToken = data.accessToken.startsWith('Bearer ') ? data.accessToken.split(' ')[1] : data.accessToken;
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', data.refreshToken);
		return accessToken;
	} catch (error) {
		console.error('Error refreshing token:', error);
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		throw error;
	}
};

// Функция для регистрации пользователя
export const registerUser = async (
	email: string,
	password: string,
	name: string
) => {
	return request('auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password, name }),
	});
};

// Функция для авторизации пользователя
export const loginUser = async (email: string, password: string) => {
	return request('auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});
};

// Функция для выхода из системы
export const logoutUser = async () => {
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) {
		throw new Error('Refresh token отсутствует');
	}
	return request('auth/logout', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token: refreshToken }),
	});
};

// Функция для восстановления пароля
export const resetPassword = async (email: string) => {
	return request('password-reset', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email }),
	});
};

// Функция для сброса пароля
export const setNewPassword = async (password: string, token: string) => {
	return request('password-reset/reset', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ password, token }),
	});
};

// Функция для получения данных пользователя
export const getUser = async (accessToken: string) => {
	return request('auth/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
};

// Функция для обновления данных пользователя
export const updateUser = async (
	accessToken: string,
	userData: { email: string; name: string }
) => {
	return request('auth/user', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(userData),
	});
};