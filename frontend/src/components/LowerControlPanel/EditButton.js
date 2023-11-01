import React from 'react';
import Button from './Button';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function EditButton(props) {
    const { editItem } = props;

    function handleButtonClick(e) {
        editItem();
    }

    return (
        <Button
            icon={faPen}
            handleClick={handleButtonClick}
            text='Edit'
        />
    )
}
