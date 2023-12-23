import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
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
        color: '#17a689'
    },
    NEGATIVE: {
        name: '-',
        color: '#e05465'
    },
    NEUTRAL: {
        name: '·',
        color: '#ccc'
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

export const SORT_TYPES = {
    NORMAL: 'NORMAL',
    REVERSED: 'REVERSED'
};

export default function DataTable(props) {
    const { activeItem, searchQuery, mappedData, setMappedData, timeframe, reportChain, drilldown } = props;
    const { name: activeItemName } = activeItem;

    const { clicks, data, fetchData, fetchingData } = useAuth();

    const defaultSortedColumn = {
        index: 2,
        type: SORT_TYPES.NORMAL
    };

    const [sortedColumn, setSortedColumn] = useState(defaultSortedColumn);
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

    function handleChevronToggle(active, row, index, parentIndex, reportChainIndex = 1) {
        if (reportChainIndex == null || reportChainIndex > 2) return;

        const deepMappedData = active
            ? mapClicks({
                clicks: row.clicks,
                data,
                activeItem: reportChain[reportChainIndex],
                timeframe
            })
            : null;

        const newMappedData = structuredClone(mappedData);

        if (reportChainIndex === 1) {
            newMappedData[index].deepMappedData = deepMappedData;
        } else if (reportChainIndex === 2) {
            newMappedData[index].deepMappedData[parentIndex].deepMappedData = deepMappedData;
        } else {
            return;
        }

        setMappedData(newMappedData);
        setSelectAllChecked(false);
    }

    const columns = (activeItemName, reportChainIndex = 0) => {
        return [
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
                    selector: (row, index, parentIndex, reportChainIndex) => (
                        <ChevronToggle reportChain={reportChain}
                            callback={(active) => handleChevronToggle(active, row, index, parentIndex, reportChainIndex)} />
                    )
                }
                : {
                    name: () => {
                        return !fetchingData && mappedData.length > 0
                            ? <Checkbox onChange={e => toggleSelectAll(e.target.dataset.checked)} checked={selectAllChecked} />
                            : '';
                    },
                    selector: (row, index) => {
                        return !fetchingData
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
    }

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

    function handleFilterClick(index) {
        if (index < 2) return;

        if (sortedColumn.index === index && sortedColumn.type === SORT_TYPES.NORMAL) {
            setSortedColumn({
                index,
                type: SORT_TYPES.REVERSED
            });
        } else {
            setSortedColumn({
                index,
                type: SORT_TYPES.NORMAL
            });
        }
    }

    function sortMappedData() {
        const _columns = columns(activeItemName);

        const result = mappedData.sort((a, b) => {
            const activeColumn = _columns[sortedColumn.index];
            const _a = activeColumn.selector(a).at(-1) === '%' ? parseFloat(activeColumn.selector(a)) : activeColumn.selector(a);
            const _b = activeColumn.selector(b).at(-1) === '%' ? parseFloat(activeColumn.selector(b)) : activeColumn.selector(b);
            return _a - _b;
        });
        return sortedColumn.type === SORT_TYPES.REVERSED
            ? result.reverse()
            : result;
    }
    const sortedMappedData = sortMappedData();

    return (
        <div ref={dataTableRef} style={{ height: dataTableRef.fillRestOfScreen() }}>
            <div className='relative grid grid-flow-col whitespace-nowrap overflow-x-scroll h-full bg-even_list_item'>
                {columns(activeItemName).map((column, index) => {
                    const id = crypto.randomUUID();
                    return (
                        <div key={index} id={id} className='relative pb-16 w-full'
                            style={{ width: index === 0 ? '15px' : index === 1 ? '30px' : '' }}>
                            <div className='absolute h-full' style={{ right: 0, width: '1px', backgroundColor: index !== 0 ? 'lightgray' : '' }}>
                                <div onMouseDown={index <= 1 ? null : e => handleMouseDown(e, id)}
                                    className={(index <= 1 ? '' : 'cursor-e-resize hover:opacity-100') + ' h-full opacity-0'}
                                    style={{ border: 'dashed black 1px' }}
                                />
                            </div>
                            <div className='flex justify-start items-center overflow-hidden px-2 h-8 text-white bg-NavBar_backgroundColor'
                                style={{ minWidth: index >= 2 ? '110px' : '', borderLeft: 'solid lightgray 1px' }}>
                                {index >= 2 &&
                                    <span className='cursor-pointer'
                                        onClick={e => handleFilterClick(index)}
                                    >
                                        <FontAwesomeIcon icon={faFilter} />
                                    </span>
                                }
                                <span className={index >= 2 ? 'ml-[4px]' : ''}>
                                    {typeof column.name === 'function'
                                        ? column.name(mappedData)
                                        : column.name
                                    }
                                </span>
                            </div>
                            {fetchingData
                                ? index >= 2 && (
                                    <div className='flex justify-center items-start h-full w-full py-2'>
                                        <Spinner />
                                    </div>
                                )
                                : sortedMappedData.map((_row, _index) => {
                                    const _cell_id = `col_${index}_index_${_index}`;
                                    const _cell = column.selector(_row, _index);
                                    return searchQuery && !stringIncludes(_row.name, searchQuery)
                                        ? ''
                                        : (
                                            <React.Fragment key={_index}>
                                                <div id={_cell_id}
                                                    style={{ borderTop: 'solid lightgray 1px', borderBottom: 'solid lightgray 1px', backgroundColor: _row.selected ? '#d1ede7' : '' }}
                                                    className={(isEven(_index) ? 'bg-even_list_item' : 'bg-odd_list_item')
                                                        + (index <= 1 ? '' : ' px-2')
                                                        + ' flex justify-center items-center overflow-hidden h-8 cursor-pointer'}
                                                    data-_row_index={_index}
                                                    onMouseEnter={e => handleMouseEnter(e, `div[data-_row_index="${_index}"]`)}
                                                    onClick={e => changeRowSelection(_row.selected === true, _index)}
                                                >
                                                    <span style={{ backgroundColor: index === 0 ? INDICATORS.getColor(_cell) : '' }}
                                                        className={(index === 0 ? 'text-white ' : 'text-black ')
                                                            + (index <= 1 ? 'justify-center ' : index === 2 ? 'justify-start ' : 'justify-end ')
                                                            + ' flex items-center h-full w-full'}
                                                    >
                                                        {_cell}
                                                    </span>
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
                                                            const __cell_id = `col_${index}__index_${__index}`;
                                                            const __cell = column.selector(__row, __index, _index, 2);
                                                            const prev__cell = columns(activeItemName, 1)[index - 1]?.selector(__row, __index, _index, 2);
                                                            return (
                                                                <React.Fragment key={__index}>
                                                                    <div id={__cell_id} style={{
                                                                        borderTop: index >= 2 ? 'solid lightgray 1px' : '',
                                                                        borderBottom: index >= 2 ? 'solid lightgray 1px' : '',
                                                                        backgroundColor: __row.selected ? '#d1ede7' : ''
                                                                    }}
                                                                        className={(isEven(__index) ? 'bg-even_list_item' : 'bg-odd_list_item')
                                                                            + (index <= 2 ? '' : ' px-2')
                                                                            + ' flex justify-center items-center overflow-hidden h-8 cursor-pointer'}
                                                                        data-__row_index={__index}
                                                                        onMouseEnter={e => handleMouseEnter(e, `div[data-__row_index="${__index}"]`)}
                                                                        onClick={e => changeRowSelection(__row.selected === true, __index)}
                                                                    >
                                                                        <span className={(index === 0 ? 'text-white ' : 'text-black ')
                                                                            + (index === 0 ? 'justify-center ' : index === 2 ? 'justify-start ' : 'justify-end ')
                                                                            + ' flex items-center h-full w-full'}
                                                                        >
                                                                            {index === 0
                                                                                ? ''
                                                                                : index === 1
                                                                                    ? (
                                                                                        <div className='flex justify-end items-center h-full'>
                                                                                            <div className='flex justify-center items-center h-full text-white'
                                                                                                style={{ width: '15px', backgroundColor: index === 1 ? INDICATORS.getColor(prev__cell) : '' }}
                                                                                            >
                                                                                                {prev__cell}
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                    : index === 2
                                                                                        ? (
                                                                                            <div className='flex justify-start items-center h-full'>
                                                                                                <div className='flex justify-center items-center px-2 h-full'
                                                                                                    style={{ width: '30px', borderRight: 'solid lightgray 1px' }}>
                                                                                                    {prev__cell}
                                                                                                </div>
                                                                                                <div className='px-2'>
                                                                                                    {__cell}
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                        : __cell
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    {__row.deepMappedData &&
                                                                        <>
                                                                            <div className='relative flex justify-start items-center px-2 h-8 w-full bg-white'>
                                                                                {index === 2 &&
                                                                                    <div className='absolute bg-white' style={{ zIndex: 20 }}>
                                                                                        {reportChain?.at(2)?.name}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                            {__row.deepMappedData.map((___row, ___index) => {
                                                                                const ___cell = column.selector(___row, ___index, null, null);
                                                                                const ___cell_id = `col_${index}___index_${___index}`;
                                                                                const prev___cell = columns(activeItemName, 2)[index - 2]?.selector(___row, ___index, null, null);
                                                                                return (
                                                                                    <div key={___index} style={{
                                                                                        borderTop: index >= 2 ? 'solid lightgray 1px' : '',
                                                                                        borderBottom: index >= 2 ? 'solid lightgray 1px' : '',
                                                                                        backgroundColor: ___row.selected ? '#d1ede7' : ''
                                                                                    }}
                                                                                        className={(isEven(___index) ? 'bg-even_list_item' : 'bg-odd_list_item')
                                                                                            + (index <= 2 ? '' : ' px-2')
                                                                                            + ' flex justify-center items-center overflow-hidden h-8 cursor-pointer'}
                                                                                        data-___row_index={___index}
                                                                                        onMouseEnter={e => handleMouseEnter(e, `div[data-___row_index="${___index}"]`)}
                                                                                        onClick={e => changeRowSelection(_row.selected === true, ___index)}
                                                                                    >
                                                                                        <span className={(index === 0 ? 'text-white ' : 'text-black ')
                                                                                            + (index === 0 ? 'justify-center ' : index === 2 ? 'justify-start ' : 'justify-end ')
                                                                                            + ' flex items-center h-full w-full'}
                                                                                        >
                                                                                            {index <= 1
                                                                                                ? ''
                                                                                                : index === 2
                                                                                                    ? (
                                                                                                        <div className='flex justify-end items-center h-full'>
                                                                                                            <div className='flex justify-center items-center h-full text-white'
                                                                                                                style={{ width: '15px', backgroundColor: index === 2 ? INDICATORS.getColor(prev___cell) : '' }}
                                                                                                            >
                                                                                                                {prev___cell}
                                                                                                            </div>
                                                                                                            <div className='px-2'>
                                                                                                                {___cell}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                    : ___cell
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                            {/* starter code for drilldown functionality: */}
                                                                            {/* <div className='relative flex justify-start items-center p-6 h-8 w-full bg-white'>
                                                                                {index === 2 &&
                                                                                    <div className='absolute bg-white' style={{ zIndex: 20 }}>
                                                                                        <DrilldownButton text={__row.name}
                                                                                            cell_id={`col_${1}__index_${0}`}
                                                                                            mappedData={mappedData} drilldown={drilldown}
                                                                                        />
                                                                                    </div>
                                                                                }
                                                                            </div> */}
                                                                        </>
                                                                    }
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                        {/* starter code for drilldown functionality: */}
                                                        {/* <div className='relative flex justify-start items-center p-6 h-8 w-full bg-white'>
                                                            {index === 1 &&
                                                                <div className='absolute bg-white' style={{ zIndex: 20 }}>
                                                                    <DrilldownButton text={_row.name}
                                                                        cell_id={`col_${0}_index_${0}`}
                                                                        mappedData={mappedData} drilldown={drilldown}
                                                                    />
                                                                </div>
                                                            }
                                                        </div> */}
                                                    </>
                                                }
                                            </React.Fragment>
                                        )
                                })
                            }
                            < div className='absolute flex justify-end items-center overflow-hidden px-2 h-8 w-full text-white bg-NavBar_backgroundColor'
                                style={{
                                    minHeight: '20px',
                                    borderLeft: 'solid lightgray 1px',
                                    bottom: 0
                                }}
                            >
                                {columnTotal(mappedData, column, index)}
                            </div>
                        </div >
                    )
                })}
            </div >
        </div >
    )
}
