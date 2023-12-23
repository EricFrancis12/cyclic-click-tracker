import React, { useState } from 'react';
import { isArray } from '../utils/utils';

export default function useClicksDataPerTimeframe(clicks, timeframe) {
    if (!clicks) return {
        numVisits: 0,
        numClicks: 0,
        numConversions: 0,
        revenue: 0,
        cost: 0
    };
    if (!timeframe || !isArray(timeframe)) return {
        numVisits: clicks.length,
        numClicks: 0,
        numConversions: 0,
        revenue: 0,
        cost: 0
    };

    const [timeframeStartDate, timeframeEndDate] = timeframe;

    let numClicks = 0;
    let numConversions = 0;
    let revenue = 0;
    let cost = 0;

    const filteredClicks = clicks.map(click => {
        if (!click?.timestamp) return false;
        const clickDate = new Date(click.timestamp);
        const isWithinTimeframe = clickDate >= timeframeStartDate && clickDate <= timeframeEndDate;
        if (isWithinTimeframe) {
            if (click.lpClick === true) numClicks++;
            if (click.conversion === true) numConversions++;
            if (typeof click?.revenue === 'number') revenue += click.revenue;
            if (typeof click?.cost === 'number') cost += click.cost;
            return true;
        }

        return false;
    });

    return {
        numVisits: filteredClicks.length,
        numClicks,
        numConversions,
        revenue,
        cost
    };
}
