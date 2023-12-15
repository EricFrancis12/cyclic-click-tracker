import React, { useMemo } from 'react';
import { RULES } from '../components/RulesMenu/RulesMenu';
import { removeDupes } from '../utils/utils';

export default function useClicksMemo(clicks) {
    // looping through all clicks, using useMemo to store unique values

    const rules = useMemo(() => {
        console.log('running useMemo at useClicksMemo');
        return getUniqueRules(clicks);
    }, []);

    const clicksMemo = {
        rules
    };

    return clicksMemo;
}

function getUniqueRules(clicks) {
    // filtering clicks into unique instances of each RULES[i].clickProp

    const uniqueContitions = RULES.reduce((result, currRule) => {
        result[currRule.name] = [...removeDupes(clicks.map(click => click[currRule.clickProp]))]
            .filter(rule => Boolean(rule));
        return result;
    }, {});

    return uniqueContitions;
}