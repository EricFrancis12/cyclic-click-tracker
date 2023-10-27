import React, { useState, useContext, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(Cookies.get('loggedIn') === 'true' ? true : false);
    const [data, setData] = useState([]);

    const fetchingData = useRef(false);

    useEffect(() => {
        fetchData();
    }, [loggedIn]);

    function fetchData() {
        if (loggedIn && !fetchingData.current) {
            fetchingData.current = true;

            fetch('/data')
                .then(async (res) => {
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
                }).finally(() => {
                    fetchingData.current = false;
                });
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
