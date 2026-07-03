import { type HTMLAttributes, useMemo, useState, useEffect, RefObject } from 'react';
import { css, cx } from '@linaria/core';
import { getCalendarMatrix, getWeekDaysHeader, isWithinDateRange } from '../util.js';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from '../icons.js';
import token from '../token.js';
import { selectStyle } from "./universal.style.js";

export interface DatePickerPanelInstance {
    keyboardNavigate: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

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

    /**
     * 获取实例对象
     */
    instance?: RefObject<DatePickerPanelInstance | null>
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
    height: ${token.header.cell.height};
    font-size: ${token.header.font.size};
    font-weight: ${token.header.font.weight};
    line-height: ${token.header.cell.height};
    box-sizing: border-box;
`;

const calendarDateCellStyle = css`
    padding: ${token.cell.padding};
    border-radius: ${token.cell.border.radius};
    cursor: pointer;
`;

// hover 反馈只挂在未选中的格子上（JSX 分支），避免 :hover 规则以更高特异性
// 压过选中样式，导致点击后选中高亮被 hover 色遮住、直到移开鼠标才显现
const calendarDateCellHoverStyle = css`
    &:hover {
        > div {
            background-color: ${token.cell.background['color-hover']};
            color: ${token.cell.text['color-hover']};
        }
    }
`

const calendarDateCellContentStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${token.cell.border.radius};
    width: ${token.cell.content.size};
    height: ${token.cell.content.size};
    line-height: ${token.cell.content.size};
    font-size: ${token.cell.font.size};
    font-weight: ${token.cell.font.weight};
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    /* 常驻过渡：hover 进出与选中切换获得对称、即时的颜色反馈 */
    transition: background-color ${token.cell.transition}, color ${token.cell.transition};
`;

const calendarTableStyle = css`
    table-layout: fixed;
    border-collapse: collapse;
`;


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
    instance,
    ...restProps
}: DatePickerPanelProps) => {
    const viewValue = value.withTimeZone(timeZone);
    const [viewDate, setViewDate] = useState(viewValue);

    useEffect(() => {
        if (instance) {
            instance.current = {
                keyboardNavigate: (direction: 'left' | 'right' | 'up' | 'down') => {
                    const [selectValue] = selectValues;
                    let moved: Temporal.ZonedDateTime = selectValue;
                    switch (direction) {
                        case 'left':
                            moved = selectValue.subtract({ days: 1 });
                            break;
                        case 'right':
                            moved = selectValue.add({ days: 1 });
                            break;
                        case 'up':
                            moved = selectValue.subtract({ days: 7 });
                            break;
                        case 'down':
                            moved = selectValue.add({ days: 7 });
                            break;
                    }
                    if (isWithinDateRange(moved, range)) {
                        if (moved.year !== viewDate.year || moved.month !== viewDate.month) {
                            setViewDate(moved);
                        }
                        onSelect?.([moved]);
                    }
                }
            }
        }
    }, [instance, selectValues, range, viewDate]);

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
        selectValues.some((v) => v.withTimeZone(timeZone).toPlainDate().equals(element.toPlainDate()));

    const rangeStart = range?.start ? range.start.withTimeZone(timeZone) : null;
    const rangeEnd = range?.end ? range.end.withTimeZone(timeZone) : null;
    const canGoPrevYear = !rangeStart || viewDate.subtract({ years: 1 }).year >= rangeStart.year;
    const canGoPrevMonth = !rangeStart
        || viewDate.subtract({ months: 1 }).year > rangeStart.year
        || (viewDate.subtract({ months: 1 }).year === rangeStart.year && viewDate.subtract({ months: 1 }).month >= rangeStart.month);
    const canGoNextMonth = !rangeEnd
        || viewDate.add({ months: 1 }).year < rangeEnd.year
        || (viewDate.add({ months: 1 }).year === rangeEnd.year && viewDate.add({ months: 1 }).month <= rangeEnd.month);
    const canGoNextYear = !rangeEnd || viewDate.add({ years: 1 }).year <= rangeEnd.year;

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                font-size: ${token.panel.font.size};
                user-select: none;
            `}
            {...restProps}
        >
            <div
                className={css`
                    display: flex;
                    justify-content: space-between;
                    padding: ${token.header.padding};
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
                        timeZone: viewDate.timeZoneId
                    }).format(new Date(viewDate.epochMilliseconds))}
                    <div
                        className={cx(css`
                            opacity: ${token.opacity.timezone};
                            position: absolute;
                            top: calc(50% + 1.8em);
                            font-size: ${token.timezone.font.size};
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
                            {row.map((element) => {
                                const inRange = isWithinDateRange(element, range);
                                const selected = inRange && isSelected(element);
                                return (
                                    <td
                                        className={cx(
                                            calendarCellStyle,
                                            calendarDateCellStyle,
                                            !inRange && calendarDateCellDisableStyle,
                                            inRange && !selected && calendarDateCellHoverStyle,
                                        )}
                                        key={element.toString()}
                                        onClick={() => {
                                            if (!inRange) return;
                                            onSelect?.([element]);
                                        }}
                                    >
                                        <div
                                            className={cx(
                                                calendarDateCellContentStyle,
                                                inRange && !isCurrentMonth(element) && isOutOfRangeStyle,
                                                selected && selectStyle,
                                            )}
                                        >
                                            {element.day}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatePickerPanel;
