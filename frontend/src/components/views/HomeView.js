import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import DataTable from '../DataTable/DataTable';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { ITEM_NAMES, ITEMS } from '../UpperControlPanel/UpperControlPanel';
import config from '../../config/config.json';
const { UNKNOWN } = config.terms;

export function mapClicks({ clicks, data, activeItem, timeframe }, backfill) {
    if (!clicks || !data || !activeItem) return [];
    const { dataProp, clickProp, name } = activeItem;

    let results = [];
    let savedDataItems = data[dataProp] ?? null;

    const clicksInTimeframe = timeframe
        ? clicks.filter(click => isWithinTimeframe(click, timeframe))
        : clicks;

    for (let i = 0; i < clicksInTimeframe.length; i++) {
        const click = clicksInTimeframe[i];
        const filteredResult = results.find(result => result.clickProp === click[clickProp]);

        let dataItem = (
            savedDataItems?.find((_dataItem) => _dataItem._id === click[clickProp])
            // Below is a fix for if the click doesn't have a ".affiliateNetwork_id" property.
            // We are simply searching for an affiliateNetwork that contains an "offer._id" matching "click.offer_id":
            ?? (name === ITEM_NAMES.AFFILIATE_NETWORKS
                ? data.affiliateNetworks?.find((affiliateNetwork) =>
                    affiliateNetwork.offers.some((offer) => offer._id === click.offer_id)
                ) ?? null
                : null)
        ) ?? { name: click[clickProp] ?? UNKNOWN };

        // if (name === ITEM_NAMES.CAMPAIGNS) {
        //     // Below is a fix for campaign.flow.defaultPath and campaign.flow.rulePaths properties in the database
        //     // The names of these properties were changed:
        //     // campaign.flow.defaultPath => campaign.flow.defaultRoute
        //     // campaign.flow.rulePaths => campaign.flow.ruleRoutes
        //     dataItem = {
        //         ...dataItem,
        //         flow: {
        //             ...dataItem.flow,
        //             defaultRoute: { ...dataItem?.flow?.defaultPath },
        //             ruleRoutes: [...dataItem?.flow?.rulePaths],
        //             defaultPath: undefined,
        //             rulePaths: undefined
        //         }
        //     };
        // }

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

    // backfill means we loop thru dataItems that received 0 clicks,
    // and include them in results anyways
    // (so they will appear as a row):
    if (backfill === true) {
        for (let j = 0; j < savedDataItems?.length; j++) {
            const dataItemInResults = results.some(result => result._id === savedDataItems[j]._id);
            if (!dataItemInResults) {
                const result = {
                    ...structuredClone(savedDataItems[j]),
                    clickProp: savedDataItems[j]._id,
                    clicks: []
                };
                results.push(result);
            }
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

export function isWithinTimeframe(click, timeframe) {
    if (!click?.viewTimestamp || !timeframe) return false;

    const [startDate, endDate] = timeframe;
    const clickDate = new Date(click.viewTimestamp);

    if (startDate <= clickDate && clickDate <= endDate) return true;
    return false;
}

export default function HomeView(props) {
    const { view_id, active, handleTabClick, newReport, newItem, editItem, duplicateItem, archiveItem } = props;

    const { clicks, data } = useAuth();

    const [timeframe, setTimeframe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeItem, setActiveItem] = useState(ITEMS.find(item => item.name === ITEM_NAMES.CAMPAIGNS));

    const [mappedData, setMappedData] = useState(mapClicks({ clicks, data, activeItem, timeframe }, true));

    useEffect(() => {
        if (clicks && data && timeframe) {
            setMappedData(mapClicks({ clicks, data, activeItem, timeframe }, true));
        }
    }, [clicks, data, timeframe]);

    function handleNewReport(props) {
        newReport({
            ...props,
            timeframe,
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
            <Tab icon={faHome} name='Home' view_id={view_id}
                active={active} handleTabClick={handleTabClick}
            />
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
