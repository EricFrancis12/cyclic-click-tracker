import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingWrapper } from './ActionMenuLayout';
import MenuHeader from '../../MenuHeader';
import MenuFooter from '../../MenuFooter';
import TagsInput from '../TagsInput';
import UrlInput from '../UrlInput';
import { Input } from '../baseComponents';
import { ACTION_MENU_TYPES } from '../ActionMenu';

export default function LandingPageLayout(props) {
    const { actionMenu, setActionMenu, loading, handleSave, handleClose } = props;
    const type = actionMenu?.type ?? ACTION_MENU_TYPES.NEW_ITEM; // defaults to new item
    const landingPage = actionMenu?.data ?? {};

    const { data } = useAuth();

    const [menuData, setMenuData] = useState({
        name: landingPage?.name ?? '',
        url: landingPage?.url ?? '',
        tags: landingPage?.tags ?? []
    });

    useEffect(() => {
        setActionMenu({
            ...actionMenu,
            data: structuredClone(menuData)
        });
    }, [menuData]);

    function handleUrlInputChange(newValue) {
        setMenuData({
            ...menuData,
            url: newValue
        })
    }

    return (
        <>
            <MenuHeader
                onClose={e => setActionMenu(null)}
                title={
                    (type === ACTION_MENU_TYPES.EDIT_ITEM
                        ? 'Edit '
                        : type === ACTION_MENU_TYPES.NEW_ITEM
                            ? 'Create '
                            : ''
                    ) + (actionMenu?.item?.singName ?? '')
                }
            />
            <LoadingWrapper loading={loading}>
                <div className='h-full w-full'>
                    <div className='flex flex-col justify-start items-start gap-2 px-4 py-2 w-full'>
                        <Input name='Name' defaultValue={menuData.name}
                            onChange={e => setMenuData({ ...menuData, name: e.target.value })}
                        />
                        <UrlInput value={menuData.url} onChange={newValue => handleUrlInputChange(newValue)} />
                        <TagsInput menuData={menuData} setMenuData={setMenuData} />
                    </div>
                </div>
            </LoadingWrapper>
            <MenuFooter disabled={loading}
                onSave={e => handleSave({
                    endpoint: type === ACTION_MENU_TYPES.EDIT_ITEM ? `/landing-pages/${landingPage._id}` : '/landing-pages',
                    method: type === ACTION_MENU_TYPES.EDIT_ITEM ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: menuData
                })}
                onClose={e => handleClose()}
            />
        </>
    )
}
