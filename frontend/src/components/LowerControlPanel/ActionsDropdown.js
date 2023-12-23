import React, { useState } from 'react';
import DropdownButton, { DropdownItem } from './DropdownButton';
import { faFire, faCopy, faArchive, faClone, faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

export default function ActionsDropdown(props) {
    const { selectedItems, duplicateItem, archiveItem } = props;

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
            {dropdownOptions.map((option, index) => {
                return option.active === true && selectedItems.length > 0
                    ? (
                        <DropdownItem key={index} icon={option.icon} onClick={option.onClick}>
                            <span>{option.name}</span>
                        </DropdownItem>
                    )
                    : ''
            })}
        </DropdownButton>
    )
}
