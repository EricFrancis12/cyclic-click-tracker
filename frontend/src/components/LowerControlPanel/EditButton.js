import React from 'react';
import Button from '../Button';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function EditButton(props) {
    const { editItem, selectedItems } = props;

    function handleButtonClick(e) {
        if (selectedItems.length !== 1) return;

        editItem({ data: selectedItems[0] });
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
