import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { traverseParentsForClass } from '../../utils/utils';

export const DROPDOWN_BUTTON_CLASS = 'DROPDOWN_BUTTON_CLASS';

export default function DropdownButton(props) {
    const { children, disabled, active, setActive, icon, text, handleClick, className, outlineEffect, bar } = props;

    useEffect(() => {
        if (!active) return;

        if (handleClick) {
            handleClick(false);
        } else if (setActive) {
            setActive(false);
        }
    }, [disabled]);

    useEffect(() => {
        document.addEventListener('click', handleGlobalClick);

        return () => document.removeEventListener('click', handleGlobalClick);

        function handleGlobalClick(e) {
            if (!traverseParentsForClass(e.target, DROPDOWN_BUTTON_CLASS)) setActive(false);
        }
    })

    return (
        <div className={DROPDOWN_BUTTON_CLASS + ' relative ' + (className ?? '') + (!disabled ? 'cursor-pointer' : ' ')}>
            <div onClick={!disabled ? (handleClick ?? (e => setActive(!active))) : (e => { })}
                className={(!disabled ? 'hover:opacity-70 ' : 'opacity-40 ') + ' px-2 py-2'}
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
