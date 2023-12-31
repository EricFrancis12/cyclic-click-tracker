import React, { useState, useRef, useEffect } from 'react';
import Dropdown from '../components/Dropdown';

export default function useHoverDropdown(id) {
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef(null);

    const dropdownId = useRef(crypto.randomUUID());

    function handleMouseEnter() {
        setIsHovered(true);

        const targetElement = document.getElementById(id);
        if (targetElement) targetElement.addEventListener('mouseleave', handleMouseExit);
        if (dropdownRef.current) dropdownRef.current.addEventListener('mouseleave', handleMouseExit);
    };

    function handleMouseExit(e) {
        function traverseParents(element, id) {
            if (element.id === id) {
                return true; // Found a valid id, return element
            } else if (element !== document.body) {
                return traverseParents(element.parentNode); // Recursive call and return its result
            }
            return false; // If no valid id found, return false
        }

        if (!traverseParents(e.target, id) && !traverseParents(e.target, dropdownId)) {
            setIsHovered(false);

            const targetElement = document.getElementById(id);
            if (targetElement) targetElement.removeEventListener('mouseleave', handleMouseExit);
            if (dropdownRef.current) dropdownRef.current.removeEventListener('mouseleave', handleMouseExit);
        }
    }

    useEffect(() => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.addEventListener('mouseenter', handleMouseEnter);
        }
        return () => {
            if (targetElement) {
                targetElement.removeEventListener('mouseenter', handleMouseEnter);
            }
        };
    }, [id]);

    return { Dropdown, isHovered };
}
