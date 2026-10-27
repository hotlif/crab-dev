import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import type { MenuOpenKeysChangeDetails } from '../../menu.js';

let Menu: (typeof import('../../menu.js'))['default'];
let ItemType: (typeof import('../../type.js'))['ItemType'];
beforeAll(async () => {
    Menu = (await mock.import<typeof import('../../menu.js')>('../../menu.js')).default;
    ItemType = (await mock.import<typeof import('../../type.js')>('../../type.js')).ItemType;
});

// Cross-document constructors, computed direction and focus need a real browser.
// The normal suite keeps the state and event contracts in the lightweight DOM.
describe('Menu across actual document realms', () => {
    it('moves horizontal group indentation to the logical start when direction changes', async () => {
        const items = [{ type: ItemType.ItemGroup, key: 'group', title: 'Group heading', children: [
            { type: ItemType.Item, key: 'child', title: 'Group child' },
        ] }];
        const result = await render(<Menu mode="horizontal" dir="ltr" items={items} />);
        const title = [...result.container.querySelectorAll('span')].find(node => node.textContent === 'Group heading')!;
        const header = title.parentElement!;
        const indent = getComputedStyle(header).paddingLeft;
        expect(Number.parseFloat(indent)).toBeGreaterThan(0);
        expect(getComputedStyle(header).paddingRight).toBe('0px');
        await result.rerender(<Menu mode="horizontal" dir="rtl" items={items} />);
        expect(getComputedStyle(header).paddingRight).toBe(indent);
        expect(getComputedStyle(header).paddingLeft).toBe('0px');
    });

    it('uses the target document realm for horizontal and collapsed keyboard navigation', async () => {
        const frame = document.createElement('iframe');
        document.body.append(frame);
        const owner = frame.contentDocument!;
        const view = owner.defaultView!;
        const container = owner.createElement('div');
        owner.body.append(container);
        try {
            for (const mode of ['horizontal', 'inline'] as const) {
                const changes: MenuOpenKeysChangeDetails[] = [];
                const result = await render(<Menu mode={mode} inlineCollapsed={mode === 'inline'} dir="rtl" onOpenKeysChange={(_keys, details) => { changes.push(details); }} items={[
                    { type: ItemType.Item, key: 'first', title: 'Foreign first' },
                    { type: ItemType.Item, key: 'second', title: 'Foreign second', children: [{ type: ItemType.Item, key: 'child', title: 'Foreign child' }] },
                ]} />, { container });
                const [first, second] = [...container.querySelectorAll<HTMLElement>('[data-menu-item]')];
                expect(first instanceof HTMLElement).toBe(false);
                first.focus();
                await fireEvent(first, new view.KeyboardEvent('keydown', { key: mode === 'horizontal' ? 'ArrowLeft' : 'ArrowDown', bubbles: true, cancelable: true }));
                expect(owner.activeElement).toBe(second);
                const event = new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
                await fireEvent(second, event);
                const actual = changes[0].event;
                expect(actual && 'nativeEvent' in actual ? actual.nativeEvent : actual).toBe(event);
                expect(second.getAttribute('aria-expanded')).toBe('true');
                await fireEvent(second, new view.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
                expect(second.getAttribute('aria-expanded')).toBe('false');
                // Settle the native ResizeObserver delivery after actual popup dismissal.
                await act(async () => { await new Promise<void>(resolve => view.requestAnimationFrame(() => resolve())); });
                await result.unmount();
            }
        } finally { frame.remove(); }
    });

});
