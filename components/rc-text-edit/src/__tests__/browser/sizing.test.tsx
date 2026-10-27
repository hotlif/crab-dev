import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
// Geometry exception: DOM css() mocks cannot verify padding, line boxes or
// minimum heights. These tests use the same ESM and CSS as a consuming app.
import TextEdit from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const sizes = ['small', 'medium', 'large'] as const;
const designs = ['md3', 'apple', 'shadcn'] as const;
type Design = typeof designs[number];
type Size = typeof sizes[number];
const geometry = {
    md3: { min: [56, 56, 56], block: [16, 16, 16], inline: [16, 16, 16], font: 16, line: 24 },
    apple: { min: [32, 36, 40], block: [2, 4, 8], inline: [8, 12, 16], font: 14, line: 20 },
    shadcn: { min: [56, 64, 72], block: [4, 8, 12], inline: [8, 12, 16], font: 14, line: 20 },
} as const;

const settleLayout = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function elements(root: ParentNode) {
    const textarea = root.querySelector<HTMLTextAreaElement>('textarea');
    const control = textarea?.parentElement;
    if (!textarea || !control) throw new Error('Missing actual TextEdit control');
    return { textarea, control };
}

function fixture(design: Design, size: Size, appearance: 'outlined' | 'filled', labeled: boolean, rows = 2, autoSize = false, allowClear = false, density: 'compact' | 'standard' | 'comfortable' = 'standard') {
    return <>
        <style>{compiledCss}</style>
        <ConfigProvider designSystem={design} size={size} density={density}>
            <div style={{ width: 360, padding: 16 }}>
                <TextEdit label={labeled ? 'Notes' : undefined} aria-label="Notes" appearance={appearance} rows={rows} autoSize={autoSize} allowClear={allowClear} defaultValue="Keep this draft." />
            </div>
        </ConfigProvider>
    </>;
}

