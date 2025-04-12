export const BASE_URL = 'https://norma.nomoreparties.space/api/';

// Проверка ответа на `ok`
const checkResponse = (res: Response) => {
	if (res.ok) {
		return res.json();
	}
	// не забываем выкидывать ошибку, чтобы она попала в `catch`
	return Promise.reject(`Ошибка ${res.status}`);
};

// Проверка на `success`
const checkSuccess = (res: any) => {
	if (res && res.success) {
		return res;
	}
	return Promise.reject(`Ответ не success: ${res}`);
};

// Универсальная функция запроса
export const request = (endpoint: string, options?: RequestInit) => {
	return fetch(`${BASE_URL}${endpoint}`, options)
		.then(checkResponse)
		.then(checkSuccess);
};
