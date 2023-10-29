import React from 'react';

export default function DataTable(props) {
    const { name, data, clicks } = props;

    const columns = [
        {
            name: name || 'Data',
            dataKey: 'name'
        },
        {
            name: 'Visits',
            dataKey: 'visits'
        },
        {
            name: 'Clicks',
            dataKey: 'clicks'
        },
        // {
        //     name: 'Conversions',
        //     selector: row => row.conversions
        // },
        // {
        //     name: 'Revenue',
        //     selector: row => row.revenue
        // },
        // {
        //     name: 'Cost',
        //     selector: row => row.cost
        // },
        // {
        //     name: 'Profit',
        //     selector: row => row.profit
        // },
        // {
        //     name: 'CPV',
        //     selector: row => row.cpv
        // },
        // {
        //     name: 'CPC',
        //     selector: row => row.cpc
        // },
        // {
        //     name: 'CTR',
        //     selector: row => row.ctr
        // },
        // {
        //     name: 'CV',
        //     selector: row => row.cv
        // },
        // {
        //     name: 'ROI',
        //     selector: row => row.roi
        // },
        // {
        //     name: 'EPV',
        //     selector: row => row.epv
        // },
        // {
        //     name: 'EPC',
        //     selector: row => row.epc
        // }
    ];

    return (
        <div style={{ height: '100vh', width: '100vw', backgroundColor: 'blue' }}>
            <div className={`grid grid-flow-col auto-cols-fr gap-4 whitespace-nowrap overflow-scroll`} style={{ backgroundColor: 'red' }}>
                {columns.map((column, index) => (
                    <div key={index} className='flex flex-col justify-start items-start p-4'>
                        <div>{column.name}</div>
                        {/* ... */}
                    </div>
                ))}
            </div>
        </div>
    )
}
