import React from 'react';
import Button from './Button';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function EditButton(props) {
    const { editItem, mappedData } = props;
    const selectedItems = mappedData?.filter(item => item.selected === true) || [];

    function handleButtonClick(e) {
        editItem();
    }

    return (
        <Button
            icon={faPen}
            handleClick={handleButtonClick}
            disabled={selectedItems.length !== 1}
            text='Edit'
        />
    )
}
