import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingWrapper } from './ActionMenuLayout';
import MenuHeader from '../../MenuHeader';
import MenuFooter from '../../MenuFooter';
import TagsInput from '../TagsInput';
import UrlInput from '../UrlInput';
import { Input, Select } from '../baseComponents';
import { ACTION_MENU_TYPES } from '../ActionMenu';


export default function OfferLayout(props) {
    const { actionMenu, setActionMenu, loading, handleSave, handleClose } = props;
    const type = actionMenu?.type ?? ACTION_MENU_TYPES.NEW_ITEM; // defaults to new item
    const offer = actionMenu?.data ?? {};

    const { data } = useAuth();

    const [menuData, setMenuData] = useState({
        name: offer?.name ?? '',
        affiliateNetwork_id: offer.affiliateNetwork_id ?? '',
        url: offer?.url ?? '',
        payout: offer?.payout ?? 0,
        tags: offer?.tags ?? []
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
                        <Select name='Affiliate Network' defaultValue={menuData.affiliateNetwork_id}
                            onChange={e => setMenuData({ ...menuData, affiliateNetwork_id: e.target.value })}
                        >
                            <option value=''>
                                None
                            </option>
                            {data?.affiliateNetworks?.map((affiliateNetwork, index) => (
                                <option key={index} value={affiliateNetwork._id}>
                                    {affiliateNetwork.name}
                                </option>
                            ))}
                        </Select>
                        <UrlInput value={menuData.url} onChange={newValue => handleUrlInputChange(newValue)} />
                        <TagsInput menuData={menuData} setMenuData={setMenuData} />
                    </div>
                </div>
            </LoadingWrapper>
            <MenuFooter disabled={loading}
                onSave={e => handleSave({
                    endpoint: type === ACTION_MENU_TYPES.EDIT_ITEM ? `/offers/${offer._id}` : '/offers',
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
