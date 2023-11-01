import React, { useState } from 'react';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import { faFile } from '@fortawesome/free-solid-svg-icons';

export default function ReportView(props) {
    const { view_id, active, handleTabClick, closeView, item } = props;
    const { name } = item;

    const [timeframe, setTimeframe] = useState(null);
    const [activeItem, setActiveItem] = useState(null);

    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faFile} name={name} view_id={view_id} active={active} handleTabClick={handleTabClick} closeView={closeView}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <UpperControlPanel activeItem={activeItem} setActiveItem={setActiveItem} excludeItemNames={[name]} />
                <LowerControlPanel timeframe={timeframe} setTimeframe={setTimeframe} />
            </div>
        </div>
    )
}

