import React, { useState } from 'react';
import ActionMenuLayout from './layouts/ActionMenuLayout';
import BlackTransparentOverlay from '../BlackTransparentOverlay';

export const ACTION_MENU_TYPES = {
    NEW_ITEM: 'NEW_ITEM',
    EDIT_ITEM: 'EDIT_ITEM'
};

export default function ActionMenu(props) {
    const { actionMenu, setActionMenu, layer = 1, maxWidth = '800px', onSave } = props;
    const { type, item } = actionMenu;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    async function handleSave(props) {
        const {
            endpoint = '',
            method = 'POST',
            headers = {
                'Content-Type': 'application/json'
            },
            body = JSON.stringify({})
        } = props;

        setError('');
        setMessage('');

        if (!actionMenu?.data) return;

        setLoading(true);

        try {
            const res = await fetch(endpoint, method === 'GET' ? undefined : {
                headers,
                method,
                body: JSON.stringify(body)
            });
            const resJson = await res.json();

            if (resJson.success !== true) {
                throw new Error(resJson.message ?? 'Unexpected Error');
            }

            setMessage('Success!');
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setActionMenu(null);
    }

    return actionMenu &&
        <BlackTransparentOverlay layer={layer} className='flex justify-center items-start p-4'>
            <div className={`flex flex-col justify-start items-between h-full w-full max-w-[${maxWidth}] bg-white`}
                style={{ borderRadius: '5px' }}
            >
                <ActionMenuLayout actionMenu={actionMenu} setActionMenu={setActionMenu} loading={loading}
                    handleSave={handleSave} handleClose={handleClose}
                />
            </div>
        </BlackTransparentOverlay>
}
