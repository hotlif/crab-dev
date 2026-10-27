import { afterAll, beforeAll, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import Tabs from '../tabs.js';

const originalBounds = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'getBoundingClientRect');
const originalScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollBy');
const originalObserver = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver');
const bounds = new Map<string, { left: number; width: number }>();
let scroll = mock.fn();
let resize: (() => void) | undefined;
let disconnect = mock.fn();

beforeAll(() => {
    // The DOM runner has no layout engine. Keep real selection and focus events,
    // substituting only measured geometry and the browser's scrolling primitive.
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value(this: HTMLElement) {
            const measured = this.getAttribute('role') === 'tablist'
                ? { left: 40, width: 200 }
                : bounds.get(this.textContent ?? '') ?? { left: 40, width: 0 };
            return new window.DOMRect(measured.left, 0, measured.width, 48);
        },
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
        configurable: true,
        value(options: ScrollToOptions) { scroll(options); },
    });
    Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        value: class {
            constructor(callback: () => void) { resize = callback; }
            observe() {}
            disconnect() { disconnect(); }
        },
    });
});

beforeEach(() => {
    scroll = mock.fn();
    disconnect = mock.fn();
    bounds.clear();
    bounds.set('One', { left: 40, width: 80 });
    bounds.set('Two', { left: 120, width: 80 });
    bounds.set('Three', { left: 320, width: 80 });
});

afterAll(() => {
    for (const [target, name, descriptor] of [
        [HTMLElement.prototype, 'getBoundingClientRect', originalBounds],
        [HTMLElement.prototype, 'scrollBy', originalScroll],
        [globalThis, 'ResizeObserver', originalObserver],
    ] as const) {
        if (descriptor) Object.defineProperty(target, name, descriptor);
        else Reflect.deleteProperty(target, name);
    }
});

const items = ['One', 'Two', 'Three'].map(label => ({ key: label, label, children: label }));

describe('Tabs overflow', () => {
    it('reveals an initially selected offscreen tab without scrolling the page', async () => {
        await render(<Tabs items={items} defaultValue="Three" />);
        expect(scroll).toHaveBeenCalledWith({ left: 160, behavior: 'instant' });
        expect(screen.getByRole('tab', { name: 'Three' }).getAttribute('aria-selected')).toBe('true');
    });

    it('reveals controlled selections and reconciles reordered tabs and resized containers', async () => {
        const view = await render(<Tabs items={items} value="One" />);
        expect(scroll).not.toHaveBeenCalled();
        await view.rerender(<Tabs items={items} value="Three" />);
        expect(scroll).toHaveBeenLastCalledWith({ left: 160, behavior: 'instant' });

        bounds.set('Three', { left: -40, width: 80 });
        await view.rerender(<Tabs items={[items[2], items[0], items[1]]} value="Three" />);
        expect(scroll).toHaveBeenLastCalledWith({ left: -80, behavior: 'instant' });

        bounds.set('Three', { left: 200, width: 80 });
        await act(() => resize?.());
        expect(scroll).toHaveBeenLastCalledWith({ left: 40, behavior: 'instant' });
        await view.unmount();
        expect(disconnect).toHaveBeenCalled();
    });

    it('reveals keyboard focus without moving the surrounding page in controlled mode', async () => {
        await render(<Tabs items={items} value="One" />);
        await fireEvent.keyDown(screen.getByRole('tab', { name: 'One' }), { key: 'End' });
        expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Three' }));
        expect(scroll).toHaveBeenLastCalledWith({ left: 160, behavior: 'instant' });
    });
});
