import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Checkbox from './Checkbox';
import ChevronToggle from './ChevronToggle';
import Spinner from '../Spinner';
import DrilldownButton from '../LowerControlPanel/DrilldownButton';
import useWindowResize from '../../hooks/useWindowResize';
import useColumnDragger from '../../hooks/useColumnDragger';
import useRowHover from '../../hooks/useRowHover';
import { mapClicks } from '../views/HomeView';
import { replaceNonsense, stringIncludes, isEven } from '../../utils/utils';

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
        color: 'grey'
    },
    getColor: (name) => {
        let result;
        switch (name) {
            case INDICATORS.POSITIVE.name: result = INDICATORS.POSITIVE.color; break;
            case INDICATORS.NEGATIVE.name: result = INDICATORS.NEGATIVE.color; break;
            default: result = INDICATORS.NEUTRAL.color; break;
        }
        return result;
    }
};

export default function DataTable(props) {
    const { activeItem, searchQuery, mappedData, setMappedData, timeframe, reportChain, drilldown } = props;
    const { name: activeItemName } = activeItem;

    const { clicks, data, fetchData } = useAuth();

    const [loading, setLoading] = useState(Boolean(mappedData));
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const dataTableRef = useRef();
    dataTableRef.width = dataTableRef.current?.offsetWidth ?? '100vw';
    dataTableRef.fillRestOfScreen = () => {
        const rectTop = dataTableRef.current?.getBoundingClientRect()?.top;
        return rectTop ? `${window.innerHeight - rectTop}px` : '100px';
    };

    useEffect(() => resetMappedData(), [searchQuery, timeframe, reportChain, clicks, data]);
    useWindowResize(() => resetMappedData());

    const handleMouseDown = useColumnDragger();
    const handleMouseEnter = useRowHover('bg-data_table_row_hovered');

    function resetMappedData() {
        setSelectAllChecked(false);
        setMappedData(prevMappedData => {
            return prevMappedData.map(row => ({ ...row, selected: false, deepMappedData: undefined }));
        });
    }

    useEffect(() => {
        const mappedDataPresent = Boolean(mappedData);
        if (mappedDataPresent) {
            setLoading(false);
        } else {
            setLoading(true);
        }

        const numSelected = mappedData.filter(row => row.selected === true).length;
        if (numSelected === 0) {
            setSelectAllChecked(false);
        }
    }, [mappedData]);

    useEffect(() => {
        fetchData();
    }, [activeItem.name]);

    function changeRowSelection(value, index) {
        if (reportChain?.at(1)?.name) return;

        value = JSON.parse(value);
        const newMappedData = structuredClone(mappedData);
        newMappedData[index].selected = !value;

        setMappedData(newMappedData);
        setSelectAllChecked(false);
    }

    function toggleSelectAll(value) {
        if (reportChain?.at(1)?.name) return;

        value = JSON.parse(value);
        const newMappedData = mappedData.map(row => ({ ...row, selected: !value }));

        setMappedData(newMappedData);
        setSelectAllChecked(!value);
    }

    function handleChevronToggle(active, row, index, activeItem) {
        const deepMappedData = active
            ? mapClicks({ clicks: row.clicks, data, activeItem, timeframe })
            : null;

        const newMappedData = structuredClone(mappedData);
        newMappedData[index].deepMappedData = deepMappedData;

        setMappedData(newMappedData);
        setSelectAllChecked(false);
    }

    const columns = (activeItemName, reportChainIndex = 0) => [
        {
            name: ' ',
            selector: (row) => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                return totalRevenue > totalCost
                    ? INDICATORS.POSITIVE.name
                    : totalRevenue === totalCost
                        ? INDICATORS.NEUTRAL.name
                        : INDICATORS.NEGATIVE.name;
            }
        },
        (reportChain?.at(reportChainIndex + 1)?.name
            ? {
                name: ' ',
                selector: (row, index) => (
                    <ChevronToggle reportChain={reportChain}
                        callback={(active) => handleChevronToggle(active, row, index, reportChain[reportChainIndex + 1])} />
                )
            }
            : {
                name: () => {
                    return !loading && reportChainIndex === 0 && mappedData.length > 0
                        ? <Checkbox onChange={e => toggleSelectAll(e.target.dataset.checked)} checked={selectAllChecked} />
                        : '';
                },
                selector: (row, index) => {
                    return !loading && reportChainIndex === 0
                        ? <Checkbox onChange={e => changeRowSelection(e.target.dataset.checked, index)} checked={row.selected} />
                        : '';
                }
            }
        ),
        {
            name: activeItemName,
            selector: (row) => row.name
        },
        {
            name: 'Visits',
            selector: (row) => row.clicks.length
        },
        {
            name: 'Clicks',
            selector: (row) => row.clicks.filter(click => click.lpClick === true).length
        },
        {
            name: 'Conversions',
            selector: (row) => row.clicks.filter(click => click.conversion === true).length
        },
        {
            name: 'Revenue',
            selector: (row) => row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0)
        },
        {
            name: 'Cost',
            selector: (row) => row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0)
        },
        {
            name: 'Profit',
            selector: (row) => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                return totalRevenue - totalCost;
            }
        },
        {
            name: 'CPV',
            selector: (row) => {
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalCost / totalVisits, 0);
            }
        },
        {
            name: 'CPC',
            selector: (row) => {
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalClicks = row.clicks.filter(click => click.lpClick === true).length;
                return replaceNonsense(totalCost / totalClicks, 0);
            }
        },
        {
            name: 'CTR',
            selector: (row) => {
                const totalClicks = row.clicks.filter(click => click.lpClick === true).length;
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalClicks / totalVisits, 0) * 100 + '%';
            }
        },
        {
            name: 'CV',
            selector: (row) => {
                const totalConversions = row.clicks.filter(click => click.conversion === true).length;
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalConversions / totalVisits, 0) * 100 + '%';
            }
        },
        {
            name: 'ROI',
            selector: (row) => {
                const totalCost = row.clicks.reduce((totalCost, click) => totalCost + (click.cost ?? 0), 0);
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                return replaceNonsense((totalRevenue - totalCost) / totalCost, 0) * 100 + '%';
            }
        },
        {
            name: 'EPV',
            selector: (row) => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalVisits = row.clicks.length;
                return replaceNonsense(totalRevenue / totalVisits, 0);
            }
        },
        {
            name: 'EPC',
            selector: (row) => {
                const totalRevenue = row.clicks.reduce((totalRevenue, click) => totalRevenue + (click.revenue ?? 0), 0);
                const totalClicks = row.clicks.filter(click => click.lpClick === true).length;
                return replaceNonsense(totalRevenue / totalClicks, 0);
            }
        }
    ];

    function columnTotal(mappedData, column, index) {
        if (index <= 2) return '';

        let isPercentage = false;
        return mappedData
            .map((_row, _index) => {
                const cell = column.selector(_row, _index);
                if (typeof cell === 'string' && cell.includes('%')) isPercentage = true;
                return cell;
            })
            .reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
            + (isPercentage ? '%' : '');
    }

    return (
        <div ref={dataTableRef} style={{ width: 'auto', height: dataTableRef.fillRestOfScreen() }}>
            <div className='relative grid grid-flow-col whitespace-nowrap overflow-x-scroll h-full bg-even_list_item'>
                {loading
                    ? <div className='flex justify-center items-center' style={{ height: '100%', width: '100%' }}>
                        <Spinner />
                    </div>
                    : columns(activeItemName).map((column, index) => {
                        const id = crypto.randomUUID();
                        return (
                            <div key={index} id={id} className='relative pb-16 first:w-6'>
                                <div className='absolute h-full' style={{ right: 0, width: '1px', backgroundColor: 'lightgray' }}>
                                    <div onMouseDown={index <= 1 ? null : e => handleMouseDown(e, id)}
                                        className={(index <= 1 ? '' : 'cursor-e-resize hover:opacity-100') + ' h-full opacity-0'}
                                        style={{ border: 'dashed black 1px' }} />
                                </div>
                                <div className='flex justify-start items-center overflow-hidden px-2 h-8 text-white bg-NavBar_backgroundColor'
                                    style={{ minWidth: index !== 1 ? '100px' : '30px', borderLeft: 'solid lightgray 1px' }}>
                                    {typeof column.name === 'function'
                                        ? column.name(mappedData)
                                        : column.name
                                    }
                                </div>
                                {mappedData.map((_row, _index) => {
                                    const _cell = column.selector(_row, _index);
                                    return searchQuery && !stringIncludes(_row.name, searchQuery)
                                        ? ''
                                        : (
                                            <React.Fragment key={_index}>
                                                <div style={{ borderTop: 'solid lightgray 1px', borderBottom: 'solid lightgray 1px', backgroundColor: _row.selected ? '#d1ede7' : '' }}
                                                    className={(isEven(_index) ? 'bg-even_list_item' : 'bg-odd_list_item')
                                                        + ' flex justify-start items-center overflow-hidden px-2 h-8 cursor-pointer'}
                                                    data-_row_index={_index}
                                                    onMouseEnter={e => handleMouseEnter(e, `div[data-_row_index="${_index}"]`)}
                                                    onClick={e => changeRowSelection(_row.selected === true, _index)}
                                                >
                                                    <span style={{ backgroundColor: index === 0 ? INDICATORS.getColor(_cell) : '' }}
                                                        className={(index === 0 ? 'text-white' : index === 2 ? 'text-left' : 'text-right') + ' w-full'}
                                                    >
                                                        {_cell}
                                                    </span>


                                                    {/* {_row.deepMappedData && index === 0
                                                    ? <div className='block'
                                                        style={{
                                                            left: 0,
                                                            width: dataTableRef.width,
                                                            backgroundColor: 'blueviolet'
                                                        }}
                                                    >
                                                        <div className='p-4' />
                                                        {reportChain[1].name}
                                                        <div className='grid grid-flow-col auto-cols-fr gap-4 whitespace-nowrap overflow-hidden'
                                                            style={{ backgroundColor: 'purple' }}>
                                                            {columns(reportChain[1].name, 1).map((__column, __index) => (
                                                                <div key={__index}>
                                                                    {<div className='flex justify-start items-center overflow-hidden' style={{ minHeight: '20px' }}>
                                                                        {typeof __column.name === 'function'
                                                                            ? __column.name(_row.deepMappedData)
                                                                            : __column.name
                                                                        }
                                                                    </div>}
                                                                    {_row.deepMappedData.map((___row, ___index) => {
                                                                        const ___cell = __column.selector(___row, ___index, _index);
                                                                        return (
                                                                            <div key={___index}>
                                                                                <div className='flex justify-start items-center overflow-hidden'
                                                                                    style={{ backgroundColor: INDICATORS.getColor(___cell) }}
                                                                                >
                                                                                    <span style={{ zIndex: 200, opacity: __index === 0 ? 0 : 100 }}>
                                                                                        {___cell}
                                                                                    </span>
                                                                                </div>



                                                                                {___row.deepMappedData && __index === 0
                                                                                    ? <div className='block'
                                                                                        style={{
                                                                                            left: 0,
                                                                                            width: dataTableRef.width,
                                                                                            backgroundColor: 'yellow',
                                                                                        }}
                                                                                    >
                                                                                        <div className='p-4' />
                                                                                        {reportChain[2].name}
                                                                                        <div className='grid grid-flow-col auto-cols-fr gap-4 whitespace-nowrap overflow-hidden'
                                                                                            style={{ backgroundColor: 'orange' }}>
                                                                                            {columns(reportChain[2].name, 2).map((____column, ____index) => (
                                                                                                <div key={____index}>
                                                                                                    {<div className='flex justify-start items-center overflow-hidden' style={{ minHeight: '20px' }}>
                                                                                                        {typeof ____column.name === 'function'
                                                                                                            ? ____column.name(___row.deepMappedData)
                                                                                                            : ____column.name
                                                                                                        }
                                                                                                    </div>}
                                                                                                    {___row.deepMappedData.map((_____row, _____index) => {
                                                                                                        const _____cell = ____column.selector(_____row, _____index, _index);
                                                                                                        return (
                                                                                                            <div key={_____index}>
                                                                                                                <div className='flex justify-start items-center overflow-hidden'
                                                                                                                    style={{ backgroundColor: INDICATORS.getColor(_____cell) }}
                                                                                                                >
                                                                                                                    <span style={{ zIndex: 200, opacity: ____index === 0 ? 0 : 100 }}>
                                                                                                                        {_____cell}
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                        <button onClick={e => console.log(`Drilldown: ${_row.deepMappedData[__index]?.name} not yet implimented.`)}>
                                                                                            {'Drilldown: ' + _row.deepMappedData[__index]?.name}
                                                                                        </button>
                                                                                    </div>
                                                                                    : ''
                                                                                }



                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button onClick={e => console.log(`Drilldown: ${mappedData[index]?.name} not yet implimented.`)}>
                                                            {'Drilldown: ' + mappedData[index]?.name}
                                                        </button>
                                                    </div>
                                                    : ''
                                                } */}

                                                </div>
                                                {_row.deepMappedData &&
                                                    <>
                                                        <div className='relative flex justify-start items-center px-2 h-8 w-full bg-white'>
                                                            {index === 1 &&
                                                                <div className='absolute bg-white' style={{ zIndex: 20 }}>
                                                                    {reportChain?.at(1)?.name}
                                                                </div>
                                                            }
                                                        </div>
                                                        {_row.deepMappedData.map((__row, __index) => {
                                                            const __cell = column.selector(__row, __index);
                                                            return (

                                                                // <div key={__index} className='flex justify-start items-center px-2 h-8'
                                                                //     style={{ borderTop: 'solid lightgray 1px', borderBottom: 'solid lightgray 1px' }}>
                                                                //     {__cell}
                                                                // </div>

                                                                <div key={__index}
                                                                    style={{ borderTop: 'solid lightgray 1px', borderBottom: 'solid lightgray 1px', backgroundColor: __row.selected ? '#d1ede7' : '' }}
                                                                    className={(isEven(__index) ? 'bg-even_list_item' : 'bg-odd_list_item')
                                                                        + ' flex justify-start items-center overflow-hidden px-2 h-8 cursor-pointer'}
                                                                    data-__row_index={__index}
                                                                    onMouseEnter={e => handleMouseEnter(e, `div[data-__row_index="${__index}"]`)}
                                                                    onClick={e => changeRowSelection(__row.selected === true, __index)}
                                                                >
                                                                    <span style={{ backgroundColor: index === 0 ? INDICATORS.getColor(_cell) : '' }}
                                                                        className={(index === 0 ? 'text-white' : index === 2 ? 'text-left' : 'text-right') + ' w-full'}
                                                                    >
                                                                        {__cell}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                        <div className='relative flex justify-start items-center p-6 h-8 w-full bg-white'>
                                                            {index === 1 &&
                                                                <div className='absolute bg-white' style={{ zIndex: 20 }}>
                                                                    <DrilldownButton mappedData={mappedData} drilldown={drilldown} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </>
                                                }
                                            </React.Fragment>
                                        )
                                })
                                }
                                <div className='absolute flex justify-end items-center overflow-hidden px-2 h-8 bg-NavBar_backgroundColor'
                                    style={{
                                        width: '100%',
                                        minHeight: '20px',
                                        color: 'white',
                                        borderLeft: 'solid lightgray 1px',
                                        bottom: 0
                                    }}
                                >
                                    {columnTotal(mappedData, column, index)}
                                </div>
                            </div >
                        )
                    })}
            </div>
        </div >
    )
}
