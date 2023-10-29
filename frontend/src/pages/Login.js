import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();

    const passwordRef = useRef();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(passwordRef.current.value);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        }

        setLoading(false);
    }

    return (
        <div>
            <h2 className='text-center mb-4'>Log In</h2>
            {error && <div>{error}</div>}
            <form onSubmit={e => handleSubmit(e)}>
                <label htmlFor='password'>Password
                    <input type='password' id='password' ref={passwordRef} required></input>
                </label>
                {!loading && <button className='w-100 mt-4' type='submit'>Log In</button>}
            </form>
        </div>
    )
}
