import React, { useRef, useEffect } from 'react';
import tokensList from '../../config/tokens.json';
import { traverseParentsForClass } from '../../utils/utils';

export const URL_INPUT_CLASS = 'URL_INPUT_CLASS';

export default function UrlInput(props) {
    const { text, defaultValue, value = '', onChange } = props;

    const insertionPoint = useRef(value?.length ?? 0);

    const availableTokens = tokensList.map(token => ({
        ...token,
        active: value.includes(token.value)
    }));

    function handleChange(e) {
        if (onChange) onChange(e.target.value);
    }

    function handleSelect(e) {
        insertionPoint.current = e.target.selectionEnd;
    }

    function handleTokenClick(tokenValue) {
        if (!onChange) return;
        if (value.includes(tokenValue)) return;

        const valueLeftOfInsertionPoint = value.substring(0, insertionPoint.current);
        const valueRightOfInsertionPoint = value.substring(insertionPoint.current, value.length);
        const newValue = `${valueLeftOfInsertionPoint}${tokenValue}${valueRightOfInsertionPoint}`;
        onChange(newValue);
    }

    useEffect(() => {
        document.addEventListener('click', handleGlobalClick);

        return () => document.removeEventListener('click', handleGlobalClick);

        function handleGlobalClick(e) {
            if (traverseParentsForClass(e.target, URL_INPUT_CLASS)) return;
            insertionPoint.current = value?.length ?? 0;
        }
    })

    return (
        <div className={URL_INPUT_CLASS + ' flex flex-col justify-start items-start gap-2 w-full'}>
            <span>
                {text ? text : 'URL:'}
            </span>
            <div className='w-full'>
                <textarea className='w-full min-h-[150px] p-1 bg-white'
                    style={{ border: 'solid 1px grey', borderRadius: '5px' }}
                    value={value} defaultValue={defaultValue}
                    onChange={e => handleChange(e)}
                    onSelect={e => handleSelect(e)}
                />
            </div>
            <div className='flex flex-wrap justify-start items-center gap-2 h-full text-sm'>
                <div className='italic'>
                    Available Tokens:
                </div>
                {availableTokens.map((token, index) => (
                    <div key={index}
                        className={(token.active ? 'bg-gray-300' : 'bg-green-500')
                            + ' flex justify-center items-center h-full px-2 cursor-pointer'}
                        style={{ borderRadius: '25px' }}
                        onClick={e => handleTokenClick(token.value)}
                    >
                        {token.value}
                    </div>
                ))}
            </div>
        </div>
    )
}
