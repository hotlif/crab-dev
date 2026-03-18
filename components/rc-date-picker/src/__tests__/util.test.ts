import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from "@jest/globals";
import { getCalendarMatrix, getWeekDaysHeader, isWithinDateRange } from '../datePicker/util';


(window as any).Temporal = Temporal;
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
});

describe('isWithinDateRange', () => {
    const tz = 'Asia/Shanghai';
    const base = Temporal.ZonedDateTime.from({ year: 2026, month: 3, day: 18, timeZone: tz });

    it('should return true if no range', () => {
        expect(isWithinDateRange(base)).toBe(true);
    });

    it('should return true if in [start, end]', () => {
        const start = base.subtract({ days: 2 });
        const end = base.add({ days: 2 });
        expect(isWithinDateRange(base, { start, end })).toBe(true);
    });

    it('should return false if before start', () => {
        const start = base;
        const test = base.subtract({ days: 1 });
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
});
