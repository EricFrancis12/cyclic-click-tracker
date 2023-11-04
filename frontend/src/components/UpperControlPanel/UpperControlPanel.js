import React, { useEffect } from 'react';
import { faBullseye, faHandshake, faFolder, faSitemap, faGlobe, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign, faDownload, faGlobeEurope, faWifi, faLaptop, faMobile, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import UpperControlPanelItem from './UpperControlPanelItem';
import { isArray } from '../../utils/utils';

export const ITEM_NAMES = {
    CAMPAIGNS: 'Campaigns',
    OFFERS: 'Offers',
    LANDING_PAGES: 'Landing Pages',
    FLOWS: 'Flows',
    TRAFFIC_SOURCES: 'Traffic Sources',
    AFFILIATE_NETWORKS: 'Affiliate Networks',
    CONVERSIONS: 'Conversions',
    POSTBACKS: 'Postbacks',
    COUNTRIES: 'Countries',
    LANGUAGES: 'Languages',
    CITIES: 'Cities',
    STATE_REGION: 'States / Regions',
    ISP: 'ISP',
    MOBILE_CARRIERS: 'Mobile Carriers',
    CONNECTION_TYPES: 'Connection Types',
    DEVICES: 'Devices',
    DEVICE_MODELS: 'Device Models',
    DEVICE_VENDORS: 'Device Vendors',
    DEVICE_TYPES: 'Device Types',
    SCREEN_RESOLUTIONS: 'Screen Resolutions',
    OS: 'OS',
    OS_VERSIONS: 'OS Versions',
    BROWSERS: 'Browsers',
    BROWSER_NAMES: 'Browser Names',
    BROWSER_VERSIONS: 'Browser Versions',
    ERRORS: 'Errors'
};

export const ITEM_TYPES = {
    BUTTON: 'BUTTON',
    DROPDOWN: 'DROPDOWN'
};

export const ITEMS = [
    { name: ITEM_NAMES.CAMPAIGNS, type: ITEM_TYPES.BUTTON, icon: faBullseye, saved: true, dataProp: 'campaigns', clickProp: 'campaign_id', singName: 'Campaign' },
    { name: ITEM_NAMES.OFFERS, type: ITEM_TYPES.BUTTON, icon: faHandshake, saved: true, dataProp: 'offers', clickProp: 'offer_id', singName: 'Offer' },
    { name: ITEM_NAMES.LANDING_PAGES, type: ITEM_TYPES.BUTTON, icon: faFolder, saved: true, dataProp: 'landingPages', clickProp: 'landingPage_id', singName: 'Landing Page' },
    { name: ITEM_NAMES.FLOWS, type: ITEM_TYPES.BUTTON, icon: faSitemap, saved: true, dataProp: 'flows', clickProp: 'flow_id', singName: 'Flow' },
    { name: ITEM_NAMES.TRAFFIC_SOURCES, type: ITEM_TYPES.BUTTON, icon: faGlobe, saved: true, dataProp: 'trafficSources', clickProp: 'trafficSource_id', singName: 'Traffic Source' },
    { name: ITEM_NAMES.AFFILIATE_NETWORKS, type: ITEM_TYPES.BUTTON, icon: faUsers, saved: true, dataProp: 'affiliateNetworks', clickProp: 'affiliateNetwork_id', singName: 'Affiliate Network' },
    { name: ITEM_NAMES.CONVERSIONS, type: ITEM_TYPES.BUTTON, icon: faDollarSign, saved: false },
    { name: ITEM_NAMES.POSTBACKS, type: ITEM_TYPES.BUTTON, icon: faDownload, saved: false },
    {
        defaultName: ITEM_NAMES.COUNTRIES, type: ITEM_TYPES.DROPDOWN, icon: faGlobeEurope, dropdownItems: [
            { name: ITEM_NAMES.LANGUAGES, icon: faGlobeEurope, saved: false, clickProp: 'language' },
            { name: ITEM_NAMES.CITIES, icon: faGlobeEurope, saved: false, clickProp: 'city' },
            { name: ITEM_NAMES.STATE_REGION, icon: faGlobeEurope, saved: false, clickProp: 'region' },
            { name: ITEM_NAMES.COUNTRIES, icon: faGlobeEurope, saved: false, clickProp: 'country' }
        ]
    },
    {
        defaultName: ITEM_NAMES.ISP, type: ITEM_TYPES.DROPDOWN, icon: faWifi, dropdownItems: [
            { name: ITEM_NAMES.ISP, icon: faWifi, saved: false, clickProp: 'isp' },
            { name: ITEM_NAMES.MOBILE_CARRIERS, icon: faWifi, saved: false, clickProp: 'mobileCarrier' },
            { name: ITEM_NAMES.CONNECTION_TYPES, icon: faWifi, saved: false, clickProp: 'connectionType' },
        ]
    },
    {
        defaultName: ITEM_NAMES.DEVICES, type: ITEM_TYPES.DROPDOWN, icon: faLaptop, dropdownItems: [
            { name: ITEM_NAMES.DEVICE_MODELS, icon: faLaptop, saved: false, clickProp: 'deviceModel' },
            { name: ITEM_NAMES.DEVICE_VENDORS, icon: faLaptop, saved: false, clickProp: 'deviceVendor' },
            { name: ITEM_NAMES.DEVICE_TYPES, icon: faLaptop, saved: false, clickProp: 'deviceType' },
            { name: ITEM_NAMES.SCREEN_RESOLUTIONS, icon: faLaptop, saved: false, clickProp: 'screenResolution' }
        ]
    },
    {
        defaultName: ITEM_NAMES.OS, type: ITEM_TYPES.DROPDOWN, icon: faMobile, dropdownItems: [
            { name: ITEM_NAMES.OS, icon: faMobile, saved: false, clickProp: 'os' },
            { name: ITEM_NAMES.OS_VERSIONS, icon: faMobile, saved: false, clickProp: 'osVersion' }
        ]
    },
    {
        defaultName: ITEM_NAMES.BROWSERS, type: ITEM_TYPES.DROPDOWN, icon: faFolder, dropdownItems: [
            { name: ITEM_NAMES.BROWSER_NAMES, icon: faFolder, saved: false, clickProp: 'browserName' },
            { name: ITEM_NAMES.BROWSER_VERSIONS, icon: faFolder, saved: false, clickProp: 'browserVersion' }
        ]
    },
    { name: ITEM_NAMES.ERRORS, type: ITEM_TYPES.BUTTON, icon: faExclamationCircle, saved: false, clickProp: 'error' }
];

export const flattened_ITEMS = ITEMS.reduce((acc, curr) => {
    if (curr.name && !curr.dropdownItems) {
        acc = [...acc, curr];
    } else {
        acc = [...acc, ...curr.dropdownItems];
    }
    return acc;
}, []);

export default function UpperControlPanel(props) {
    const { activeItem, setActiveItem, excludeItemNames } = props;

    useEffect(() => {
        if (!activeItem) {
            const filteredItems = ITEMS.filter(item => !excludeItemNames.includes(item.name));
            setActiveItem(filteredItems[0]);
        }
    }, [excludeItemNames]);

    const line1 = ITEMS.filter(item => item.saved === true);
    const line2 = ITEMS.filter(item => !item.saved);

    return (
        <div className='flex flex-col justify-center align-start w-full bg-tab_active_backgroundColor'>
            <div className='flex flex-wrap gap-6 mx-8 my-4 w-full'>
                {line1.map((item, index) => {
                    if (!excludeItemNames?.includes(item.name)) return (
                        <UpperControlPanelItem item={item} key={index} activeItem={activeItem} setActiveItem={setActiveItem} />
                    )
                })}
            </div>
            <div className='flex flex-wrap gap-6 mx-8 my-4 w-full'>
                {line2.map((item, index) => {
                    if (!excludeItemNames?.includes(item.name)) return (
                        <UpperControlPanelItem item={item} key={index} activeItem={activeItem} setActiveItem={setActiveItem} />
                    )
                })}
            </div>
        </div >
    )
}
