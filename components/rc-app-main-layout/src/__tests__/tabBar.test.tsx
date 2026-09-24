import { afterAll, beforeAll, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { useState } from 'react';
import type { Key } from 'react';
import TabBar from '../tabBar.js';

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

const items = ['One', 'Two', 'Three'].map(title => ({ key: title, title, children: title, closable: false }));

function prepareTabs() {
    const animations: { duration: number; finish: () => void; cancel: () => void; finished: Promise<void>; playState: string }[] = [];
    const tabs = screen.getAllByRole('tab');
    for (const button of tabs) {
        const tab = button.parentElement!;
        // Only layout and the Web Animations lifecycle are substituted; pointer events stay real.
        Object.defineProperty(tab, 'offsetWidth', { value: 100 });
        tab.style.transitionDuration = '0.47s';
        tab.style.transitionTimingFunction = 'cubic-bezier(0.42, 1.67, 0.21, 0.9)';
        Object.defineProperty(tab, 'animate', { value: (_frames: Keyframe[], options: KeyframeAnimationOptions) => {
            const completion = Promise.withResolvers<void>();
            // A cancellation may happen before the component needs to await finished.
            void completion.promise.catch(() => {});
            const animation = {
                duration: Number(options.duration),
                playState: Number(options.duration) === 0 ? 'finished' : 'running',
                finished: completion.promise,
                finish: () => { animation.playState = 'finished'; completion.resolve(); },
                cancel: () => { animation.playState = 'idle'; completion.reject(new Error('cancelled')); },
            };
            if (animation.duration === 0) completion.resolve();
            animations.push(animation);
            return animation;
        } });
    }
    return { tabs, animations };
}

async function drag(tab: HTMLElement) {
    await fireEvent(tab, new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1, clientX: 0 }));
    await fireEvent(tab, new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 160 }));
    await fireEvent(tab, new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: 160 }));
}

describe('TabBar reorder motion', () => {
    it('keeps touch panning available instead of starting a reorder', async () => {
        const onReorder = mock.fn();
        await render(<TabBar items={items} onReorder={onReorder} />);
        const { tabs, animations } = prepareTabs();
        for (const type of ['pointerdown', 'pointermove', 'pointerup']) {
            await fireEvent(tabs[0], new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, pointerType: 'touch', clientX: type === 'pointerdown' ? 0 : 160 }));
        }
        expect(onReorder).not.toHaveBeenCalled();
        expect(animations.length).toBe(0);
    });

    it('reorders in the physical direction of an RTL tab strip', async () => {
        reduced = true;
        const onReorder = mock.fn();
        await render(<TabBar items={items} onReorder={onReorder} />);
        const { tabs } = prepareTabs();
        tabs[0].parentElement!.style.direction = 'rtl';
        await fireEvent(tabs[0], new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1, clientX: 200 }));
        await fireEvent(tabs[0], new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 40 }));
        await fireEvent(tabs[0], new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: 40 }));
        expect(onReorder).toHaveBeenCalledWith(['Two', 'Three', 'One']);
    });
    it('commits only after all release/reflow animations settle, regardless of their token duration', async () => {
        const onReorder = mock.fn();
        await render(<TabBar items={items} onReorder={onReorder} />);
        const { tabs, animations } = prepareTabs();
        await drag(tabs[0]);
        const pending = animations.filter(animation => animation.playState === 'running');
        expect(pending.length).toBe(3);
        expect(pending.every(animation => animation.duration === 470)).toBe(true);
        expect(onReorder).not.toHaveBeenCalled();
        await act(() => { pending[0].finish(); });
        expect(onReorder).not.toHaveBeenCalled();
        await act(() => { pending.slice(1).forEach(animation => animation.finish()); });
        expect(onReorder).toHaveBeenCalledTimes(1);
        expect(onReorder).toHaveBeenCalledWith(['Two', 'Three', 'One']);
    });

    it('commits immediately with reduced motion and suppresses the synthetic click after dragging', async () => {
        reduced = true;
        const onReorder = mock.fn();
        const onChange = mock.fn();
        await render(<TabBar items={items} onReorder={onReorder} onChange={onChange} />);
        const { tabs, animations } = prepareTabs();
        await drag(tabs[0]);
        expect(onReorder).toHaveBeenCalledWith(['Two', 'Three', 'One']);
        expect(animations.every(animation => animation.duration === 0)).toBe(true);
        await fireEvent.click(tabs[0]);
        expect(onChange).not.toHaveBeenCalled();
        await fireEvent(tabs[1], new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 2, clientX: 0 }));
        await fireEvent(tabs[1], new PointerEvent('pointerup', { bubbles: true, pointerId: 2, clientX: 0 }));
        await fireEvent.click(tabs[1]);
        expect(onChange).toHaveBeenCalledWith('Two');
    });

    it('finishes a pending reorder once when the user enables reduced motion', async () => {
        const onReorder = mock.fn();
        await render(<TabBar items={items} onReorder={onReorder} />);
        const { tabs } = prepareTabs();
        await drag(tabs[0]);
        expect(onReorder).not.toHaveBeenCalled();
        await act(() => {
            reduced = true;
            listeners.forEach(listener => listener({ matches: true }));
        });
        expect(onReorder).toHaveBeenCalledTimes(1);
    });

    it('cancels pointer gestures without reordering and does not call back after unmount', async () => {
        const onReorder = mock.fn();
        const view = await render(<TabBar items={items} onReorder={onReorder} />);
        const { tabs, animations } = prepareTabs();
        await fireEvent(tabs[0], new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1, clientX: 0 }));
        await fireEvent(tabs[0], new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 160 }));
        await fireEvent(tabs[0], new PointerEvent('pointercancel', { bubbles: true, pointerId: 1 }));
        expect(onReorder).not.toHaveBeenCalled();
        expect(animations.every(animation => animation.playState === 'idle')).toBe(true);
        await drag(tabs[0]);
        await view.unmount();
        await act(() => { animations.forEach(animation => animation.finish()); });
        expect(onReorder).not.toHaveBeenCalled();
    });
});

