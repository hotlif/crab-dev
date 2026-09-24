import { afterEach, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, renderHook } from '@crab-dev/wake/test/react';
import { useBarTransition } from '../hooks/useBarTransition.js';
import { DIM_OPACITY, useCategoryDim } from '../hooks/useCategoryDim.js';
import type { BarRect } from '../layout.js';

const frames = new Map<number, FrameRequestCallback>();
const listeners = new Set<(event: { matches: boolean }) => void>();
const mediaDescriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
let handle = 0;
let reduced = false;
beforeEach(() => {
    frames.clear();
    listeners.clear();
    handle = 0;
    reduced = false;
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(callback => {
        frames.set(++handle, callback);
        return handle;
    });
    mock.spyOn(globalThis, 'cancelAnimationFrame').implement(id => { frames.delete(id); });
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({
        matches: reduced,
        addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.delete(listener),
    }) });
});
afterEach(() => {
    mock.restoreAll();
    if (mediaDescriptor) Object.defineProperty(window, 'matchMedia', mediaDescriptor);
    else Reflect.deleteProperty(window, 'matchMedia');
});

const bars: BarRect[] = [{ x: 0, y: 20, width: 10, height: 80, categoryIndex: 0, seriesIndex: 0, value: 80, dataEnd: 'top' }];
const options = { zeroPos: 100, orientation: 'vertical' as const, categoryCount: 1, width: 200, height: 100 };

describe('running chart motion policy', () => {
    it('does not rerender indefinitely for equivalent freshly computed geometry', async () => {
        const view = await renderHook(() => useBarTransition(bars.map(bar => ({ ...bar })), { ...options, animate: false }));
        expect(view.result.current).toEqual(bars);
        expect(frames.size).toBe(0);
    });
    it('finishes unchanged geometry when animate is disabled', async () => {
        const view = await renderHook(({ animate }) => useBarTransition(bars, { ...options, animate }), { initialProps: { animate: true } });
        expect(view.result.current[0].height).toBe(0);
        expect(frames.size).toBe(1);
        await view.rerender({ animate: false });
        expect(view.result.current).toEqual(bars);
        expect(frames.size).toBe(0);
    });

    it('settles geometry and category feedback when reduced motion changes mid-flight', async () => {
        const view = await renderHook(({ active }) => ({
            bars: useBarTransition(bars, { ...options, animate: true }),
            dims: useCategoryDim(active, 2, true),
        }), { initialProps: { active: null as number | null } });
        await view.rerender({ active: 0 });
        expect(frames.size).toBe(2);
        await act(async () => {
            reduced = true;
            listeners.forEach(listener => listener({ matches: true }));
        });
        expect(view.result.current.bars).toEqual(bars);
        expect(view.result.current.dims).toEqual([1, DIM_OPACITY]);
        expect(frames.size).toBe(0);
    });

    it('stops category feedback without requiring a new target', async () => {
        const view = await renderHook(({ active, animate }) => useCategoryDim(active, 2, animate), { initialProps: { active: null as number | null, animate: true } });
        await view.rerender({ active: 1, animate: true });
        expect(frames.size).toBe(1);
        await view.rerender({ active: 1, animate: false });
        expect(view.result.current).toEqual([DIM_OPACITY, 1]);
        expect(frames.size).toBe(0);
    });
});
