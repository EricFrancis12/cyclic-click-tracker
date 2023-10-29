import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export default function Tab(props) {
    const { view_id, icon, name, active, handleTabClick, closeView } = props;

    return (
        <div className='flex items-end h-full' style={{ marginRight: '8px' }}>
            <div onClick={e => handleTabClick(view_id)}
                className={(active ? 'bg-tab_active_backgroundColor' : 'bg-tab_inactive_backgroundColor hover:bg-tab_inactive_backgroundColor_hover')}
                style={{
                    userSelect: 'none',
                    height: '32px',
                    maxWidth: '245px',
                    fontSize: '13px',
                    padding: '6px 8px 6px 8px',
                    borderRadius: '6px 6px 0 0',
                    color: active ? 'var(--color-graphite)' : 'var(--color-white)',
                    // backgroundColor: active ? 'var(--tab-active-backgroundColor)' : 'var(--tab-inactive-backgroundColor)',
                }}>
                <FontAwesomeIcon icon={icon} style={{ marginRight: '4px' }} />
                <span className='cursor-pointer' style={{ marginRight: '4px' }}>
                    {name}
                </span>
                {closeView && <FontAwesomeIcon className='cursor-pointer' icon={faClose} onClick={e => closeView(view_id)} />}
            </div>
        </div>
    )
}
