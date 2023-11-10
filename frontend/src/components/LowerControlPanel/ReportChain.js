import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DropdownButton, { DropdownItem } from './DropdownButton';
import { flattened_ITEMS } from '../UpperControlPanel/UpperControlPanel';
import { MAX_REPORT_CHAIN_LENGTH } from '../views/ReportView';
import { arrayOf } from '../../utils/utils';

const TERMS = {
    NONE: 'None'
};

export default function ReportChain(props) {
    const { reportChain, setReportChain, reportItem, activeItem, setActiveItem } = props;

    const { fetchData } = useAuth();

    const DEFAULT_DROPDOWNS_ACTIVE = reportChain.map(() => false);
    const [dropdownsActive, setDropdownsActive] = useState(DEFAULT_DROPDOWNS_ACTIVE);

    const dropdownItems = [
        ...flattened_ITEMS.filter(item => item.name !== activeItem?.name && item.name !== reportItem.name),
        // add more custom items here like Custom 1-10, time periods, referrers, etc.
    ];

    useEffect(() => handleClick(activeItem, 0), [activeItem]);

    function handleClick(item, index) {
        if (index === 0) {
            setActiveItem(item);
            fetchData();
        }

        setDropdownsActive(DEFAULT_DROPDOWNS_ACTIVE);

        setReportChain(prevReportChain => {
            const newReportChain = [...prevReportChain];
            newReportChain.splice(index, MAX_REPORT_CHAIN_LENGTH, ...[
                { ...item, disabled: false },
                { name: null, disabled: item?.name ? false : true },
                ...arrayOf({ name: null, disabled: true }, MAX_REPORT_CHAIN_LENGTH)
            ]);

            while (newReportChain.length > MAX_REPORT_CHAIN_LENGTH) {
                newReportChain.pop();
            }

            return newReportChain;
        });
    }

    function handleSetActive(active, index) {
        setDropdownsActive(prevDropdownsActive => {
            const newDropdownsActive = [...prevDropdownsActive];
            newDropdownsActive.splice(index, 1, active);

            return newDropdownsActive;
        });
    }

    return (
        <div className='flex flex-wrap justify-center items-center'>
            {reportChain.map((chainLink, index) => (
                <div key={index} className='p-1'>
                    <DropdownButton
                        text={chainLink.disabled ? '' : ((index === 0 ? activeItem.name : chainLink.name) || TERMS.NONE)}
                        disabled={chainLink.disabled}
                        active={dropdownsActive[index] !== false}
                        setActive={(active) => handleSetActive(active, index)}
                    >
                        {index !== 0 &&
                            <DropdownItem text={TERMS.NONE}
                                onClick={e => handleClick({ name: null }, index)}
                            />
                        }
                        {dropdownItems.map((dropdownItem, _index) => {
                            const isPrevChainLink = reportChain.find(chainLink => chainLink?.name === dropdownItem.name) !== undefined;
                            return !isPrevChainLink
                                ? (
                                    <DropdownItem key={_index} text={dropdownItem.name}
                                        onClick={e => handleClick(dropdownItem, index)}
                                    />
                                )
                                : ''
                        })}
                    </DropdownButton>
                </div>
            ))
            }
        </div >
    )
}
