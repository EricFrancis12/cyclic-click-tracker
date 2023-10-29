import React, { useState } from 'react';
import Button from './Button';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

export default function ReportButton(props) {
    const { newReport } = props;

    function handleButtonClick(e) {
        newReport();
    }

    return (
        <Button
            icon={faRandom}
            handleClick={handleButtonClick}
            outlineColor='green'
            bar={true}
            text='Report'
        />
    )
}
