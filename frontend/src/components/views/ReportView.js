import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Tab from '../Tab';
import UpperControlPanel from '../UpperControlPanel/UpperControlPanel';
import LowerControlPanel from '../LowerControlPanel/LowerControlPanel';
import DataTable from '../DataTable/DataTable';
import { ITEM_NAMES, ITEMS } from '../UpperControlPanel/UpperControlPanel';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { mapClicks } from './HomeView';

export const MAX_REPORT_CHAIN_LENGTH = 3;

export default function ReportView(props) {
    const { view_id, active, handleTabClick, closeView, item: reportItem, timeframe: _timeframe } = props;

    const { clicks, data } = useAuth();

    const [timeframe, setTimeframe] = useState(_timeframe || null);
    const [searchQuery, setSearchQuery] = useState('');

    const defaultFirstItem = ITEMS.filter(_item => _item.name !== reportItem.name)?.at(0);
    const [activeItem, setActiveItem] = useState(defaultFirstItem);

    const [reportChain, setReportChain] = useState([
        { ...activeItem, disabled: false },
        { name: null, disabled: false },
        { name: null, disabled: true }
    ]);

    const [mappedData, setMappedData] = useState(mapClicks({ clicks, data, activeItem, timeframe }, false));

    useEffect(() => {
        if (clicks && data && timeframe) {
            setMappedData(mapClicks({ clicks, data, activeItem, timeframe }, false));
        }
    }, [clicks, data, timeframe]);

    function drilldown(e) {
        console.log('Drilldown not yet implimented.');
    }

    return (
        <div style={{ zIndex: active ? 100 : 1 }}>
            <Tab icon={faFile} name={reportItem.name} view_id={view_id} active={active} handleTabClick={handleTabClick} closeView={closeView}>
                <div className='absolute' style={{ height: '100vh', width: '100vw' }} />
            </Tab>
            <div className='absolute' style={{ top: '40px', left: '0', width: '100vw', fontSize: '13px' }}>
                <UpperControlPanel activeItem={activeItem} setActiveItem={setActiveItem} excludeItemNames={[reportItem.name]} />
                <LowerControlPanel activeItem={activeItem} setActiveItem={setActiveItem} mappedData={mappedData}
                    reportChain={reportChain} setReportChain={setReportChain} reportItem={reportItem}
                    timeframe={timeframe} setTimeframe={setTimeframe}
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                    drilldown={drilldown}
                />
                {activeItem.name === ITEM_NAMES.CONVERSIONS
                    ? ''
                    : activeItem.name === ITEM_NAMES.POSTBACKS
                        ? ''
                        : <DataTable activeItem={activeItem} searchQuery={searchQuery}
                            mappedData={mappedData} setMappedData={setMappedData}
                            timeframe={timeframe} reportChain={reportChain}
                            drilldown={drilldown}
                        />
                }
            </div>
        </div>
    )
}

