import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';
import { nowZonedDateTime, resolveTemporal, toPickerDateTime } from '../temporal.js';
import { getCalendarMatrix, isWithinDateRange } from '../util.js';

describe('local Temporal runtime and current-time boundary', () => {
    it('uses the official fallback when native Temporal is absent and keeps a supplied native runtime', () => {
        const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Temporal');
        expect(resolveTemporal(undefined)).toBe(TemporalPolyfill);
        const native = globalThis.Temporal ?? resolveTemporal(undefined);
        expect(resolveTemporal(native)).toBe(native);
        expect(Object.getOwnPropertyDescriptor(globalThis, 'Temporal')).toEqual(descriptor);
    });

    it('reads one millisecond clock while resolving the requested time zone across the date boundary', () => {
        const instant = TemporalPolyfill.Instant.from('2026-09-12T00:30:00.123Z');
        const clock = mock.spyOn(Date, 'now').return(instant.epochMilliseconds);
        try {
            const west = nowZonedDateTime('America/Los_Angeles');
            const east = nowZonedDateTime('Asia/Shanghai');
            expect(west.toPlainDate().toString()).toBe('2026-09-11');
            expect(east.toPlainDate().toString()).toBe('2026-09-12');
            expect(west.epochNanoseconds).toBe(instant.epochNanoseconds);
            expect(east.epochMilliseconds).toBe(instant.epochMilliseconds);
            expect(east.microsecond).toBe(0);
            expect(east.nanosecond).toBe(0);
        } finally {
            clock.restore();
        }
    });

    it('computes calendar and range data without requiring a Temporal global', () => {
        const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Temporal');
        const value = toPickerDateTime(TemporalPolyfill.ZonedDateTime.from('2026-06-15T09:30:00.123456789+08:00[Asia/Shanghai]'));
        Reflect.deleteProperty(globalThis, 'Temporal');
        try {
            const dates = getCalendarMatrix(2026, 6, 1, 'Asia/Shanghai');
            expect(dates.length).toBe(42);
            expect(isWithinDateRange(value, { start: value.subtract({ days: 1 }), end: value.add({ days: 1 }) })).toBe(true);
            expect(value.nanosecond).toBe(789);
            expect(Object.getOwnPropertyDescriptor(globalThis, 'Temporal')).toBeUndefined();
        } finally {
            if (descriptor) Object.defineProperty(globalThis, 'Temporal', descriptor);
        }
    });

    it('normalizes official polyfill and available native values without losing calendar, zone or nanoseconds', () => {
        const polyfill = TemporalPolyfill.ZonedDateTime.from('2026-06-15T09:30:00.123456789+08:00[Asia/Shanghai]').withCalendar('japanese');
        const native = globalThis.Temporal;
        // The browser runner covers the native branch when the platform has it;
        // the official fallback branch runs even on engines without Temporal.
        const adapted = [toPickerDateTime(polyfill), ...(native ? [toPickerDateTime(native.ZonedDateTime.from(polyfill.toString()))] : [])];
        expect(polyfill.nanosecond).toBe(789);
        for (const value of adapted) {
            expect(value.epochNanoseconds).toBe(polyfill.epochNanoseconds);
            expect(value.timeZoneId).toBe('Asia/Shanghai');
            expect(value.calendarId).toBe('japanese');
            expect(value.toString()).toBe(polyfill.toString());
            const restored = TemporalPolyfill.ZonedDateTime.from(value.toString());
            expect(restored.equals(polyfill)).toBe(true);
        }
    });

    it('accepts the narrow ISO serialization protocol and rejects invalid serialized values', () => {
        const text = '2026-06-15T09:30:00.123456789+08:00[Asia/Shanghai]';
        expect(toPickerDateTime(text).toString()).toBe(text);
        expect(toPickerDateTime({ toString: () => text }).toString()).toBe(text);
        expect(() => toPickerDateTime({ toString: () => '[object Object]' })).toThrow();
    });
});
