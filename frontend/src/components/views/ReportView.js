import React, { useState } from 'react';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import { faFile } from '@fortawesome/free-solid-svg-icons';

export default function ReportView(props) {
    const { view_id, active, handleTabClick, closeView, itemName } = props;

    const [timeframe, setTimeframe] = useState(null);
    const [activeItemName, setActiveItemName] = useState(null);

    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faFile} name={itemName} view_id={view_id} active={active} handleTabClick={handleTabClick} closeView={closeView}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <UpperControlPanel activeItemName={activeItemName} setActiveItemName={setActiveItemName} excludeItemNames={[itemName]} />
                <LowerControlPanel timeframe={timeframe} setTimeframe={setTimeframe} />
            </div>
        </div>
    )
}

