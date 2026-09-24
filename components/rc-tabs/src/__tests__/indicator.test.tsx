import { beforeAll, afterAll, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import Tabs from '../tabs.js';

let reduced = false;
const listeners = new Set<(event: { matches: boolean }) => void>();
const originalMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({
        get matches() { return reduced; },
        addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => listeners.delete(listener),
    }) });
});
beforeEach(() => { reduced = false; });
afterAll(() => {
    if (originalMedia) Object.defineProperty(window, 'matchMedia', originalMedia);
    else Reflect.deleteProperty(window, 'matchMedia');
});

const items = ['One', 'Two', 'Three'].map(label => ({ key: label, label, children: label }));

function indicator(label: string, left: number, width: number) {
    const node = screen.getByRole('tab', { name: label }).querySelector<HTMLSpanElement>('span > span[aria-hidden="true"]')!;
    // The DOM runner has no layout or CSS animation engine. Supply measured bounds and resolved tokens.
    const bounds = { left, width };
    Object.defineProperty(node, 'getBoundingClientRect', { value: () => ({ ...bounds }) });
    node.style.transitionDuration = '0.35s';
    node.style.transitionTimingFunction = 'cubic-bezier(0.42, 1.67, 0.21, 0.9)';
    const cancel = mock.fn();
    const animate = mock.fn((_frames: Keyframe[], _options: KeyframeAnimationOptions) => ({ cancel }));
    Object.defineProperty(node, 'animate', { value: animate });
    return { node, bounds, animate, cancel };
}

describe('Tabs indicator motion', () => {
    it('moves from the previous label and retargets from the interrupted position', async () => {
        const view = await render(<Tabs items={items} />);
        indicator('One', 20, 40);
        const second = indicator('Two', 80, 60);
        const third = indicator('Three', 170, 30);
        await fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
        expect(second.animate.calls.calls[0][0]).toEqual([
            { transform: `translateX(-60px) scaleX(${40 / 60})` }, { transform: 'none' },
        ]);
        expect(second.animate.calls.calls[0][1].duration).toBe(350);
        second.bounds.left = 50;
        second.bounds.width = 50;
        await fireEvent.click(screen.getByRole('tab', { name: 'Three' }));
        expect(second.cancel).toHaveBeenCalledTimes(1);
        expect(third.animate.calls.calls[0][0]).toEqual([
            { transform: `translateX(-120px) scaleX(${50 / 30})` }, { transform: 'none' },
        ]);
        await view.unmount();
        expect(third.cancel).toHaveBeenCalledTimes(1);
    });

    it('supports reversed physical positions, controlled selection and variant changes', async () => {
        const view = await render(<Tabs items={items} activeKey="One" dir="rtl" />);
        indicator('One', 170, 30);
        const second = indicator('Two', 80, 60);
        await view.rerender(<Tabs items={items} activeKey="Two" dir="rtl" />);
        expect(second.animate.calls.calls[0][0]).toEqual([
            { transform: 'translateX(90px) scaleX(0.5)' }, { transform: 'none' },
        ]);
        await view.rerender(<Tabs items={items} activeKey="Two" type="pill" />);
        expect(second.cancel).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
    });

    it('cancels an in-flight move when reduced motion changes and keeps selection responsive', async () => {
        await render(<Tabs items={items} />);
        indicator('One', 20, 40);
        const second = indicator('Two', 80, 60);
        const third = indicator('Three', 170, 30);
        await fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
        await act(() => {
            reduced = true;
            listeners.forEach(listener => listener({ matches: true }));
        });
        expect(second.cancel).toHaveBeenCalledTimes(1);
        await fireEvent.click(screen.getByRole('tab', { name: 'Three' }));
        expect(third.animate).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'Three' }).getAttribute('aria-selected')).toBe('true');
    });

    it('skips spatial motion when the resolved CSS duration is zero', async () => {
        await render(<Tabs items={items} />);
        indicator('One', 20, 40);
        const second = indicator('Two', 80, 60);
        second.node.style.transitionDuration = '0s';
        await fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
        expect(second.animate).not.toHaveBeenCalled();
    });
});
