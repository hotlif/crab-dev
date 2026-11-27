import { createRef } from 'react';
import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
// CSS extraction happens in the library build. Use its matching renderer and
// styles so that gaps, scrolling, and wrapping are checked by the layout engine.
import Flex from '../../esm/index.mjs';
import compiledCss from '../../.cache/browser-css.json';

const styles = <style>{compiledCss}</style>;
const itemKey = (index: number) => `record-${index}`;
const itemText = (index: number) => `Record ${index}`;

function nextFrame() {
    return new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
}

async function settleSize() {
    await act(async () => {
        await nextFrame();
        await nextFrame();
    });
}

function listItem(root: HTMLElement, position: number): HTMLElement {
    const item = root.querySelector<HTMLElement>(`[role="listitem"][aria-posinset="${position}"]`);
    if (!item) throw new Error(`Missing mounted item at position ${position}`);
    return item;
}

describe('Flex layout', () => {
    it('lays out direct children and forwards native div properties and its ref', async () => {
        const ref = createRef<HTMLDivElement>();
        const clicked = mock.fn();
        const view = await render(<>
            {styles}
            <Flex ref={ref} aria-label="Actions" className="toolbar" direction="column" align="center"
                justify="space-between" wrap="wrap" gap="1em" style={{ fontSize: 12 }} onClick={clicked}>
                <button type="button">Start</button><button type="button">Finish</button>
            </Flex>
        </>);
        const root = ref.current;
        if (!root) throw new Error('Missing Flex ref');
        expect(view.container.querySelector('.toolbar')).toBe(root);
        expect(root.getAttribute('aria-label')).toBe('Actions');
        expect(Array.from(root.children, child => child.tagName)).toEqual(['BUTTON', 'BUTTON']);
        const css = getComputedStyle(root);
        expect([css.display, css.flexDirection, css.alignItems, css.justifyContent, css.flexWrap, css.gap])
            .toEqual(['flex', 'column', 'center', 'space-between', 'wrap', '12px']);
        await act(async () => root.click());
        expect(clicked).toHaveBeenCalledTimes(1);
    });

    it('renders a bounded window, reaches the final record, and clamps after the data shrinks', async () => {
        const renderItem = mock.fn(itemText);
        const fixture = (itemCount: number) => <>
            {styles}
            <Flex data-testid="viewport" gap={8} style={{ width: 300, height: 160 }}
                virtual={{ itemCount, itemHeight: 32, overscan: 2, getItemKey: itemKey, renderItem }} />
        </>;
        const view = await render(fixture(1_000_000));
        await settleSize();
        const root = view.container.querySelector<HTMLElement>('[data-testid="viewport"]');
        if (!root) throw new Error('Missing Flex viewport');
        const first = listItem(root, 1);
        expect(first.getAttribute('aria-setsize')).toBe('1000000');
        expect(first.getBoundingClientRect().width).toBe(300);
        expect(first.getBoundingClientRect().height).toBe(32);
        expect(listItem(root, 2).getBoundingClientRect().top - first.getBoundingClientRect().bottom).toBe(8);
        expect(root.querySelectorAll('[role="listitem"]')).toHaveLength(6);
        expect(renderItem.calls.calls.length).toBeLessThan(24);

        const scroller = root.querySelector<HTMLElement>('[data-crab-native-vertical-scroll]');
        if (!scroller) throw new Error('Missing native scrolling surface');
        const css = getComputedStyle(scroller);
        expect([css.overflowX, css.overflowY, css.scrollbarWidth]).toEqual(['hidden', 'auto', 'none']);
        await act(async () => {
            scroller.scrollBy({ top: 400, behavior: 'instant' });
            await nextFrame();
            await nextFrame();
        });
        const middle = listItem(root, 11);
        expect(middle.getBoundingClientRect().top).toBeCloseTo(root.getBoundingClientRect().top, 1);
        await act(async () => {
            middle.dispatchEvent(new WheelEvent('wheel', { deltaY: 40_000_000, bubbles: true, cancelable: true }));
            await nextFrame();
        });
        const last = listItem(root, 1_000_000);
        expect(last.textContent).toBe('Record 999999');
        expect(last.getBoundingClientRect().bottom).toBeCloseTo(root.getBoundingClientRect().bottom, 1);
        expect(root.contains(first)).toBe(false);
        expect(root.querySelectorAll('[role="listitem"]').length).toBeLessThan(10);
        expect(renderItem.calls.calls.length).toBeLessThan(50);

        await view.rerender(fixture(2));
        await settleSize();
        expect(root.querySelectorAll('[role="listitem"]')).toHaveLength(2);
        expect(listItem(root, 1).getBoundingClientRect().top).toBe(root.getBoundingClientRect().top);
        expect(listItem(root, 2).getAttribute('aria-setsize')).toBe('2');
        await view.rerender(fixture(0));
        expect(root.querySelectorAll('[role="listitem"]')).toHaveLength(0);
    });

    it('rewraps fixed-width cards at the exact gap threshold and fits a card into a narrower viewport', async () => {
        const fixture = (width: number) => <>
            {styles}
            <Flex dir="rtl" gap={8} style={{ width, height: 120 }}
                virtual={{ itemCount: 9, itemWidth: 80, itemHeight: 32, overscan: 0, getItemKey: itemKey, renderItem: itemText }} />
        </>;
        const view = await render(fixture(256));
        await settleSize();
        const rect = (position: number) => listItem(view.container, position).getBoundingClientRect();
        expect(rect(1).left - rect(2).right).toBe(8);
        expect(rect(1).top).toBe(rect(3).top);
        expect(rect(4).top - rect(1).bottom).toBe(8);
        expect(rect(3).width).toBe(80);
        await view.rerender(fixture(255));
        await settleSize();
        expect(rect(3).top - rect(1).bottom).toBe(8);
        expect(view.container.querySelectorAll('[role="listitem"]')).toHaveLength(6);
        await view.rerender(fixture(64));
        await settleSize();
        expect(rect(1).width).toBe(64);
        expect(rect(2).top - rect(1).bottom).toBe(8);
        expect(view.container.querySelectorAll('[role="listitem"]')).toHaveLength(3);

        await view.rerender(<>
            {styles}
            <Flex style={{ width: 100, height: 64 }}
                virtual={{ itemCount: 12, itemWidth: 25.001, itemHeight: 32, overscan: 0, getItemKey: itemKey, renderItem: itemText }} />
        </>);
        await settleSize();
        expect(rect(3).top).toBe(rect(1).top);
        expect(rect(4).top).toBe(rect(1).bottom);
        expect(view.container.querySelectorAll('[role="listitem"]')).toHaveLength(6);
    });

    it('handles End and Home on the focused list while leaving descendant keystrokes available', async () => {
        const view = await render(<>
            {styles}
            <Flex aria-label="Records" style={{ width: 300, height: 120 }}
                virtual={{ itemCount: 1000, itemHeight: 40, getItemKey: itemKey, renderItem: index => <button type="button">{index}</button> }} />
        </>);
        await settleSize();
        const root = view.container.querySelector<HTMLElement>('[role="list"]');
        if (!root) throw new Error('Missing Flex list');
        expect(root.tabIndex).toBe(0);
        expect(root.getAttribute('aria-label')).toBe('Records');
        await act(async () => {
            root.focus();
            root.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
        });
        expect(document.activeElement).toBe(root);
        const button = listItem(root, 1000).querySelector('button');
        if (!button) throw new Error('Missing last button');
        const childKey = new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true });
        await act(async () => {
            button.focus();
            button.dispatchEvent(childKey);
            await nextFrame();
        });
        expect(childKey.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(button);
        expect(listItem(root, 1000).contains(button)).toBe(true);
        await act(async () => {
            root.focus();
            root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
        });
        expect(listItem(root, 1).textContent).toBe('0');
    });

    it('preserves focused records by their data keys when visible items change order', async () => {
        const fixture = (ids: string[]) => <>
            {styles}
            <Flex style={{ width: 240, height: 96 }} virtual={{
                itemCount: ids.length, itemHeight: 32, getItemKey: index => ids[index],
                renderItem: index => <input aria-label={ids[index]} defaultValue={ids[index]} />,
            }} />
        </>;
        const view = await render(fixture(['a', 'b', 'c']));
        await settleSize();
        const input = listItem(view.container, 2).querySelector('input');
        if (!input) throw new Error('Missing editable record');
        await act(async () => {
            input.focus();
            input.value = 'draft';
        });
        await view.rerender(fixture(['a', 'c', 'b']));
        expect(listItem(view.container, 3).querySelector('input')).toBe(input);
        expect(document.activeElement).toBe(input);
        expect(input.value).toBe('draft');
    });
});
