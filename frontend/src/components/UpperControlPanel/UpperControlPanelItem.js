import React from 'react';
import useHoverDropdown from '../../hooks/useHoverDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ITEM_TYPES } from './UpperControlPanel';
import { arrayIncludesKeyValuePair } from '../../utils/utils';

export default function UpperControlPanelItem(props) {
    const { item, activeItemName, setActiveItemName } = props;

    const id = crypto.randomUUID();

    const { Dropdown, isHovered } = useHoverDropdown(id);

    return (
        <div className='flex justify-start items-start '>
            <div onClick={item.type !== ITEM_TYPES.DROPDOWN ? e => setActiveItemName(item.name) : null}
                id={id}
                style={{ borderRadius: '4px' }}
                className={(activeItemName === item.name || arrayIncludesKeyValuePair(item?.dropdownItems, 'name', activeItemName) ? 'bg-button_backgroundColor text-white ' : '')
                    + ' relative flex justify-start items-center p-1 px-2 cursor-pointer hover:bg-button_backgroundColor_hover hover:text-white'}>
                <FontAwesomeIcon icon={item.icon} style={{ marginRight: '4px' }} />
                <span style={{ marginRight: '4px' }}>
                    {item.name ?? (arrayIncludesKeyValuePair(item?.dropdownItems, 'name', activeItemName) ? activeItemName : item.defaultName)}
                </span>
                {item.type === ITEM_TYPES.DROPDOWN && <FontAwesomeIcon icon={isHovered ? faChevronUp : faChevronDown} />}
                {item.type === ITEM_TYPES.DROPDOWN && isHovered && <div className='absolute text-black' style={{}}>
                    <Dropdown>
                        {item.dropdownItems.map((dropdownItem, index) => (
                            <div onClick={e => setActiveItemName(dropdownItem.name)} key={index} className='hover:bg-red-500'>
                                <span>{dropdownItem.name}</span>
                            </div>
                        ))}
                    </Dropdown>
                </div>}
            </div>
        </div>
    )
}
