import { usePickerLocale } from '../locale.js';
import { temporal, nowZonedDateTime } from '../temporal.js';
import { useState, useEffect } from 'react';
import type { HTMLAttributes, RefObject } from 'react';
import { cx } from '@crab-dev/css';
import { getCalendarMatrix, getWeekDaysHeader, isWithinDateRange } from '../util.js';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from '../icons.js';
import Button from '@crab-dev/rc-button';
import { useConfig } from '@crab-dev/rc-config-provider';
import { isOutOfRangeStyle, centerFlexStyle, panelStyle, headerStyle, monthStyle, timezoneStyle, navigationStyle, calendarCellStyle, calendarHeaderCellContentStyle, calendarDateCellContentStyle, todayStyle, calendarTableStyle } from "./datePickerPanel.styles.js";
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


const DatePickerPanel = ({
    value,
    timeZone = temporal.Now.timeZoneId(),
    weekStartDay = 1,
    locale: localeProp,
    selectValues = [],
    range,
    onSelect,
    instance,
    ...restProps
}: DatePickerPanelProps) => {
    const { locale, messages } = usePickerLocale(localeProp);
    const { direction } = useConfig();
    const isRtl = (restProps.dir ?? direction) === 'rtl';
    const viewValue = value.withTimeZone(timeZone);
    const [viewDate, setViewDate] = useState(viewValue);
    const [today, setToday] = useState(() => nowZonedDateTime(timeZone).toPlainDate());

    useEffect(() => {
        let midnight: ReturnType<typeof setTimeout>;
        const updateToday = () => {
            const now = nowZonedDateTime(timeZone);
            const nextDate = now.toPlainDate();
            setToday(previous => previous.equals(nextDate) ? previous : nextDate);
            // Midnight follows the picker zone, including daylight-saving day lengths.
            const nextMidnight = now.add({ days: 1 }).startOfDay();
            midnight = setTimeout(updateToday, nextMidnight.epochMilliseconds - now.epochMilliseconds + 1);
        };
        updateToday();
        return () => clearTimeout(midnight);
    }, [timeZone]);

    useEffect(() => {
        if (instance) {
            instance.current = {
                keyboardNavigate: (direction: 'left' | 'right' | 'up' | 'down') => {
                    const selectValue = selectValues[0] ?? viewDate;
                    let moved: Temporal.ZonedDateTime = selectValue;
                    switch (direction) {
                        case 'left':
                            moved = selectValue.add({ days: isRtl ? 1 : -1 });
                            break;
                        case 'right':
                            moved = selectValue.add({ days: isRtl ? -1 : 1 });
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
    }, [instance, selectValues, range, viewDate, onSelect, isRtl]);

    const calendarMatrix = getCalendarMatrix(viewDate.year, viewDate.month, weekStartDay, timeZone);
    const weekDaysHeader = getWeekDaysHeader(viewDate.year, viewDate.month, weekStartDay, locale, timeZone);
    const calendarRows: Temporal.ZonedDateTime[][] = [];
    for (let index = 0; index < calendarMatrix.length; index += 7) {
        calendarRows.push(calendarMatrix.slice(index, index + 7));
    }

    const isCurrentMonth = (element: Temporal.ZonedDateTime) =>
        viewDate.year === element.year && viewDate.month === element.month;

    const isSelected = (element: Temporal.ZonedDateTime) =>
        selectValues.some((v) => v.withTimeZone(timeZone).toPlainDate().equals(element.toPlainDate().toString()));

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
                        aria-label={messages.previousYear} icon={isRtl ? <ChevronDoubleRight aria-hidden /> : <ChevronDoubleLeft aria-hidden />}
                        disabled={!canGoPrevYear} onClick={() => setViewDate(viewDate.subtract({ years: 1 }))} />
                    <Button type="button" appearance="text" className={navigationStyle}
                        aria-label={messages.previousMonth} icon={isRtl ? <ChevronRight aria-hidden /> : <ChevronLeft aria-hidden />}
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
                        aria-label={messages.nextMonth} icon={isRtl ? <ChevronLeft aria-hidden /> : <ChevronRight aria-hidden />}
                        disabled={!canGoNextMonth} onClick={() => setViewDate(viewDate.add({ months: 1 }))} />
                    <Button type="button" appearance="text" className={navigationStyle}
                        aria-label={messages.nextYear} icon={isRtl ? <ChevronDoubleLeft aria-hidden /> : <ChevronDoubleRight aria-hidden />}
                        disabled={!canGoNextYear} onClick={() => setViewDate(viewDate.add({ years: 1 }))} />
                </div>
            </div>
            <table className={calendarTableStyle} aria-label={messages.chooseDate}>
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
                                const isToday = today.equals(date.toPlainDate());
                                return (
                                    <td className={calendarCellStyle} key={date.toString()}>
                                        <Button type="button" appearance={selected ? 'primary' : 'text'}
                                            aria-label={date.toPlainDate().toString()}
                                            aria-pressed={selected} disabled={!inRange}
                                            aria-current={isToday ? 'date' : undefined}
                                            className={cx.call(undefined, calendarDateCellContentStyle,
                                                isToday && todayStyle,
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
