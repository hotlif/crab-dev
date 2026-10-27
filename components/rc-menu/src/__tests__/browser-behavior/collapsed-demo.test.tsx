import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import CollapsedDemo from '../../../docs/demos/collapsed.demo.js';

// Import the runnable example itself, including its public Menu/Button imports.
// This root mocks CSS extraction only; these tests cover actual state, native
// browser focus and Floating UI handlers. Published paint and physical pointer
// placement remain in the CSS suite and the docs visual matrix.
function item(root: ParentNode, title: string, collapsed = false): HTMLElement {
    const candidates = [...root.querySelectorAll<HTMLElement>('[data-menu-item]')];
    const result = candidates.find(node => collapsed
        ? node.getAttribute('role') === 'menuitem' && node.getAttribute('aria-label') === title
        : node.getAttribute('role') === 'button' && node.textContent === title);
    if (!result) throw new Error(`Missing actual ${collapsed ? 'collapsed' : 'inline'} item: ${title}`);
    return result;
}

function toggle(root: ParentNode, title: string): HTMLButtonElement {
    const result = [...root.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent === title);
    if (!result) throw new Error(`Missing actual demo toggle: ${title}`);
    return result;
}

function popup(trigger: HTMLElement): HTMLElement | null {
    const id = trigger.getAttribute('aria-controls');
    return id ? trigger.ownerDocument.getElementById(id) : null;
}

async function until(condition: () => boolean): Promise<void> {
    const deadline = performance.now() + 2000;
    // Wait for the real 300 ms mode swap / Floating UI delay by observing its
    // resulting DOM, rather than assuming a fixed sleep means it has completed.
    while (!condition()) {
        if (performance.now() >= deadline) throw new Error('Actual collapsed demo state did not settle');
        await act(async () => { await new Promise<void>(resolve => setTimeout(resolve, 20)); });
    }
}

async function collapse(root: ParentNode): Promise<void> {
    await fireEvent.click(toggle(root, '收起菜单'));
    await until(() => root.querySelectorAll('[role="menuitem"][aria-label]').length === 4);
    expect(toggle(root, '展开菜单').getAttribute('aria-pressed')).toBe('true');
    for (const title of ['人员信息', '系统管理']) {
        const trigger = item(root, title, true);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(popup(trigger)).toBe(null);
    }
}

async function expand(root: ParentNode): Promise<void> {
    await fireEvent.click(toggle(root, '展开菜单'));
    await until(() => root.querySelector('[role="menuitem"][aria-label]') === null);
    expect(toggle(root, '收起菜单').getAttribute('aria-pressed')).toBe('false');
}

async function openWithKeyboard(trigger: HTMLElement): Promise<HTMLElement> {
    await act(() => { trigger.focus(); });
    await fireEvent.keyDown(trigger, { key: 'Enter' });
    await until(() => trigger.getAttribute('aria-expanded') === 'true' && popup(trigger) !== null);
    return popup(trigger)!;
}

async function settleNativeResizeObserverQueue(): Promise<void> {
    // A native ResizeObserver delivery can queue Floating UI's one-shot
    // reobserve frame after the current rAF phase. Allow that next rendering
    // turn and its task boundary to finish naturally; do not cancel frames or
    // replace the observer/Floating UI, and leave Wake's leak detector enabled.
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
            setTimeout(resolve, 0);
        })));
    });
}

async function unmountDemo(view: Awaited<ReturnType<typeof render>>, closedPopups: HTMLElement[]): Promise<void> {
    await settleNativeResizeObserverQueue();
    // Dismissal/mode change must already own removal; unmount must not be what
    // makes these assertions pass.
    for (const element of closedPopups) expect(element.isConnected).toBe(false);
    const items = [...view.container.querySelectorAll('[data-menu-item]')];
    expect(items.length).toBeGreaterThan(0);
    await view.unmount();
    expect(view.container.childElementCount).toBe(0);
    for (const element of items) expect(element.isConnected).toBe(false);
    await settleNativeResizeObserverQueue();
}

describe('actual collapsed Menu example state ownership', () => {
    it('starts collapsed popups closed and preserves inline memory after hover, Escape and outside dismissal', async () => {
        const view = await render(<CollapsedDemo />);
        const root = view.container;
        expect(item(root, '人员信息').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '系统管理').getAttribute('aria-expanded')).toBe('false');
        expect(item(root, '用户调整').getAttribute('aria-current')).toBe('page');

        await collapse(root);
        const system = item(root, '系统管理', true);
        const reference = system.closest('li')!;
        await fireEvent(reference, new MouseEvent('mouseenter'));
        await until(() => system.getAttribute('aria-expanded') === 'true' && popup(system) !== null);
        const hoveredPopup = popup(system)!;
        expect(popup(system)?.textContent).toContain('菜单维护');
        expect(item(root, '人员信息', true).getAttribute('aria-expanded')).toBe('false');

        const leaf = item(popup(system)!, '菜单维护');
        await act(() => { leaf.focus(); });
        await fireEvent.keyDown(leaf, { key: 'Escape' });
        await until(() => popup(system) === null);
        expect(system.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(system);

        const keyboardPopup = await openWithKeyboard(system);
        await fireEvent(document.body, new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
        await until(() => popup(system) === null);
        expect(system.getAttribute('aria-expanded')).toBe('false');
        await expand(root);
        expect(item(root, '人员信息').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '系统管理').getAttribute('aria-expanded')).toBe('false');
        await unmountDemo(view, [hoveredPopup, keyboardPopup]);
    });

    it('restores changed inline branches after popup selection and clears live popups on both mode transitions', async () => {
        const view = await render(<CollapsedDemo />);
        const root = view.container;
        await fireEvent.click(item(root, '系统管理'));
        await fireEvent.click(item(root, '菜单维护'));
        expect(item(root, '人员信息').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '系统管理').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '菜单维护').getAttribute('aria-current')).toBe('page');

        await collapse(root);
        const people = item(root, '人员信息', true);
        const peoplePopup = await openWithKeyboard(people);
        await fireEvent.click(item(peoplePopup, '用户删除'));
        await until(() => popup(people) === null);
        expect(people.getAttribute('aria-expanded')).toBe('false');
        await expand(root);
        expect(item(root, '人员信息').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '系统管理').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '菜单维护').getAttribute('aria-current')).toBe(null);
        // The popup's actual leaf selection survives returning to inline mode.
        expect(item(root, '用户删除').getAttribute('aria-current')).toBe('page');
        await collapse(root);
        await expand(root);
        expect(item(root, '人员信息').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '系统管理').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '用户删除').getAttribute('aria-current')).toBe('page');

        await collapse(root);
        const systemPopup = await openWithKeyboard(item(root, '系统管理', true));
        expect(systemPopup.isConnected).toBe(true);
        await expand(root);
        expect(systemPopup.isConnected).toBe(false);
        expect(item(root, '人员信息').getAttribute('aria-expanded')).toBe('true');
        expect(item(root, '系统管理').getAttribute('aria-expanded')).toBe('true');
        await collapse(root);
        await unmountDemo(view, [peoplePopup, systemPopup]);
    });
});
