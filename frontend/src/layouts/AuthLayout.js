import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AuthLayout({ children }) {
    const { loggedIn } = useAuth();

    return loggedIn
        ? <>
            {children}
        </>
        : <Navigate to='/login' />
}
