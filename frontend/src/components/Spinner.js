import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


export default function Spinner(props) {
    const { active: _active = true } = props;

    const [active, setActive] = useState(_active);

    return active
        ? (
            <FontAwesomeIcon icon={faSpinner} />
        )
        : '';
}
