import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchUser } from '@services/actions/authActions';

export const Autologin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { user, loading, error, isAuthChecked } = useAppSelector(state => state.auth);

    console.log('Autologin Rendered: user=', user, 'loading=', loading, 'error=', error, 'isAuthChecked=', isAuthChecked);

    useEffect(() => {
        console.log('Autologin useEffect triggered');
        const accessToken = localStorage.getItem('accessToken');
        console.log('Autologin useEffect: accessToken=', accessToken, 'user=', user, 'loading=', loading, 'isAuthChecked=', isAuthChecked);
        
        if (accessToken && !user && !loading && !isAuthChecked && !error) {
            console.log('Autologin useEffect: Dispatching fetchUser');
            dispatch(fetchUser());
        }
    }, [dispatch, user, loading, isAuthChecked, error]);

    return <>{children}</>;
}; 