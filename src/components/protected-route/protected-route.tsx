import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@services/hooks';

interface ProtectedRouteElementProps {
	children: React.ReactNode;
	onlyForAuth?: boolean; // Если true, маршрут доступен только для авторизованных пользователей
	onlyForUnauth?: boolean; // Если true, маршрут доступен только для неавторизованных пользователей
}

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({
	children,
	onlyForAuth = false,
	onlyForUnauth = false,
}) => {
	const { user, loading } = useAppSelector((state) => state.auth);
	const location = useLocation();

	// Если идет загрузка, показываем загрузку
	if (loading) {
		return <div>Загрузка...</div>;
	}

	// Если маршрут доступен только для авторизованных пользователей
	if (onlyForAuth && !user) {
		// Сохраняем текущий путь и состояние фона
		localStorage.setItem('redirectPath', location.pathname);
		if (location.state?.background) {
			localStorage.setItem('redirectBackground', JSON.stringify(location.state.background));
		}
		return <Navigate to='/login' state={{ from: location }} />;
	}

	// Если маршрут доступен только для неавторизованных пользователей
	if (onlyForUnauth && user) {
		// Проверяем, есть ли сохраненный путь для перенаправления
		const savedPath = localStorage.getItem('redirectPath');
		const savedBackground = localStorage.getItem('redirectBackground');
		
		if (savedPath) {
			const background = savedBackground ? JSON.parse(savedBackground) : undefined;
			localStorage.removeItem('redirectPath');
			localStorage.removeItem('redirectBackground');
			return <Navigate to={savedPath} state={{ background }} />;
		}
		return <Navigate to='/profile' />;
	}

	return <>{children}</>;
};

export default ProtectedRouteElement;
