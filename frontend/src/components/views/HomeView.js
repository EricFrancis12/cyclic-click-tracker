import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import DataTable from '../DataTable';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { ITEM_NAMES, ITEMS } from '../UpperControlPanel/UpperControlPanel';
import config from '../../config/config.json';
const { UNKNOWN } = config.terms;

export function mapClicks({ clicks, data, activeItem }) {
    if (!clicks || !data || !activeItem) return [];
    const { dataProp, clickProp, name } = activeItem;

    let results = [];
    let savedDataItems = data[dataProp] ?? null;

    for (let i = 0; i < clicks.length; i++) {
        const click = clicks[i];
        const filteredResult = results.find(result => result.clickProp === click[clickProp]);

        const dataItem = (
            savedDataItems?.find((_dataItem) => _dataItem._id === click[clickProp])
            // below is a fix for if the click doesn't have a ".affiliateNetwork_id" property.
            // we are simply searching for an affiliateNetwork that contains an "offer._id" matching "click.offer_id":
            ?? (name === ITEM_NAMES.AFFILIATE_NETWORKS
                ? data.affiliateNetworks.find((affiliateNetwork) =>
                    affiliateNetwork.offers.some((offer) => offer._id === click.offer_id)
                ) ?? null
                : null)
        ) ?? { name: click[clickProp] ?? UNKNOWN, };

        if (filteredResult) {
            filteredResult.clicks.push(structuredClone(click))
        } else {
            const result = {
                ...structuredClone(dataItem),
                clickProp: click[clickProp],
                clicks: [structuredClone(click)]
            };
            results.push(result);
        }
    }

    // here's an example of what results could look like:
    // result = [
    //     { name: 'Unknown', clickProp: '012', clicks: [{}, {}, {}] },
    //     { name: 'name 1', clickProp: '345', clicks: [{}, {}] },
    //     { name: 'name 2', clickProp: '678', clicks: [{ conversion: true }] },
    //     { name: 'name 3', clickProp: '999', clicks: [{}, { revenue: 99 }, { cost: 9 }, { cost: 8 }] }
    // ];

    return results;
}

export default function HomeView(props) {
    const { view_id, active, handleTabClick, newReport, newItem, editItem, duplicateItem, archiveItem } = props;

    const { clicks, data } = useAuth();

    const [timeframe, setTimeframe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeItem, setActiveItem] = useState(ITEMS.find(item => item.name === ITEM_NAMES.CAMPAIGNS));

    const [mappedData, setMappedData] = useState(mapClicks({ clicks, data, activeItem }));

    useEffect(() => {
        if (clicks && data) {
            setMappedData(mapClicks({ clicks, data, activeItem }));
        }
    }, [clicks, data]);

    function handleNewReport(props) {
        newReport({
            ...props,
            item: structuredClone(activeItem),
            // add HomeView-specific data here to pass to ReportView
        });
    }

    function handleNewItem(props) {
        newItem({
            ...props,
            item: structuredClone(activeItem),
            // add HomeView-specific data here to pass to ReportView
        });
    }

    function handleEditItem(props) {
        editItem({
            ...props,
            item: structuredClone(activeItem),
            // add HomeView-specific data here to pass to ReportView
        });
    }

    function handleDuplicateItem(props) {
        duplicateItem({
            ...props,
            item: structuredClone(activeItem),
            // add HomeView-specific data here to pass to ReportView
        });
    }

    function handleArchiveItem(props) {
        archiveItem({
            ...props,
            item: structuredClone(activeItem),
            // add HomeView-specific data here to pass to ReportView
        });

    }

    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faHome} name='Home' view_id={view_id} active={active} handleTabClick={handleTabClick}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <UpperControlPanel activeItem={activeItem} setActiveItem={setActiveItem} />
                <LowerControlPanel activeItem={activeItem} mappedData={mappedData}
                    newReport={handleNewReport} newItem={handleNewItem} editItem={handleEditItem}
                    duplicateItem={handleDuplicateItem} archiveItem={handleArchiveItem}
                    timeframe={timeframe} setTimeframe={setTimeframe}
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                />
                {activeItem.name === ITEM_NAMES.CONVERSIONS
                    ? ''
                    : activeItem.name === ITEM_NAMES.POSTBACKS
                        ? ''
                        : <DataTable activeItem={activeItem} searchQuery={searchQuery}
                            mappedData={mappedData} setMappedData={setMappedData}
                        />
                }
            </div>
        </div>
    )
}
