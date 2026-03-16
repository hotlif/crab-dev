import { type HTMLAttributes, useMemo, useState } from 'react';
import { css, cx } from '@linaria/core';
import { getCalendarMatrix, getWeekDaysHeader } from '../util';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from '../icons';
import token from '../token';

export interface DatePickerPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'selectValues' | 'onSelect'> {

    /**
     * 当前选中的日期
     */
    value: Temporal.ZonedDateTime;

    /**
     * 限制日期范围
     */
    range?: {
        start?: Temporal.ZonedDateTime;
        end?: Temporal.ZonedDateTime;
    },

    /**
     * 时区
     */
    timeZone?: string;

    /**
     * 一周的起始天
     */
    weekStartDay?: 1 | 2 | 3 | 4 | 5 | 6 | 7;

    /**
     * 选中的时间
     */
    selectValues?: Temporal.ZonedDateTime[];

    /**
     * 国际化
     */
    locale?: string;

    /**
     * 选择的时间信息
     */
    onSelect?: (values: Temporal.ZonedDateTime[]) => void;
}

const isOutOfRangeStyle = css`
    opacity: ${token.opacity['out-of-range']};
`;

const centerFlexStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const iconStyle = css`
    cursor: pointer;
`;

const iconDisabledStyle = css`
    opacity: 0.25;
    cursor: not-allowed;
    pointer-events: none;
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
    height: ${token.dimension['header-cell-height']};
    font-size: ${token.typography['header-font-size']};
    font-weight: ${token.typography['header-font-weight']};
    line-height: ${token.dimension['header-cell-height']};
    box-sizing: border-box;
`;

const calendarDateCellStyle = css`
    padding: ${token.dimension['cell-padding']};
    border-radius: ${token.dimension['cell-border-radius']};
    cursor: pointer;
`;

const calendarDateCellHoverStyle = css`
    &:hover {
        > div {
            transition: ${token.motion['cell-transition']};
            background-color: ${token.color['cell-hover-background']};
            color: ${token.color['cell-hover-text']};
        }
    }
`

const calendarDateCellContentStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${token.dimension['cell-border-radius']};
    width: ${token.dimension['cell-content-size']};
    height: ${token.dimension['cell-content-size']};
    line-height: ${token.dimension['cell-content-size']};
    font-size: ${token.typography['cell-font-size']};
    font-weight: ${token.typography['cell-font-weight']};
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
`;

const calendarTableStyle = css`
    table-layout: fixed;
    border-collapse: collapse;
`;

const calendarSelectDateCellContentStyle = css`
    background-color: ${token.color['selected-background']};
    color: ${token.color['selected-text']};
`

const calendarDateCellDisableStyle = css`
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
    pointer-events: none;
`

const DatePickerPanel = ({
    value,
    timeZone = Temporal.Now.timeZoneId(),
    weekStartDay = 1,
    locale = 'zh-CN',
    selectValues = [],
    range,
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
    
    const isAllowableRange = (element: Temporal.ZonedDateTime) => {
        if (range) {
            const { start, end } = range;
            const t = element.epochNanoseconds;
            if (start && end) {
                let s = start.epochNanoseconds;
                let e = end.epochNanoseconds;
                if (s > e) {
                    [s, e] = [e, s];
                }
                return t >= s && t <= e;
            }
            if (start) {
                return t >= start.epochNanoseconds;
            }
            if (end) {
                return t <= end.epochNanoseconds;
            }
        }
        return true;
    }

    const canGoPrevYear = !range?.start || viewDate.subtract({ years: 1 }).year >= range.start.year;
    const canGoPrevMonth = !range?.start
        || viewDate.subtract({ months: 1 }).year > range.start.year
        || (viewDate.subtract({ months: 1 }).year === range.start.year && viewDate.subtract({ months: 1 }).month >= range.start.month);
    const canGoNextMonth = !range?.end
        || viewDate.add({ months: 1 }).year < range.end.year
        || (viewDate.add({ months: 1 }).year === range.end.year && viewDate.add({ months: 1 }).month <= range.end.month);
    const canGoNextYear = !range?.end || viewDate.add({ years: 1 }).year <= range.end.year;

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                font-size: ${token.typography['panel-font-size']};
                user-select: none;
            `}
            {...restProps}
        >
            <div
                className={css`
                    display: flex;
                    justify-content: space-between;
                    padding: ${token.dimension['header-padding']};
                `}
            >
                <div className={centerFlexStyle}>
                    <ChevronDoubleLeft
                        className={cx(iconStyle, !canGoPrevYear && iconDisabledStyle)}
                            onClick={() => {
                                if (!canGoPrevYear) return;
                                const lastYear = viewDate.subtract({ years: 1 });
                                setViewDate(lastYear);
                            }}
                    />
                    <ChevronLeft
                        className={cx(iconStyle, !canGoPrevMonth && iconDisabledStyle)}
                            onClick={() => {
                                if (!canGoPrevMonth) return;
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
                            opacity: ${token.opacity['timezone']};
                            position: absolute;
                            top: calc(50% + 1.8em);
                            font-size: ${token.typography['timezone-font-size']};
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
                        className={cx(iconStyle, !canGoNextMonth && iconDisabledStyle)}
                        onClick={() => {
                            if (!canGoNextMonth) return;
                            const nextMonth = viewDate.add({ months: 1 });
                            setViewDate(nextMonth);
                        }}
                    />
                    <ChevronDoubleRight
                        className={cx(iconStyle, !canGoNextYear && iconDisabledStyle)}
                        onClick={() => {
                            if (!canGoNextYear) return;
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
                                    className={cx(
                                        calendarCellStyle,
                                        calendarDateCellStyle,
                                        isAllowableRange(element) ? calendarDateCellHoverStyle : calendarDateCellDisableStyle,
                                    )}
                                    key={element.toString()}
                                    onClick={() => {
                                        if (!isAllowableRange(element)) return;
                                        onSelect?.([element]);
                                    }}
                                >
                                    <div
                                        className={cx(
                                            calendarDateCellContentStyle,
                                            isAllowableRange(element) && !isCurrentMonth(element) && isOutOfRangeStyle,
                                            isAllowableRange(element) && isSelected(element) && calendarSelectDateCellContentStyle,
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
