import React, { useState } from 'react';
import DropdownButton from './DropdownButton';
import Dropdown from '../Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCopy, faArchive, faClone, faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

export default function ActionsDropdown(props) {
    const { mappedData, duplicateItem, archiveItem } = props;
    const selectedItems = mappedData?.filter(item => item.selected === true) || [];

    const [active, setActive] = useState(false);

    function copyUrl(e) {
        console.log('copyUrl() not yet implimented');
    }

    function preview(e) {
        console.log('preview() not yet implimented');
    }

    const dropdownOptions = [
        { name: 'Duplicate', icon: faCopy, active: selectedItems.length === 1, onClick: (e) => duplicateItem(e) },
        { name: 'Archive', icon: faArchive, active: true, onClick: (e) => archiveItem(e) },
        { name: 'Copy URL', icon: faClone, active: selectedItems.length === 1, onClick: (e) => copyUrl(e) },
        { name: 'Preview', icon: faExternalLinkSquareAlt, active: selectedItems.length === 1, onClick: () => preview() }
    ];

    return (
        <DropdownButton
            icon={faFire}
            disabled={selectedItems.length === 0}
            active={active}
            setActive={setActive}
            text='Actions'
        >
            <Dropdown>
                {dropdownOptions.map((option, index) => {
                    return option.active === true && selectedItems.length > 0
                        ? (
                            <div onClick={option.onClick}
                                key={index} className='hover:bg-red-500'>
                                <FontAwesomeIcon icon={option.icon} style={{ marginRight: '4px' }} />
                                <span>{option.name}</span>
                            </div>
                        )
                        : ''
                })}
            </Dropdown>
        </DropdownButton>
    )
}
