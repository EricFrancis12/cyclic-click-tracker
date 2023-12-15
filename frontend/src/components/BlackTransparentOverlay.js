import React from 'react';

export default function BlackTransparentOverlay(props) {
    const { layer = 1, className = '', children } = props;

    const zIndex = parseFloat(layer) * 1000;

    return (
        <>
            <div className={'absolute opacity-60 bg-black'}
                style={{ top: 0, left: 0, height: '1000vh', width: '1000vw', pointerEvents: 'none', zIndex }}
            />
            <div className={'absolute ' + className}
                style={{ top: 0, left: 0, height: '100vh', width: '100vw', zIndex: zIndex + 10 }}
            >
                {children}
            </div>
        </>
    )
}
