import React from 'react';
import Tab from '../Tab';
import { faTachometerAltFast } from '@fortawesome/free-solid-svg-icons';

export default function DashboardView(props) {
    const { view_id, active, handleTabClick } = props;

    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faTachometerAltFast} name='Dashboard' view_id={view_id} active={active} handleTabClick={handleTabClick}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <div style={{ height: '100px', width: '100%', backgroundColor: 'red' }}>
                    Dashboard View
                </div>
            </div>
        </div>
    )
}
