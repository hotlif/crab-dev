import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import ConfigProvider, { ConfigBoundary, useConfig } from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import type { TableProps } from '../../table.js';
import type { ColumnType, Row } from '../../types.js';
// Layout-only exception: consume published ESM and its actual compiled CSS,
// prepared by test:browser. Source CSS mocks cannot expose inline baselines.
import Table from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

interface GeometryRow extends Row { dataRef: Record<string, string>; }
const ROW_COUNT = 200;
const ROW_HEIGHT = 28;
const HEADER_HEIGHT = 32;
const HEIGHT = 240;
const TOTAL_HEIGHT = ROW_COUNT * ROW_HEIGHT + HEADER_HEIGHT;
const settleLayout = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function requiredElement<T extends HTMLElement>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing table geometry element: ${selector}`);
    return element;
}

const columns: ColumnType<GeometryRow>[] = Array.from({ length: 20 }, (_, index) => ({
    name: `$.field${index}`,
    title: `Column ${index}`,
    width: 120,
    ...(index === 0 ? { fixed: 'left' as const } : {}),
    ...(index === 19 ? { fixed: 'right' as const } : {}),
}));
const rows: GeometryRow[] = Array.from({ length: ROW_COUNT }, (_, index) => ({
    id: `row-${index}`,
    dataRef: Object.fromEntries(columns.map((_column, columnIndex) => [`field${columnIndex}`, `Record ${index}:${columnIndex}`])),
}));
const tableProps: TableProps<GeometryRow> = { rows, columns, width: 320, height: HEIGHT, density: 'compact' };

it('keeps shortcuts and resize resources inside the table owner Document in a real iframe', async () => {
    const frame = document.createElement('iframe');
    frame.title = 'Independent table document';
    document.body.append(frame);
    const other = frame.contentDocument;
    if (!other?.body) throw new Error('A real same-origin iframe document is required');
    const mainCopy = mock.fn((cells: Array<{ value: unknown }>) => cells);
    const frameCopy = mock.fn((cells: Array<{ value: unknown }>) => cells);
    const resized = mock.fn((column: string, width: number) => ({ column, width }));
    const fields = [{ name: 'value', title: 'Value', width: 100 }];
    const view = await render(<>
        <style>{compiledCss}</style>
        <Table width={180} height={180} columns={fields} rows={[{ id: 'main', dataRef: { value: 'main value' } }]} onCopy={mainCopy} />
        {createPortal(<><style>{compiledCss}</style><Table width={180} height={180} columns={fields} rows={[{ id: 'frame', dataRef: { value: 'frame value' } }]} onCopy={frameCopy} resizable onColumnResize={resized} /></>, other.body)}
    </>);
    const select = async (owner: Document) => {
        const cell = requiredElement<HTMLElement>(owner, '[data-row-index="0"] [data-col-index="0"]');
        await fireEvent(cell, new MouseEvent('mousedown', { bubbles: true, button: 0, buttons: 1 }));
        await fireEvent(owner.body, new MouseEvent('mouseup', { bubbles: true, button: 0 }));
    };
    const copy = (owner: Document) => fireEvent(owner.body, new KeyboardEvent('keydown', { bubbles: true, key: 'c', ctrlKey: true }));
    try {
        await select(document);
        await select(other);
        await copy(document);
        expect(mainCopy).toHaveBeenCalledTimes(1);
        expect(mainCopy.calls.calls[0][0][0].value).toBe('main value');
        expect(frameCopy).not.toHaveBeenCalled();
        await copy(other);
        expect(frameCopy).toHaveBeenCalledTimes(1);
        expect(frameCopy.calls.calls[0][0][0].value).toBe('frame value');
        expect(mainCopy).toHaveBeenCalledTimes(1);
        const mainCursor = document.body.style.cursor, mainSelect = document.body.style.userSelect;
        const frameCursor = other.body.style.cursor, frameSelect = other.body.style.userSelect;
        const handle = requiredElement<HTMLElement>(other, '[role="separator"]');
        const width = requiredElement<HTMLElement>(other, '[role="columnheader"]').getBoundingClientRect().width;
        await fireEvent(handle, new MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 10 }));
        expect(other.body.style.cursor).toBe('col-resize');
        expect(document.body.style.cursor).toBe(mainCursor);
        await fireEvent(other.body, new MouseEvent('mousemove', { bubbles: true, buttons: 1, clientX: 30 }));
        await fireEvent(other.body, new MouseEvent('mouseup', { bubbles: true, button: 0, clientX: 30 }));
        expect(resized).toHaveBeenCalledTimes(1);
        expect(resized.calls.calls[0][1]).toBeCloseTo(width + 20, 1);
        expect(other.body.style.cursor).toBe(frameCursor);
        expect(other.body.style.userSelect).toBe(frameSelect);
        expect(document.body.style.cursor).toBe(mainCursor);
        expect(document.body.style.userSelect).toBe(mainSelect);
    } finally { await view.unmount(); frame.remove(); }
});

describe('Table published virtual row geometry', () => {
    it('keeps inline horizontal spacers inside each row across fixed-column scrolling and the final row', async () => {
        const view = await render(<><style>{compiledCss}</style><Table<GeometryRow> {...tableProps} data-testid="table-layout" /></>);
        await settleLayout();
        const root = requiredElement<HTMLElement>(view.container, '[data-testid="table-layout"]');
        const grid = root.firstElementChild?.firstElementChild;
        if (!(grid instanceof HTMLElement)) throw new Error('Missing actual virtual scroll grid');
        const header = requiredElement<HTMLElement>(grid, '[role="row"]:not([data-row-index])');
        const first = requiredElement<HTMLElement>(grid, '[data-row-index="0"]');
        expect(header.getBoundingClientRect().height).toBe(HEADER_HEIGHT);
        expect(header.getBoundingClientRect().top).toBeCloseTo(grid.getBoundingClientRect().top, 1);
        expect(first.getBoundingClientRect().top).toBeCloseTo(header.getBoundingClientRect().bottom, 1);
        expect(first.getBoundingClientRect().height).toBe(ROW_HEIGHT);
        expect(grid.scrollHeight).toBe(TOTAL_HEIGHT);

        await fireEvent(grid, new WheelEvent('wheel', { deltaX: 800, bubbles: true, cancelable: true }));
        await settleLayout();
        const horizontalFirst = requiredElement<HTMLElement>(grid, '[data-row-index="0"]');
        const spacers = Array.from(horizontalFirst.children).filter((element): element is HTMLElement => element instanceof HTMLElement && !element.hasAttribute('role'));
        expect(spacers).toHaveLength(2);
        for (const spacer of spacers) {
            expect(spacer.getBoundingClientRect().width).toBeGreaterThan(0);
            expect(getComputedStyle(spacer).verticalAlign).toBe('top');
        }
        expect(root.hasAttribute('data-fixed-left')).toBe(true);
        expect(root.hasAttribute('data-fixed-right')).toBe(true);
        expect(horizontalFirst.getBoundingClientRect().height).toBe(ROW_HEIGHT);
        expect(grid.scrollHeight).toBe(TOTAL_HEIGHT);

        await fireEvent(grid, new WheelEvent('wheel', { deltaY: 1_000_000, bubbles: true, cancelable: true }));
        await settleLayout();
        const last = requiredElement<HTMLElement>(grid, '[data-row-index="199"]');
        expect(grid.scrollHeight).toBe(TOTAL_HEIGHT);
        expect(last.getBoundingClientRect().height).toBe(ROW_HEIGHT);
        expect(last.getBoundingClientRect().bottom).toBeCloseTo(grid.getBoundingClientRect().bottom, 1);
        for (const cell of last.querySelectorAll<HTMLElement>('[role="gridcell"]')) {
            expect(cell.getBoundingClientRect().bottom).toBeCloseTo(last.getBoundingClientRect().bottom, 1);
        }
    });
});

// Preserve the existing fixed-column browser regressions in the same real
// published-style fixture, rather than leaving them behind an unregistered path.
const fixedRows: Row[] = Array.from({ length: 30 }, (_, id) => ({ id, dataRef: {} }));
const fixedColumns: ColumnType<Row>[] = [
    { name: 'left-1', title: 'Left 1', width: 80, fixed: 'left' },
    { name: 'left-2', title: 'Left 2', width: 100, fixed: 'left' },
    ...Array.from({ length: 8 }, (_, index): ColumnType<Row> => ({ name: `middle-${index}`, title: `Middle ${index}`, width: 160 })),
    { name: 'right-1', title: 'Right 1', width: 90, fixed: 'right' },
    { name: 'right-2', title: 'Right 2', width: 110, fixed: 'right' },
];

function getFixedCells(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>('[role="columnheader"], [data-row-index="0"] > [role="gridcell"]'))
        .filter(cell => cell.style.left !== '' || cell.style.right !== '');
}

describe('Table fixed columns with real CSS and browser layout', () => {
    it('pins both header and body columns throughout horizontal virtualization', async () => {
        const { container } = await render(<><style>{compiledCss}</style><Table width={600} height={200} rows={fixedRows} columns={fixedColumns} /></>);
        await settleLayout();
        const fixedCells = getFixedCells(container);
        expect(fixedCells).toHaveLength(8);
        const initialLefts = fixedCells.map(cell => cell.getBoundingClientRect().left);
        for (const cell of fixedCells) expect(getComputedStyle(cell).position).toBe('sticky');
        const scrollContainer = Array.from(container.querySelectorAll<HTMLElement>('div'))
            .find(element => getComputedStyle(element).overflowX === 'hidden'
                && element.scrollWidth > element.clientWidth && element.clientWidth === 600);
        if (!scrollContainer) throw new Error('Missing horizontal scroll viewport');
        for (const left of [200, 800, 1060, 0]) {
            await fireEvent(scrollContainer, new WheelEvent('wheel', { deltaX: left - scrollContainer.scrollLeft, bubbles: true, cancelable: true }));
            await settleLayout();
            expect(scrollContainer.scrollLeft).toBe(left);
            const currentCells = getFixedCells(container);
            expect(currentCells).toHaveLength(8);
            currentCells.forEach((cell, index) => {
                expect(getComputedStyle(cell).position).toBe('sticky');
                expect(cell.getBoundingClientRect().left).toBeCloseTo(initialLefts[index], 1);
            });
        }
    });

    it('updates offsets after a width change and restores relative positioning when unfixed', async () => {
        const field = (nextColumns: ColumnType<Row>[]) => <><style>{compiledCss}</style><Table width={600} height={200} rows={fixedRows} columns={nextColumns} /></>;
        const { container, rerender } = await render(field(fixedColumns));
        const resized = fixedColumns.map((column, index) => index === 0 ? { ...column, width: 120 } : column);
        await rerender(field(resized));
        await settleLayout();
        const fixedCells = getFixedCells(container);
        expect(fixedCells).toHaveLength(8);
        expect(fixedCells[1].style.left).toBe('120px');
        expect(fixedCells[5].style.left).toBe('120px');
        const unfixed = resized.map(column => ({ ...column, fixed: undefined }));
        await rerender(field(unfixed));
        await settleLayout();
        expect(getFixedCells(container)).toHaveLength(0);
        for (const cell of container.querySelectorAll('[role="columnheader"], [role="gridcell"]')) {
            expect(getComputedStyle(cell).position).toBe('relative');
        }
    });
});

function horizontalViewport(root: HTMLElement): HTMLElement {
    const viewport = Array.from(root.querySelectorAll<HTMLElement>('div')).find(element =>
        getComputedStyle(element).overflowX === 'hidden'
        && element.scrollWidth > element.clientWidth && element.clientWidth === 600);
    if (!viewport) throw new Error('Missing 600px Table horizontal viewport');
    return viewport;
}

function assertPhysicalPins(root: HTMLElement, viewport: HTMLElement) {
    const bounds = viewport.getBoundingClientRect();
    for (const row of ['[role="row"]:has(> [role="columnheader"])', '[data-row-index="0"]']) {
        const current = requiredElement<HTMLElement>(root, row);
        for (const [index, left, width] of [[1, 0, 80], [2, 80, 100], [11, 400, 90], [12, 490, 110]] as const) {
            const cell = requiredElement<HTMLElement>(current, `[aria-colindex="${index}"]`);
            expect(getComputedStyle(cell).position).toBe('sticky');
            expect(cell.getBoundingClientRect().left).toBeCloseTo(bounds.left + left, 1);
            expect(cell.getBoundingClientRect().width).toBeCloseTo(width, 1);
        }
    }
}

function assertHorizontalThumb(viewport: HTMLElement) {
    const track = viewport.nextElementSibling;
    const thumb = track?.firstElementChild;
    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) throw new Error('Missing actual horizontal scrollbar');
    const bounds = track.getBoundingClientRect();
    const thumbBounds = thumb.getBoundingClientRect();
    const maximum = fixedColumns.reduce((total, column) => total + (column.width ?? 0), 0) - viewport.clientWidth;
    const expected = viewport.scrollLeft / maximum * (bounds.width - thumbBounds.width);
    expect(bounds.width).toBeCloseTo(viewport.clientWidth, 1);
    expect(thumbBounds.left - bounds.left).toBeCloseTo(expected, 1);
}

function assertPhysicalRowWidth(root: HTMLElement, viewport: HTMLElement) {
    const expectedWidth = fixedColumns.reduce((total, column) => total + (column.width ?? 0), 0);
    expect(viewport.scrollWidth).toBe(expectedWidth);
    for (const selector of ['[role="row"]:has(> [role="columnheader"])', '[data-row-index="0"]']) {
        const row = requiredElement<HTMLElement>(root, selector);
        expect(row.getBoundingClientRect().width).toBe(expectedWidth);
        expect(row.scrollWidth).toBe(expectedWidth);
    }
}

function textBounds(element: HTMLElement, text: string): DOMRect {
    const walker = document.createTreeWalker(element, globalThis.NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
        if (node.textContent?.trim() !== text) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        return range.getBoundingClientRect();
    }
    throw new Error(`Missing actual text range: ${text}`);
}

function assertPhysicalTextAlignment(cell: HTMLElement, text: string, side: 'left' | 'right') {
    const bounds = cell.getBoundingClientRect();
    const content = textBounds(cell, text);
    expect(content.width).toBeGreaterThan(0);
    expect(content.left).toBeGreaterThanOrEqual(bounds.left);
    expect(content.right).toBeLessThanOrEqual(bounds.right + 1);
    const leftGap = content.left - bounds.left;
    const rightGap = bounds.right - content.right;
    if (side === 'left') expect(leftGap).toBeLessThan(rightGap);
    else expect(rightGap).toBeLessThan(leftGap);
}

function DirectionProbe({ name, portal = false }: { name: string; portal?: boolean }) {
    const { direction } = useConfig();
    return <>
        <span data-direction-probe={name} data-context-direction={direction}>مرحبا {direction}</span>
        {portal && <Button type="button" data-testid="table-direction-button">Control</Button>}
        {portal && createPortal(
            <ConfigBoundary data-testid="table-direction-portal">
                <span data-portal-context-direction={direction}>مرحبا {direction}</span>
            </ConfigBoundary>,
            document.body,
        )}
    </>;
}

describe('Table physical data axis and RTL content boundaries', () => {
    for (const direction of ['ltr', 'rtl'] as const) {
        it(`keeps both physical pins, the column window and thumb aligned under ${direction}`, async () => {
            const { container } = await render(<>
                <style>{compiledCss}</style>
                <ConfigProvider direction={direction}>
                    <Table aria-label="Physical column axis" width={600} height={200} rows={fixedRows} columns={fixedColumns} />
                </ConfigProvider>
            </>);
            await settleLayout();
            const root = requiredElement<HTMLElement>(container, '[role="grid"][aria-label="Physical column axis"]');
            const viewport = horizontalViewport(root);
            expect(getComputedStyle(root).direction).toBe(direction);
            expect(getComputedStyle(viewport).direction).toBe('ltr');
            expect(viewport.scrollLeft).toBe(0);
            assertPhysicalPins(root, viewport);
            assertHorizontalThumb(viewport);
            assertPhysicalRowWidth(root, viewport);
            const largestMiddleColumn = () => Math.max(...Array.from(root.querySelectorAll<HTMLElement>('[role="columnheader"]'))
                .filter(cell => !cell.style.left && !cell.style.right)
                .map(cell => Number(cell.getAttribute('aria-colindex'))));
            const initialLast = largestMiddleColumn();
            await fireEvent(viewport, new WheelEvent('wheel', { deltaX: 320, bubbles: true, cancelable: true }));
            await settleLayout();
            expect(viewport.scrollLeft).toBe(320);
            expect(largestMiddleColumn()).toBeGreaterThan(initialLast);
            assertPhysicalPins(root, viewport);
            assertHorizontalThumb(viewport);
            assertPhysicalRowWidth(root, viewport);

            const target = requiredElement<HTMLElement>(root, '[role="columnheader"][aria-colindex="7"]');
            let nativeLeft = 0;
            await act(async () => {
                target.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
                nativeLeft = viewport.scrollLeft;
                // Native browser scroll events, without a manually dispatched scroll.
                await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
            });
            expect(nativeLeft).toBeGreaterThan(320);
            expect(viewport.scrollLeft).toBe(nativeLeft);
            assertPhysicalPins(root, viewport);
            assertHorizontalThumb(viewport);
            const alignedHeader = requiredElement<HTMLElement>(root, '[role="columnheader"][aria-colindex="7"]');
            const alignedBody = requiredElement<HTMLElement>(root, '[data-row-index="0"] > [aria-colindex="7"]');
            expect(alignedBody.getBoundingClientRect().left).toBeCloseTo(alignedHeader.getBoundingClientRect().left, 1);
            expect(getComputedStyle(alignedBody).direction).toBe(direction);

            // Both fixed-right columns are always rendered separately. Cover a
            // partially remaining fixed tail, the fully visible tail, and reset
            // to the initial window; no width may appear twice or disappear.
            for (const left of [740, 1060, 0]) {
                await fireEvent(viewport, new WheelEvent('wheel', { deltaX: left - viewport.scrollLeft, bubbles: true, cancelable: true }));
                await settleLayout();
                expect(viewport.scrollLeft).toBe(left);
                if (left === 740) {
                    // The last 110px fixed column is outside this virtual window.
                    const rawTail = getComputedStyle(viewport).getPropertyValue('--crab-rc-virtual-right-padding-width');
                    expect(Number.parseFloat(rawTail)).toBe(110);
                }
                assertPhysicalPins(root, viewport);
                assertHorizontalThumb(viewport);
                assertPhysicalRowWidth(root, viewport);
            }
        });
    }

    it('restores RTL content in filter, summary, grouped and expanded rows while explicit alignment stays physical', async () => {
        const contentRows: GeometryRow[] = [{ id: 'content', dataRef: { left: 'LEFT', middle: 'Middle', right: 'RIGHT' } }];
        const contentColumns: ColumnType<GeometryRow>[] = [
            { name: '$.left', title: 'Left title', width: 200, fixed: 'left', align: 'left', summaryRender: () => <span data-summary="left">Left sum</span> },
            { name: '$.middle', title: 'Middle', width: 200 },
            { name: '$.right', title: 'Right title', width: 200, fixed: 'right', align: 'right', summaryRender: () => <span data-summary="right">Right sum</span> },
        ];
        const field = (table: ReactNode) => <><style>{compiledCss}</style><ConfigProvider direction="rtl">{table}</ConfigProvider></>;
        const view = await render(field(<Table key="filter-summary" aria-label="RTL table content" width={480} height={240}
            rows={contentRows} columns={contentColumns} filterBar showSummary
            renderDefaultFilterEditor={({ column, value, onValueChange }) => <input aria-label={`Filter ${column.name}`} value={value} onChange={event => onValueChange(event.target.value)} />} />));
        await settleLayout();
        const root = requiredElement<HTMLElement>(view.container, '[role="grid"]');
        for (const side of ['left', 'right'] as const) {
            const index = side === 'left' ? 1 : 3;
            const header = requiredElement<HTMLElement>(root, `[role="columnheader"][aria-colindex="${index}"]`);
            const body = requiredElement<HTMLElement>(root, `[data-row-index="0"] > [aria-colindex="${index}"]`);
            const input = requiredElement<HTMLInputElement>(root, `input[aria-label="Filter $.${side}"]`);
            const filterCell = input.closest<HTMLElement>('[role="gridcell"]');
            const summary = requiredElement<HTMLElement>(root, `[data-summary="${side}"]`);
            const summaryCell = summary.closest<HTMLElement>('[role="gridcell"]');
            if (!filterCell || !summaryCell) throw new Error('Missing filter or summary cell');
            for (const content of [header, body, input, summary]) expect(getComputedStyle(content).direction).toBe('rtl');
            expect(filterCell.getBoundingClientRect().left).toBeCloseTo(header.getBoundingClientRect().left, 1);
            expect(summaryCell.getBoundingClientRect().left).toBeCloseTo(header.getBoundingClientRect().left, 1);
            assertPhysicalTextAlignment(header, side === 'left' ? 'Left title' : 'Right title', side);
            assertPhysicalTextAlignment(body, side === 'left' ? 'LEFT' : 'RIGHT', side);
            assertPhysicalTextAlignment(summaryCell, side === 'left' ? 'Left sum' : 'Right sum', side);
        }

        await view.rerender(field(<Table key="grouped" aria-label="RTL grouped content" width={480} height={240}
            rows={contentRows} columns={contentColumns} groupBy={['$.left']} defaultExpandAll
            renderGroupCell={({ isGroupColumn, originalElement }) => isGroupColumn ? <div data-testid="rtl-group-content">{originalElement}</div> : null} />));
        await settleLayout();
        const group = requiredElement<HTMLElement>(view.container, '[data-testid="rtl-group-content"]');
        expect(getComputedStyle(group).direction).toBe('rtl');
        const groupCell = group.closest<HTMLElement>('[role="gridcell"]');
        if (!groupCell) throw new Error('Missing grouped cell');
        expect(getComputedStyle(groupCell).direction).toBe('rtl');
        expect(getComputedStyle(requiredElement(group, '[role="button"]')).direction).toBe('rtl');

        await view.rerender(field(<Table key="expanded" aria-label="RTL expanded content" width={480} height={240}
            rows={contentRows} columns={contentColumns} defaultExpandedRowKeys={new Set(['content'])}
            expandedRowHeight={80} expandedRowRender={() => <div data-testid="rtl-expanded-content">تفاصيل Record</div>} />));
        await settleLayout();
        expect(getComputedStyle(requiredElement(view.container, '[data-testid="rtl-expanded-content"]')).direction).toBe('rtl');
    });

    it('keeps explicit Table dir, nested controls and portal config consistent without changing the parent provider', async () => {
        const contextColumns: ColumnType<Row>[] = [{ name: 'context', title: 'Context', width: 300, render: () => <DirectionProbe name="cell" portal /> }];
        const contextRows: Row[] = [{ id: 'context', dataRef: {} }];
        const field = (parentDirection: 'ltr' | 'rtl', direction: 'ltr' | 'rtl') => <>
            <style>{compiledCss}</style>
            <ConfigProvider direction={parentDirection}>
                <DirectionProbe name="parent" />
                <Table aria-label="Explicit direction" dir={direction} width={300} height={160} rows={contextRows} columns={contextColumns} />
            </ConfigProvider>
        </>;
        const view = await render(field('ltr', 'rtl'));
        for (const [parentDirection, direction] of [['ltr', 'rtl'], ['rtl', 'ltr']] as const) {
            await view.rerender(field(parentDirection, direction));
            await settleLayout();
            const root = requiredElement<HTMLElement>(view.container, '[role="grid"][aria-label="Explicit direction"]');
            const cell = requiredElement<HTMLElement>(root, '[data-direction-probe="cell"]');
            const parent = requiredElement<HTMLElement>(view.container, '[data-direction-probe="parent"]');
            const portal = requiredElement<HTMLElement>(document.body, '[data-testid="table-direction-portal"]');
            const portalValue = requiredElement<HTMLElement>(portal, '[data-portal-context-direction]');
            expect(getComputedStyle(root).direction).toBe(direction);
            expect(getComputedStyle(cell).direction).toBe(direction);
            expect(getComputedStyle(requiredElement(root, '[data-testid="table-direction-button"]')).direction).toBe(direction);
            expect(cell.getAttribute('data-context-direction')).toBe(direction);
            expect(portal.getAttribute('dir')).toBe(direction);
            expect(getComputedStyle(portalValue).direction).toBe(direction);
            expect(portalValue.getAttribute('data-portal-context-direction')).toBe(direction);
            expect(parent.getAttribute('data-context-direction')).toBe(parentDirection);
        }
    });
});
