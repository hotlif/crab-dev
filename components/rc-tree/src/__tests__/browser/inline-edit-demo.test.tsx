import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { useState } from 'react';
import Tree, { LoadStateType, NodeEditStateType, NodeType, type Node } from '@crab-dev/rc-tree';
import LineEdit from '@crab-dev/rc-line-edit';
import InlineEditDemo, { CustomInput, useKeyboardEditFocus } from '../../../.cache/inline-edit-demo.mjs';
import compiledCss from '../../../.cache/browser-css.json';

// This module is built from docs/demos/inline-edit.demo.tsx by the public Wake
// bundle API. It consumes published component entries and the emitted demo CSS.
// Native event dispatch exercises the real example's editing handlers; this is
// not a claim about physical pointer input or every animation frame.
function required<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing actual inline editor element: ${selector}`);
    return element;
}

const settle = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

async function settlePaint(root: HTMLElement): Promise<void> {
    await settle();
    await act(async () => {
        const finite = root.getAnimations({ subtree: true }).filter(animation => {
            const end = animation.effect?.getComputedTiming().endTime;
            return typeof end === 'number' && Number.isFinite(end);
        });
        await Promise.all(finite.map(animation => animation.finished));
    });
    await settle();
}

function colorPixel(color: string): Uint8ClampedArray {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Native canvas color conversion is required.');
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1).data;
}

function contrast(foreground: string, background: string): number {
    const luminance = (color: string) => {
        const pixel = colorPixel(color);
        expect(pixel[3]).toBe(255);
        const linear = [...pixel.slice(0, 3)].map(channel => {
            const value = channel / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const a = luminance(foreground), b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function assertFits(row: HTMLElement, input: HTMLInputElement, count: HTMLElement): void {
    const bounds = row.getBoundingClientRect();
    const field = input.closest<HTMLElement>('[data-field-control]');
    if (!field) throw new Error('Missing real embedded LineEdit control.');
    const inputBounds = input.getBoundingClientRect();
    for (const element of [field, input]) {
        const rect = element.getBoundingClientRect();
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.height).toBeGreaterThan(0);
        expect(rect.left).toBeGreaterThanOrEqual(bounds.left);
        expect(rect.right).toBeLessThanOrEqual(bounds.right);
        expect(rect.top).toBeGreaterThanOrEqual(bounds.top);
        expect(rect.bottom).toBeLessThanOrEqual(bounds.bottom);
    }
    expect(input.matches(':focus-visible')).toBe(true);
    const fieldStyle = getComputedStyle(field);
    expect(fieldStyle.outlineStyle).toBe('solid');
    expect(parseFloat(fieldStyle.outlineWidth)).toBeGreaterThan(0);
    // The focused paint stays within the same real row, without an outer halo.
    expect(parseFloat(fieldStyle.outlineOffset) + parseFloat(fieldStyle.outlineWidth)).toBeLessThanOrEqual(0);
    const countBounds = count.getBoundingClientRect();
    expect(countBounds.width).toBeGreaterThan(0);
    expect(countBounds.left).toBeGreaterThanOrEqual(bounds.left);
    expect(countBounds.right).toBeLessThanOrEqual(bounds.right);
    expect(countBounds.top).toBeGreaterThanOrEqual(bounds.top);
    expect(countBounds.bottom).toBeLessThanOrEqual(bounds.bottom);
    expect(inputBounds.right <= countBounds.left || countBounds.right <= inputBounds.left).toBe(true);
    const range = document.createRange();
    range.selectNodeContents(count);
    const glyphs = range.getBoundingClientRect();
    expect(glyphs.width).toBeGreaterThan(0);
    expect(glyphs.left).toBeGreaterThanOrEqual(countBounds.left - 0.5);
    expect(glyphs.right).toBeLessThanOrEqual(countBounds.right + 0.5);
}

describe('actual custom inline editor count on published selected rows', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps normal and invalid counts readable for ${designSystem}/${colorMode}`, async () => {
                const content = (direction: 'ltr' | 'rtl', density: 'compact' | 'standard' | 'comfortable' = 'standard') => <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction} density={density}>
                    <style>{compiledCss}</style>
                    <div style={{ width: 520 }}><InlineEditDemo /></div>
                </ConfigProvider>;
                const view = await render(content('ltr'));
                try {
                    await settle();
                    const tree = required<HTMLElement>(view.container, '[role="tree"]');
                    const row = required<HTMLElement>(tree, '[role="treeitem"][id$="-quick-start"]');
                    const rowGeometry = () => [...tree.querySelectorAll<HTMLElement>('[role="treeitem"]')].map(item => {
                        const rect = item.getBoundingClientRect();
                        return [item.id, rect.top, rect.bottom, rect.height];
                    });
                    const ordinaryRows = rowGeometry();
                    await fireEvent(row, new MouseEvent('dblclick', { bubbles: true, cancelable: true, detail: 2 }));
                    await settlePaint(tree);
                    const input = required<HTMLInputElement>(row, 'input[aria-label="节点名称"]');
                    const count = required<HTMLElement>(row, '[data-node-editor-count]');
                    expect(input.value).toBe('快速开始.md');
                    expect(count.textContent).toBe('7/20');
                    expect(row.getAttribute('aria-selected')).toBe('true');
                    expect(document.activeElement).toBe(input);

                    const assertNormal = () => {
                        const countStyle = getComputedStyle(count);
                        const rowStyle = getComputedStyle(row);
                        expect(countStyle.color).toBe(rowStyle.color);
                        expect(colorPixel(countStyle.backgroundColor)[3]).toBe(0);
                        expect(contrast(countStyle.color, rowStyle.backgroundColor)).toBeGreaterThanOrEqual(4.5);
                        assertFits(row, input, count);
                    };
                    assertNormal();
                    expect(rowGeometry()).toEqual(ordinaryRows);
                    const setValue = async (value: string) => {
                        await act(() => Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, 'value')!.set!.call(input, value));
                        await fireEvent.input(input);
                        await settlePaint(tree);
                    };
                    await setValue('New');
                    expect(count.textContent).toBe('3/20');
                    expect(input.getAttribute('aria-invalid')).toBe('false');
                    assertNormal();

                    for (const direction of ['rtl', 'ltr'] as const) {
                        await view.rerender(content(direction));
                        await settlePaint(tree);
                        expect(required<HTMLInputElement>(row, 'input')).toBe(input);
                        expect(input.value).toBe('New');
                        expect(getComputedStyle(row).direction).toBe(direction);
                        assertNormal();
                    }

                    for (const [density, height] of [['compact', 32], ['comfortable', 40], ['standard', 36]] as const) {
                        await view.rerender(content('ltr', density));
                        await settlePaint(tree);
                        expect(required<HTMLInputElement>(row, 'input')).toBe(input);
                        expect(input.value).toBe('New');
                        expect(row.getBoundingClientRect().height).toBe(height);
                        const measuredRows = rowGeometry();
                        for (let index = 1; index < measuredRows.length; index += 1) {
                            expect(measuredRows[index][1]).toBe(measuredRows[index - 1][2]);
                        }
                        assertNormal();
                    }
                    expect(rowGeometry()).toEqual(ordinaryRows);
                    for (const value of ['123456789012345678901', '']) {
                        await setValue(value);
                        expect(count.textContent).toBe(`${value.length}/20`);
                        expect(input.getAttribute('aria-invalid')).toBe('true');
                        const countStyle = getComputedStyle(count);
                        expect(contrast(countStyle.color, countStyle.backgroundColor)).toBeGreaterThanOrEqual(4.5);
                        assertFits(row, input, count);
                        await fireEvent.keyDown(input, { key: 'Enter' });
                        await settle();
                        expect(input.isConnected).toBe(true);
                        expect(input.value).toBe(value);
                        expect(document.activeElement).toBe(input);
                        expect(rowGeometry()).toEqual(ordinaryRows);
                        assertFits(row, input, count);
                    }
                    await setValue('New');
                    expect(count.textContent).toBe('3/20');
                    assertNormal();
                    await fireEvent.keyDown(input, { key: 'Enter' });
                    await settle();
                    expect(input.isConnected).toBe(false);
                    expect(row.textContent).toBe('New');
                    expect(document.activeElement).toBe(tree);
                    expect(rowGeometry()).toEqual(ordinaryRows);
                    await fireEvent(row, new MouseEvent('dblclick', { bubbles: true, cancelable: true, detail: 2 }));
                    await settlePaint(tree);
                    const cancelInput = required<HTMLInputElement>(row, 'input');
                    const cancelCount = required<HTMLElement>(row, '[data-node-editor-count]');
                    assertFits(row, cancelInput, cancelCount);
                    await fireEvent.keyDown(cancelInput, { key: 'Escape' });
                    await settle();
                    expect(cancelInput.isConnected).toBe(false);
                    expect(row.textContent).toBe('New');
                    expect(document.activeElement).toBe(tree);
                    expect(rowGeometry()).toEqual(ordinaryRows);
                } finally {
                    await view.unmount();
                }
            });
        }
    }
});

