import React from 'react';
import Button from './Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function NewButton(props) {
    const { activeItem, newItem } = props;

    function handleButtonClick(e) {
        newItem();
    }

    return (
        <Button
            icon={faPlus}
            handleClick={handleButtonClick}
            outlineColor='red'
            bar={true}
            text={activeItem?.saved === true ? `New ${activeItem?.singName}` : 'New'}
        />
    )
}
