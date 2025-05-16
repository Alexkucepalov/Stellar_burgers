export const BASE_URL = 'https://norma.nomoreparties.space/api/';

// Проверка ответа на `ok`
const checkResponse = (res: Response) => {
	if (res.ok) {
		return res.json();
	}
	return Promise.reject(`Ошибка ${res.status}`);
};

// Универсальная функция запроса
export const request = (endpoint: string, options?: RequestInit) => {
	return fetch(`${BASE_URL}${endpoint}`, options).then(checkResponse);
};

// Функция для обновления токена
export const refreshToken = async () => {
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) {
		throw new Error('Refresh token отсутствует');
	}
	const data = await request('auth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ token: refreshToken }),
	});
	localStorage.setItem('refreshToken', data.refreshToken);
	localStorage.setItem('accessToken', data.accessToken);
	return data.accessToken;
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
			Authorization: accessToken,
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
			Authorization: accessToken,
		},
		body: JSON.stringify(userData),
	});
};
