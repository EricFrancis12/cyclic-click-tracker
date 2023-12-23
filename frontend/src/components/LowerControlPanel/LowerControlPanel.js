import React from 'react';
import ReportChain from './ReportChain';
import CalendarButton from './CalendarButton';
import SearchBar from './SearchBar';
import ReportButton from './ReportButton';
import NewButton from './NewButton';
import EditButton from './EditButton';
import ActionsDropdown from './ActionsDropdown';
import DrilldownButton from './DrilldownButton';
import RefreshButton from './RefreshButton';

export default function LowerControlPanel(props) {
    const { mappedData, activeItem, setActiveItem, newReport, newItem, editItem, duplicateItem, archiveItem } = props;
    const { timeframe, setTimeframe, searchQuery, setSearchQuery, reportChain, setReportChain, reportItem, drilldown } = props;

    const selectedItems = mappedData?.filter(item => item.selected === true) || [];

    return (
        <div className='flex flex-col justify-center align-start w-full bg-LowerConrolPanel_backgroundColor'
            style={{ borderTop: 'solid lightgrey 3px' }}>
            {reportChain && setReportChain &&
                <div className='flex gap-6 mx-8 my-4 w-full'>
                    <div className='flex flex-wrap gap-2 justify-center items-center'>
                        <ReportChain reportChain={reportChain} setReportChain={setReportChain} reportItem={reportItem}
                            activeItem={activeItem} setActiveItem={setActiveItem} />
                    </div>
                </div>
            }
            <div className='flex gap-6 mx-8 my-4 w-full'>
                <div className='flex flex-wrap gap-2 justify-center items-center'>
                    <CalendarButton timeframe={timeframe} setTimeframe={setTimeframe} />
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    {newReport && <ReportButton newReport={newReport} selectedItems={selectedItems} />}
                    {newItem && <NewButton activeItem={activeItem} newItem={newItem} />}
                    {editItem && <EditButton editItem={editItem} selectedItems={selectedItems} />}
                    {(duplicateItem || archiveItem) && <ActionsDropdown selectedItems={selectedItems}
                        duplicateItem={duplicateItem} archiveItem={archiveItem} />}
                    {/* starter code for drilldown functionality: */}
                    {/* {drilldown && <DrilldownButton drilldown={drilldown} mappedData={mappedData} />} */}
                </div>
            </div>
            <div className='flex gap-6 mx-8 my-4 w-full'>
                <div className='flex flex-wrap gap-2 justify-center items-center'>
                    <RefreshButton />
                </div>
            </div>
        </div >
    )
}
