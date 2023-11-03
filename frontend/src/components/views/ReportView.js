import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import DataTable from '../DataTable';
import { ITEM_NAMES, ITEMS } from '../UpperControlPanel/UpperControlPanel';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { mapClicks } from './HomeView';

export const MAX_REPORT_CHAIN_LENGTH = 3;

export default function ReportView(props) {
    const { view_id, active, handleTabClick, closeView, item } = props;

    const { clicks, data } = useAuth();

    const [timeframe, setTimeframe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeItem, setActiveItem] = useState(item);

    const [reportChain, setReportChain] = useState([
        { ...activeItem, disabled: false },
        { name: null, disabled: false },
        { name: null, disabled: true }
    ]);

    const [mappedData, setMappedData] = useState(mapClicks({ clicks, data, activeItem, timeframe }));

    useEffect(() => {
        if (clicks && data && timeframe) {
            setMappedData(mapClicks({ clicks, data, activeItem, timeframe }));
        }
    }, [clicks, data, timeframe]);


    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faFile} name={activeItem.name} view_id={view_id} active={active} handleTabClick={handleTabClick} closeView={closeView}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <UpperControlPanel activeItem={activeItem} setActiveItem={setActiveItem} excludeItemNames={[activeItem.name]} />
                <LowerControlPanel reportChain={reportChain} setReportChain={setReportChain}
                    timeframe={timeframe} setTimeframe={setTimeframe}
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                />
                {activeItem.name === ITEM_NAMES.CONVERSIONS
                    ? ''
                    : activeItem.name === ITEM_NAMES.POSTBACKS
                        ? ''
                        : <DataTable activeItem={activeItem} searchQuery={searchQuery}
                            mappedData={mappedData} setMappedData={setMappedData}
                            timeframe={timeframe} reportChain={reportChain}
                        />
                }
            </div>
        </div>
    )
}

