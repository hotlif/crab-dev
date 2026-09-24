import { afterEach, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import { useRef } from 'react';
import { useAnimatedRows } from '../useAnimatedRows.js';

const frames = new Map<number, FrameRequestCallback>();
const listeners = new Set<(event: { matches: boolean }) => void>();
let now = 0;
let handle = 0;
const matchMediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');

beforeEach(() => {
    frames.clear();
    listeners.clear();
    now = 0;
    handle = 0;
    mock.spyOn(performance, 'now').implement(() => now);
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(callback => {
        frames.set(++handle, callback);
        return handle;
    });
    mock.spyOn(globalThis, 'cancelAnimationFrame').implement(id => { frames.delete(id); });
    const computedStyle = globalThis.getComputedStyle;
    mock.spyOn(globalThis, 'getComputedStyle').implement(element => {
        const style = computedStyle(element);
        Object.defineProperty(style, 'getPropertyValue', { configurable: true, value: () => '200ms linear' });
        return style;
    });
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({
        matches: false,
        addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.delete(listener),
    }) });
});

afterEach(() => {
    mock.restoreAll();
    if (matchMediaDescriptor) Object.defineProperty(window, 'matchMedia', matchMediaDescriptor);
    else Reflect.deleteProperty(window, 'matchMedia');
});

async function advance(ms: number) {
    await act(async () => {
        now += ms;
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach(callback => callback(now));
    });
}

function Subject({ ids, trigger = '', enabled = true }: { ids: number[]; trigger?: string; enabled?: boolean }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const rows = useAnimatedRows(ids, {
        keyFor: id => id, sizeFor: () => 40, trigger, rootRef, enabled, motionProperty: '--row-motion',
    });
    return <div ref={rootRef}>{rows.map(row => <div key={row.key} data-id={row.key} data-size={row.size} inert={row.exiting} />)}</div>;
}

function size(container: HTMLElement, id: number) {
    return Number(container.querySelector(`[data-id="${id}"]`)?.getAttribute('data-size'));
}

describe('useAnimatedRows', () => {
    it('retains closing rows in order and reverses from their current measured size', async () => {
        const view = await render(<Subject ids={[1, 2, 3]} />);
        expect(frames.size).toBe(0);
        await view.rerender(<Subject ids={[1, 3]} trigger="collapse" />);
        expect([...view.container.querySelectorAll('[data-id]')].map(row => row.getAttribute('data-id'))).toEqual(['1', '2', '3']);
        expect(view.container.querySelector('[data-id="2"]')?.hasAttribute('inert')).toBe(true);
        await advance(100);
        expect(size(view.container, 2)).toBeCloseTo(20, 2);
        await view.rerender(<Subject ids={[1, 2, 3]} trigger="expand" />);
        expect(size(view.container, 2)).toBeCloseTo(20, 2);
        expect(view.container.querySelector('[data-id="2"]')?.hasAttribute('inert')).toBe(false);
        await advance(200);
        expect(size(view.container, 2)).toBe(40);
        expect(frames.size).toBe(0);
        await view.rerender(<Subject ids={[1, 3]} trigger="collapse-again" />);
        await advance(200);
        expect(view.container.querySelector('[data-id="2"]')).toBeNull();
    });

    it('expands from zero and settles immediately when reduced motion changes', async () => {
        const view = await render(<Subject ids={[1]} />);
        await view.rerender(<Subject ids={[1, 2]} trigger="expand" />);
        expect(size(view.container, 2)).toBe(0);
        await advance(50);
        expect(size(view.container, 2)).toBeCloseTo(10, 2);
        await act(async () => listeners.forEach(listener => listener({ matches: true })));
        expect(size(view.container, 2)).toBe(40);
        expect(frames.size).toBe(0);
        await view.rerender(<Subject ids={[1]} trigger="collapse" />);
        expect(view.container.querySelector('[data-id="2"]')).toBeNull();
    });

    it('does not animate sorting, disabled motion, or large virtual lists', async () => {
        const view = await render(<Subject ids={[1]} />);
        await view.rerender(<Subject ids={[2, 1]} />);
        expect(size(view.container, 2)).toBe(40);
        expect(frames.size).toBe(0);
        await view.rerender(<Subject ids={[1]} trigger="disabled" enabled={false} />);
        expect(frames.size).toBe(0);
        await view.rerender(<Subject ids={Array.from({ length: 120 }, (_, i) => i)} trigger="large" />);
        expect(frames.size).toBe(0);
        expect(size(view.container, 119)).toBe(40);
    });

    it('cancels scheduled frames on unmount', async () => {
        const view = await render(<Subject ids={[1]} />);
        await view.rerender(<Subject ids={[1, 2]} trigger="expand" />);
        expect(frames.size).toBe(1);
        await view.unmount();
        expect(frames.size).toBe(0);
    });
});
