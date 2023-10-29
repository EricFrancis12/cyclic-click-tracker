import React, { useEffect } from 'react';
import { faBullseye, faHandshake, faFolder, faSitemap, faGlobe, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign, faDownload, faGlobeEurope, faWifi, faLaptop, faMobile, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import UpperControlPanelItem from './UpperControlPanelItem';

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
    STATE_REGION: 'State / Region',
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
    { name: ITEM_NAMES.CAMPAIGNS, type: ITEM_TYPES.BUTTON, icon: faBullseye, dataKey: 'campaigns' },
    { name: ITEM_NAMES.OFFERS, type: ITEM_TYPES.BUTTON, icon: faHandshake, dataKey: 'offers' },
    { name: ITEM_NAMES.LANDING_PAGES, type: ITEM_TYPES.BUTTON, icon: faFolder, dataKey: 'landingPages' },
    { name: ITEM_NAMES.FLOWS, type: ITEM_TYPES.BUTTON, icon: faSitemap, dataKey: 'flows' },
    { name: ITEM_NAMES.TRAFFIC_SOURCES, type: ITEM_TYPES.BUTTON, icon: faGlobe, dataKey: 'trafficSources' },
    { name: ITEM_NAMES.AFFILIATE_NETWORKS, type: ITEM_TYPES.BUTTON, icon: faUsers, dataKey: 'affiliateNetworks' },
    { name: ITEM_NAMES.CONVERSIONS, type: ITEM_TYPES.BUTTON, icon: faDollarSign },
    { name: ITEM_NAMES.POSTBACKS, type: ITEM_TYPES.BUTTON, icon: faDownload },
    {
        defaultName: ITEM_NAMES.COUNTRIES, type: ITEM_TYPES.DROPDOWN, icon: faGlobeEurope, dropdownItems: [
            { name: ITEM_NAMES.LANGUAGES, icon: faGlobeEurope },
            { name: ITEM_NAMES.CITIES, icon: faGlobeEurope },
            { name: ITEM_NAMES.STATE_REGION, icon: faGlobeEurope },
            { name: ITEM_NAMES.COUNTRIES, icon: faGlobeEurope }
        ]
    },
    {
        defaultName: ITEM_NAMES.ISP, type: ITEM_TYPES.DROPDOWN, icon: faWifi, dropdownItems: [
            { name: ITEM_NAMES.ISP, icon: faWifi },
            { name: ITEM_NAMES.MOBILE_CARRIERS, icon: faWifi },
            { name: ITEM_NAMES.CONNECTION_TYPES, icon: faWifi },
        ]
    },
    {
        defaultName: ITEM_NAMES.DEVICES, type: ITEM_TYPES.DROPDOWN, icon: faLaptop, dropdownItems: [
            { name: ITEM_NAMES.DEVICE_MODELS, icon: faLaptop },
            { name: ITEM_NAMES.DEVICE_VENDORS, icon: faLaptop },
            { name: ITEM_NAMES.DEVICE_TYPES, icon: faLaptop },
            { name: ITEM_NAMES.SCREEN_RESOLUTIONS, icon: faLaptop }
        ]
    },
    {
        defaultName: ITEM_NAMES.OS, type: ITEM_TYPES.DROPDOWN, icon: faMobile, dropdownItems: [
            { name: ITEM_NAMES.OS, icon: faMobile },
            { name: ITEM_NAMES.OS_VERSIONS, icon: faMobile }
        ]
    },
    {
        defaultName: ITEM_NAMES.BROWSERS, type: ITEM_TYPES.DROPDOWN, icon: faFolder, dropdownItems: [
            { name: ITEM_NAMES.BROWSERS, icon: faFolder },
            { name: ITEM_NAMES.BROWSER_NAMES, icon: faFolder },
            { name: ITEM_NAMES.BROWSER_VERSIONS, icon: faFolder }
        ]
    },
    { name: ITEM_NAMES.ERRORS, type: ITEM_TYPES.BUTTON, icon: faExclamationCircle },
];

export default function UpperControlPanel(props) {
    const { activeItemName, setActiveItemName, excludeItemNames } = props;

    useEffect(() => {
        if (!activeItemName) {
            const filteredItems = ITEMS.filter(item => !excludeItemNames.includes(item.name));
            setActiveItemName(filteredItems[0].name);
        }
    }, [excludeItemNames]);

    return (
        <div className='flex flex-col justify-center align-start w-full bg-tab_active_backgroundColor'>
            <div className='flex flex-wrap gap-6 mx-8 my-4 w-full'>
                {ITEMS.map((item, index) => {
                    if (!excludeItemNames?.includes(item.name)) return (
                        <UpperControlPanelItem item={item} key={index} activeItemName={activeItemName} setActiveItemName={setActiveItemName} />
                    )
                })}
            </div>
        </div >
    )
}
