import React from 'react';
import Button from '../Button';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

export default function ReportButton(props) {
    const { newReport, selectedItems } = props;

    function handleButtonClick(e) {
        if (selectedItems.length !== 1) return;

        newReport({
            dataItem: structuredClone(selectedItems[0])
        });
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
