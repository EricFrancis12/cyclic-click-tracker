import React, { useRef } from 'react';

export default function useColumnDragger() {
    const id = useRef('');

    function handleMouseDown(e, _id) {
        id.current = _id;
        document.body.style.cursor = 'e-resize';
        document.body.style.userSelect = 'none';

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
    }

    function handleMouseUp(e) {
        id.current = '';
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'default';

        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    }

    function handleMouseMove(e) {
        const column = document.getElementById(id.current);
        const rectLeft = column.getBoundingClientRect()?.left;

        column.style.width = `${e.clientX - rectLeft}px`;
    }

    return handleMouseDown;
}
