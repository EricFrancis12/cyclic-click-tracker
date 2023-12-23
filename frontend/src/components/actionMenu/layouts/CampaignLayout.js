import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthContext';
import ActionMenu from '../ActionMenu';
import { LoadingWrapper } from './ActionMenuLayout';
import MenuHeader from '../../MenuHeader';
import MenuFooter from '../../MenuFooter';
import FlowBuilder from '../../FlowBuilder/FlowBuilder';
import TagsInput from '../TagsInput';
import UrlInput from '../UrlInput';
import Checkbox from '../../Checkbox';
import { Input, Select } from '../baseComponents';
import { ITEMS, ITEM_NAMES } from '../../UpperControlPanel/UpperControlPanel';
import { ACTION_MENU_TYPES } from '../ActionMenu';
import { DEFAULT_PATH } from '../../FlowBuilder/Path';
import geos from '../../../config/rules/geos.json';

import LandingPageCongig from '../../../config/LandingPage.config.json';
import OfferConfig from '../../../config/Offer.config.json';
import FlowConfig from '../../../config/Flow.config.json';
const { rotationOptions: LP_ROTATION_OPTIONS } = LandingPageCongig;
const { rotationOptions: OFFER_ROTATION_OPTIONS } = OfferConfig;
const { types: FLOW_TYPES, routeTypes: ROUTE_TYPES, static_ids: STATIC_IDS } = FlowConfig;

