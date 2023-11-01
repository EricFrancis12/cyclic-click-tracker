import React, { useState } from 'react';

export default function Checkbox(props) {
    const { checked: _checked, onChange } = props;

    const [checked, setChecked] = useState(_checked ?? false);

    function handleChange(e) {
        setChecked(!checked);
        if (onChange) onChange(e);
    }

    return (
        <input onChange={handleChange}
            type='checkbox'
            checked={_checked ?? checked}
            data-checked={_checked ?? checked}
        />
    )
}
