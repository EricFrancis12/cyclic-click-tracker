import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import { traverseParentsForClass, makeDate, formatDatesRange } from '../../utils/utils';

export const CALENDAR_BUTTON_CLASS = 'CALENDAR_BUTTON_CLASS';
export const CALENDAR_APPLY_BUTTON_CLASS = 'CALENDAR_APPLY_BUTTON_CLASS';

export const ONE_DAY_MS = 86_400_000;
export const ONE_DAY_DIFF_MS = ONE_DAY_MS - 1;
export const EARLIEST_TIMESTAMP_ALLOWED = makeDate(2023, 0, 1, 0, 0, 0, 0).getTime();

export const TIMEFRAME_TYPE_NAMES = {
    TODAY: 'Today',
    YESTERDAY: 'Yesterday',
    LAST_3_DAYS: 'Last 3 Days',
    LAST_7_DAYS: 'Last 7 Days',
    LAST_30_DAYS: 'Last 30 Days',
    THIS_MONTH: 'This Month',
    LAST_MONTH: 'Last Month',
    MAX_AVAILABLE: 'Max. available',
    DATE_RANGE: 'Date Range'
};

export const DEFAULT_TIMEFRAME_TYPE_NAME = TIMEFRAME_TYPE_NAMES.LAST_7_DAYS;

export function getDates(name) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const startOfTodayMS = makeDate(year, month, day, 5, 0, 0, 0).getTime();
    const endOfTodayMS = startOfTodayMS + ONE_DAY_DIFF_MS;

    let result;
    switch (name) {
        case TIMEFRAME_TYPE_NAMES.TODAY: {
            result = [startOfTodayMS, endOfTodayMS];
            break;
        }
        case TIMEFRAME_TYPE_NAMES.YESTERDAY: {
            const startOfYesterdayMS = startOfTodayMS - ONE_DAY_MS;
            const endOfYesterdayMS = startOfYesterdayMS + ONE_DAY_DIFF_MS;
            result = [startOfYesterdayMS, endOfYesterdayMS];
            break;
        }
        case TIMEFRAME_TYPE_NAMES.LAST_3_DAYS: {
            const startOf3DaysAgoMS = startOfTodayMS - (2 * ONE_DAY_MS);
            result = [startOf3DaysAgoMS, endOfTodayMS];
            break;
        }
        case TIMEFRAME_TYPE_NAMES.LAST_7_DAYS: {
            const startOf7DaysAgoMS = startOfTodayMS - (7 * ONE_DAY_MS);
            result = [startOf7DaysAgoMS, endOfTodayMS];
            break;
        }
        case TIMEFRAME_TYPE_NAMES.LAST_30_DAYS: {
            const startOf30DaysAgoMS = startOfTodayMS - (30 * ONE_DAY_MS);
            result = [startOf30DaysAgoMS, endOfTodayMS];
            break;
        }
        case TIMEFRAME_TYPE_NAMES.THIS_MONTH: {
            const startOfThisMonthMS = makeDate(year, month, 1, 0, 0, 0, 0).getTime();
            result = [startOfThisMonthMS, endOfTodayMS];
            break;
        }
        case TIMEFRAME_TYPE_NAMES.LAST_MONTH: {
            const calcLastYearAndMonth = (year, month) => {
                return month !== 0 ? [year, month - 1] : [year - 1, 11]; // month is 0-11
            };

            const [lastYear, lastMonth] = calcLastYearAndMonth(year, month);
            const startOfThisMonthMS = makeDate(year, month, 1, 0, 0, 0, 0).getTime();

            const startOfLastMonthMS = makeDate(lastYear, lastMonth, 1, 0, 0, 0, 0).getTime();
            const endOfLastMonthMS = startOfThisMonthMS - 1;
            result = [startOfLastMonthMS, endOfLastMonthMS];
            break;
        }
        case TIMEFRAME_TYPE_NAMES.MAX_AVAILABLE: {
            result = [EARLIEST_TIMESTAMP_ALLOWED, endOfTodayMS];
            break;
        }
    }
    return result.map(timestamp => new Date(timestamp));
}

