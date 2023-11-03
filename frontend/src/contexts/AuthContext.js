import React, { useState, useContext, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { DISABLE_AUTH } from '../layouts/AuthLayout';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(Cookies.get('loggedIn') === 'true' ? true : false);
    const [data, setData] = useState([]);
    const [clicks, setClicks] = useState([]);

    const fetchingData = useRef(false);

    useEffect(() => {
        fetchData();
    }, [loggedIn]);

    function fetchData() {
        if ((loggedIn && !fetchingData.current) || DISABLE_AUTH === true) {
            fetchingData.current = true;
            setData([]);
            setClicks([]);

            const _finally = () => {
                if (fetchData.count < 2) {
                    fetchData.count = 1;
                } else {
                    fetchData.count++;
                }

                if (fetchData.count === 2) {
                    fetchingData.current = false;
                    fetchData.count = undefined;
                }
            };

            fetch('/data').then(async (res) => {
                if (res.status === 401) {
                    setData([]);
                    setLoggedIn(false);
                    return;
                }

                const resJson = await res.json();

                if (resJson.data) {
                    setData(resJson.data);
                }
            }).catch(err => {
                console.error(err);
            }).finally(_finally);

            fetch(`${process.env.REACT_APP_CYCLIC_URL}/clicks`, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION}`
                }
            }).then(async (res) => {
                if (res.status === 401) {
                    return;
                }

                const resJson = await res.json();

                if (resJson.data) {
                    setClicks(resJson.data);
                }
            }).catch(err => {
                console.error(err);
            }).finally(_finally);
        }
    }

    async function login(password) {
        return await new Promise((resolve, reject) => {
            fetch('/login', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    password
                })
            }).then(async (res) => {
                const resJson = await res.json();

                if (resJson.success === false) {
                    setLoggedIn(false);
                    Cookies.remove('loggedIn');
                    reject(resJson);
                } else if (resJson.success === true) {
                    setLoggedIn(true);
                    Cookies.set('loggedIn', 'true', { expires: 7, path: '/' });
                }

                resolve(resJson);
            }).catch(err => reject(err));
        });
    }

    async function logout(signal) {
        setLoggedIn(false);
        Cookies.remove('loggedIn');
        return await fetch('/logout', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: '{}',
            signal
        });
    }

    const value = {
        data,
        clicks,
        fetchData,
        loggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
