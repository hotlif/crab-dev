import { act, fireEvent } from '@crab-dev/wake/test/react';
import { Temporal } from '@js-temporal/polyfill';

export function setupTimePickerDOM() {
    // Keep implicit defaults deterministic and avoid consulting the host OS time zone.
    const instant = Temporal.Instant.from('2026-10-23T04:00:00Z');
    const temporal = {
        ...Temporal,
        Now: {
            ...Temporal.Now,
            timeZoneId: () => 'Asia/Singapore',
            zonedDateTimeISO: (timeZone = 'Asia/Singapore') => instant.toZonedDateTimeISO(timeZone),
        },
    };
    Object.defineProperty(globalThis, 'Temporal', { value: temporal, configurable: true });
    // The DOM runner has no layout engine or CSS animation timeline.
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', { configurable: true, value: () => [] });
    if (typeof ResizeObserver === 'undefined') {
        Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } });
    }
}
export async function enterTime(input: HTMLElement, text: string) {
    await act(() => Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, text));
    await fireEvent.input(input);
}
