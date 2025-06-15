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
	console.log(`Отправка запроса: ${BASE_URL}${endpoint}`);
	console.log('Метод:', options?.method);
	console.log('Заголовки:', options?.headers);
	console.log('Тело запроса:', options?.body);
	return fetch(`${BASE_URL}${endpoint}`, { ...options }).then(checkResponse);
};

// Функция для обновления токена
export const refreshToken = async () => {
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) {
		console.error('refreshToken: Refresh token отсутствует в localStorage');
		throw new Error('Refresh token отсутствует');
	}
	console.log('refreshToken: Отправка запроса на обновление токена с refreshToken:', refreshToken);
	try {
		const data = await request('auth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: refreshToken }),
		});
		localStorage.setItem('refreshToken', data.refreshToken);
		const newAccessToken = data.accessToken.startsWith('Bearer ') ? data.accessToken.split(' ')[1] : data.accessToken;
		localStorage.setItem('accessToken', newAccessToken);
		console.log('refreshToken: Токен успешно обновлен. Новый accessToken:', newAccessToken);
		return newAccessToken;
	} catch (err) {
		console.error('refreshToken: Ошибка при запросе на обновление токена:', err);
		throw err;
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