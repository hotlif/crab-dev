import { describe, expect, it } from "@crab-dev/wake/test";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Temporal } from '@js-temporal/polyfill';
import { getCalendarMatrix, getWeekDaysHeader, isWithinDateRange } from '../util.js';
import { formatTemporal } from '../util.js';
const tz = 'Asia/Shanghai';
(window as unknown as Record<string, unknown>).Temporal = Temporal;
const zdt = Temporal.ZonedDateTime.from({
    year: 2026,
    month: 3,
    day: 19,
    hour: 15,
    minute: 8,
    second: 5,
    millisecond: 42,
    timeZone: tz,
}) as any;
const base = Temporal.ZonedDateTime.from({ year: 2026, month: 3, day: 18, timeZone: tz }) as any;
describe('getCalendarMatrix', () => {
    it('should return 42 days for a month', () => {
        const matrix = getCalendarMatrix(2026, 3, 1, 'Asia/Shanghai');
        expect(matrix).toHaveLength(42);
    });
    it('should start from correct weekStartDay', () => {
        const matrix = getCalendarMatrix(2026, 3, 1, 'Asia/Shanghai');
        expect(matrix[0].dayOfWeek).toBe(1); // Monday
    });
    it('should cover the whole month', () => {
        const matrix = getCalendarMatrix(2026, 3, 1, 'Asia/Shanghai');
        const days = matrix.map(d => d.day);
        expect(days).toContain(1);
        expect(days).toContain(31);
    });
    it('should use default weekStartDay when omitted', () => {
        const matrix = getCalendarMatrix(2026, 3, undefined, tz);
        expect(matrix).toHaveLength(42);
        expect(matrix[0].dayOfWeek).toBe(1);
    });
});
describe('formatTemporal', () => {
    it('should return original string for unmatched token', () => {
        expect(formatTemporal(zdt, 'notAToken')).toBe('notAToken');
        expect(formatTemporal(zdt, 'yyyy-notAToken')).toBe('2026-notAToken');
        expect(formatTemporal(zdt, 'foo@#￥%')).toBe('foo@#￥%');
        expect(formatTemporal(zdt, 'plainText')).toBe('plPMinTe+08t');
        expect(formatTemporal(zdt, '\'plainText\'')).toBe('plainText');
    });
    it('should format AM/PM/aaa for morning', () => {
        const morning = Temporal.ZonedDateTime.from({
            year: 2026, month: 3, day: 19, hour: 0, minute: 0, second: 0, millisecond: 0, timeZone: tz,
        }) as any;
        expect(formatTemporal(morning, 'a')).toBe('AM');
        expect(formatTemporal(morning, 'aa')).toBe('AM');
        expect(formatTemporal(morning, 'aaa')).toBe('am');
    });
    it('should format 12-hour for midnight', () => {
        const midnight = Temporal.ZonedDateTime.from({
            year: 2026, month: 3, day: 19, hour: 0, minute: 0, second: 0, millisecond: 0, timeZone: tz,
        }) as any;
        expect(formatTemporal(midnight, 'hh')).toBe('12');
        expect(formatTemporal(midnight, 'h')).toBe('12');
    });
    it('should cover all token replacements in one string', () => {
        const fmt = 'yyyy yy y MMMM MMM MM M dd d EEEE EEE E a aa aaa HH H hh h mm m ss s SSS SS S xxx xx x z';
        const out = formatTemporal(zdt, fmt);
        const expected = '2026 26 2026 March Mar 03 3 19 19 Thursday Thu 4 PM PM pm 15 15 03 3 08 8 05 5 042 04 0 +08:00 +0800 +08 Asia/Shanghai';
        expect(out).toBe(expected);
    });
    it('should return empty string for null', () => {
        expect(formatTemporal(null, 'yyyy-MM-dd')).toBe('');
    });
    it('should format basic date/time', () => {
        expect(formatTemporal(zdt, 'yyyy-MM-dd HH:mm:ss')).toBe('2026-03-19 15:08:05');
        expect(formatTemporal(zdt, 'yy-M-d H:m:s')).toBe('26-3-19 15:8:5');
    });
    it('should format month and weekday names', () => {
        expect(formatTemporal(zdt, 'MMMM')).toBe('March');
        expect(formatTemporal(zdt, 'MMM')).toBe('Mar');
        expect(formatTemporal(zdt, 'EEEE')).toBe('Thursday');
        expect(formatTemporal(zdt, 'EEE')).toBe('Thu');
    });
    it('should format 12-hour and AM/PM', () => {
        expect(formatTemporal(zdt, 'hh:mm a')).toBe('03:08 PM');
        expect(formatTemporal(zdt, 'h:m aaa')).toBe('3:8 pm');
    });
    it('should format milliseconds', () => {
        expect(formatTemporal(zdt, 'SSS')).toBe('042');
        expect(formatTemporal(zdt, 'SS')).toBe('04');
        expect(formatTemporal(zdt, 'S')).toBe('0');
    });
    it('should format timezone', () => {
        expect(formatTemporal(zdt, 'xxx')).toMatch(/[+-]\d{2}:\d{2}/);
        expect(formatTemporal(zdt, 'xx')).toMatch(/[+-]\d{4}/);
        expect(formatTemporal(zdt, 'x')).toMatch(/[+-]\d{2}/);
        expect(formatTemporal(zdt, 'z')).toBe('Asia/Shanghai');
    });
    it('should handle escaped text and single quotes', () => {
        expect(formatTemporal(zdt, "'year:' yyyy 'month:' MM")).toBe('year: 2026 month: 03');
        expect(formatTemporal(zdt, "hh 'o''clock' a")).toBe("03 o'clock PM");
    });
});
describe('getWeekDaysHeader', () => {
    it('should return 7 days', () => {
        const header = getWeekDaysHeader(2026, 3, 1, 'zh-CN', 'Asia/Shanghai');
        expect(header).toHaveLength(7);
    });
    it('should start from correct weekStartDay', () => {
        const header = getWeekDaysHeader(2026, 3, 1, 'en-US', 'Asia/Shanghai');
        expect(header[0]).toMatch(/M|一/);
    });
    it('should be locale aware', () => {
        const headerCN = getWeekDaysHeader(2026, 3, 1, 'zh-CN', 'Asia/Shanghai');
        const headerEN = getWeekDaysHeader(2026, 3, 1, 'en-US', 'Asia/Shanghai');
        expect(headerCN[0]).not.toBe(headerEN[0]);
    });
    it('should use default weekStartDay when omitted', () => {
        const header = getWeekDaysHeader(2026, 3, undefined, 'en-US', tz);
        expect(header).toHaveLength(7);
    });
});
describe('isWithinDateRange', () => {
    it('should return true if only end is undefined and start is undefined', () => {
        expect(isWithinDateRange(base, {})).toBe(true);
        expect(isWithinDateRange(base, { end: undefined })).toBe(true);
    });
    it('should return true if range is empty object', () => {
        expect(isWithinDateRange(base, {})).toBe(true);
    });
    it('should return true if range.start and range.end are both undefined', () => {
        expect(isWithinDateRange(base, { start: undefined, end: undefined })).toBe(true);
    });
    it('should return true if no range', () => {
        expect(isWithinDateRange(base)).toBe(true);
    });
    it('should return true if in [start, end]', () => {
        const start = base.add({ days: -2 });
        const end = base.add({ days: 2 });
        expect(isWithinDateRange(base, { start, end })).toBe(true);
    });
    it('should return false if before start', () => {
        const start = base;
        const test = base.add({ days: -1 });
        expect(isWithinDateRange(test, { start })).toBe(false);
    });
    it('should return false if after end', () => {
        const end = base;
        const test = base.add({ days: 1 });
        expect(isWithinDateRange(test, { end })).toBe(false);
    });
    it('should return true if on start or end', () => {
        const start = base;
        const end = base.add({ days: 2 });
        expect(isWithinDateRange(start, { start, end })).toBe(true);
        expect(isWithinDateRange(end, { start, end })).toBe(true);
    });
    it('should return true if only end is present but undefined', () => {
        // 关键：range 有 end 字段但为 undefined，触发最后 return true 分支
        expect(isWithinDateRange(base, { end: undefined })).toBe(true);
    });
});