export default function ToggleButton(props) {
    const { timeframe, setTimeframe } = props;

    const [active, setActive] = useState(false);
    const [calendarValue, setCalendarValue] = useState(timeframe ?? getDates(DEFAULT_TIMEFRAME_TYPE_NAME));

    const [activeTimeframeTypeName, setActiveTimeframeTypeName] = useState(DEFAULT_TIMEFRAME_TYPE_NAME);
    const originalActiveTimeframeTypeName = useRef(activeTimeframeTypeName);

    useEffect(() => {
        if (timeframe == null && calendarValue != null) {
            setTimeframe(calendarValue);
            setActiveTimeframeTypeName(DEFAULT_TIMEFRAME_TYPE_NAME);
            originalActiveTimeframeTypeName.current = DEFAULT_TIMEFRAME_TYPE_NAME;
        }
    }, [timeframe]);

    useEffect(() => {
        if (active === false) {
            originalActiveTimeframeTypeName.current = activeTimeframeTypeName;
        }
    }, [active]);

    const timeframeTypes = [
        {
            name: TIMEFRAME_TYPE_NAMES.TODAY,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.TODAY));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.TODAY);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.YESTERDAY,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.YESTERDAY));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.YESTERDAY);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.LAST_3_DAYS,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.LAST_3_DAYS));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.LAST_3_DAYS);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.LAST_7_DAYS,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.LAST_7_DAYS));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.LAST_7_DAYS);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.LAST_30_DAYS,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.LAST_30_DAYS));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.LAST_30_DAYS);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.THIS_MONTH,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.THIS_MONTH));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.THIS_MONTH);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.LAST_MONTH,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.LAST_MONTH));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.LAST_MONTH);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.MAX_AVAILABLE,
            onClick: (e) => {
                setCalendarValue(getDates(TIMEFRAME_TYPE_NAMES.MAX_AVAILABLE));
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.MAX_AVAILABLE);
            }
        },
        {
            name: TIMEFRAME_TYPE_NAMES.DATE_RANGE,
            onClick: (e) => {
                setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.DATE_RANGE);
            }
        }
    ];

    function handleButtonClick(e) {
        if (!active) {
            setActive(true);
            handleGlobalClick.ignoreNext = true;
            document.addEventListener('click', handleGlobalClick);
        } else {
            setActive(false);
            document.removeEventListener('click', handleGlobalClick);
        }
    }

    function handleGlobalClick(e) {
        // a one-time "shut off" switch,
        // otherwise the click from handleButtonClick would also trigger handleGlobalClick
        if (handleGlobalClick.ignoreNext === true) {
            handleGlobalClick.ignoreNext = false;
            return;
        }

        if (!traverseParentsForClass(e.target, CALENDAR_BUTTON_CLASS) && !e.target.classList.contains(CALENDAR_APPLY_BUTTON_CLASS)) {
            console.log('handling cancel');
            handleCancel();
        }
    }

    function handleCalendarClick(e) {
        if (!active) setActive(true);
    }

    function handleCalendarChange(newState) {
        setCalendarValue(newState);
        setActiveTimeframeTypeName(TIMEFRAME_TYPE_NAMES.DATE_RANGE);
    }

    function handleCancel() {
        setActive(false);
        setCalendarValue(timeframe ?? getDates(DEFAULT_TIMEFRAME_TYPE_NAME));
        setActiveTimeframeTypeName(originalActiveTimeframeTypeName.current);

        document.removeEventListener('click', handleGlobalClick);
    }

    function handleApply() {
        setActive(false);
        if (setTimeframe) setTimeframe(calendarValue);
    }

    return (
        <div className={CALENDAR_BUTTON_CLASS + ' relative'}>
            <div onClick={e => handleButtonClick()}
                className='cursor-pointer hover:opacity-70 px-2 py-2'
                style={{ border: 'solid lightgrey 1px', borderRadius: '6px', backgroundImage: 'linear-gradient(0deg,var(--color-gray5),var(--color-white))' }}
            >
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '4px' }} />
                <span style={{ marginRight: '4px' }}>
                    {activeTimeframeTypeName && activeTimeframeTypeName !== TIMEFRAME_TYPE_NAMES.DATE_RANGE
                        ? activeTimeframeTypeName
                        : formatDatesRange(calendarValue ?? getDates(TIMEFRAME_TYPE_NAMES.TODAY))
                    }
                </span>
                <FontAwesomeIcon icon={active ? faChevronUp : faChevronDown} />
            </div>
            {active &&
                <div onClick={e => handleCalendarClick()}
                    className='absolute bg-white'
                    style={{ border: 'solid black 1px' }}
                >
                    <div className='flex'>
                        <div className='m-4'>
                            <Calendar selectRange={true} hover={null} value={calendarValue} onChange={handleCalendarChange} />
                        </div>
                        <div className='flex flex-col p-1' style={{ height: 'auto', width: 'auto', backgroundColor: 'red' }}>
                            {timeframeTypes.map((type, index) => (
                                <div onClick={e => type.onClick(e)}
                                    key={index}
                                    className='whitespace-nowrap cursor-pointer hover:opacity-70'
                                    style={{
                                        backgroundColor: type.name === activeTimeframeTypeName ? 'blue' : 'white'
                                    }}
                                >
                                    {type.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div />
                        <div className='flex justify-end gap-2 px-2'>
                            <button onClick={e => handleCancel()}>Cancel</button>
                            <button onClick={e => handleApply()} className={CALENDAR_APPLY_BUTTON_CLASS}>Apply</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
