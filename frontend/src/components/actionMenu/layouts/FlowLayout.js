import React, { useState, useEffect } from 'react';
import { LoadingWrapper } from './ActionMenuLayout';
import MenuHeader from '../../MenuHeader';
import MenuFooter from '../../MenuFooter';
import TagsInput from '../TagsInput';
import FlowBuilder from '../../FlowBuilder/FlowBuilder';
import { Input } from '../baseComponents';
import { ACTION_MENU_TYPES } from '../ActionMenu';
import { DEFAULT_PATH } from '../../FlowBuilder/Path';
import flowConfig from '../../../config/Flow.config.json';
const { types: FLOW_TYPES } = flowConfig;

export default function FlowLayout(props) {
    const { actionMenu, setActionMenu, loading, handleSave, handleClose } = props;
    const type = actionMenu?.type ?? ACTION_MENU_TYPES.NEW_ITEM; // defaults to new item
    const flow = actionMenu?.data ?? {};

    const [menuData, setMenuData] = useState({
        name: flow?.name ?? '',
        _id: flow?._id ?? undefined,
        type: FLOW_TYPES.SAVED,
        defaultRoute: flow?.defaultRoute ?? {
            active: true,
            rules: null,
            paths: [structuredClone(DEFAULT_PATH)]
        },
        ruleRoutes: flow?.ruleRoutes ?? [],
        tags: flow?.tags ?? []
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
                        <Input name='Flow Name' defaultValue={menuData.name}
                            onChange={e => setMenuData({ ...menuData, name: e.target.value })}
                        />
                        <FlowBuilder flow={menuData} setFlow={setMenuData} />
                        <TagsInput menuData={menuData} setMenuData={setMenuData} />
                    </div>
                </div>
            </LoadingWrapper>
            <MenuFooter disabled={loading}
                onSave={e => handleSave({
                    endpoint: type === ACTION_MENU_TYPES.EDIT_ITEM ? `/flows/${flow._id}` : '/flows',
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
