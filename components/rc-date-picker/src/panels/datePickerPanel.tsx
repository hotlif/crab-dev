import { type HTMLAttributes, useMemo, useState } from 'react';
import { css, cx } from '@linaria/core';
import { getCalendarMatrix, getWeekDaysHeader } from '../util';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from '../icons';

interface DatePickerPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'selectValues' | 'onSelect'> {
    value: Temporal.ZonedDateTime;
    timeZone?: string;
    weekStartDay?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    selectValues?: Temporal.ZonedDateTime[];
    locale?: string;
    onSelect?: (values: Temporal.ZonedDateTime[]) => void;
}

const isOutOfRangeStyle = css`
    opacity: 0.3;
`;

const centerFlexStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const iconStyle = css`
    cursor: pointer;
`;

const calendarCellStyle = css`
    text-align: center;
    vertical-align: middle;
    padding: 0;
`;

const calendarHeaderCellContentStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 12px;
    font-weight: 400;
    line-height: 40px;
    box-sizing: border-box;
`;

const calendarDateCellStyle = css`
    padding: 3px 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    cursor: pointer;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const calendarDateCellContentStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 400;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
`;

const calendarTableStyle = css`
    table-layout: fixed;
    border-collapse: collapse;
`;

const calendarSelectDateCellContentStyle = css`
    background-color: #1677ff;
    color: #fff;
`

const DatePickerPanel = ({
    value,
    timeZone = Temporal.Now.timeZoneId(),
    weekStartDay = 1,
    locale = 'zh-CN',
    selectValues = [],
    onSelect,
    ...restProps
}: DatePickerPanelProps) => {
    const viewValue = value.withTimeZone(timeZone);
    const [viewDate, setViewDate] = useState(viewValue);
    const calendarMatrix = useMemo(() => {
        const year = viewDate.year;
        const month = viewDate.month;
        return getCalendarMatrix(year, month, weekStartDay, timeZone);
    }, [viewDate, weekStartDay, timeZone]);

    const weekDaysHeader = useMemo(() => {
        const year = viewDate.year;
        const month = viewDate.month;
        return getWeekDaysHeader(year, month, weekStartDay, locale, timeZone);
    }, [viewDate, weekStartDay, locale, timeZone]);

    const calendarRows = useMemo(() => {
        const rows: Temporal.ZonedDateTime[][] = [];
        for (let index = 0; index < calendarMatrix.length; index += 7) {
            rows.push(calendarMatrix.slice(index, index + 7));
        }
        return rows;
    }, [calendarMatrix]);

    const isCurrentMonth = (element: Temporal.ZonedDateTime) =>
        viewDate.year === element.year && viewDate.month === element.month;

    const isSelected = (element: Temporal.ZonedDateTime) =>
        selectValues.some(
            (v) => v.year === element.year && v.month === element.month && v.day === element.day,
        );

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
                <div className={centerFlexStyle}>
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
                    className={cx(
                        css`
                            flex: 1;
                            font-weight: bold;
                            position: relative;
                        `,
                        centerFlexStyle,
                    )}
                >
                    {new Intl.DateTimeFormat(locale, {
                        year: 'numeric',
                        month: 'long',
                    }).format(new Date(viewDate.epochMilliseconds))}
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
                            })
                                .formatToParts(new Date(viewDate.epochMilliseconds))
                                .find((p) => p.type === 'timeZoneName')?.value
                        }
                    </div>
                </div>
                <div className={centerFlexStyle}>
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
            <table className={calendarTableStyle}>
                <thead>
                    <tr>
                        {weekDaysHeader.map((element) => (
                            <th className={calendarCellStyle} key={element.toString()}>
                                <div className={calendarHeaderCellContentStyle}>{element}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((element) => (
                                <td
                                    className={cx(calendarCellStyle, calendarDateCellStyle)}
                                    key={element.toString()}
                                    onClick={() => {
                                        onSelect?.([element]);
                                    }}
                                >
                                    <div
                                        className={cx(
                                            calendarDateCellContentStyle,
                                            !isCurrentMonth(element) && isOutOfRangeStyle,
                                            isSelected(element) && calendarSelectDateCellContentStyle,
                                        )}
                                    >
                                        {element.day}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatePickerPanel;
