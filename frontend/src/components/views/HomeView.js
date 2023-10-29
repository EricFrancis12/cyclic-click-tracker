import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import DataTable from '../DataTable';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { ITEM_NAMES, ITEMS } from '../UpperControlPanel/UpperControlPanel';

export const MAPPED_CLICK_TYPES = {
    SAVED: 'SAVED',
    NOT_SAVED: 'NOT_SAVED'
};

export default function HomeView(props) {
    const { view_id, active, handleTabClick, newReport } = props;

    const { clicks } = useAuth();

    const [timeframe, setTimeframe] = useState(null);
    const [activeItemName, setActiveItemName] = useState(ITEM_NAMES.CAMPAIGNS);

    const dataKey = ITEMS.find(item => item.name === activeItemName).dataKey;
    const mappedData = mapClicks({ clicks, dataKey });

    function mapClicks({ clicks, dataKey }) {
        if (!clicks || !dataKey) return;

        let result = [];
        // for (let i = 0; i < clicks.length; i++) {
        //     const value = clicks[i][dataKey];
        //     const dataKeyExists = result.filter(dataItem => dataItem[dataKey] != undefined).length > 0;
        //     if (!dataKeyExists) {
        //         result.push({
        //             name: ,
        //             type: ,
        //             _id: ,
        //             clicks: []
        //         });
        //     }
        // }

        result = [
            { name: 'name 1', type: MAPPED_CLICK_TYPES.SAVED, _id: '1234', clicks: [{}, {}, {}] },
            { name: 'name 2', type: MAPPED_CLICK_TYPES.SAVED, _id: '5678', clicks: [{}, {}] },
            { name: 'name 3', type: MAPPED_CLICK_TYPES.NOT_SAVED, clicks: [{ conversion: true }] },
            { name: 'name 4', type: MAPPED_CLICK_TYPES.NOT_SAVED, clicks: [{}, { revenue: 99 }, { cost: 9 }, { cost: 8 }] },
        ];

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
