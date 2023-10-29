import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function DropdownButton(props) {
    const { children, active, disabled, setActive, icon, text, handleClick, className, outlineEffect, bar } = props;

    useEffect(() => {
        if (!active) return;

        if (handleClick) {
            handleClick(false);
        } else if (setActive) {
            setActive(false);
        }
    }, [disabled]);

    return (
        <div className={(className ?? '') + ' relative'}>
            <div onClick={!disabled ? (handleClick ?? setActive) : (e => { })}
                className={(!disabled ? 'cursor-pointer hover:opacity-70 ' : 'opacity-40 ') + ' px-2 py-2'}
                style={{ border: 'solid lightgrey 1px', borderRadius: '6px', backgroundImage: 'linear-gradient(0deg,var(--color-gray5),var(--color-white))' }}
            >
                <FontAwesomeIcon icon={icon ?? null} style={{ marginRight: '4px' }} />
                <span style={{ marginRight: '4px' }}>
                    {text ?? ''}
                </span>
                <FontAwesomeIcon icon={active ? faChevronUp : faChevronDown} />
            </div >
            {active &&
                (children)
            }
        </div>
    )
}
