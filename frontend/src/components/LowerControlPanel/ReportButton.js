import React, { useState } from 'react';
import Button from './Button';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

export default function ReportButton(props) {
    const { newReport, mappedData } = props;

    const selectedItems = mappedData?.filter(item => item.selected === true) || [];

    function handleButtonClick(e) {
        newReport();
    }

    return (
        <Button
            icon={faRandom}
            handleClick={handleButtonClick}
            disabled={selectedItems.length !== 1}
            text='Report'
        />
    )
}
