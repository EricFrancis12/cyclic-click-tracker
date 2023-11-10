import React, { useEffect } from 'react';

export default function useWindowResize(callback) {
    function handleResize(e) {
        if (callback && typeof callback === 'function') {
            callback(e);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
}
