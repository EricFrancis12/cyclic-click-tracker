import React, { useState } from 'react';
import Route from './Route';
import RulesMenu from '../RulesMenu/RulesMenu';
import { AddNewButton } from '../ActionMenu/baseComponents';
import FlowConfig from '../../config/Flow.config.json';
const { types: FLOW_TYPES, routeTypes: ROUTE_TYPES } = FlowConfig;

export default function FlowBuilder(props) {
    const { flow, setFlow } = props;
    const { createNewLandingPage, createNewOffer } = props;

    const [rulesMenuActive, setRulesMenuActive] = useState(false);

    function handleSave(rules) {
        setFlow({
            ...flow,
            ruleRoutes: [
                ...flow.ruleRoutes,
                {
                    active: true,
                    rules: rules,
                    paths: [{
                        weight: 100,
                        landingPages: [],
                        offers: [],
                        active: true,
                        directLinkingEnabled: false
                    }]
                }
            ]
        });
    }

    return (
        <>
            {flow?.defaultRoute &&
                <Route route={flow.defaultRoute} type={ROUTE_TYPES.DEFAULT} flow={flow} setFlow={setFlow}
                    createNewLandingPage={createNewLandingPage} createNewOffer={createNewOffer}
                />
            }
            {flow?.ruleRoutes?.map((route, index) => (
                <Route key={index} route={route} type={ROUTE_TYPES.RULE} flow={flow} setFlow={setFlow}
                    createNewLandingPage={createNewLandingPage} createNewOffer={createNewOffer}
                />
            ))}
            <AddNewButton name='Rule' onClick={e => setRulesMenuActive(true)} />
            {rulesMenuActive &&
                <RulesMenu rulesMenuActive={rulesMenuActive} setRulesMenuActive={setRulesMenuActive}
                    rules={[]} onSave={handleSave}
                />
            }
        </>
    )
}
