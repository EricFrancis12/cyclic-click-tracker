import React, { useState } from 'react';
import CalendarButton from './CalendarButton';
import SearchBar from './SearchBar';
import ReportButton from './ReportButton';
import ReportChain from './ReportChain';

export default function LowerControlPanel(props) {
    const { activeItemName, newReport, timeframe, setTimeframe } = props;

    const [searchQuery, setSearchQuery] = useState('');

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
                </div>
            </div>
            <div className='flex flex-wrap gap-6 mx-8 my-4 w-full'>
                Line 2
            </div>
        </div >
    )
}
