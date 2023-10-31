import React from 'react';
import { replaceNonsense } from '../utils/utils';

export default function DataTable(props) {
    const { name, mappedData } = props;

    const columns = [
        {
            name: name,
            selector: dataItem => dataItem.name
        },
        {
            name: 'Visits',
            selector: dataItem => dataItem.clicks.length
        },
        {
            name: 'Clicks',
            selector: dataItem => dataItem.clicks.filter(click => click.lpClick === true).length
        },
        {
            name: 'Conversions',
            selector: dataItem => dataItem.clicks.filter(click => click.conversion === true).length
        },
        {
            name: 'Revenue',
            selector: dataItem => dataItem.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0)
        },
        {
            name: 'Cost',
            selector: dataItem => dataItem.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0)
        },
        {
            name: 'Profit',
            selector: dataItem => {
                const totalRevenue = dataItem.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalCost = dataItem.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                return totalRevenue - totalCost;
            }
        },
        {
            name: 'CPV',
            selector: dataItem => {
                const totalCost = dataItem.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalVisits = dataItem.clicks.length;
                return replaceNonsense(totalCost / totalVisits, 0);
            }
        },
        {
            name: 'CPC',
            selector: dataItem => {
                const totalCost = dataItem.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalClicks = dataItem.clicks.filter(click => click.lpClick === true).length;
                return replaceNonsense(totalCost / totalClicks, 0);
            }
        },
        {
            name: 'CTR',
            selector: dataItem => {
                const totalClicks = dataItem.clicks.filter(click => click.lpClick === true).length;
                const totalVisits = dataItem.clicks.length;
                return replaceNonsense(totalClicks / totalVisits, 0);
            }
        },
        {
            name: 'CV',
            selector: dataItem => {
                const totalConversions = dataItem.clicks.filter(click => click.conversion === true).length;
                const totalVisits = dataItem.clicks.length;
                return replaceNonsense(totalConversions / totalVisits, 0);
            }
        },
        {
            name: 'ROI',
            selector: dataItem => {
                const totalCost = dataItem.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalRevenue = dataItem.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                return replaceNonsense((totalRevenue - totalCost) / totalCost, 0);
            }
        },
        {
            name: 'EPV',
            selector: dataItem => {
                const totalRevenue = dataItem.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalVisits = dataItem.clicks.length;
                return replaceNonsense(totalRevenue / totalVisits, 0);
            }
        },
        {
            name: 'EPC',
            selector: dataItem => {
                const totalRevenue = dataItem.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalClicks = dataItem.clicks.filter(click => click.lpClick === true).length;
                return replaceNonsense(totalRevenue / totalClicks, 0);
            }
        }
    ];

    console.log(mappedData);

    return (
        <div style={{ height: '100vh', width: '100vw', backgroundColor: 'blue' }}>
            <div className={`grid grid-flow-col auto-cols-fr gap-4 whitespace-nowrap overflow-scroll`} style={{ backgroundColor: 'red' }}>
                {columns.map((column, index) => (
                    <div key={index}>
                        {column.name}
                        {mappedData.map((dataItem, _index) => (
                            <div key={_index}>
                                {column.selector(dataItem)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div >
    )
}
