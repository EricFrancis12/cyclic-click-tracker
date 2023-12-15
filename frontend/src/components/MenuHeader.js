import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function MenuHeader(props) {
    const { title, onClose } = props;

    return (
        <div className='flex justify-between items-center p-4 px-6 text-white bg-popup_header'
            style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
            <div className='flex justify-center items-center'>
                <div className='flex justify-center items-center'>
                    {title}
                </div>
            </div>
            <div className='flex gap-4 justify-center items-center'>
                <div className='flex justify-center items-center'>
                    <span className='cursor-pointer'>
                        <span style={{ marginRight: '4px' }}>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </span>
                        <span>
                            Read Guide
                        </span>
                    </span>
                </div>
                <div className='flex justify-center items-center'>
                    <span className='cursor-pointer' onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
            </div>
        </div>
    )
}
