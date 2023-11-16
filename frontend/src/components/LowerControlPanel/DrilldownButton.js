import React, { useState } from 'react';
import Button from './Button';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

export default function DrilldownButton(props) {
    const { drilldown, mappedData } = props;

    const selectedItems = mappedData?.filter(item => item.selected === true) || [];

    function handleButtonClick(e) {
        drilldown(e);
    }

    return (
        <Button
            icon={faRandom}
            handleClick={handleButtonClick}
            disabled={selectedItems.length !== 1}
            text='Drilldown'
        />
    )
}
