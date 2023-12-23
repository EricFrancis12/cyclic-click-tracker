import React from 'react'

export function Wrapper({ children }) {
    return (
        <div className='flex flex-col justify-start items-start w-full'>
            {children}
        </div>
    )
}

export function Input(props) {
    const { name = '', placeholder = name, defaultValue, onChange } = props;

    return (
        <Wrapper>
            <span>
                {name}
            </span>
            <input type='text' placeholder={placeholder}
                className='w-full px-2 py-1'
                style={{ border: 'solid 1px grey', borderRadius: '6px' }}
                onChange={onChange}
                defaultValue={defaultValue}
            />
        </Wrapper>
    )
}

export function Select(props) {
    const { name, defaultValue, onChange, children } = props;

    return (
        <Wrapper>
            <span>
                {name}
            </span>
            <select className='w-full px-2 py-1'
                style={{ border: 'solid 1px grey', borderRadius: '6px' }}
                onChange={onChange}
                defaultValue={defaultValue}
            >
                {children}
            </select>
        </Wrapper>
    )
}

export function AddNewButton(props) {
    const { name = '', onClick } = props;

    return (
        <div className='flex justify-center items-center w-full p-2 cursor-pointer'
            style={{ border: 'solid 1px grey', borderRadius: '5px' }}
            onClick={onClick}
        >
            <span>
                {'+ Add New ' + name}
            </span>
        </div>
    )
}