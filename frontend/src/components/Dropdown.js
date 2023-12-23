import React from 'react'

export default function Dropdown(props) {
    const { children, ref, id, isHovered = true } = props;

    return (
        <div className='absolute bg-white'
            ref={ref}
            id={id}
            style={{
                display: isHovered ? 'block' : 'none',
                zIndex: 999,
                width: 'auto'
            }}
        >
            {children}
        </div>
    )
};