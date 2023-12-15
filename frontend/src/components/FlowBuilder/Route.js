import React, { useState } from 'react';
import Path from './Path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faChevronUp, faChevronDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AddNewButton } from '../ActionMenu/baseComponents';
import RulesMenu from '../RulesMenu/RulesMenu';
import Checkbox from '../Checkbox';
import { DEFAULT_PATH } from './Path';
import { swapArrayElementsPerCondition } from '../../utils/utils';
import FlowConfig from '../../config/Flow.config.json';
const { types: FLOW_TYPES, routeTypes: ROUTE_TYPES } = FlowConfig;

export default function Route(props) {
    const { route, type, flow, setFlow } = props;
    const { createNewLandingPage, createNewOffer } = props;

    const [rulesMenuActive, setRulesMenuActive] = useState(false);

    function handleChecked(e) {
        if (type === ROUTE_TYPES.DEFAULT) return;

        const newRuleRoutes = flow.ruleRoutes.map(ruleRoute => {
            if (ruleRoute === route) {
                return { ...ruleRoute, active: !ruleRoute.active };
            }
            return ruleRoute;
        });
        setFlow({
            ...flow,
            ruleRoutes: newRuleRoutes
        });
    }

    function handleSave({ rules, logicalRelation }) {
        const newRuleRoutes = flow.ruleRoutes.map(ruleRoute => {
            if (ruleRoute === route) {
                return { ...ruleRoute, rules, logicalRelation };
            }
            return ruleRoute;
        });
        setFlow({
            ...flow,
            ruleRoutes: newRuleRoutes
        });
    }

    function handleChevronClick(direction) {
        const newRuleRoutes = swapArrayElementsPerCondition(flow.ruleRoutes, (ruleRoute) => ruleRoute === route, { direction });
        setFlow({
            ...flow,
            ruleRoutes: newRuleRoutes
        });
    }

    function handleTrashCanClick(e) {
        const newRuleRoutes = flow.ruleRoutes.filter(ruleRoute => ruleRoute !== route);
        setFlow({
            ...flow,
            ruleRoutes: [
                ...newRuleRoutes
            ]
        });
    }

    function handleAddNewPath() {
        if (type === ROUTE_TYPES.DEFAULT) {
            setFlow({
                ...flow,
                defaultRoute: {
                    ...flow.defaultRoute,
                    paths: [
                        ...flow.defaultRoute.paths,
                        structuredClone(DEFAULT_PATH)
                    ]
                }
            });
        } else if (type === ROUTE_TYPES.RULE) {
            setFlow({
                ...flow,
                ruleRoutes: flow.ruleRoutes.map(ruleRoute => {
                    if (ruleRoute === route) {
                        return {
                            ...ruleRoute,
                            paths: [
                                ...ruleRoute.paths,
                                structuredClone(DEFAULT_PATH)
                            ]
                        };
                    }
                    return ruleRoute;
                })
            });
        }
    }

    return (
        <>
            <div className='flex flex-col justify-start items-start gap-2 w-full px-2 py-1'
                style={{ border: 'solid 1px grey', borderRadius: '5px' }}
            >
                <div className='flex justify-between items-center p-2 w-full'>
                    <div className='flex justify-start items-center'>
                        <div>
                            <span className={route.active ? ' ' : 'line-through '}>
                                {type
                                    ? type === ROUTE_TYPES.DEFAULT
                                        ? 'Default Route'
                                        : type === ROUTE_TYPES.DEFAULT
                                            ? 'Rule Route'
                                            : 'Route'
                                    : 'Route'
                                }
                            </span>
                        </div>
                    </div>
                    {type !== ROUTE_TYPES.DEFAULT &&
                        <div className='flex justify-end items-center gap-2 p-2'>
                            {route.active &&
                                <>
                                    <div className='cursor-pointer' onClick={e => setRulesMenuActive(true)}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </div>
                                    <div className='cursor-pointer' onClick={e => handleChevronClick('before')}>
                                        <FontAwesomeIcon icon={faChevronUp} />
                                    </div>
                                    <div className='cursor-pointer' onClick={e => handleChevronClick('after')}>
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </div>
                                    <div className='cursor-pointer hover:text-red-500' onClick={e => handleTrashCanClick(e)}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </div>
                                </>
                            }
                            <div>
                                <Checkbox checked={route.active} onChange={e => handleChecked(e)} />
                            </div>
                        </div>
                    }
                </div>
                {route.active &&
                    <>
                        {route.paths.map((path, index) => (
                            <Path key={index} path={path} route={route} routeType={type} flow={flow} setFlow={setFlow}
                                createNewLandingPage={createNewLandingPage} createNewOffer={createNewOffer}
                            />
                        ))}
                        < AddNewButton name='Path' onClick={e => handleAddNewPath()} />
                    </>
                }

            </div >
            {rulesMenuActive && route.active &&
                <RulesMenu rulesMenuActive={rulesMenuActive} setRulesMenuActive={setRulesMenuActive}
                    rules={route.rules} route={route} onSave={handleSave}
                />
            }
        </>
    )
}
