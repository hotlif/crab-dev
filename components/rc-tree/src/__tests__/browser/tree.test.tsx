import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { useState } from 'react';
import type { Node } from '../../type.js';
// Layout exception: use the actual published ESM and compiled component/theme
// CSS. Source CSS mocks cannot prove spacer, indentation or caret geometry.
import Tree, { LoadStateType, NodeEditStateType, NodeType, TokenVars } from '../../../esm/index.mjs';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import compiledCss from '../../../.cache/browser-css.json';

const HEIGHT = 240;
const COUNT = 200;
const settleLayout = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function createNodes(explicit = false): Node[] {
    return Array.from({ length: COUNT }, (_, index) => ({
        id: `row-${index}`,
        title: `Record ${index}`,
        parent: null,
        type: NodeType.FILE,
        loadState: LoadStateType.LOADING_COMPLETED,
        priority: index,
        ...(explicit && index === 1 ? { height: 37 } : {}),
        ...(explicit && index === 2 ? { height: 60 } : {}),
    }));
}

function fixture(treeData: Node[], selectedKeys: string[] = [], defaultNodeHeight?: number) {
    return <ConfigProvider density="compact" size="small">
        <style>{compiledCss}</style>
        <Tree treeData={treeData} selectedKeys={selectedKeys} defaultNodeHeight={defaultNodeHeight}
            width={320} height={HEIGHT} data-testid="geometry-grid" aria-label="Geometry tree"
            onTreeNodeChange={() => {}} />
    </ConfigProvider>;
}

