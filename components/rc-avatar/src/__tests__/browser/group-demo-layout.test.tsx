import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import GroupDemo from '../../../.cache/group-demo.mjs';
import compiledCss from '../../../.cache/browser-css.json';

// The actual public example is compiled byte-for-byte, including its 16px
// toolbar gap. Wake's browser uses reduced motion; this validates its real
// geometry, not normal-motion timing or a hand-built replacement for the demo.
function required<T extends Element>(scope: ParentNode, selector: string): T {
    const matches = scope.querySelectorAll<T>(selector);
    if (matches.length !== 1) throw new Error(`Expected one demo ${selector}; got ${matches.length}`);
    return matches[0];
}

async function settle() {
    await act(async () => {
        await document.fonts.ready;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

function measure(host: HTMLElement, direction: 'ltr' | 'rtl') {
    const toolbar = required<HTMLElement>(host, '[data-avatar-group-toolbar]');
    expect(toolbar.children.length).toBe(2);
    const first = toolbar.children[0] as HTMLElement;
    const second = toolbar.children[1] as HTMLElement;
    const count = required<HTMLElement>(first, '[role="status"]');
    const last = required<HTMLElement>(first, '[aria-label="E1"]');
    const adjacent = required<HTMLElement>(second, '[aria-label="K"]');
    const bounds = count.getBoundingClientRect();
    const a = first.getBoundingClientRect(), b = second.getBoundingClientRect();
    const avatar = last.getBoundingClientRect(), neighbor = adjacent.getBoundingClientRect();
    expect(count.textContent).toBe('+1');
    expect(getComputedStyle(toolbar).gap).toBe('16px');
    expect(getComputedStyle(first).direction).toBe(direction);
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.left).toBeGreaterThanOrEqual(a.left - 0.1);
    expect(bounds.right).toBeLessThanOrEqual(a.right + 0.1);
    expect(bounds.top + bounds.height / 2).toBeCloseTo(avatar.top, 1);
    expect(direction === 'ltr' ? bounds.left : bounds.right).toBeCloseTo(direction === 'ltr' ? avatar.right : avatar.left, 1);
    expect(direction === 'ltr' ? b.left - a.right : a.left - b.right).toBeCloseTo(16, 1);
    expect(bounds.right <= neighbor.left || bounds.left >= neighbor.right).toBe(true);
    expect(avatar.width).toBe(24);
    expect(neighbor.width).toBe(40);
    expect(getComputedStyle(count.parentElement!.parentElement!).boxShadow).toBe('none');
    expect(getComputedStyle(last).boxShadow).toContain('0px 0px 0px 2px');
    const range = document.createRange();
    range.selectNodeContents(count);
    const text = range.getBoundingClientRect();
    expect(text.left).toBeGreaterThanOrEqual(bounds.left);
    expect(text.right).toBeLessThanOrEqual(bounds.right);
    return { first, second, count, last };
}

describe('AvatarGroup actual public example layout', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`reserves the real small count beside the large group (${designSystem}/${colorMode})`, async () => {
                const fixture = (direction: 'ltr' | 'rtl') => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                        <div style={{ width: 640, padding: 32 }}><GroupDemo /></div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture('ltr'));
                await settle();
                const initial = measure(view.container, 'ltr');
                const sameNodes = (current: ReturnType<typeof measure>) => {
                    for (const name of ['first', 'second', 'count', 'last'] as const) expect(current[name]).toBe(initial[name]);
                };
                for (const direction of ['rtl', 'ltr'] as const) {
                    await view.rerender(fixture(direction));
                    await settle();
                    const current = measure(view.container, direction);
                    sameNodes(current);
                    const toggle = required<HTMLButtonElement>(view.container, 'button[aria-expanded]');
                    await fireEvent.click(toggle);
                    await settle();
                    expect(toggle.getAttribute('aria-expanded')).toBe('true');
                    expect(toggle.textContent).toBe('收起');
                    sameNodes(measure(view.container, direction));
                    await fireEvent.click(toggle);
                    await settle();
                    expect(toggle.getAttribute('aria-expanded')).toBe('false');
                    sameNodes(measure(view.container, direction));
                }
            });
        }
    }
});
