import React from 'react'

export default function Dropdown(props) {
    const { children, ref, id, isHovered = true } = props;

    return (
        <div className='bg-white'
            ref={ref}
            id={id}
            style={{
                position: 'absolute',
                display: isHovered ? 'block' : 'none',
                zIndex: 999,
                width: 'auto'
            }}
        >
            {children}
        </div>
    )
};