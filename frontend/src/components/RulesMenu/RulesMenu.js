import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import BlackTransparentOverlay from '../BlackTransparentOverlay';
import MenuHeader from '../MenuHeader';
import MenuFooter from '../MenuFooter';
import Checkbox from '../Checkbox';
import DropdownButton, { DropdownItem } from '../LowerControlPanel/DropdownButton';
import Button from '../Button';
import { FromClicksOrCustom, Checkboxes } from './RuleInterface';
import { ITEM_NAMES } from '../UpperControlPanel/UpperControlPanel';
import rules from '../../config/rules/rules';
import flowCongig from '../../config/Flow.config.json';

const connectionTypes = rules.connectionTypes.map(item => item?.name);
const deviceTypes = rules.deviceTypes.map(item => item?.name);
const browserNames = rules.browserNames.map(item => item?.name);
const daysOfTheWeek = rules.daysOfTheWeek.map(item => item?.name);

export const LOGICAL_RELATIONS = {
    ...flowCongig.logicalRelations
};

export const RULES = [
    { name: 'Country', itemName: ITEM_NAMES.COUNTRIES, clickProp: 'country', component: FromClicksOrCustom, selector: (click, array, isEquals) => isEquals ? array.includes(click.country) : !array.includes(click.country) },
    { name: 'State / Region', itemName: ITEM_NAMES.STATE_REGION, clickProp: 'region', component: FromClicksOrCustom },
    { name: 'City', itemName: ITEM_NAMES.CITIES, clickProp: 'city', component: FromClicksOrCustom },
    { name: 'Language', itemName: ITEM_NAMES.LANGUAGES, clickProp: 'language', component: FromClicksOrCustom },
    { name: 'ISP', itemName: ITEM_NAMES.ISP, clickProp: 'isp', component: FromClicksOrCustom },
    { name: 'Mobile Carrier', itemName: ITEM_NAMES.MOBILE_CARRIERS, clickProp: 'mobileCarrier', component: FromClicksOrCustom },
    { name: 'Connection Type', itemName: ITEM_NAMES.CONNECTION_TYPES, clickProp: 'connectionType', component: Checkboxes, list: connectionTypes },
    { name: 'Device Model', itemName: ITEM_NAMES.DEVICE_MODELS, clickProp: 'deviceModel', component: FromClicksOrCustom },
    { name: 'Device Vendor', itemName: ITEM_NAMES.DEVICE_VENDORS, clickProp: 'deviceVendor', component: FromClicksOrCustom },
    { name: 'Device Type', itemName: ITEM_NAMES.DEVICE_TYPES, clickProp: 'deviceType', component: Checkboxes, list: deviceTypes },
    { name: 'Screen Resolution', itemName: ITEM_NAMES.SCREEN_RESOLUTIONS, clickProp: 'screenResolution', component: FromClicksOrCustom },
    { name: 'OS', itemName: ITEM_NAMES.OS, clickProp: 'os', component: FromClicksOrCustom },
    { name: 'OS Version', itemName: ITEM_NAMES.OS_VERSIONS, clickProp: 'osVersion', component: FromClicksOrCustom },
    { name: 'Browser Name', itemName: ITEM_NAMES.BROWSER_NAMES, clickProp: 'browserName', component: Checkboxes, list: browserNames },
    { name: 'Browser Version', itemName: ITEM_NAMES.BROWSER_VERSIONS, clickProp: 'browserVersion', component: FromClicksOrCustom },
    { name: 'Days of the Week', itemName: null, clickProp: null, component: Checkboxes, list: daysOfTheWeek, selector: (click, array) => array.includes(new Date().getDay()) }
];

export default function RulesMenu(props) {
    const { rules: _rules, route, onSave, rulesMenuActive, setRulesMenuActive } = props;

    const [dropdownActive, setDropdownActive] = useState(false);
    const [logicalRelation, setLogicalRelation] = useState(route?.logicalRelation ?? LOGICAL_RELATIONS.AND);
    const [rules, setRules] = useState(
        _rules?.map(_rule => {
            const matchingRule = RULES.find(rule => rule.name === _rule.name);
            return matchingRule != undefined
                ? { ...matchingRule, equals: _rule.equals, data: _rule.data }
                : { ..._rule, equals: _rule.equals, data: _rule.data };
        }) ?? []
    );

    const filteredRules = RULES.filter(_rule => !rules.some(rule => rule.name === _rule.name));

    function addNewRule(rule) {
        if (!rule) return;

        const newRule = { ...rule, equals: true, data: [] };
        setRules([...rules, newRule]);
        setDropdownActive(false);
    }

    function deleteRule(rule) {
        const newRules = rules.filter(_rule => _rule.name !== rule.name);
        setRules(newRules);
    }

    function handleSave() {
        if (onSave) onSave({
            rules,
            logicalRelation
        });
        setRulesMenuActive(false);
    }

    return (
        <BlackTransparentOverlay layer={2} className='flex justify-center items-start p-4'>
            <div className='flex flex-col justify-start items-between h-full w-full max-w-[700px] bg-white'
                style={{ borderRadius: '5px' }}
            >
                <MenuHeader title='Rules' onClose={e => setRulesMenuActive(false)} />
                <div className='flex flex-col justify-start items-start gap-2 px-4 overflow-y-scroll'
                    style={{ height: 'inherit' }}
                >
                    <div className='flex justify-start items-center w-full'>
                        <span>
                            Logical Relation
                        </span>
                    </div>
                    <div className='flex justify-start items-center gap-2 w-full'>
                        {[LOGICAL_RELATIONS.AND, LOGICAL_RELATIONS.OR].map((_logicalRelation, index) => (
                            <div key={index} className='flex justify-start items-center'>
                                <Checkbox checked={_logicalRelation === logicalRelation}
                                    onChange={e => setLogicalRelation(_logicalRelation)}
                                />
                                <span>
                                    {_logicalRelation}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-start items-center gap-2 w-full'>
                        <DropdownButton
                            icon={faPlus}
                            active={dropdownActive}
                            setActive={setDropdownActive}
                            text='Add Rule'
                        >
                            {filteredRules.map((rule, index) => {
                                return rule.active !== false
                                    ? (
                                        <DropdownItem key={index} onClick={e => addNewRule(rule)}>
                                            <span>{rule.name}</span>
                                        </DropdownItem>
                                    )
                                    : ''
                            })}
                        </DropdownButton>
                        <Button text='Remove All Rules' icon={faTrashAlt} handleClick={e => setRules([])} />
                    </div>
                    <div className='flex flex-col justify-start items-center gap-2 p-2 w-full'
                        style={{ border: 'solid 1px grey' }}
                    >
                        {rules.map((rule, index) => (
                            <rule.component key={index} rule={rule} list={rule.list}
                                rules={rules} setRules={setRules}
                                onDelete={e => deleteRule(rule)}
                            />
                        ))}
                    </div>
                </div>
                <MenuFooter onSave={e => handleSave()} onClose={e => setRulesMenuActive(false)} />
            </div>
        </BlackTransparentOverlay>
    )
}
