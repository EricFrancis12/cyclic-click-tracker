import React, { useState } from 'react';
import DropdownButton, { DropdownItem } from './DropdownButton';
import { ITEMS } from '../UpperControlPanel/UpperControlPanel';
import { MAX_REPORT_CHAIN_LENGTH } from '../views/ReportView';
import { arrayOf } from '../../utils/utils';

const TERMS = {
    NONE: 'None'
};

export default function ReportChain(props) {
    const { reportChain, setReportChain, activeItem } = props;

    const [dropdownsActive, setDropdownsActive] = useState(reportChain.map(() => false));

    const dropdownItems = ITEMS.filter(item => item.name !== activeItem?.name);

    function handleSetActive(active, index) {
        setDropdownsActive(prevDropdownsActive => {
            const newDropdownsActive = [...prevDropdownsActive];
            newDropdownsActive.splice(index, 1, active);

            return newDropdownsActive;
        });
    }

    function handleClick(item, index) {
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

    return (
        <div className='flex flex-wrap justify-center items-center'>
            {reportChain.map((chainLink, index) => (
                <div key={index} className='p-1'>
                    <DropdownButton
                        text={chainLink.disabled ? '' : (chainLink.name || TERMS.NONE)}
                        disabled={chainLink.disabled}
                        active={dropdownsActive[index] !== false}
                        setActive={active => handleSetActive(active, index)}
                    >
                        {index !== 0 &&
                            <DropdownItem text={TERMS.NONE}
                                onClick={e => handleClick(activeItem, index)}
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
