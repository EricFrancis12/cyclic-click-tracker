import React from 'react';
import CalendarButton from './CalendarButton';
import SearchBar from './SearchBar';
import ReportButton from './ReportButton';
import NewButton from './NewButton';
import EditButton from './EditButton';
import ActionsDropdown from './ActionsDropdown';
import ReportChain from './ReportChain';

export default function LowerControlPanel(props) {
    const { activeItem, newReport, newItem, editItem, duplicateItem, archiveItem } = props;
    const { mappedData, timeframe, setTimeframe, searchQuery, setSearchQuery } = props;

    return (
        <div className='flex flex-col justify-center align-start w-full bg-LowerConrolPanel_backgroundColor'
            style={{ borderTop: 'solid lightgrey 3px' }}>
            <div className='flex flex-wrap gap-6 mx-8 my-4 w-full'>
                <ReportChain />
            </div>
            <div className='flex flex-wrap gap-6 mx-8 my-4 w-full'>
                <div className='flex gap-2 justify-center items-center'>
                    <CalendarButton timeframe={timeframe} setTimeframe={setTimeframe} />
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    {newReport && <ReportButton newReport={newReport} />}
                    <NewButton activeItem={activeItem} newItem={newItem} />
                    <EditButton editItem={editItem} />
                    <ActionsDropdown mappedData={mappedData} duplicateItem={duplicateItem} archiveItem={archiveItem} />
                </div>
            </div>
            <div className='flex flex-wrap gap-6 mx-8 my-4 w-full'>
                Line 2
            </div>
        </div >
    )
}
