import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { ColumnType, Row } from '../../types.js';
// Use published Table and actual extracted Theme/Button CSS. Recreated paint
// rules or DOM css() mocks cannot catch the former text-button state collision.
import Table from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

interface EditingRow extends Row { dataRef: { name: string }; }
const rows: EditingRow[] = Array.from({ length: 20 }, (_, index) => ({ id: index + 1, dataRef: { name: `Record ${index + 1}` } }));
const columns: ColumnType<EditingRow>[] = [
    { name: '$.name', title: 'Name', fixed: 'left', width: 160, editRender: ({ row, editorValue, onEditorValueChange }) => (
        <input aria-label="Edit record name" value={String(editorValue ?? row.dataRef.name)} onChange={event => onEditorValueChange(event.target.value)} />
    ) },
    ...Array.from({ length: 7 }, (_, index) => ({ name: `extra-${index}`, title: `Column ${index}`, width: 160 })),
    { name: 'status', title: 'Status', fixed: 'right', width: 100 },
];

const settleVisual = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    for (const animation of document.getAnimations()) {
        if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
    }
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
});

function required<T extends HTMLElement>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing row-edit regression target: ${selector}`);
    return element;
}

type Pixel = readonly [number, number, number];
function paintColors(colors: string[]): Pixel {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas color conversion is unavailable');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, 1, 1);
    for (const color of colors) {
        expect(CSS.supports('color', color)).toBe(true);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
    }
    const pixel = context.getImageData(0, 0, 1, 1).data;
    return [pixel[0], pixel[1], pixel[2]];
}

function backgroundLayers(element: HTMLElement): string[] {
    const layers = [];
    for (let current: HTMLElement | null = element; current; current = current.parentElement) layers.unshift(getComputedStyle(current).backgroundColor);
    return layers;
}

function luminance(pixel: Pixel) {
    const linear = pixel.map(value => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first: Pixel, second: Pixel) {
    const values = [luminance(first), luminance(second)].sort((a, b) => a - b);
    return (values[1] + 0.05) / (values[0] + 0.05);
}

function assertReadable(button: HTMLButtonElement) {
    const layers = backgroundLayers(button);
    const label = required<HTMLElement>(button, 'span:not([aria-hidden])');
    const background = paintColors(layers);
    const foreground = paintColors([...layers, getComputedStyle(label).color]);
    // These are normal-size labels. The test measures computed, composited
    // colors rather than expecting a particular theme token or CSS class.
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    expect(button.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(button.getBoundingClientRect().height).toBeGreaterThan(0);
}

function assertFocusVisible(button: HTMLButtonElement, grid: HTMLElement) {
    const style = getComputedStyle(button);
    expect(document.activeElement).toBe(button);
    expect(button.matches(':focus-visible')).toBe(true);
    expect(style.outlineStyle).toBe('solid');
    expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0);
    const surrounding = backgroundLayers(button.parentElement!);
    expect(contrast(paintColors([...surrounding, style.outlineColor]), paintColors(surrounding))).toBeGreaterThanOrEqual(3);
    const bounds = button.getBoundingClientRect();
    const viewport = grid.getBoundingClientRect();
    const outset = Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
    expect(bounds.left - outset).toBeGreaterThanOrEqual(viewport.left - 1);
    expect(bounds.right + outset).toBeLessThanOrEqual(viewport.right + 1);
    expect(bounds.bottom + outset).toBeLessThanOrEqual(viewport.bottom + 1);
    assertReadable(button);
}

async function activateAndReadFeedback(button: HTMLButtonElement) {
    // Exercise the real React key handler's propagation boundary, then the
    // native DOM click(detail=0) path used for semantic activation feedback.
    // This is not a physical held press or proof of a keyboard default action.
    await fireEvent(button, new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await act(() => button.click());
    expect(button.hasAttribute('data-press-feedback')).toBe(true);
    // Read during the production 225ms feedback window. Finishing current CSS
    // transitions does not extend that timer or manufacture the state attribute.
    await act(() => {
        for (const animation of button.getAnimations({ subtree: true })) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
    });
    expect(button.hasAttribute('data-press-feedback')).toBe(true);
    assertReadable(button);
    await fireEvent(button, new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
}

async function assertObservedHover(button: HTMLButtonElement, actions: HTMLElement, grid: HTMLElement, user: ReturnType<typeof userEvent.setup>) {
    const document = button.ownerDocument;
    const events: { type: string; trusted: boolean; x: number; y: number; target: string }[] = [];
    const name = (target: EventTarget | null): string => {
        const control = target instanceof Element ? target.closest('button') : null;
        if (control?.textContent === '确定') return 'confirm';
        if (control?.textContent === '取消') return 'cancel';
        return target instanceof Element ? target.tagName : 'other';
    };
    const layers = (hit: Element | null) => {
        const chain = [];
        for (let element = hit; element; element = element.parentElement) {
            const style = getComputedStyle(element);
            chain.push({ tag: element.tagName, role: element.getAttribute('role'), column: element.getAttribute('aria-colindex'),
                row: element.getAttribute('data-row-index'), editing: element.getAttribute('data-table-row-editing'),
                position: style.position, zIndex: style.zIndex, rect: element.getBoundingClientRect().toJSON() });
            if (element === grid) break;
        }
        return chain;
    };
    const read = () => {
        const scroll = Array.from(grid.querySelectorAll<HTMLElement>('div')).find(element => getComputedStyle(element).overflowX === 'hidden' && element.scrollWidth > element.clientWidth && element.clientWidth === 600);
        const point = events.at(-1);
        return {
            button: button.getBoundingClientRect().toJSON(), actions: actions.getBoundingClientRect().toJSON(), grid: grid.getBoundingClientRect().toJSON(),
            nativeScroll: scroll ? { rect: scroll.getBoundingClientRect().toJSON(), left: scroll.scrollLeft, top: scroll.scrollTop } : null,
            hover: button.matches(':hover'), active: button.matches(':active'),
            hitAtLastPointer: point ? name(document.elementFromPoint(point.x, point.y)) : null,
            hitLayerChain: point ? layers(document.elementFromPoint(point.x, point.y)) : [],
            buttonLayerChain: layers(button),
        };
    };
    const listen = (event: Event) => {
        if (event instanceof MouseEvent && events.length < 40) events.push({ type: event.type, trusted: event.isTrusted, x: event.clientX, y: event.clientY, target: name(event.target) });
    };
    const types = ['pointerover', 'pointermove', 'mouseover', 'mousemove'];
    for (const type of types) document.addEventListener(type, listen, true);
    const before = read();
    let afterInput: ReturnType<typeof read> | undefined;
    try {
        await act(() => user.hover(button));
        afterInput = read();
        await settleVisual();
        const afterSettle = read();
        if (!afterSettle.hover) throw new Error('Actual :hover was not retained');
        assertReadable(button);
    } catch (error) {
        throw new Error(`Table hover input/geometry diagnostic: ${JSON.stringify({
            target: name(button), before, afterInput, afterSettle: read(), events,
            cause: error instanceof Error ? error.message : String(error),
        })}`);
    } finally {
        for (const type of types) document.removeEventListener(type, listen, true);
    }
}

function readFixedColumnGeometry(grid: HTMLElement) {
    const describe = (element: HTMLElement) => {
        const style = getComputedStyle(element);
        return { tag: element.tagName, role: element.getAttribute('role'),
            column: element.getAttribute('aria-colindex'), row: element.getAttribute('data-row-index'),
            direction: style.direction, position: style.position, zIndex: style.zIndex,
            left: style.left, right: style.right, rect: element.getBoundingClientRect().toJSON() };
    };
    const scroll = Array.from(grid.querySelectorAll<HTMLElement>('div')).find(element => getComputedStyle(element).overflowX === 'hidden' && element.scrollWidth > element.clientWidth && element.clientWidth === 600);
    return {
        grid: describe(grid),
        scroll: scroll ? { ...describe(scroll), scrollLeft: scroll.scrollLeft, scrollTop: scroll.scrollTop,
            scrollWidth: scroll.scrollWidth, clientWidth: scroll.clientWidth,
            leftPadding: getComputedStyle(scroll).getPropertyValue('--crab-rc-virtual-left-padding-width'),
            rightPadding: getComputedStyle(scroll).getPropertyValue('--crab-rc-virtual-right-padding-width') } : null,
        headerCells: [...grid.querySelectorAll<HTMLElement>('[role="columnheader"]')].map(describe),
        bodyRows: [0, 1].map(index => {
            const row = required<HTMLElement>(grid, `[role="row"][data-row-index="${index}"]`);
            return { ...describe(row), cells: [...row.querySelectorAll<HTMLElement>('[role="gridcell"]')].map(describe) };
        }),
        scrollbars: scroll?.parentElement ? [...scroll.parentElement.children]
            .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== scroll)
            .map(element => ({ ...describe(element), children: [...element.children]
                .filter((child): child is HTMLElement => child instanceof HTMLElement).map(describe) })) : [],
    };
}

function assertActionAboveAdjacentFixedCells(button: HTMLButtonElement, grid: HTMLElement, beforeInput?: ReturnType<typeof readFixedColumnGeometry>) {
    const bounds = button.getBoundingClientRect();
    const viewport = grid.getBoundingClientRect();
    const nextRow = required<HTMLElement>(grid, '[role="row"][data-row-index="1"]');
    const fixedCells = [...nextRow.querySelectorAll<HTMLElement>('[role="gridcell"]')]
        .filter(cell => getComputedStyle(cell).position === 'sticky');
    const overlap = fixedCells.map(cell => {
        const rect = cell.getBoundingClientRect();
        return {
            left: Math.max(bounds.left, rect.left, viewport.left),
            right: Math.min(bounds.right, rect.right, viewport.right),
            top: Math.max(bounds.top, rect.top, viewport.top),
            bottom: Math.min(bounds.bottom, rect.bottom, viewport.bottom),
        };
    }).find(rect => rect.right > rect.left && rect.bottom > rect.top);
    // Prove this fixture exercises the original overlap, not just an isolated
    // button. Its center can be outside a real partial overlap, so choose an
    // interior point shared by the visible button and competing fixed cell.
    if (!overlap) throw new Error(`Table fixed-column overlap diagnostic: ${JSON.stringify({
        point: null, button: bounds.toJSON(), beforeInput, afterInput: readFixedColumnGeometry(grid),
        fixture: { left: { index: 0, width: 160 }, right: { index: 8, width: 100 }, fixedContract: 'physical left/right' },
    })}`);
    const point = { x: (overlap.left + overlap.right) / 2, y: (overlap.top + overlap.bottom) / 2 };
    expect(point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom).toBe(true);
    const coveredFixedCells = fixedCells.filter(cell => {
        const rect = cell.getBoundingClientRect();
        return point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;
    });
    expect(coveredFixedCells.length).toBeGreaterThan(0);
    const hit = button.ownerDocument.elementFromPoint(point.x, point.y);
    expect(hit === button || (hit !== null && button.contains(hit))).toBe(true);
}

function assertEditingRowColumnGeometry(grid: HTMLElement) {
    const header = required<HTMLElement>(grid, '[role="row"]:has(> [role="columnheader"])');
    const row = required<HTMLElement>(grid, '[data-table-row-editing]');
    const expectedWidth = columns.reduce((total, column) => total + (column.width ?? 0), 0);
    // The RTL anchor's negative margin must not shrink the explicit row or its
    // physical cells/spacers. All visible cells still share header coordinates.
    expect(row.getBoundingClientRect().width).toBe(expectedWidth);
    expect(header.getBoundingClientRect().width).toBe(expectedWidth);
    expect(row.scrollWidth).toBe(expectedWidth);
    for (const cell of row.querySelectorAll<HTMLElement>('[role="gridcell"]')) {
        const index = cell.getAttribute('aria-colindex');
        const corresponding = required<HTMLElement>(header, `[role="columnheader"][aria-colindex="${index}"]`);
        expect(cell.getBoundingClientRect().left).toBeCloseTo(corresponding.getBoundingClientRect().left, 1);
        expect(cell.getBoundingClientRect().width).toBeCloseTo(corresponding.getBoundingClientRect().width, 1);
    }
    const spacerWidths = (element: HTMLElement) => [...element.children]
        .filter((child): child is HTMLElement => child instanceof HTMLElement
            && !child.hasAttribute('role') && getComputedStyle(child).position === 'static')
        .map(child => child.getBoundingClientRect().width);
    expect(spacerWidths(row)).toEqual(spacerWidths(header));
}

describe('Table row-edit action states with actual CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                it(`keeps action paint, observed focus and semantic activation feedback readable (${designSystem}/${colorMode}/${direction})`, async () => {
                    const commit = mock.fn();
                    const cancel = mock.fn();
                    const gridKeyDown = mock.fn();
                    const rowClick = mock.fn();
                    const view = await render(<>
                        <style>{compiledCss}</style>
                        <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                            <div style={{ padding: 16 }}>
                                <Table aria-label="Editable data" width={600} height={240} rows={rows} columns={columns}
                                    size="small" editType="row" editingRowId={1} onRowCommit={commit} onRowCancel={cancel}
                                    onKeyDown={gridKeyDown} onRowClick={rowClick} />
                            </div>
                        </ConfigProvider>
                    </>);
                    await settleVisual();
                    const grid = required<HTMLElement>(view.container, '[role="grid"]');
                    const actions = required<HTMLElement>(grid, '[data-table-row-edit-actions]');
                    const [confirm, discard] = Array.from(actions.querySelectorAll<HTMLButtonElement>('button'));
                    const initialFixedGeometry = readFixedColumnGeometry(grid);
                    assertEditingRowColumnGeometry(grid);
                    expect(confirm.textContent).toBe('确定');
                    expect(discard.textContent).toBe('取消');
                    const user = userEvent.setup();
                    await act(() => user.unhover(view.container));
                    await settleVisual();
                    for (const button of [confirm, discard]) {
                        expect(button.matches(':hover')).toBe(false);
                        expect(button.matches(':active')).toBe(false);
                        expect(button.hasAttribute('data-press-feedback')).toBe(false);
                    }
                    assertReadable(confirm);
                    assertReadable(discard);
                    expect(getComputedStyle(discard).borderTopStyle).toBe('solid');
                    expect(Number.parseFloat(getComputedStyle(discard).borderTopWidth)).toBeGreaterThan(0);
                    if (direction === 'rtl') expect(confirm.getBoundingClientRect().left).toBeGreaterThan(discard.getBoundingClientRect().left);
                    else expect(confirm.getBoundingClientRect().right).toBeLessThan(discard.getBoundingClientRect().left);

                    expect(getComputedStyle(grid).direction).toBe(direction);
                    expect(getComputedStyle(required(grid, 'input[aria-label="Edit record name"]')).direction).toBe(direction);
                    // Both directions must overlap the adjacent physical fixed
                    // column and remain the real pointer hit target above it.
                    for (const button of [confirm, discard]) {
                        await assertObservedHover(button, actions, grid, user);
                        assertActionAboveAdjacentFixedCells(button, grid, initialFixedGeometry);
                        assertEditingRowColumnGeometry(grid);
                        await act(() => user.unhover(view.container));
                        await settleVisual();
                    }

                    // Wake's browser Tab helper is checked by actual focus and
                    // :focus-visible below. It is not an OS keyboard/IME claim.
                    // The separate CDP rowEdit plan must also retain actual hover
                    // and held :active; helper completion alone proves neither.
                    await act(() => grid.focus());
                    await act(() => user.tab());
                    expect(document.activeElement).toBe(required(grid, 'input[aria-label="Edit record name"]'));
                    await act(() => user.tab());
                    await settleVisual();
                    assertFocusVisible(confirm, grid);
                    // A controlled owner deliberately keeps the edit open so the
                    // activated button remains measurable during press feedback.
                    gridKeyDown.clear();
                    await activateAndReadFeedback(confirm);
                    expect(commit).toHaveBeenCalledTimes(1);
                    expect(document.activeElement).toBe(confirm);
                    expect(gridKeyDown).not.toHaveBeenCalled();
                    await act(() => user.tab());
                    await settleVisual();
                    assertFocusVisible(discard, grid);
                    gridKeyDown.clear();
                    await activateAndReadFeedback(discard);
                    expect(cancel).toHaveBeenCalledTimes(1);
                    expect(document.activeElement).toBe(discard);
                    expect(rowClick).not.toHaveBeenCalled();
                    expect(gridKeyDown).not.toHaveBeenCalled();

                    // The Table scroller uses physical coordinates in both
                    // content directions, while the action bar follows inline-end.
                    {
                        const scroll = Array.from(grid.querySelectorAll<HTMLElement>('div')).find(element => getComputedStyle(element).overflowX === 'hidden' && element.scrollWidth > element.clientWidth && element.clientWidth === 600);
                        if (!scroll) throw new Error('Missing actual horizontal Table viewport');
                        expect(getComputedStyle(scroll).direction).toBe('ltr');
                        const originalEdge = direction === 'rtl' ? actions.getBoundingClientRect().left : actions.getBoundingClientRect().right;
                        await fireEvent(scroll, new WheelEvent('wheel', { deltaX: 320, bubbles: true, cancelable: true }));
                        await settleVisual();
                        expect(scroll.scrollLeft).toBeGreaterThan(0);
                        expect(direction === 'rtl' ? actions.getBoundingClientRect().left : actions.getBoundingClientRect().right).toBeCloseTo(originalEdge, 1);
                        const bounds = actions.getBoundingClientRect();
                        expect(bounds.left).toBeGreaterThanOrEqual(grid.getBoundingClientRect().left);
                        expect(bounds.right).toBeLessThanOrEqual(grid.getBoundingClientRect().right + 1);
                        assertActionAboveAdjacentFixedCells(confirm, grid);
                        assertActionAboveAdjacentFixedCells(discard, grid);
                        assertEditingRowColumnGeometry(grid);
                    }
                });
            }
        }
    }
});
