import { describe, expect, it } from '@crab-dev/wake/test';
import { renderHook } from '@crab-dev/wake/test/react';
import { act } from 'react';
import { useDevicePixelRatio } from '../useDevicePixelRatio.js';

function owner() {
    const doc = document.implementation.createHTMLDocument('secondary display');
    const listeners = new Set<() => void>();
    const queries: Array<EventTarget & { media: string }> = [];
    const view = {
        devicePixelRatio: 1.5,
        addEventListener: (_name: string, notify: () => void) => listeners.add(notify),
        removeEventListener: (_name: string, notify: () => void) => listeners.delete(notify),
        matchMedia: (media: string) => { const query = Object.assign(new EventTarget(), { media }); queries.push(query); return query; },
    };
    Object.defineProperty(doc, 'defaultView', { configurable: true, value: view });
    return { ref: { current: doc.createElement('div') }, view, listeners, queries };
}

describe('document-owned pixel resolution', () => {
    it('uses the owning window and follows resize changes without changing the element', async () => {
        const target = owner();
        const { result, unmount } = await renderHook(() => useDevicePixelRatio(target.ref));
        expect(result.current).toBe(1.5);
        await act(async () => { target.view.devicePixelRatio = 2; target.listeners.forEach(notify => notify()); });
        expect(result.current).toBe(2);
        expect(target.queries.at(-1)?.media).toBe('(resolution: 2dppx)');
        await unmount(); expect(target.listeners.size).toBe(0);
    });
    it('rearms the resolution query when moving between displays without a resize', async () => {
        const target = owner();
        const { result, unmount } = await renderHook(() => useDevicePixelRatio(target.ref));
        await act(async () => { target.view.devicePixelRatio = 2.5; target.queries.at(-1)?.dispatchEvent(new Event('change')); });
        expect(result.current).toBe(2.5);
        await act(async () => { target.view.devicePixelRatio = 3; target.queries.at(-1)?.dispatchEvent(new Event('change')); });
        expect(result.current).toBe(3);
        await unmount();
    });
    it('does not subscribe when the renderer has an explicit resolution', async () => {
        const target = owner();
        const { unmount } = await renderHook(() => useDevicePixelRatio(target.ref, false));
        expect(target.listeners.size).toBe(0); expect(target.queries.length).toBe(0);
        await unmount();
    });
});
