import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
// Layout-only exception: use published ESM and extracted application CSS, not
// the DOM suite's css() mock or a replacement for the component's spacing.
import Segmented from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const settleLayout = () => act(async () => {
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function group(container: HTMLElement): HTMLElement {
    const root = container.querySelector<HTMLElement>('[role="radiogroup"]');
    if (!root) throw new Error('Missing segmented group');
    return root;
}

function dimensions(root: HTMLElement) {
    return [root, ...root.querySelectorAll('label')].map(element => element.getBoundingClientRect().width);
}

function expectCenteredLabels(root: HTMLElement, requireCompleteText: boolean) {
    const segments = Array.from(root.querySelectorAll<HTMLLabelElement>('label'));
    const widths = segments.map(segment => segment.getBoundingClientRect().width);
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    for (const segment of segments) {
        const text = segment.querySelector<HTMLElement>('span:not([aria-hidden])');
        const input = segment.querySelector<HTMLInputElement>('input');
        if (!text || !input) throw new Error('Missing segment label/input');
        const textBounds = text.getBoundingClientRect();
        const segmentBounds = segment.getBoundingClientRect();
        expect(textBounds.width).toBeGreaterThan(0);
        if (requireCompleteText) {
            // Actual browser overflow measurement, not a string/style assertion.
            expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth);
            const range = document.createRange();
            range.selectNodeContents(text);
            const glyphBounds = range.getBoundingClientRect();
            expect(glyphBounds.left).toBeGreaterThanOrEqual(textBounds.left - 1);
            expect(glyphBounds.right).toBeLessThanOrEqual(textBounds.right + 1);
        }
        if (!input.checked) {
            // The old empty 16px indicator + 8px gap shifts this center by 12px.
            const centerDelta = (textBounds.left + textBounds.right - segmentBounds.left - segmentBounds.right) / 2;
            expect(Math.abs(centerDelta)).toBeLessThanOrEqual(0.75);
        }
    }
}

describe('Segmented real CSS text layout', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                for (const size of ['small', 'medium', 'large'] as const) {
                    it(`centers unselected text without changing intrinsic widths (${designSystem}/${colorMode}/${direction}/${size})`, async () => {
                        const fixture = (block: boolean, width = 320) => <>
                            <style>{compiledCss}</style>
                            <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                                <div style={{ width }}>
                                    <Segmented block={block} size={size} options={['日', '周', '月', '年']} />
                                </div>
                            </ConfigProvider>
                        </>;
                        const view = await render(fixture(false));
                        await settleLayout();
                        const root = group(view.container);
                        const before = dimensions(root);
                        expectCenteredLabels(root, true);
                        const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('input'));
                        for (const index of [1, 2, 0]) {
                            await fireEvent.click(inputs[index]);
                            await settleLayout();
                            expect(inputs[index].checked).toBe(true);
                            dimensions(root).forEach((width, item) => expect(width).toBeCloseTo(before[item], 1));
                            expectCenteredLabels(root, true);
                        }

                        await view.rerender(fixture(true));
                        await settleLayout();
                        expect(group(view.container).getBoundingClientRect().width).toBeCloseTo(320, 1);
                        expectCenteredLabels(group(view.container), true);

                        // Keep the exact constrained width from the reported case.
                        // At 240px even one selected CJK glyph may be ellipsized;
                        // the contract keeps equal segments and readable indicators
                        // rather than silently changing padding or hiding selection.
                        await view.rerender(fixture(true, 240));
                        await settleLayout();
                        expect(group(view.container).getBoundingClientRect().width).toBeCloseTo(240, 1);
                        expectCenteredLabels(group(view.container), false);
                        expect(document.documentElement.scrollWidth).toBe(document.documentElement.clientWidth);
                    });
                }
            }
        }
    }
});