export default function CampaignLayout(props) {
    const { actionMenu, setActionMenu, loading, handleSave, handleClose } = props;
    const type = actionMenu?.type ?? ACTION_MENU_TYPES.NEW_ITEM; // defaults to new item
    const campaign = actionMenu?.data ?? {};

    const { data } = useAuth();

    const [newLandingPageActionMenu, setNewLandingPageActionMenu] = useState(null);
    const [newOfferActionMenu, setNewOfferActionMenu] = useState(null);

    const [savedFlow, setSavedFlow] = useState(
        campaign?.flow?.type === FLOW_TYPES.SAVED
            ? campaign.flow
            : {
                type: FLOW_TYPES.SAVED,
                _id: data?.flows?.at(0)?._id
            }
    );
    const [builtInFlow, setBuiltInFlow] = useState(
        campaign?.flow?.type === FLOW_TYPES.BUILT_IN
            ? campaign.flow
            : {
                type: FLOW_TYPES.BUILT_IN,
                _id: STATIC_IDS.BUILT_IN_FL,
                defaultRoute: {
                    active: true,
                    rules: null,
                    paths: [structuredClone(DEFAULT_PATH)]
                },
                ruleRoutes: []
            }
    );

    const [urlFlow, setUrlFlow] = useState(
        campaign?.flow?.type === FLOW_TYPES.URL
            ? campaign.flow
            : {
                type: FLOW_TYPES.URL,
                _id: STATIC_IDS.URL_FL,
                url: ''
            }
    );

    const [flow, setFlow] = useState(
        campaign?.flow?.type === FLOW_TYPES.SAVED
            ? structuredClone(savedFlow)
            : campaign?.flow?.type === FLOW_TYPES.BUILT_IN
                ? structuredClone(builtInFlow)
                : campaign?.flow?.type === FLOW_TYPES.URL
                    ? structuredClone(urlFlow)
                    : structuredClone(savedFlow)
    );

    const [menuData, setMenuData] = useState({
        name: campaign?.name ?? '',
        trafficSource_id: campaign?.trafficSource_id ?? '',
        landingPageRotation: campaign?.landingPageRotation ?? LP_ROTATION_OPTIONS.RANDOM,
        offerRotation: campaign?.offerRotation ?? OFFER_ROTATION_OPTIONS.RANDOM,
        geoName: campaign?.geoName ?? geos[0].name,
        tags: campaign?.tags ?? [],
        flow: flow
    });

    useEffect(() => {
        setActionMenu({
            ...actionMenu,
            data: structuredClone(menuData)
        });
    }, [menuData, flow]);

    function handleCreateNewLandingPage() {
        setNewLandingPageActionMenu({
            type: ACTION_MENU_TYPES.NEW_ITEM,
            item: { ...ITEMS.find(item => item.name === ITEM_NAMES.LANDING_PAGES) },
            data: {}
        });
    }

    function handleCreateNewOffer() {
        setNewOfferActionMenu({
            type: ACTION_MENU_TYPES.NEW_ITEM,
            item: { ...ITEMS.find(item => item.name === ITEM_NAMES.OFFERS) },
            data: {}
        });
    }

    return (
        <>
            {newLandingPageActionMenu &&
                <ActionMenu actionMenu={newLandingPageActionMenu} setActionMenu={setNewLandingPageActionMenu}
                    layer={2} maxWidth='700px'
                />
            }
            {newOfferActionMenu &&
                <ActionMenu actionMenu={newOfferActionMenu} setActionMenu={setNewOfferActionMenu}
                    layer={2} maxWidth='700px'
                />
            }
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
                        Campaign Details
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2 px-4 py-2 w-full'>
                        <Input name='Name' defaultValue={menuData.name}
                            onChange={e => setMenuData({ ...menuData, name: e.target.value })}
                        />
                        <Select name='Traffic Source' defaultValue={menuData.trafficSource_id}
                            onChange={e => setMenuData({ ...menuData, trafficSource_id: e.target.value })}
                        >
                            <option value=''>
                                None
                            </option>
                            {data?.trafficSources?.map((trafficSource, index) => (
                                <option key={index} value={trafficSource._id}>
                                    {trafficSource.name}
                                </option>
                            ))}
                        </Select>
                        <Select name='Country' defaultValue={menuData.geoName}
                            onChange={e => setMenuData({ ...menuData, geoName: e.target.value })}
                        >
                            {geos.map((geo, index) => (
                                <option key={index} value={geo.name}>
                                    {geo.name}
                                </option>
                            ))}
                        </Select>
                        <TagsInput menuData={menuData} setMenuData={setMenuData} />
                    </div>
                </div>
                <div className='h-[-webkit-fill-available] w-[1px] bg-gray-300' />
                <div className='h-full w-full'>
                    <div className='flex justify-start items-center p-2' style={{ borderBottom: 'solid 1px grey' }}>
                        Destination
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2 px-4 py-2 w-full'>
                        <div className='flex justify-between items-start w-full'>
                            <div className='w-[50%]'>
                                <span>
                                    Destination
                                </span>
                                {[FLOW_TYPES.SAVED, FLOW_TYPES.BUILT_IN, FLOW_TYPES.URL].map((flowType, index) => (
                                    <div key={index} className='flex justify-start items-center w-full cursor-pointer'
                                        onClick={e => setMenuData({ ...menuData, flow: { ...menuData.flow, type: flowType } })}
                                    >
                                        <Checkbox checked={menuData.flow.type === flowType} />
                                        <span className='flex justify-start items-center h-full w-full ml-1'>
                                            {flowType}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className='bg-blue-500 w-[50%]'>
                                {/* Starter code for when adding Reditect Mode functionality */}
                                {/* {menuData.flow.type !== FLOW_TYPES.BUILT_IN &&
                                <>
                                    <span>
                                        Redirect Mode
                                    </span>
                                    ...
                                </>
                            } */}
                            </div>
                        </div>
                        {menuData.flow.type === FLOW_TYPES.SAVED &&
                            <Select name='Flow' defaultValue={menuData.flow._id}
                                onChange={e => setMenuData({ ...menuData, flow: { ...menuData.flow, _id: e.target.value } })}
                            >
                                <option value=''>
                                    None
                                </option>
                                {data?.flows?.map((flow, index) => (
                                    <option key={index} value={flow._id}>
                                        {flow.name}
                                    </option>
                                ))}
                            </Select>
                        }
                        {menuData.flow.type === FLOW_TYPES.BUILT_IN &&
                            <>
                                <Select name='Landing Page Rotation' defaultValue={menuData.landingPageRotation}
                                    onChange={e => setMenuData({ ...menuData, flow: { ...menuData.flow, landingPageRotation: e.target.value } })}
                                >
                                    {Object.values(LP_ROTATION_OPTIONS).map((rotation, index) => (
                                        <option key={index} value={rotation}>
                                            {rotation}
                                        </option>
                                    ))}
                                </Select>
                                <Select name='Offer Rotation' defaultValue={menuData.offerRotation}
                                    onChange={e => setMenuData({ ...menuData, flow: { ...menuData.flow, offerRotation: e.target.value } })}
                                >
                                    {Object.values(OFFER_ROTATION_OPTIONS).map((rotation, index) => (
                                        <option key={index} value={rotation}>
                                            {rotation}
                                        </option>
                                    ))}
                                </Select>
                                <FlowBuilder flow={builtInFlow} setFlow={setBuiltInFlow}
                                    createNewLandingPage={handleCreateNewLandingPage} createNewOffer={handleCreateNewOffer}
                                />
                            </>
                        }
                        {menuData.flow.type === FLOW_TYPES.URL &&
                            <UrlInput text='Enter Destination URL' value={urlFlow.url}
                                onChange={newValue => setUrlFlow({ ...urlFlow, url: newValue })}
                            />
                        }
                    </div>
                </div>
            </LoadingWrapper>
            <MenuFooter disabled={loading}
                onSave={e => handleSave({
                    endpoint: type === ACTION_MENU_TYPES.EDIT_ITEM ? `/campaigns/${campaign._id}` : '/campaigns',
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
