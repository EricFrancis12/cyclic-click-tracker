import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const DISABLE_AUTH = true;

export function AuthLayout({ children }) {
    const { loggedIn } = useAuth();

    return loggedIn || DISABLE_AUTH === true
        ? <>
            {children}
        </>
        : <Navigate to='/login' />
}
