import React, { useState, useEffect } from 'react';
import { LoadingWrapper } from './ActionMenuLayout';
import MenuHeader from '../../MenuHeader';
import MenuFooter from '../../MenuFooter';
import TagsInput from '../TagsInput';
import UrlInput from '../UrlInput';
import TokensInput from '../TokensInput';
import { Input } from '../baseComponents';
import { ACTION_MENU_TYPES } from '../ActionMenu';

export default function TrafficSourceLayout(props) {
    const { actionMenu, setActionMenu, loading, handleSave, handleClose } = props;
    const type = actionMenu?.type ?? ACTION_MENU_TYPES.NEW_ITEM; // defaults to new item
    const trafficSource = actionMenu?.data ?? {};

    const [menuData, setMenuData] = useState({
        name: trafficSource?.name ?? '',
        postbackUrl: trafficSource?.postbackUrl ?? '',
        defaultTokens: trafficSource?.defaultTokens ?? [
            {
                name: 'External ID',
                queryParam: '',
                value: '',
                isDefault: true
            },
            {
                name: 'Cost',
                queryParam: '',
                value: '',
                isDefault: true
            }
        ],
        customTokens: trafficSource?.customTokens ?? [],
        tags: trafficSource?.tags ?? []
    });

    useEffect(() => {
        setActionMenu({
            ...actionMenu,
            data: structuredClone(menuData)
        });
    }, [menuData]);

    function handlePostbackUrlInputChange(newValue) {
        setMenuData({
            ...menuData,
            postbackUrl: newValue
        });
    }

    function handleDefaultTokensInputChange(newDefaultTokens) {
        setMenuData({
            ...menuData,
            defaultTokens: newDefaultTokens
        });
    }

    function handleCustomTokensInputChange(newCustomTokens) {
        setMenuData({
            ...menuData,
            customTokens: newCustomTokens
        });
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
                <div className='w-full md:w-[600px]'>
                    <div className='flex justify-start items-center p-2' style={{ borderBottom: 'solid 1px grey' }}>
                        Traffic Source Details
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2 px-4 py-2 w-full'>
                        <Input name='Name' defaultValue={menuData.name}
                            onChange={e => setMenuData({ ...menuData, name: e.target.value })}
                        />
                        <UrlInput text='Postback URL'
                            value={menuData.postbackUrl} onChange={newValue => handlePostbackUrlInputChange(newValue)}
                        />
                        <TagsInput menuData={menuData} setMenuData={setMenuData} />
                    </div>
                </div>
                <div className='h-[-webkit-fill-available] w-[1px] bg-gray-300' />
                <div className='h-full w-full'>
                    <div className='flex justify-start items-center p-2' style={{ borderBottom: 'solid 1px grey' }}>
                        Parameters
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2 px-4 py-2 w-full'>
                        <TokensInput defaultTokens={menuData.defaultTokens}
                            setDefaultTokens={handleDefaultTokensInputChange}
                            customTokens={menuData.customTokens}
                            setCustomTokens={handleCustomTokensInputChange}
                        />
                    </div>
                </div>
            </LoadingWrapper>
            <MenuFooter disabled={loading}
                onSave={e => handleSave({
                    endpoint: type === ACTION_MENU_TYPES.EDIT_ITEM ? `/traffic-sources/${trafficSource._id}` : '/traffic-sources',
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
