import React, { useState, useEffect } from 'react';
import { LoadingWrapper } from './ActionMenuLayout';
import MenuHeader from '../../MenuHeader';
import MenuFooter from '../../MenuFooter';
import TagsInput from '../TagsInput';
import { Input } from '../baseComponents';
import { ACTION_MENU_TYPES } from '../ActionMenu';

export default function AffiliateNetworkLayout(props) {
    const { actionMenu, setActionMenu, loading, handleSave, handleClose } = props;
    const type = actionMenu?.type ?? ACTION_MENU_TYPES.NEW_ITEM; // defaults to new item
    const affiliateNetwork = actionMenu?.data ?? {};

    const [menuData, setMenuData] = useState({
        name: affiliateNetwork?.name ?? '',
        defaultNewOfferString: affiliateNetwork?.defaultNewOfferString ?? '',
        tags: affiliateNetwork?.tags ?? []
    });

    useEffect(() => {
        setActionMenu({
            ...actionMenu,
            data: structuredClone(menuData)
        });
    }, [menuData]);

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
                        {/* <Input name='Default New Offer String' defaultValue={menuData.name}
                            onChange={e => setMenuData({ ...menuData, defaultNewOfferString: e.target.value })}
                        /> */}
                        <TagsInput menuData={menuData} setMenuData={setMenuData} />
                    </div>
                </div>
            </LoadingWrapper>
            <MenuFooter disabled={loading}
                onSave={e => handleSave({
                    endpoint: type === ACTION_MENU_TYPES.EDIT_ITEM ? `/affiliate-networks/${affiliateNetwork._id}` : '/affiliate-networks',
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
