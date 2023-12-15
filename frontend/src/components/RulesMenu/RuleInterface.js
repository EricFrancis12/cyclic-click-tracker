import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faList, faPen, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { RULES } from './RulesMenu';
import Checkbox from '../Checkbox';
import ItemSelector from './ItemSelector';

export const RULE_INTERFACE_TYPES = {
    CUSTOM: 'CUSTOM',
    FROM_LIST: 'FROM_LIST',
    FROM_CLICKS: 'FROM_CLICKS',
    FROM_CLICKS_OR_CUSTOM: 'FROM_CLICKS_OR_CUSTOM',
    CHECKBOXES: 'CHECKBOXES'
};

export function Custom() {
    throw new Error('Custom() not yet implimented');
    return (
        <div>Custom</div>
    )
}

export function FromList() {
    throw new Error('FromList() not yet implimented');
    return (
        <div>FromList</div>
    )
}

export function FromClicks() {
    throw new Error('FromClicks() not yet implimented');
    return (
        <div>FromClicks</div>
    )
}

export function FromClicksOrCustom(props) {
    const { rules, setRules, rule, onDelete } = props;
    const { name, equals, data } = rule;

    const { clicksMemo } = useAuth();
    const list = clicksMemo.rules?.[name] ?? [];

    const [includeEmptyValue, setIncludeEmptyValue] = useState(false);

    const currItems = includeEmptyValue ? ['', ...data] : data;

    const setItems = (items) => {
        let newData = items;
        if (includeEmptyValue === true) newData.shift();

        const newRules = rules.map(_rule => {
            if (_rule.name === name) {
                return { ..._rule, data: newData };
            }
            return _rule;
        });
        setRules(newRules);

    }

    const setEquals = (newEquals) => {
        const newRules = rules.map(_rule => {
            if (_rule.name === name) {
                return { ..._rule, equals: newEquals };
            }
            return _rule;
        });
        setRules(newRules);
    }

    return (
        <Layout equals={equals} setEquals={setEquals} name={name} onDelete={onDelete}>
            <div className='flex justify-start items-center w-full'>
                <div className='flex justify-start items-center gap-2'>
                    <span>
                        <Checkbox checked={includeEmptyValue} onChange={e => setIncludeEmptyValue(!includeEmptyValue)} />
                    </span>
                    <span>
                        Include Empty Value
                    </span>
                </div>
            </div>
            <ItemSelector currItems={currItems} setItems={setItems} itemsList={list} maxItems={includeEmptyValue ? 10 : 9} />

        </Layout>
    )
}

export function Checkboxes(props) {
    const { rules, setRules, rule, onDelete, list = [] } = props;
    const { name, equals, data } = rule;

    function handleChange(item) {
        const newData = data.includes(item)
            ? data.filter(_item => _item !== item)
            : [...data, item];

        const newRules = rules.map(_rule => {
            if (_rule.name === name) {
                return { ..._rule, data: newData };
            }
            return _rule;
        });
        setRules(newRules);
    }

    const setEquals = (newEquals) => {
        const newRules = rules.map(_rule => {
            if (_rule.name === name) {
                return { ..._rule, equals: newEquals };
            }
            return _rule;
        });
        setRules(newRules);
    }

    return (
        <Layout equals={equals} setEquals={setEquals} name={name} onDelete={onDelete}>
            <div className='flex flex-wrap justify-start items-center gap-2 p-2'>
                {list.map((item, index) => (
                    <div key={index} value={item} className='flex justify-start items-center gap-2'>
                        <span>
                            <Checkbox checked={data.includes(item)} onChange={e => handleChange(item)} />
                        </span>
                        <span>
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

function Layout(props) {
    const { equals, setEquals, name, onDelete, children } = props;

    return (
        <div className='flex flex-col justify-start items-start gap-2 w-full p-2'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex justify-start items-center gap-2'>
                    <span>
                        {name}
                    </span>
                    <span>
                        <span>
                            <Checkbox checked={equals} onChange={e => setEquals(true)} />
                        </span>
                        <span>
                            Equals
                        </span>
                    </span>
                    <span>
                        <span>
                            <Checkbox checked={!equals} onChange={e => setEquals(false)} />
                        </span>
                        <span>
                            Not Equal
                        </span>
                    </span>
                </div>
                <div>
                    <span onClick={onDelete} className='cursor-pointer'>
                        <FontAwesomeIcon icon={faX} fontSize='12px' />
                    </span>
                </div>
            </div>
            {children}
        </div>
    )
}
