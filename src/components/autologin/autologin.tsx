import React, { useEffect } from 'react';
import { useAppDispatch } from '@services/hooks';
import { fetchUser } from '@services/actions/authActions';

export const Autologin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            dispatch(fetchUser());
        }
    }, [dispatch]);

    return <>{children}</>;
}; 