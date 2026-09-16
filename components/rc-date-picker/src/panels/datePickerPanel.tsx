import { useState, useEffect } from 'react';
import type { HTMLAttributes, RefObject } from 'react';
import { css, cx } from '@crab-dev/css';
import { getCalendarMatrix, getWeekDaysHeader, isWithinDateRange } from '../util.js';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from '../icons.js';
import token from '../token.js';
import Button from '@crab-dev/rc-button';
import semantic from '@crab-dev/rc-token-semantic';

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
    &:not(:disabled) { color: ${semantic.color.text.tertiary}; }
`;

const centerFlexStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const panelStyle = css`
    width: calc(${token.cell.content.width} * 7);
    max-width: 100%;
    font-size: ${token.panel['font-size']};
    color: ${semantic.color.text.primary};
    user-select: none;
`;
const headerStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: ${semantic.space['component-gap']};
`;
const monthStyle = css`
    display: grid;
    gap: ${semantic.space['inline-gap']};
    text-align: center;
    font-weight: ${semantic.font.weight.heading};
    line-height: ${token.header['line-height']};
`;
const timezoneStyle = css`
    font-size: ${semantic.font.size.caption};
    font-weight: ${semantic.font.weight.body};
    color: ${semantic.color.text.secondary};
`;
const navigationStyle = css`
    width: ${token.navigation.width};
    height: ${token.navigation.width};
    padding: 0;
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
    font-size: ${token.header["font-size"]};
    font-weight: ${token.header["font-weight"]};
    line-height: ${token.header.cell.height};
    box-sizing: border-box;
`;

const calendarDateCellContentStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${token.cell["border-radius"]};
    width: ${token.cell.content.width};
    height: ${token.cell.content.width};
    line-height: ${token.cell.content.width};
    font-size: ${token.cell["font-size"]};
    font-weight: ${token.cell["font-weight"]};
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    /* 常驻过渡：hover 进出与选中切换获得对称、即时的颜色反馈 */
    transition: background-color ${token.cell.transition}, color ${token.cell.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { &[aria-pressed="true"] { outline: 2px solid Highlight; } }
`;

const calendarTableStyle = css`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
`;


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
                    const selectValue = selectValues[0] ?? viewDate;
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
        return () => { if (instance) instance.current = null; };
    }, [instance, selectValues, range, viewDate, onSelect]);

    const calendarMatrix = getCalendarMatrix(viewDate.year, viewDate.month, weekStartDay, timeZone);
    const weekDaysHeader = getWeekDaysHeader(viewDate.year, viewDate.month, weekStartDay, locale, timeZone);
    const calendarRows: Temporal.ZonedDateTime[][] = [];
    for (let index = 0; index < calendarMatrix.length; index += 7) {
        calendarRows.push(calendarMatrix.slice(index, index + 7));
    }

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
        <div {...restProps} className={cx.call(undefined, panelStyle, restProps.className)}>
            <div className={headerStyle}>
                <div className={centerFlexStyle}>
                    <Button type="button" appearance="text" className={navigationStyle}
                        aria-label="上一年" icon={<ChevronDoubleLeft aria-hidden />}
                        disabled={!canGoPrevYear} onClick={() => setViewDate(viewDate.subtract({ years: 1 }))} />
                    <Button type="button" appearance="text" className={navigationStyle}
                        aria-label="上一月" icon={<ChevronLeft aria-hidden />}
                        disabled={!canGoPrevMonth} onClick={() => setViewDate(viewDate.subtract({ months: 1 }))} />
                </div>
                <div className={monthStyle} aria-live="polite">
                    {new Intl.DateTimeFormat(locale, {
                        year: 'numeric', month: 'long', timeZone: viewDate.timeZoneId,
                    }).format(new Date(viewDate.epochMilliseconds))}
                    <span className={timezoneStyle}>
                        {new Intl.DateTimeFormat(locale, {
                            timeZone: viewDate.timeZoneId, timeZoneName: 'longOffset',
                        }).formatToParts(new Date(viewDate.epochMilliseconds))
                            .find((part) => part.type === 'timeZoneName')?.value}
                    </span>
                </div>
                <div className={centerFlexStyle}>
                    <Button type="button" appearance="text" className={navigationStyle}
                        aria-label="下一月" icon={<ChevronRight aria-hidden />}
                        disabled={!canGoNextMonth} onClick={() => setViewDate(viewDate.add({ months: 1 }))} />
                    <Button type="button" appearance="text" className={navigationStyle}
                        aria-label="下一年" icon={<ChevronDoubleRight aria-hidden />}
                        disabled={!canGoNextYear} onClick={() => setViewDate(viewDate.add({ years: 1 }))} />
                </div>
            </div>
            <table className={calendarTableStyle} aria-label="选择日期">
                <thead>
                    <tr>
                        {weekDaysHeader.map((day) => (
                            <th className={calendarCellStyle} key={day} scope="col">
                                <div className={calendarHeaderCellContentStyle}>{day}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarRows.map((row) => (
                        <tr key={row[0].toPlainDate().toString()}>
                            {row.map((date) => {
                                const inRange = isWithinDateRange(date, range);
                                const selected = inRange && isSelected(date);
                                return (
                                    <td className={calendarCellStyle} key={date.toString()}>
                                        <Button type="button" appearance={selected ? 'primary' : 'text'}
                                            aria-label={date.toPlainDate().toString()}
                                            aria-pressed={selected} disabled={!inRange}
                                            className={cx.call(undefined, calendarDateCellContentStyle,
                                                inRange && !selected && !isCurrentMonth(date) && isOutOfRangeStyle)}
                                            onClick={() => onSelect?.([date])}>
                                            {date.day}
                                        </Button>
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
