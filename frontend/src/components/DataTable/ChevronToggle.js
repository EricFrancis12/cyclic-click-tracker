import React, { useState, useEffect } from 'react';
import useWindowResize from '../../hooks/useWindowResize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ChevronToggle(props) {
    const { callback, reportChain } = props;

    const [active, setActive] = useState(false);

    useEffect(() => setActive(false), [reportChain]);
    useWindowResize(() => setActive(false));

    function handleClick() {
        setActive(!active);
        if (callback) callback(!active);
    }

    return (
        <span className='flex justify-center items-center w-full h-full cursor-pointer'>
            <FontAwesomeIcon onClick={e => handleClick(e)} icon={active ? faChevronDown : faChevronRight} />
        </span>
    )
}