describe('TextEdit actual size geometry', () => {
    for (const design of designs) {
        it(`preserves host geometry for borderless editors and their optional action (${design})`, async () => {
            const bare = (size: Size, value: string, allowClear: boolean) => <>
                <style>{compiledCss}</style>
                <ConfigProvider designSystem={design} size={size}>
                    <div style={{ width: 360, fontSize: 18, lineHeight: '28px' }}>
                        <TextEdit bordered={false} rows={1} value={value} allowClear={allowClear} aria-label="Embedded notes" />
                    </div>
                </ConfigProvider>
            </>;
            const view = await render(bare('small', 'Host text', false));
            const original = elements(view.container).textarea;
            for (const size of sizes) {
                await view.rerender(bare(size, 'Host text', false));
                await settleLayout();
                const { control, textarea } = elements(view.container);
                expect(textarea).toBe(original);
                expect(getComputedStyle(textarea).fontSize).toBe('18px');
                expect(getComputedStyle(textarea).lineHeight).toBe('28px');
                expect(getComputedStyle(control).padding).toBe('0px');
                expect(getComputedStyle(control).borderTopWidth).toBe('0px');
                expect(control.getBoundingClientRect().height).toBe(28);
                await view.rerender(bare(size, 'Host text', true));
                await settleLayout();
                const clear = control.querySelector<HTMLButtonElement>('button');
                if (!clear) throw new Error('Missing borderless clear action');
                // Existing host integration uses the default 28px action and
                // 4px insets, independent of the library's bordered size mapping.
                expect(control.getBoundingClientRect().height).toBe(36);
                expect(clear.getBoundingClientRect().width).toBe(28);
                expect(clear.getBoundingClientRect().top - control.getBoundingClientRect().top).toBe(4);
                expect(clear.getBoundingClientRect().bottom).toBeLessThanOrEqual(control.getBoundingClientRect().bottom);
                await view.rerender(bare(size, '', true));
                await settleLayout();
                expect(control.querySelector('button')).toBeNull();
                expect(control.getBoundingClientRect().height).toBe(28);
            }
        });
        for (const appearance of ['outlined', 'filled'] as const) {
            for (const labeled of [false, true]) {
                it(`resolves all three sizes through the ${design}/${appearance}/${labeled ? 'label' : 'plain'} control`, async () => {
                    const view = await render(fixture(design, 'small', appearance, labeled));
                    const original = elements(view.container).textarea;
                    const heights: number[] = [];
                    for (const [index, size] of sizes.entries()) {
                        await view.rerender(fixture(design, size, appearance, labeled));
                        await settleLayout();
                        const { textarea, control } = elements(view.container);
                        const controlStyle = getComputedStyle(control);
                        const inputStyle = getComputedStyle(textarea);
                        const expected = geometry[design];
                        const materialFilled = design === 'md3' && labeled && appearance === 'filled';
                        expect(textarea).toBe(original);
                        expect(textarea.value).toBe('Keep this draft.');
                        expect(Number.parseFloat(controlStyle.minHeight)).toBe(expected.min[index]);
                        expect(Number.parseFloat(controlStyle.paddingInlineStart)).toBe(expected.inline[index]);
                        expect(Number.parseFloat(controlStyle.paddingInlineEnd)).toBe(expected.inline[index]);
                        expect(Number.parseFloat(controlStyle.paddingBlockStart)).toBe(materialFilled ? 24 : expected.block[index]);
                        expect(Number.parseFloat(controlStyle.paddingBlockEnd)).toBe(materialFilled ? 8 : expected.block[index]);
                        expect(Number.parseFloat(inputStyle.fontSize)).toBe(expected.font);
                        expect(Number.parseFloat(inputStyle.lineHeight)).toBe(expected.line);
                        expect(control.getBoundingClientRect().height).toBeGreaterThanOrEqual(expected.min[index]);
                        heights.push(control.getBoundingClientRect().height);

                        // Enabling the optional action must preserve the same
                        // padding, keep the first line clear and fit the action.
                        await view.rerender(fixture(design, size, appearance, labeled, 2, false, true));
                        await settleLayout();
                        const clear = control.querySelector<HTMLButtonElement>('button');
                        if (!clear) throw new Error('Missing clear action');
                        const bounds = control.getBoundingClientRect();
                        const action = clear.getBoundingClientRect();
                        expect(action.width).toBe([24, 28, 32][index]);
                        expect(action.top).toBeGreaterThanOrEqual(bounds.top);
                        expect(action.bottom).toBeLessThanOrEqual(bounds.bottom);
                        expect(action.right).toBeLessThanOrEqual(bounds.right);
                        expect(Number.parseFloat(getComputedStyle(textarea).paddingInlineEnd)).toBeGreaterThanOrEqual(action.width);
                    }
                    if (design === 'md3') expect(heights).toEqual([heights[0], heights[0], heights[0]]);
                    else {
                        expect(heights[1]).toBeGreaterThan(heights[0]);
                        expect(heights[2]).toBeGreaterThan(heights[1]);
                    }
                });
            }
        }
        for (const size of sizes) {
            it(`keeps rows, autoSize and density independent of ${design}/${size}`, async () => {
                const view = await render(fixture(design, size, 'outlined', true, 4));
                await settleLayout();
                const original = elements(view.container).textarea;
                const initialHeight = elements(view.container).control.getBoundingClientRect().height;
                await view.rerender(fixture(design, size, 'outlined', true, 7));
                await settleLayout();
                const largerHeight = elements(view.container).control.getBoundingClientRect().height;
                expect(largerHeight - initialHeight).toBeCloseTo(3 * geometry[design].line, 1);
                for (const density of ['compact', 'comfortable'] as const) {
                    await view.rerender(fixture(design, size, 'outlined', true, 7, false, false, density));
                    await settleLayout();
                    expect(elements(view.container).control.getBoundingClientRect().height).toBe(largerHeight);
                    expect(elements(view.container).textarea).toBe(original);
                    expect(original.value).toBe('Keep this draft.');
                }
                await view.rerender(fixture(design, size, 'outlined', true, 2, true));
                await settleLayout();
                expect(getComputedStyle(original).resize).toBe('none');
                if (CSS.supports('field-sizing', 'content')) {
                    const shortHeight = elements(view.container).control.getBoundingClientRect().height;
                    await fireEvent.change(original, { target: { value: Array.from({ length: 12 }, (_, index) => `Line ${index}`).join('\n') } });
                    await settleLayout();
                    expect(elements(view.container).control.getBoundingClientRect().height).toBeGreaterThan(shortHeight);
                }
            });
        }
    }
});
