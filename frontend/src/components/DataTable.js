import React, { useState } from 'react';
import Checkbox from './Checkbox';
import { replaceNonsense } from '../utils/utils';

export const INDICATORS = {
    POSITIVE: {
        name: '+',
        color: 'green'
    },
    NEGATIVE: {
        name: '-',
        color: 'red'
    },
    NEUTRAL: {
        name: '=',
        color: 'unset'
    },
};

export default function DataTable(props) {
    const { activeItem, searchQuery, mappedData, setMappedData } = props;
    const { name } = activeItem;

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    function handleChange(value, index) {
        value = JSON.parse(value);
        const newMappedData = structuredClone(mappedData);
        newMappedData[index].selected = !value;

        setMappedData(newMappedData);
        setSelectAllChecked(false);
    }

    function toggleSelectAll(value) {
        value = JSON.parse(value);
        const newMappedData = mappedData.map(item => ({ ...item, selected: !value }));

        setMappedData(newMappedData);
        setSelectAllChecked(!value);
    }

    const columns = [
        {
            name: '$',
            selector: row => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                return totalRevenue > totalCost
                    ? INDICATORS.POSITIVE.name
                    : totalRevenue === totalCost
                        ? INDICATORS.NEUTRAL.name
                        : INDICATORS.NEGATIVE.name;
            }
        },
        {
            name: () => <Checkbox onChange={e => toggleSelectAll(e.target.dataset.checked)}
                checked={selectAllChecked} />,
            selector: (row, index) => <Checkbox onChange={e => handleChange(e.target.dataset.checked, index)}
                checked={row.selected} />
        },
        {
            name: name,
            selector: row => row.name
        },
        {
            name: 'Visits',
            selector: row => row.clicks.length
        },
        {
            name: 'Clicks',
            selector: row => row.clicks.filter(click => click.lpClick === true).length
        },
        {
            name: 'Conversions',
            selector: row => row.clicks.filter(click => click.conversion === true).length
        },
        {
            name: 'Revenue',
            selector: row => row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0)
        },
        {
            name: 'Cost',
            selector: row => row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0)
        },
        {
            name: 'Profit',
            selector: row => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                return totalRevenue - totalCost;
            }
        },
        {
            name: 'CPV',
            selector: row => {
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalCost / totalVisits, 0);
            }
        },
        {
            name: 'CPC',
            selector: row => {
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalClicks = row.clicks.filter(click => click.lpClick === true).length;
                return replaceNonsense(totalCost / totalClicks, 0);
            }
        },
        {
            name: 'CTR',
            selector: row => {
                const totalClicks = row.clicks.filter(click => click.lpClick === true).length;
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalClicks / totalVisits, 0);
            }
        },
        {
            name: 'CV',
            selector: row => {
                const totalConversions = row.clicks.filter(click => click.conversion === true).length;
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalConversions / totalVisits, 0);
            }
        },
        {
            name: 'ROI',
            selector: row => {
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                return replaceNonsense((totalRevenue - totalCost) / totalCost, 0);
            }
        },
        {
            name: 'EPV',
            selector: row => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalRevenue / totalVisits, 0);
            }
        },
        {
            name: 'EPC',
            selector: row => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalClicks = row.clicks.filter(click => click.lpClick === true).length;
                return replaceNonsense(totalRevenue / totalClicks, 0);
            }
        }
    ];

    return (
        <div style={{ height: '100vh', width: '100vw', backgroundColor: 'blue' }}>
            <div className={`grid grid-flow-col auto-cols-fr gap-4 whitespace-nowrap overflow-scroll`} style={{ backgroundColor: 'grey' }}>
                {columns.map((column, index) => (
                    <div key={index}>
                        {typeof column.name === 'function'
                            ? column.name(mappedData)
                            : column.name
                        }
                        {searchQuery && !mappedData[index].name?.toUpperCase()?.includes(searchQuery.toUpperCase())
                            ? ''
                            : mappedData.map((row, _index) => {
                                const output = column.selector(row, _index, row?.selected === true);
                                return (
                                    <div key={_index} style={{
                                        backgroundColor: output === INDICATORS.POSITIVE.name
                                            ? INDICATORS.POSITIVE.color
                                            : output === INDICATORS.NEGATIVE.name
                                                ? INDICATORS.NEGATIVE.color
                                                : output === INDICATORS.NEUTRAL.name
                                                    ? INDICATORS.NEUTRAL.color
                                                    : ''
                                    }}>
                                        <span style={{
                                            opacity: index === 0 ? 0 : 100
                                        }}>
                                            {output}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                ))}
            </div>
        </div >
    )
}
