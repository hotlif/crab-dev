import { act, fireEvent } from '@crab-dev/wake/test/react';
import { Temporal } from '@js-temporal/polyfill';

export function setupTimePickerDOM() {
    Object.defineProperty(globalThis, 'Temporal', { value: Temporal, configurable: true });
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
