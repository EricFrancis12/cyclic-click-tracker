import React, { useRef, useEffect } from 'react';
import Dropdown from '../Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { traverseParentsForId } from '../../utils/utils';

export const DROPDOWN_BUTTON_ID = 'DROPDOWN_BUTTON_ID';

export function DropdownItem(props) {
    const { children, text, icon, onClick } = props;

    return (
        <div onClick={onClick}
            className='hover:bg-red-500'>
            {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '4px' }} />}
            {children || text}
        </div>
    )
}

export default function DropdownButton(props) {
    const { children, disabled, active, setActive, icon, text, handleClick, className, outlineEffect, bar } = props;

    const id = useRef(crypto.randomUUID());

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
            if (setActive && !traverseParentsForId(e.target, id.current)) setActive(false);
        }
    })

    return (
        <div id={id.current} className={' relative whitespace-nowrap ' + (className || ' ') + (!disabled ? 'cursor-pointer ' : ' ')}>
            <div onClick={!disabled ? (handleClick ?? setActive ? (e => setActive(!active)) : (e => null)) : (e => null)}
                className={(!disabled ? 'hover:opacity-70 ' : 'opacity-40 ') + 'flex justify-between px-2 py-2'}
                style={{
                    minWidth: '100px',
                    border: 'solid lightgrey 1px',
                    borderRadius: '6px',
                    backgroundImage: 'linear-gradient(0deg,var(--color-gray5),var(--color-white))'
                }}
            >
                <span>
                    {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '4px' }} />}
                    <span style={{ marginRight: '4px' }}>
                        {text ?? ''}
                    </span>
                </span>
                <span>
                    <FontAwesomeIcon icon={active ? faChevronUp : faChevronDown} />
                </span>
            </div >
            {
                active && !disabled &&
                <Dropdown>
                    {children}
                </Dropdown>
            }
        </div >
    )
}
