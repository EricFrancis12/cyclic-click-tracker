import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Button(props) {
    const { children, disabled, icon, handleClick, text = '', className = '' } = props;

    return (
        <div className={(className)}>
            <div onClick={!disabled ? handleClick : e => { }}
                className={(!disabled ? 'cursor-pointer hover:opacity-70 ' : 'opacity-40 ') + ' px-2 py-2'}
                style={{
                    border: 'solid lightgrey 1px',
                    borderRadius: '6px',
                    backgroundImage: 'linear-gradient(0deg,var(--color-gray5),var(--color-white))'
                }}
            >
                <FontAwesomeIcon icon={icon ?? null} style={{ marginRight: '4px' }} />
                <span style={{ marginRight: '4px' }}>
                    {children}
                    {text}
                </span>
            </div >
        </div>
    )
}
