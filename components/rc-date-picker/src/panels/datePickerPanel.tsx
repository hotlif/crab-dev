

import { type HTMLAttributes, useMemo, useState } from 'react';
import { css, cx} from "@linaria/core";
import { getCalendarMatrix, getWeekDaysHeader } from "../util";
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from '../icons';


interface DatePickerPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, ""> {
    value: Temporal.ZonedDateTime
    timeZone?: string
    weekStartDay?: 1 | 2 | 3 | 4 | 5 | 6 | 7
    locale?: string
}

const isOutOfRangeStyle = css`
    opacity: 0.3;
`

const centerFlexStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

const iconStyle = css`
    cursor: pointer;
`

const cellStyle = css`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1; 
    padding: 8px;
    box-sizing: border-box;
`


const DatePickerPanel = ({
    value,
    timeZone = Temporal.Now.timeZoneId(),
    weekStartDay = 1,
    locale = "zh-CN",
    ...restProps
}: DatePickerPanelProps) => {

    const viewValue = value.withTimeZone(timeZone);
    const [viewDate, setViewDate] = useState(viewValue);
    const calendarMatrix = useMemo(() => {
        const year = viewDate.year;
        const month = viewDate.month;
        return getCalendarMatrix(year, month, weekStartDay);
    }, [viewDate, weekStartDay])

    const weekDaysHeader = useMemo(() => {
        const year = viewDate.year;
        const month = viewDate.month;
        return getWeekDaysHeader(year, month, weekStartDay, locale);
    }, [viewDate, weekStartDay, locale]);

    const isCurrentMonth = (element: Temporal.PlainDate) => viewDate.year === element.year && viewDate.month === element.month;

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                font-size: 14px;
                user-select: none;
            `}
            {...restProps}
        >
            <div
                className={css`
                    display: flex;
                    justify-content: space-between;
                    padding: 16px 8px;
                `}
            >
                <div
                    className={centerFlexStyle}
                >
                    <ChevronDoubleLeft
                        className={iconStyle}
                        onClick={() => {
                            const lastYear = viewDate.subtract({ years: 1 });
                            setViewDate(lastYear);
                        }}
                    />
                    <ChevronLeft
                        className={iconStyle}
                        onClick={() => {
                            const lastMonth = viewDate.subtract({ months: 1 });
                            setViewDate(lastMonth);
                        }}
                    />
                </div>
                <div
                    className={cx(css`
                        flex: 1;
                        font-weight: bold;
                        position: relative;

                    `, centerFlexStyle)}
                >
                    {
                        new Intl.DateTimeFormat(locale, { 
                            year: 'numeric', 
                            month: 'long',
                        }).format(new Date(viewDate.epochMilliseconds))
                    }
                    <div
                        className={cx(css`
                            opacity: 0.6;
                            position: absolute;
                            top: calc(50% + 1.8em);
                            font-size: 10px;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        `)}
                    >
                        {
                            new Intl.DateTimeFormat(locale, { 
                                timeZone: viewDate.timeZoneId,
                                timeZoneName: 'longOffset',
                            }).formatToParts(new Date(viewDate.epochMilliseconds))
                                .find(p => p.type === 'timeZoneName')?.value
                        }
                    </div>
                </div>
                <div
                    className={centerFlexStyle}
                >
                    <ChevronRight
                        className={iconStyle}
                        onClick={() => {
                            const nextMonth = viewDate.add({ months: 1 });
                            setViewDate(nextMonth);
                        }}
                    />
                    <ChevronDoubleRight
                        className={iconStyle}
                        onClick={() => {
                            const nextYear = viewDate.add({ years: 1 });
                            setViewDate(nextYear);
                        }}
                    />
                </div>
            </div>
            <div
                className={css`
                    display: grid;
                    grid-template-columns: repeat(7, 1fr); 
                    grid-template-rows: repeat(6, 1fr);
                `}
            >
                {weekDaysHeader.map(element => (
                    <div
                        className={cellStyle}
                        key={element.toString()}
                    >
                        {element}
                    </div>
                ))}
                {calendarMatrix.map(element => (
                    <div
                        className={cx(cellStyle, !isCurrentMonth(element) && isOutOfRangeStyle)}
                        key={element.toString()}
                    >
                        {element.day}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default DatePickerPanel;