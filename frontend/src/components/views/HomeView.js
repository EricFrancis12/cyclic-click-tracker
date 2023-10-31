import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import DataTable from '../DataTable';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { ITEM_NAMES, ITEMS } from '../UpperControlPanel/UpperControlPanel';
import { extract_uuid } from '../../utils/utils';
import { terms as t } from '../../config/config.json';

export default function HomeView(props) {
    const { view_id, active, handleTabClick, newReport } = props;

    const { clicks, data } = useAuth();

    const [timeframe, setTimeframe] = useState(null);
    const [activeItemName, setActiveItemName] = useState(ITEM_NAMES.CAMPAIGNS);

    const dataKey = ITEMS.find(item => item.name === activeItemName)?.dataKey ?? activeItemName;
    const mappedData = mapClicks({ clicks, data, dataKey });

    function mapClicks({ clicks, data, dataKey }) {
        if (!clicks || !data || !dataKey) return [];

        let result = [];
        for (let i = 0; i < clicks.length; i++) {
            const filteredResults = result.filter(dataItem => dataItem[dataKey] != undefined);
            if (filteredResults.length <= 0) {
                let value = clicks[i][dataKey] ?? t.UNKNOWN;
                let dataItem = Object.keys(data).map(key => data[key])?.flat()?.find(dataItem => dataItem._id === value);
                if (!dataItem) data.affiliateNetworks.find(affiliateNetwork => {
                    return value = extract_uuid(affiliateNetwork._id) === extract_uuid(clicks[i].offer_id);
                });

                result.push({
                    ...structuredClone(dataItem),
                    [dataKey]: value,
                    clicks: [structuredClone(clicks[i])]
                });
            } else {
                filteredResults[0].clicks.push(structuredClone(clicks[i]));
            }
        }

        // example of what result should look like:
        // result = [
        //     { name: 'name 1', _id: '1234', clicks: [{}, {}, {}] },
        //     { name: 'name 2', _id: '5678', clicks: [{}, {}] },
        //     { name: 'name 3', clicks: [{ conversion: true }] },
        //     { name: 'name 4', clicks: [{}, { revenue: 99 }, { cost: 9 }, { cost: 8 }] }
        // ];

        return result;
    }

    function handleNewReport(props) {
        newReport({
            ...props,
            itemName: activeItemName
            // add HomeView-specific data here to pass to ReportView
        });
    }

    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faHome} name='Home' view_id={view_id} active={active} handleTabClick={handleTabClick}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <UpperControlPanel activeItemName={activeItemName} setActiveItemName={setActiveItemName} />
                <LowerControlPanel activeItemName={activeItemName} newReport={handleNewReport}
                    timeframe={timeframe} setTimeframe={setTimeframe}
                />
                {activeItemName === ITEM_NAMES.CONVERSIONS
                    ? ''
                    : activeItemName === ITEM_NAMES.POSTBACKS
                        ? ''
                        : <DataTable name={activeItemName} mappedData={mappedData} clicks={clicks} />
                }
            </div>
        </div>
    )
}
