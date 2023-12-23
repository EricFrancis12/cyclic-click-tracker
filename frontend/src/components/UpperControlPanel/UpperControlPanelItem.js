import React from 'react';
import useHoverDropdown from '../../hooks/useHoverDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ITEM_TYPES } from './UpperControlPanel';
import { arrayIncludesKeyValuePair } from '../../utils/utils';

export default function UpperControlPanelItem(props) {
    const { item, activeItem, setActiveItem } = props;

    const id = crypto.randomUUID();
    const { Dropdown, isHovered } = useHoverDropdown(id);

    return (
        <div className='flex justify-start items-start bg-transparent'>
            <div id={id}
                onClick={item.type !== ITEM_TYPES.DROPDOWN ? e => setActiveItem(item) : null}
                style={{ borderRadius: '6px' }}
                className={(activeItem?.name === item?.name || arrayIncludesKeyValuePair(item?.dropdownItems, 'name', activeItem?.name) ? 'bg-button_backgroundColor text-white ' : '')
                    + ' relative flex justify-start items-center py-1 px-2 cursor-pointer hover:bg-button_backgroundColor_hover hover:text-white'}
            >
                <FontAwesomeIcon icon={item.icon} style={{ marginRight: '4px' }} />
                <span style={{ marginRight: '4px' }}>
                    {item?.name ?? (arrayIncludesKeyValuePair(item?.dropdownItems, 'name', activeItem?.name) ? activeItem?.name : item?.defaultName)}
                </span>
                {item.type === ITEM_TYPES.DROPDOWN &&
                    <FontAwesomeIcon icon={isHovered ? faChevronUp : faChevronDown} />
                }
                {(item.type === ITEM_TYPES.DROPDOWN && isHovered) &&
                    <div className='absolute bg-white text-black'
                        style={{ bottom: 0, border: 'solid 1px black', borderRadius: '6px' }}
                    >
                        <Dropdown>
                            {item.dropdownItems.map((dropdownItem, index) => (
                                <div key={index} className='p-1 bg-white hover:bg-red-500'
                                    style={{
                                        borderTop: index === 0 ? 'solid 1px black' : '',
                                        borderBottom: 'solid 1px black',
                                        // borderLeft: 'solid 1px black',
                                        // borderRight: 'solid 1px black'
                                    }}
                                    onClick={e => setActiveItem(dropdownItem)}
                                >
                                    <span style={{ whiteSpace: 'nowrap' }}>
                                        {dropdownItem.name}
                                    </span>
                                </div>
                            ))}
                        </Dropdown>
                    </div>
                }
            </div>
        </div>
    )
}
