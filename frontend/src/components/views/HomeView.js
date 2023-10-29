import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import DataTable from '../DataTable';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { ITEM_NAMES, ITEMS } from '../UpperControlPanel/UpperControlPanel';

export default function HomeView(props) {
    const { view_id, active, handleTabClick, newReport } = props;

    const [timeframe, setTimeframe] = useState(null);
    const [activeItemName, setActiveItemName] = useState(ITEM_NAMES.CAMPAIGNS);

    const { data, clicks } = useAuth();
    const dataKey = ITEMS.find(item => item.name === activeItemName)?.dataKey;

    function handleNewReport(props) {
        newReport({
            ...props,
            itemName: activeItemName
            // add HomeView-specific data here to pass to ReportView
        });
    }

    console.log(clicks);

    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faHome} name='Home' view_id={view_id} active={active} handleTabClick={handleTabClick}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <UpperControlPanel activeItemName={activeItemName} setActiveItemName={setActiveItemName} />
                <LowerControlPanel timeframe={timeframe} setTimeframe={setTimeframe} newReport={handleNewReport} />
                <DataTable name={activeItemName} data={data[dataKey]} clicks={clicks} />
            </div>
        </div>
    )
}
