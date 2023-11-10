import React from 'react';

export default function useRowHover(activeClassName = 'bg-green-400') {
    function handleMouseEnter(e, selector) {
        if (!e?.target || !selector) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.classList.add(activeClassName));

        e.target.addEventListener('mouseleave', e => handleMouseLeave(e, selector));
    }

    function handleMouseLeave(e, selector) {
        if (!e?.target || !selector) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.classList.remove(activeClassName));

        e.target.removeEventListener('mouseleave', e => handleMouseLeave(e, selector));
    }

    return handleMouseEnter;
}
