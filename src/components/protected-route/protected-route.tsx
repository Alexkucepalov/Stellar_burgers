import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@services/hooks';

interface ProtectedRouteElementProps {
	children: JSX.Element;
	onlyForAuth?: boolean; // Если true, маршрут доступен только для авторизованных пользователей
	onlyForUnauth?: boolean; // Если true, маршрут доступен только для неавторизованных пользователей
}

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({
	children,
	onlyForAuth = false,
	onlyForUnauth = false,
}) => {
	const { user } = useAppSelector((state) => state.auth);
	const location = useLocation();

	// Если маршрут доступен только для авторизованных пользователей
	if (onlyForAuth && !user) {
		return <Navigate to='/login' state={{ from: location }} />;
	}

	// Если маршрут доступен только для неавторизованных пользователей
	if (onlyForUnauth && user) {
		return <Navigate to='/profile' />;
	}

	return children;
};

export default ProtectedRouteElement;