function LoadingEditorFixture() {
    const [nodes, setNodes] = useState<Node[]>(() => ['before', 'loading', 'after'].map(id => ({
        id, title: `${id}.md`, parent: null, type: NodeType.FOLDER,
        loadState: id === 'loading' ? LoadStateType.LOADING : LoadStateType.LOADING_COMPLETED,
        editState: id === 'loading' ? NodeEditStateType.UPDATE : undefined,
        height: id === 'loading' ? 37 : undefined,
    })));
    const finishKeyboardEdit = useKeyboardEditFocus();
    return <>
        <Tree width={320} height={160} treeData={nodes} selectedKeys={['loading']}
            onTreeNodeChange={setNodes} aria-label="Loading editor row geometry"
            onEditEnd={(node, title, cancelled) => setNodes(previous => previous.map(item => item.id === node.id
                ? { ...item, title: cancelled ? item.title : title, editState: undefined } : item))}
            renderEditInput={({ defaultValue, onCommit, onCancel }) => <CustomInput
                defaultValue={defaultValue} onCommit={onCommit} onCancel={onCancel} onKeyboardEnd={finishKeyboardEdit} />} />
        <LineEdit size="small" aria-label="Standalone field geometry" defaultValue="Standalone" />
    </>;
}

describe('published custom editor and loading row geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`contains the actual custom editor while loading for ${designSystem}/${colorMode}`, async () => {
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} density="standard">
                    <style>{compiledCss}</style><LoadingEditorFixture />
                </ConfigProvider>);
                try {
                    await settlePaint(view.container);
                    const tree = required<HTMLElement>(view.container, '[role="tree"]');
                    const row = required<HTMLElement>(tree, '[role="treeitem"][id$="-loading"]');
                    const previous = required<HTMLElement>(tree, '[role="treeitem"][id$="-before"]');
                    const next = required<HTMLElement>(tree, '[role="treeitem"][id$="-after"]');
                    const input = required<HTMLInputElement>(row, 'input');
                    const count = required<HTMLElement>(row, '[data-node-editor-count]');
                    const loading = required<HTMLElement>(row, '[data-loading-indicator]');
                    const before = [previous, row, next].map(item => {
                        const rect = item.getBoundingClientRect();
                        return [rect.top, rect.bottom, rect.height];
                    });
                    expect(before.map(rect => rect[2])).toEqual([36, 37, 36]);
                    expect(before[0][1]).toBe(before[1][0]);
                    expect(before[1][1]).toBe(before[2][0]);
                    assertFits(row, input, count);
                    const rowRect = row.getBoundingClientRect();
                    const loadingRect = loading.getBoundingClientRect();
                    expect(loadingRect.height).toBeGreaterThan(0);
                    expect(loadingRect.top).toBeGreaterThanOrEqual(rowRect.top);
                    expect(loadingRect.bottom).toBeLessThanOrEqual(rowRect.bottom);
                    const ordinary = required<HTMLInputElement>(view.container, 'input[aria-label="Standalone field geometry"]');
                    const ordinaryField = ordinary.closest<HTMLElement>('[data-field-control]');
                    if (!ordinaryField) throw new Error('Missing ordinary published field.');
                    if (designSystem === 'md3') expect(ordinaryField.getBoundingClientRect().height).toBeGreaterThanOrEqual(56);
                    await fireEvent.keyDown(input, { key: 'Escape' });
                    await settlePaint(tree);
                    expect(input.isConnected).toBe(false);
                    expect(row.textContent).toContain('loading.md');
                    expect(document.activeElement).toBe(tree);
                    expect(required<HTMLElement>(row, '[data-loading-indicator]')).toBe(loading);
                    expect([previous, row, next].map(item => {
                        const rect = item.getBoundingClientRect();
                        return [rect.top, rect.bottom, rect.height];
                    })).toEqual(before);
                } finally {
                    await view.unmount();
                }
            });
        }
    }
});
