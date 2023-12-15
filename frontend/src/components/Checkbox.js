import React from 'react';

export default function Checkbox(props) {
    const { checked, onChange = () => null } = props;

    return (
        <input type='checkbox' checked={checked} onChange={e => onChange(e)} />
    )
}
