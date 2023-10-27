import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const { data } = useAuth();

    return (
        <div>
            <div>Dashboard</div>
            <div>
                {JSON.stringify(data, null, 4)}
            </div>
        </div>
    )
}