function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing geometry element: ${selector}`);
    return element;
}

describe('Tree published selected node icon foreground', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`pairs currentColor icons with ${designSystem}/${colorMode} selection and restores muted colors`, async () => {
                const treeData: Node[] = [
                    {
                        id: 'mono', title: 'Inherited icon', parent: null,
                        type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED,
                        icon: <svg data-testid="inherited-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
                            <path d="M3 1H9L12 4V13H3Z" />
                        </svg>,
                    },
                    {
                        id: 'colored', title: 'Explicit colored icon', parent: null,
                        type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED,
                        icon: <svg data-testid="colored-icon" width="14" height="14" viewBox="0 0 14 14"
                            style={{ color: 'rgb(190, 18, 60)' }} fill="rgb(22, 128, 56)" stroke="rgb(29, 78, 216)" aria-hidden="true">
                            <path d="M2 2H12V12H2Z" />
                            <circle cx="7" cy="7" r="2" fill="currentColor" />
                        </svg>,
                    },
                ];
                const onSelectedKeysChange = mock.fn();
                const content = (selectedKeys: string[]) => <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    <Tree treeData={treeData} selectedKeys={selectedKeys} onSelectedKeysChange={onSelectedKeysChange}
                        width={320} height={120} aria-label="Icon foreground tree" onTreeNodeChange={mock.fn()} />
                </ConfigProvider>;
                const view = await render(content([]));
                try {
                    const tree = requiredElement<HTMLElement>(view.container, '[role="tree"]');
                    const settleColors = async () => {
                        await settleLayout();
                        // Let the actual published CSS transitions finish naturally.
                        // This verifies terminal paint roles, not every animation frame.
                        await act(async () => {
                            const finite = tree.getAnimations({ subtree: true }).filter(animation => {
                                const endTime = animation.effect?.getComputedTiming().endTime;
                                return typeof endTime === 'number' && Number.isFinite(endTime);
                            });
                            await Promise.all(finite.map(animation => animation.finished));
                        });
                        await settleLayout();
                    };
                    const row = (id: string) => requiredElement<HTMLElement>(tree, `[role="treeitem"][id$="-${id}"]`);
                    const ownIcon = (id: string) => requiredElement<HTMLElement>(row(id), ':scope > [data-node-icon]');
                    const title = (id: string) => requiredElement<HTMLElement>(row(id), '[data-node-title]');
                    const assertExplicitColors = () => {
                        const svg = requiredElement<SVGElement>(tree, '[data-testid="colored-icon"]');
                        expect(getComputedStyle(svg).color).toBe('rgb(190, 18, 60)');
                        expect(getComputedStyle(svg).fill).toBe('rgb(22, 128, 56)');
                        expect(getComputedStyle(svg).stroke).toBe('rgb(29, 78, 216)');
                        expect(getComputedStyle(requiredElement<SVGElement>(svg, 'path')).fill).toBe('rgb(22, 128, 56)');
                        expect(getComputedStyle(requiredElement<SVGElement>(svg, 'circle')).fill).toBe('rgb(190, 18, 60)');
                    };
                    await settleColors();
                    const muted = getComputedStyle(ownIcon('mono')).color;
                    expect(getComputedStyle(requiredElement<SVGElement>(tree, '[data-testid="inherited-icon"]')).stroke).toBe(muted);
                    assertExplicitColors();

                    await view.rerender(content(['mono', 'colored']));
                    await settleColors();
                    for (const id of ['mono', 'colored']) {
                        expect(row(id).getAttribute('aria-selected')).toBe('true');
                        const selectedColor = getComputedStyle(row(id)).color;
                        expect(getComputedStyle(title(id)).color).toBe(selectedColor);
                        expect(getComputedStyle(ownIcon(id)).color).toBe(selectedColor);
                    }
                    const inherited = requiredElement<SVGElement>(tree, '[data-testid="inherited-icon"]');
                    expect(getComputedStyle(inherited).color).toBe(getComputedStyle(title('mono')).color);
                    expect(getComputedStyle(inherited).stroke).toBe(getComputedStyle(title('mono')).color);
                    expect(getComputedStyle(requiredElement<SVGElement>(inherited, 'path')).stroke).toBe(getComputedStyle(title('mono')).color);
                    expect(getComputedStyle(inherited).fill).toBe('none');
                    assertExplicitColors();

                    await view.rerender(content([]));
                    await settleColors();
                    for (const id of ['mono', 'colored']) {
                        expect(row(id).getAttribute('aria-selected')).toBe('false');
                        expect(getComputedStyle(ownIcon(id)).color).toBe(muted);
                    }
                    expect(getComputedStyle(inherited).stroke).toBe(muted);
                    assertExplicitColors();
                    // Controlled state synchronization must not notify user actions.
                    expect(onSelectedKeysChange).not.toHaveBeenCalled();
                } finally {
                    await view.unmount();
                }
            });
        }
    }
});

describe('Tree published focus inside AutoSizer clipping', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const customWidth of [undefined, 4] as const) {
                it(`keeps every outline edge inside the measured clip for ${designSystem}/${colorMode}/${customWidth ?? 'default'}px`, async () => {
                    // Inherit public variables from a real DOM ancestor. Tree
                    // forwards arbitrary data props to its inner virtual grid,
                    // which cannot style the outer keyboard focus target.
                    const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} size="medium" density="standard">
                        <style>{compiledCss}</style>
                        {customWidth !== undefined && <style>{`[data-tree-outline-host] { ${TokenVars['root.outline-width-focus']}: ${customWidth}px; }`}</style>}
                        <div data-tree-outline-host="" style={{ width: 320, height: HEIGHT }}>
                            <AutoSizer data-testid="outline-measurer" defaultWidth={320} defaultHeight={HEIGHT}>
                                {({ width, height }) => <Tree treeData={createNodes().slice(0, 3)} selectedKeys={['row-1']}
                                    width={width} height={height}
                                    aria-label="Measured outline tree" onTreeNodeChange={mock.fn()} />}
                            </AutoSizer>
                        </div>
                    </ConfigProvider>);
                    try {
                        await settleLayout();
                        const measurer = requiredElement<HTMLElement>(view.container, '[data-testid="outline-measurer"]');
                        const tree = requiredElement<HTMLElement>(measurer, '[role="tree"]');
                        await act(() => tree.focus());
                        const clip = measurer.getBoundingClientRect();
                        const box = tree.getBoundingClientRect();
                        const clipStyle = getComputedStyle(measurer);
                        const style = getComputedStyle(tree);
                        expect(clipStyle.overflowX).toBe('hidden');
                        expect(clipStyle.overflowY).toBe('hidden');
                        expect(box.width).toBeGreaterThan(0);
                        expect(box.height).toBeGreaterThan(0);
                        expect(box.left).toBeCloseTo(clip.left, 1);
                        expect(box.top).toBeCloseTo(clip.top, 1);
                        expect(box.width).toBeCloseTo(clip.width, 1);
                        expect(box.height).toBeCloseTo(clip.height, 1);
                        expect(document.activeElement).toBe(tree);
                        expect(tree.matches(':focus-visible')).toBe(true);
                        expect(style.outlineStyle).toBe('solid');
                        const outlineWidth = parseFloat(style.outlineWidth);
                        const outlineOffset = parseFloat(style.outlineOffset);
                        expect(Number.isFinite(outlineOffset)).toBe(true);
                        expect(outlineWidth).toBeGreaterThan(0);
                        if (customWidth !== undefined) expect(outlineWidth).toBe(customWidth);
                        // Actual computed outline paint bounds, not merely a
                        // declared focus rule. A positive offset is clipped by
                        // this real AutoSizer at every coincident outer edge.
                        const outwardExtent = outlineOffset + outlineWidth;
                        expect(box.left - outwardExtent).toBeGreaterThanOrEqual(clip.left - 0.5);
                        expect(box.top - outwardExtent).toBeGreaterThanOrEqual(clip.top - 0.5);
                        expect(box.right + outwardExtent).toBeLessThanOrEqual(clip.right + 0.5);
                        expect(box.bottom + outwardExtent).toBeLessThanOrEqual(clip.bottom + 0.5);
                        // An inset outline on the parent alone can be painted
                        // underneath positioned selected rows. Check the real
                        // compiled overlay and stacking prerequisites here;
                        // continuity of its pixels is reviewed in capture PNGs.
                        const overlay = getComputedStyle(tree, '::after');
                        expect(overlay.content).toBe('""');
                        expect(overlay.position).toBe('absolute');
                        expect(overlay.pointerEvents).toBe('none');
                        expect(overlay.outlineStyle).toBe(style.outlineStyle);
                        expect(overlay.outlineWidth).toBe(style.outlineWidth);
                        expect(overlay.outlineOffset).toBe(style.outlineOffset);
                        expect(overlay.outlineColor).toBe(style.outlineColor);
                        for (const edge of ['top', 'right', 'bottom', 'left'] as const) {
                            expect(overlay[edge]).toBe('0px');
                        }
                        expect(parseFloat(overlay.width)).toBeCloseTo(box.width, 1);
                        expect(parseFloat(overlay.height)).toBeCloseTo(box.height, 1);
                        const selected = requiredElement<HTMLElement>(tree, '[role="treeitem"][data-selected="true"]');
                        expect(getComputedStyle(selected).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
                        for (let layer: HTMLElement | null = selected; layer && layer !== tree; layer = layer.parentElement) {
                            const zIndex = getComputedStyle(layer).zIndex;
                            expect(Number(overlay.zIndex)).toBeGreaterThan(zIndex === 'auto' ? 0 : Number(zIndex));
                        }
                        const selectedBox = selected.getBoundingClientRect();
                        const hit = document.elementFromPoint(selectedBox.left + 2, selectedBox.top + selectedBox.height / 2);
                        expect(hit !== null && selected.contains(hit)).toBe(true);
                    } finally {
                        await view.unmount();
                    }
                });
            }
        }
    }

    it('inherits an explicit public outline offset and removes the overlay after blur', async () => {
        const view = await render(<ConfigProvider designSystem="md3">
            <style>{compiledCss}</style>
            <style>{`[data-tree-custom-outline] { ${TokenVars['root.outline-width-focus']}: 4px; ${TokenVars['root.outline-offset-focus']}: -6px; }`}</style>
            <div data-tree-custom-outline="">
                <Tree treeData={createNodes().slice(0, 3)} selectedKeys={['row-1']}
                    width={320} height={HEIGHT} aria-label="Custom outline tree" onTreeNodeChange={mock.fn()} />
                <button type="button">Outside tree</button>
            </div>
        </ConfigProvider>);
        try {
            await settleLayout();
            const tree = requiredElement<HTMLElement>(view.container, '[role="tree"]');
            await act(() => tree.focus());
            const overlay = getComputedStyle(tree, '::after');
            expect(overlay.outlineWidth).toBe('4px');
            expect(overlay.outlineOffset).toBe('-6px');
            expect(overlay.outlineColor).toBe(getComputedStyle(tree).outlineColor);
            await act(() => requiredElement<HTMLButtonElement>(view.container, 'button').focus());
            expect(tree.matches(':focus-visible')).toBe(false);
            expect(getComputedStyle(tree, '::after').content).toBe('none');
        } finally {
            await view.unmount();
        }
    });
});

describe('Tree published row geometry', () => {
    it('keeps zero-height spacers out of inline layout and aligns rows before and after scrolling', async () => {
        const treeData = createNodes();
        const view = await render(fixture(treeData));
        await settleLayout();
        const grid = requiredElement<HTMLElement>(view.container, '[data-testid="geometry-grid"]');
        const first = requiredElement<HTMLElement>(grid, '[role="treeitem"][id$="-row-0"]');
        const topSpacer = grid.firstElementChild;
        const bottomSpacer = grid.lastElementChild;
        if (!(topSpacer instanceof HTMLElement) || !(bottomSpacer instanceof HTMLElement)) throw new Error('Missing spacers');
        expect(getComputedStyle(topSpacer).display).toBe('block');
        expect(getComputedStyle(bottomSpacer).display).toBe('block');
        expect(topSpacer.getAttribute('aria-hidden')).toBe('true');
        expect(bottomSpacer.getAttribute('aria-hidden')).toBe('true');
        expect(topSpacer.getBoundingClientRect().height).toBe(0);
        expect(first.getBoundingClientRect().top).toBeCloseTo(grid.getBoundingClientRect().top, 1);
        expect(first.getBoundingClientRect().height).toBe(32);
        expect(grid.scrollHeight).toBe(COUNT * 32);
        expect(grid.querySelectorAll('[role="treeitem"]').length).toBeLessThan(20);
        await view.rerender(fixture(treeData, ['row-199']));
        await settleLayout();
        const last = requiredElement<HTMLElement>(grid, '[role="treeitem"][id$="-row-199"]');
        expect(last.getBoundingClientRect().bottom).toBeCloseTo(grid.getBoundingClientRect().bottom, 1);
        expect(grid.lastElementChild?.getAttribute('aria-hidden')).toBe('true');
        expect(grid.lastElementChild?.getBoundingClientRect().height).toBe(0);
        expect(grid.scrollHeight).toBe(COUNT * 32);
        await fireEvent(grid, new WheelEvent('wheel', { deltaY: -64, bubbles: true, cancelable: true }));
        await settleLayout();
        const visible = requiredElement<HTMLElement>(grid, '[role="treeitem"]');
        expect(visible.getBoundingClientRect().top).toBeLessThanOrEqual(grid.getBoundingClientRect().top);
        expect(visible.getBoundingClientRect().bottom).toBeGreaterThan(grid.getBoundingClientRect().top);
    });

    for (const explicitDefault of [undefined, 44]) {
        it(`preserves node 37/60 and ${explicitDefault ?? 'adaptive'} defaults under coarse-pointer geometry`, async () => {
            const originalMatchMedia = window.matchMedia;
            // Activate the real media-query arithmetic without replacing geometry
            // or styles. Native coarse-media coverage also runs in the audit matrix.
            window.matchMedia = query => {
                const media = originalMatchMedia.call(window, query);
                if (query === '(pointer: coarse)') Object.defineProperty(media, 'matches', { value: true });
                return media;
            };
            try {
                const treeData = createNodes(true);
                const view = await render(fixture(treeData, [], explicitDefault));
                await settleLayout();
                const grid = requiredElement<HTMLElement>(view.container, '[data-testid="geometry-grid"]');
                const expectedDefault = explicitDefault ?? 48;
                const first = requiredElement<HTMLElement>(grid, '[role="treeitem"][id$="-row-0"]');
                expect(first.getBoundingClientRect().top).toBeCloseTo(grid.getBoundingClientRect().top, 1);
                expect(first.getBoundingClientRect().height).toBe(expectedDefault);
                expect(requiredElement<HTMLElement>(grid, '[role="treeitem"][id$="-row-1"]').getBoundingClientRect().height).toBe(37);
                expect(requiredElement<HTMLElement>(grid, '[role="treeitem"][id$="-row-2"]').getBoundingClientRect().height).toBe(60);
                expect(grid.scrollHeight).toBe(COUNT * expectedDefault - 2 * expectedDefault + 37 + 60);
                await view.rerender(fixture(treeData, ['row-199'], explicitDefault));
                await settleLayout();
                const last = requiredElement<HTMLElement>(grid, '[role="treeitem"][id$="-row-199"]');
                expect(last.getBoundingClientRect().bottom).toBeCloseTo(grid.getBoundingClientRect().bottom, 1);
                await view.unmount();
            } finally {
                window.matchMedia = originalMatchMedia;
            }
        });
    }
});

describe('Tree published default editor geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`contains the ${designSystem}/${colorMode} default editor within its actual medium row`, async () => {
                // Enter through the public controlled node state. Keep all real
                // field/tree CSS: overriding heights here would hide the defect.
                const treeData = createNodes().slice(0, 3).map(node => node.id === 'row-1'
                    ? { ...node, editState: NodeEditStateType.UPDATE }
                    : node);
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} size="medium" density="standard">
                    <style>{compiledCss}</style>
                    <Tree treeData={treeData} selectedKeys={['row-1']} width={320} height={HEIGHT}
                        aria-label="Default editor geometry" onTreeNodeChange={mock.fn()} />
                </ConfigProvider>);
                try {
                    await settleLayout();
                    const tree = requiredElement<HTMLElement>(view.container, '[role="tree"]');
                    const previous = requiredElement<HTMLElement>(tree, '[role="treeitem"][id$="-row-0"]');
                    const row = requiredElement<HTMLElement>(tree, '[role="treeitem"][id$="-row-1"]');
                    const next = requiredElement<HTMLElement>(tree, '[role="treeitem"][id$="-row-2"]');
                    const field = requiredElement<HTMLElement>(row, '[data-field-control]');
                    const input = requiredElement<HTMLInputElement>(field, 'input');
                    const rowRect = row.getBoundingClientRect();
                    const previousRect = previous.getBoundingClientRect();
                    const nextRect = next.getBoundingClientRect();
                    expect(document.activeElement).toBe(input);
                    expect(input.matches(':focus-visible')).toBe(true);
                    const fieldStyle = getComputedStyle(field);
                    expect(fieldStyle.outlineStyle).toBe('solid');
                    expect(parseFloat(fieldStyle.outlineWidth)).toBeGreaterThan(0);
                    expect(parseFloat(fieldStyle.outlineOffset)).toBeLessThan(0);
                    expect(fieldStyle.outlineColor).toBe(getComputedStyle(input).color);
                    expect(getComputedStyle(input).color).toBe(getComputedStyle(row).color);
                    expect(rowRect.height).toBeGreaterThan(0);
                    // The real Tree row contract is the boundary, not a chosen
                    // LineEdit specification height or a CSS-mocked dimension.
                    expect(rowRect.height).toBeCloseTo(previousRect.height, 1);
                    expect(rowRect.height).toBeCloseTo(nextRect.height, 1);
                    expect(previousRect.bottom).toBeLessThanOrEqual(rowRect.top + 0.5);
                    expect(rowRect.bottom).toBeLessThanOrEqual(nextRect.top + 0.5);
                    for (const element of [field, input]) {
                        const rect = element.getBoundingClientRect();
                        expect(rect.height).toBeGreaterThan(0);
                        expect(rect.width).toBeGreaterThan(0);
                        expect(rect.top).toBeGreaterThanOrEqual(rowRect.top - 0.5);
                        expect(rect.bottom).toBeLessThanOrEqual(rowRect.bottom + 0.5);
                        expect(rect.left).toBeGreaterThanOrEqual(rowRect.left - 0.5);
                        expect(rect.right).toBeLessThanOrEqual(rowRect.right + 0.5);
                        expect(rect.top).toBeGreaterThanOrEqual(previousRect.bottom - 0.5);
                        expect(rect.bottom).toBeLessThanOrEqual(nextRect.top + 0.5);
                    }
                    // A focus outline/shadow is a separate, legitimate state.
                    // Count only painted borders in the nested field/input
                    // controls, so the test rejects stacked native+field frames.
                    const borderedBoxes = [field, input, ...field.querySelectorAll<HTMLElement>('fieldset')].filter(element => {
                        const style = getComputedStyle(element);
                        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
                        return ['top', 'right', 'bottom', 'left'].some(side => {
                            const width = parseFloat(style.getPropertyValue(`border-${side}-width`));
                            const kind = style.getPropertyValue(`border-${side}-style`);
                            const color = style.getPropertyValue(`border-${side}-color`);
                            return width > 0 && kind !== 'none' && kind !== 'hidden' && color !== 'transparent' && !/rgba\([^)]*,\s*0\s*\)/.test(color);
                        });
                    });
                    expect(borderedBoxes.length).toBeLessThanOrEqual(1);
                } finally {
                    await view.unmount();
                }
            });
        }
    }
});

function createHierarchy(): Node[] {
    const root: Node = { id: 'root', title: 'Root', parent: null, type: NodeType.FOLDER, loadState: LoadStateType.LOADING_COMPLETED };
    const child: Node = { id: 'child', title: 'Child', parent: root, type: NodeType.FOLDER, loadState: LoadStateType.LOADING_COMPLETED };
    const leaf: Node = { id: 'leaf', title: 'Grandchild', parent: child, type: NodeType.FOLDER, loadState: LoadStateType.LOADING_COMPLETED };
    return [root, child, leaf];
}

function expectCaret(row: HTMLElement, expanded: boolean, direction: 'ltr' | 'rtl') {
    const svg = requiredElement<SVGSVGElement>(row, '[data-expanded] > svg');
    const transform = getComputedStyle(svg).transform;
    const matrix = new globalThis.DOMMatrix(transform === 'none' ? undefined : transform);
    const horizontal = direction === 'rtl' ? -1 : 1;
    expect(matrix.a).toBeCloseTo(expanded ? 0 : horizontal, 3);
    expect(matrix.b).toBeCloseTo(expanded ? 1 : 0, 3);
    expect(matrix.c).toBeCloseTo(expanded ? -1 : 0, 3);
    expect(matrix.d).toBeCloseTo(expanded ? 0 : horizontal, 3);
}

describe('Tree published directional geometry and navigation', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const showLine of [false, true]) {
            it(`mirrors ${designSystem} hierarchy spacing and caret orientation with showLine=${showLine}`, async () => {
                const measures: number[][] = [];
                for (const direction of ['ltr', 'rtl'] as const) {
                    const view = await render(<ConfigProvider designSystem={designSystem} direction={direction}>
                        <style>{compiledCss}</style>
                        <Tree treeData={createHierarchy()} defaultExpandedKeys={['root', 'child']} showLine={showLine}
                            width={320} height={HEIGHT} aria-label="Hierarchy geometry" onTreeNodeChange={mock.fn()} />
                    </ConfigProvider>);
                    await settleLayout();
                    const tree = requiredElement<HTMLElement>(view.container, '[role="tree"]');
                    expect(getComputedStyle(tree).direction).toBe(direction);
                    const rows = ['root', 'child', 'leaf'].map(id => requiredElement<HTMLElement>(tree, `[role="treeitem"][id$="-${id}"]`));
                    const containerRect = tree.getBoundingClientRect();
                    const starts = rows.map(row => {
                        const title = requiredElement<HTMLElement>(row, '[data-node-title]').getBoundingClientRect();
                        return direction === 'rtl' ? containerRect.right - title.right : title.left - containerRect.left;
                    });
                    const step = starts[1] - starts[0];
                    expect(step).toBeGreaterThan(0);
                    expect(starts[2] - starts[1]).toBeCloseTo(step, 1);
                    // Measure the real indentation box; CSS mocks would yield zero.
                    if (showLine) {
                        const line = rows[1].firstElementChild;
                        if (!(line instanceof HTMLElement)) throw new Error('Missing indentation line');
                        expect(step).toBeCloseTo(line.getBoundingClientRect().width, 1);
                        expect(parseFloat(getComputedStyle(line).paddingInlineStart)).toBeGreaterThan(0);
                        expect(getComputedStyle(line).paddingInlineEnd).toBe('0px');
                    } else {
                        expect(getComputedStyle(rows[0]).paddingInlineStart).toBe('0px');
                        expect(step).toBeCloseTo(parseFloat(getComputedStyle(rows[1]).paddingInlineStart), 1);
                        expect(parseFloat(getComputedStyle(rows[2]).paddingInlineStart)).toBeCloseTo(step * 2, 1);
                    }
                    expectCaret(rows[0], true, direction);
                    expectCaret(rows[1], true, direction);
                    expectCaret(rows[2], false, direction);
                    measures.push(starts);
                    await view.unmount();
                }
                for (let depth = 0; depth < 3; depth++) expect(measures[1][depth]).toBeCloseTo(measures[0][depth], 1);
            });
        }
    }

    for (const [providerDirection, nativeDirection] of [['ltr', undefined], ['rtl', undefined], ['rtl', 'ltr'], ['ltr', 'rtl']] as const) {
        const direction = nativeDirection ?? providerDirection;
        it(`uses rendered ${direction} keys with provider=${providerDirection} and dir=${nativeDirection ?? 'inherited'}`, async () => {
            const expanded = mock.fn();
            const selected = mock.fn();
            const treeData = createHierarchy();
            const view = await render(<ConfigProvider direction={providerDirection}>
                <style>{compiledCss}</style>
                <Tree treeData={treeData} dir={nativeDirection} defaultSelectedKeys={['root']}
                    width={320} height={HEIGHT} aria-label="Directional navigation" onTreeNodeChange={mock.fn()}
                    onExpandedKeysChange={expanded} onSelectedKeysChange={selected} />
            </ConfigProvider>);
            await settleLayout();
            const tree = requiredElement<HTMLElement>(view.container, '[role="tree"]');
            const root = requiredElement<HTMLElement>(tree, '[role="treeitem"][id$="-root"]');
            const expandKey = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
            const collapseKey = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
            expect(getComputedStyle(tree).direction).toBe(direction);
            await act(() => tree.focus());
            await fireEvent.keyDown(tree, { key: expandKey });
            await settleLayout();
            expect(root.getAttribute('aria-expanded')).toBe('true');
            expect(expanded).toHaveBeenCalledTimes(1);
            expect(expanded).toHaveBeenCalledWith(['root'], expect.objectContaining({ reason: 'expand', expanded: true }));
            await fireEvent.keyDown(tree, { key: 'ArrowDown' });
            const child = requiredElement<HTMLElement>(tree, '[role="treeitem"][id$="-child"]');
            expect(child.getAttribute('aria-selected')).toBe('true');
            await fireEvent.keyDown(tree, { key: collapseKey });
            expect(root.getAttribute('aria-selected')).toBe('true');
            expect(root.getAttribute('aria-expanded')).toBe('true');
            expect(selected).toHaveBeenCalledTimes(2);
            expect(selected).toHaveBeenLastCalledWith(['root'], expect.objectContaining({ reason: 'select', selected: true }));
            await fireEvent.keyDown(tree, { key: collapseKey });
            expect(root.getAttribute('aria-expanded')).toBe('false');
            expect(expanded).toHaveBeenCalledTimes(2);
            expect(expanded).toHaveBeenLastCalledWith([], expect.objectContaining({ reason: 'expand', expanded: false }));
            expect(document.activeElement).toBe(tree);
        });
    }
});

describe('Tree published default edit completion', () => {
    for (const key of ['Enter', 'Escape'] as const) {
        it('restores the real tree focus after native input removal for ' + key, async () => {
            const edited = mock.fn();
            function EditingTree() {
                const [nodes, setNodes] = useState(() => createNodes().slice(0, 3).map(node => node.id === 'row-1'
                    ? { ...node, editState: NodeEditStateType.UPDATE } : node));
                return <ConfigProvider designSystem="md3" colorMode="light" size="medium" density="standard">
                    <style>{compiledCss}</style>
                    <Tree treeData={nodes} selectedKeys={['row-1']} width={320} height={HEIGHT}
                        aria-label="Published default editor" onTreeNodeChange={setNodes}
                        onEditEnd={(node, value, cancelled) => {
                            edited(node, value, cancelled);
                            setNodes(current => current.map(item => item.id === node.id
                                ? { ...item, title: cancelled ? item.title : value, editState: undefined } : item));
                        }} />
                </ConfigProvider>;
            }
            const view = await render(<EditingTree />);
            try {
                await settleLayout();
                const tree = requiredElement<HTMLElement>(view.container, '[role="tree"]');
                const row = requiredElement<HTMLElement>(tree, '[role="treeitem"][id$="-row-1"]');
                const input = requiredElement<HTMLInputElement>(row, 'input');
                const activeId = tree.getAttribute('aria-activedescendant');
                expect(document.activeElement).toBe(input);
                await fireEvent.keyDown(input, { key });
                expect(input.isConnected).toBe(false);
                expect(requiredElement<HTMLElement>(tree, '[role="treeitem"][id$="-row-1"]')).toBe(row);
                expect(document.activeElement).toBe(tree);
                expect(tree.matches(':focus-visible')).toBe(true);
                expect(getComputedStyle(tree).outlineStyle).toBe('solid');
                expect(parseFloat(getComputedStyle(tree).outlineWidth)).toBeGreaterThan(0);
                expect(tree.getAttribute('aria-activedescendant')).toBe(activeId);
                expect(row.getAttribute('aria-selected')).toBe('true');
                expect(edited).toHaveBeenCalledTimes(1);
                expect(edited).toHaveBeenCalledWith(expect.objectContaining({ id: 'row-1' }), key === 'Enter' ? 'Record 1' : '', key === 'Escape');
            } finally {
                await view.unmount();
            }
        });
    }
});
