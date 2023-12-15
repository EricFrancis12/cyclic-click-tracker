import React from 'react';
import Button from './Button';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function MenuFooter(props) {
    const { onSave, onClose, disabled } = props;

    return (
        <div className='flex justify-end items-center p-4 px-6' style={{ borderTop: 'solid 1px grey' }}>
            <span style={{ marginRight: '4px' }}>
                <Button icon={faTimes} text='Cancel' handleClick={onClose} />
            </span>
            <span>
                <Button icon={faCheck} text='Save' disabled={disabled} handleClick={onSave} />
            </span>
        </div>
    )
}
