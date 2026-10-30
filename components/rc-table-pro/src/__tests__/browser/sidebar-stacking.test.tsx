import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render, userEvent, waitFor } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import ActualSidebarDemo from '../../../.cache/sidebar-demo.mjs';
import publishedCss from '../../../.cache/browser-css.json';

const settle = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function required<T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): T {
    const node = root.querySelector<T>(selector);
    if (!node) throw new Error(`Missing actual sidebar element: ${selector}`);
    return node;
}

function getPanel(root: ParentNode): HTMLElement {
    const search = required<HTMLInputElement>(root, 'input[aria-label="搜索列"]');
    for (let node = search.parentElement; node; node = node.parentElement) {
        if (node.querySelector('[role="tree"]') && !node.querySelector('[role="grid"]')) return node;
    }
    throw new Error('Actual search/tree sidebar not found');
}

function containsHit(panel: HTMLElement, x: number, y: number) {
    expect(panel.contains(document.elementFromPoint(x, y))).toBe(true);
}

describe('TablePro published sidebar paint and pointer containment', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                for (const width of [320, 768]) {
                    it(`${designSystem}/${colorMode}/${direction}/${width}: sidebar stays above fixed edges, focus and scrollbars`, async () => {
                        const view = await render(<><style>{publishedCss}</style>
                            <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                                <button data-testid="before-table">Before table</button>
                                <div data-testid="stacking-fixture" style={{ width }}><ActualSidebarDemo /></div>
                            </ConfigProvider>
                        </>);
                        try {
                            const stage = required(view.container, '[data-testid="stacking-fixture"]');
                            // The real demo resolves both loaders asynchronously. Keep
                            // their updates inside act while waiting for rendered data.
                            const started = performance.now();
                            while (stage.querySelectorAll('[role="columnheader"]').length <= 1 || !stage.querySelector('[data-row-index="0"]')) {
                                if (performance.now() - started > 5000) throw new Error('Actual sidebar data did not load');
                                await settle();
                            }
                            await settle();
                            const grid = required(stage, '[role="grid"]');
                            const panel = getPanel(stage);
                            const bounds = panel.getBoundingClientRect();
                            const baseline = { panel: [bounds.width, bounds.height], grid: [grid.clientWidth, grid.clientHeight], row: required(grid, '[data-row-index="0"]').getBoundingClientRect().height };
                            const user = userEvent.setup();
                            await act(() => required(view.container, '[data-testid="before-table"]').focus());
                            await act(() => user.tab());
                            expect(document.activeElement).toBe(grid);
                            expect(grid.matches(':focus-visible')).toBe(true);
                            const ring = required(grid, '[data-table-focus-ring]');
                            expect(getComputedStyle(ring).display).toBe('block');

                            // Only make existing noninteractive paint hit-testable,
                            // as in Table's contained-focus regression. No paint,
                            // geometry, motion, clipping or z-index is changed.
                            const probe = document.createElement('style');
                            probe.textContent = '[data-testid="stacking-fixture"] [role="grid"]::before { pointer-events: auto; }';
                            stage.append(probe);
                            ring.style.pointerEvents = 'auto';
                            try {
                                if (width === 320) {
                                    const pseudo = getComputedStyle(grid, '::before');
                                    expect(pseudo.content).not.toBe('none');
                                    const rect = grid.getBoundingClientRect();
                                    const x = rect.left + Number.parseFloat(pseudo.left) + Number.parseFloat(pseudo.width) / 2;
                                    expect(x).toBeGreaterThan(bounds.left);
                                    expect(x).toBeLessThan(bounds.right);
                                    for (const y of [bounds.top + 20, bounds.top + 140, bounds.bottom - 20]) containsHit(panel, x, y);
                                    const ringBounds = ring.getBoundingClientRect();
                                    const ringX = direction === 'ltr' ? ringBounds.right - 1 : ringBounds.left + 1;
                                    containsHit(panel, ringX, bounds.top + 140);
                                    // Original Virtual scrollbar hit testing is
                                    // unchanged: its z200 cannot escape the table.
                                    const tracks = Array.from(grid.querySelectorAll<HTMLElement>('div')).filter(node => getComputedStyle(node).zIndex === '200');
                                    expect(tracks.length).toBeGreaterThan(0);
                                    let overlappingTracks = 0;
                                    for (const track of tracks) {
                                        const r = track.getBoundingClientRect();
                                        const left = Math.max(bounds.left + 1, r.left + 1);
                                        const right = Math.min(bounds.right - 1, r.right - 1);
                                        const top = Math.max(bounds.top + 1, r.top + 1);
                                        const bottom = Math.min(bounds.bottom - 1, r.bottom - 1);
                                        if (left < right && top < bottom) { containsHit(panel, (left + right) / 2, (top + bottom) / 2); overlappingTracks++; }
                                    }
                                    expect(overlappingTracks).toBeGreaterThan(0);
                                }
                            } finally { ring.style.removeProperty('pointer-events'); probe.remove(); }

                            const search = required<HTMLInputElement>(panel, 'input[aria-label="搜索列"]');
                            await act(() => user.click(search));
                            expect(document.activeElement).toBe(search);
                            await act(() => user.keyboard('姓名'));
                            await waitFor(() => expect(search.value).toBe('姓名'));
                            await settle();
                            const tree = required(panel, '[role="tree"]');
                            const item = Array.from(tree.querySelectorAll<HTMLElement>('[role="treeitem"]')).find(node => node.textContent?.includes('姓名'));
                            if (!item) throw new Error('Search did not retain the actual Name column item');
                            const input = required<HTMLInputElement>(item, 'input[type="checkbox"]');
                            const label = input.closest('label');
                            if (!label) throw new Error('Actual column checkbox label missing');
                            expect(input.checked).toBe(true);
                            await act(() => user.click(label));
                            await waitFor(() => expect(input.checked).toBe(false));
                            expect(Array.from(grid.querySelectorAll('[role="columnheader"]')).some(node => node.textContent === '姓名')).toBe(false);
                            await act(() => user.click(label));
                            await waitFor(() => expect(input.checked).toBe(true));
                            expect(Array.from(grid.querySelectorAll('[role="columnheader"]')).some(node => node.textContent === '姓名')).toBe(true);

                            const toggle = required(stage, 'button[aria-label="列设置"]');
                            await act(() => user.click(toggle));
                            await waitFor(() => expect(stage.querySelector('input[aria-label="搜索列"]')).toBeNull());
                            await act(() => user.click(toggle));
                            await waitFor(() => expect(stage.querySelector('input[aria-label="搜索列"]')).not.toBeNull());
                            await settle();
                            const reopened = getPanel(stage).getBoundingClientRect();
                            expect([reopened.width, reopened.height]).toEqual(baseline.panel);
                            expect([grid.clientWidth, grid.clientHeight]).toEqual(baseline.grid);
                            expect(required(grid, '[data-row-index="0"]').getBoundingClientRect().height).toBe(baseline.row);
                        } finally { await view.unmount(); }
                    });
                }
            }
        }
    }
});