function InteractiveTabs({ onEmpty, dir }: { onEmpty?: () => void; dir?: string }) {
    const [open, setOpen] = useState(items.map(item => ({ ...item, closable: item.key !== 'One' })));
    const [active, setActive] = useState<Key>('One');
    return <div dir={dir}><TabBar items={open} activeKey={active} onChange={setActive} onEmpty={onEmpty}
        onClose={key => {
            const next = open.filter(item => item.key !== key);
            setOpen(next);
            if (key === active) setActive(next[0]?.key ?? '');
        }} /></div>;
}

describe('TabBar accessibility', () => {
    it('follows the reading direction for RTL keyboard navigation', async () => {
        await render(<InteractiveTabs dir="rtl" />);
        const [one, two] = screen.getAllByRole('tab');
        // The DOM test environment has no inherited-direction layout engine.
        one.style.direction = 'rtl';
        two.style.direction = 'rtl';
        await fireEvent.keyDown(one, { key: 'ArrowLeft' });
        expect(document.activeElement).toBe(two);
        await fireEvent.keyDown(two, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(one);
    });
    it('moves focus and selection with arrows, Home and End, and makes the active close action reachable', async () => {
        await render(<InteractiveTabs />);
        const [one, two, three] = screen.getAllByRole('tab');
        expect(one.tabIndex).toBe(0);
        expect(two.tabIndex).toBe(-1);
        await act(() => one.focus());
        await fireEvent.keyDown(one, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(two);
        expect(two.getAttribute('aria-selected')).toBe('true');
        expect(two.parentElement?.querySelector('button[aria-label="关闭标签页"]')?.getAttribute('tabindex')).toBe('0');
        await fireEvent.keyDown(two, { key: 'End' });
        expect(document.activeElement).toBe(three);
        await fireEvent.keyDown(three, { key: 'Home' });
        expect(document.activeElement).toBe(one);
        await fireEvent.keyDown(one, { key: 'Delete' });
        expect(screen.getAllByRole('tab').length).toBe(3);
    });

    it('closes through Delete and the native close button without activating the closing tab', async () => {
        await render(<InteractiveTabs />);
        const [one, two] = screen.getAllByRole('tab');
        await fireEvent.keyDown(one, { key: 'ArrowRight' });
        await fireEvent.keyDown(two, { key: 'Delete' });
        expect(screen.queryByRole('tab', { name: 'Two' })).toBeNull();
        expect(document.activeElement).toBe(one);
        const close = screen.getByRole('button', { name: '关闭标签页' });
        expect(close.tagName).toBe('BUTTON');
        await fireEvent.click(close);
        expect(screen.queryByRole('tab', { name: 'Three' })).toBeNull();
        expect(one.getAttribute('aria-selected')).toBe('true');
        expect(document.activeElement).toBe(one);
    });

    it('returns focus after the final tab is removed', async () => {
        const onEmpty = mock.fn();
        const view = await render(<TabBar items={[{ key: 1, title: 'Only', children: null }]} onClose={() => {}} onEmpty={onEmpty} />);
        await fireEvent.click(screen.getByRole('button', { name: '关闭标签页' }));
        expect(onEmpty).not.toHaveBeenCalled();
        await view.rerender(<TabBar items={[]} onClose={() => {}} onEmpty={onEmpty} />);
        expect(onEmpty).toHaveBeenCalledTimes(1);
    });

    it('opens the tab context menu from the keyboard', async () => {
        await render(<TabBar items={items} onReload={() => {}} />);
        await fireEvent.keyDown(screen.getByRole('tab', { name: 'One' }), { key: 'F10', shiftKey: true });
        expect(screen.getByRole('menuitem', { name: '重新加载页面' })).toBeTruthy();
    });
});
