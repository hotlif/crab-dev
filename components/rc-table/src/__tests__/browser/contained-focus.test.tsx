import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { ColumnType, Row } from '../../types.js';
// Real published CSS is required: DOM mocks cannot reveal clipped outlines or
// a sticky cell painting over an otherwise correctly measured focus indicator.
import Table from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';
import { vars as tableVars } from '../../token.js';

const rows: Row[] = Array.from({ length: 40 }, (_, id) => ({ id, dataRef: { name: `Row ${id}` } }));
const columns: ColumnType<Row>[] = [
    { name: '$.name', title: 'Name', width: 120, fixed: 'left' },
    { name: 'middle', title: 'Middle', width: 600 },
    { name: 'last', title: 'Last', width: 80, fixed: 'right' },
];
const settle = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function required(root: ParentNode, selector: string): HTMLElement {
    const element = root.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`Missing contained focus fixture: ${selector}`);
    return element;
}

describe('Table contained focus with published CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`${designSystem}/${colorMode}: contains all four edges above selected/sticky cells after scrolling`, async () => {
                const view = await render(<><style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <button data-testid="before-grid">Before grid</button>
                        <div data-testid="tight-clip" style={{ width: 320, height: 240, overflow: 'auto' }}>
                            <Table rows={rows} columns={columns} width={320} height={240}
                                rowSelection={{ type: 'checkbox', selectedRowIds: new Set(rows.map(row => row.id)) }} />
                        </div>
                    </ConfigProvider>
                </>);
                await settle();
                const clip = required(view.container, '[data-testid="tight-clip"]');
                const grid = required(clip, '[role="grid"]');
                const viewport = Array.from(grid.querySelectorAll<HTMLElement>('div')).find(element =>
                    getComputedStyle(element).overflowX === 'hidden' && element.clientWidth === 320
                    && element.scrollWidth > element.clientWidth);
                if (!viewport) throw new Error('Missing real Table virtual viewport');
                const baseline = { width: viewport.scrollWidth, height: viewport.scrollHeight,
                    rowHeight: required(grid, '[data-row-index="0"]').getBoundingClientRect().height };
                await act(() => required(view.container, '[data-testid="before-grid"]').focus());
                await act(() => userEvent.setup().tab());
                expect(document.activeElement).toBe(grid);
                expect(grid.matches(':focus-visible')).toBe(true);
                for (const [deltaX, deltaY] of [[0, 0], [240, 160], [-240, -160]]) {
                    grid.style.setProperty(tableVars['root.outline-width-focus'], deltaX === 0 ? '4px' : '2px');
                    await fireEvent(viewport, new WheelEvent('wheel', { deltaX, deltaY, bubbles: true, cancelable: true }));
                    await settle();
                    const ring = required(grid, '[data-table-focus-ring]');
                    const style = getComputedStyle(ring);
                    const bounds = ring.getBoundingClientRect();
                    const clipBounds = clip.getBoundingClientRect();
                    expect(style.display).toBe('block');
                    expect(style.pointerEvents).toBe('none');
                    expect(style.outlineStyle).toBe('solid');
                    const width = Number.parseFloat(style.outlineWidth);
                    const outset = width + Number.parseFloat(style.outlineOffset);
                    expect(width).toBeGreaterThan(0);
                    expect(outset).toBeLessThanOrEqual(0);
                    expect(bounds.left - outset).toBeGreaterThanOrEqual(clipBounds.left);
                    expect(bounds.top - outset).toBeGreaterThanOrEqual(clipBounds.top);
                    expect(bounds.right + outset).toBeLessThanOrEqual(clipBounds.right);
                    expect(bounds.bottom + outset).toBeLessThanOrEqual(clipBounds.bottom);
                    // Temporarily expose the noninteractive paint layer to hit
                    // testing; test the actual browser stacking at every corner.
                    ring.style.pointerEvents = 'auto';
                    try {
                        for (const x of [bounds.left + 1, bounds.right - 1]) {
                            for (const y of [bounds.top + 1, bounds.bottom - 1]) {
                                expect(document.elementFromPoint(x, y)).toBe(ring);
                            }
                        }
                    } finally { ring.style.removeProperty('pointer-events'); }
                    expect(viewport.scrollWidth).toBe(baseline.width);
                    expect(viewport.scrollHeight).toBe(baseline.height);
                    expect(required(grid, '[data-row-index]').getBoundingClientRect().height).toBe(baseline.rowHeight);
                    expect(required(grid, '[data-row-index]').getAttribute('aria-selected')).toBe('true');
                    expect(clip.scrollLeft).toBe(0);
                    expect(clip.scrollTop).toBe(0);
                }
                await act(() => required(view.container, '[data-testid="before-grid"]').focus());
                expect(getComputedStyle(required(grid, '[data-table-focus-ring]')).display).toBe('none');
            });
        }
    }
});
