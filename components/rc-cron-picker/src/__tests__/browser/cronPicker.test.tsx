import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
// Geometry exception: published ESM + compiled CSS, with real Floating UI.
// The DOM suite's positioning substitute cannot prove text remains uncovered.
import CronPicker from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const settleLayout = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing geometry element: ${selector}`);
    return element;
}

function expectDescriptionOutsidePanel(input: HTMLInputElement, dialog: HTMLElement) {
    const field = input.closest('[data-field-root]');
    if (!(field instanceof HTMLElement)) throw new Error('Missing complete field');
    const description = requiredElement<HTMLElement>(field, '[data-field-support] > span');
    const fieldRect = field.getBoundingClientRect();
    const panelRect = dialog.getBoundingClientRect();
    expect(fieldRect.height).toBeGreaterThan(0);
    expect(panelRect.height).toBeGreaterThan(0);
    expect(panelRect.top).toBeGreaterThanOrEqual(fieldRect.bottom);
    const range = document.createRange();
    range.selectNodeContents(description);
    const textRects = Array.from(range.getClientRects());
    expect(textRects.length).toBeGreaterThan(0);
    for (const rect of textRects) {
        expect(rect.height).toBeGreaterThan(0);
        expect(rect.bottom).toBeLessThanOrEqual(panelRect.top);
    }
    // Check the actual paint hit, not only the description's own DOMRect.
    const last = textRects[textRects.length - 1];
    const hit = document.elementFromPoint(last.left + Math.min(2, last.width / 2), last.top + last.height / 2);
    expect(hit === description || description.contains(hit)).toBe(true);
    return description;
}

describe('CronPicker published validation placement', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const locale of ['zh-CN', 'en-US'] as const) {
            it(`keeps ${designSystem} ${locale} field text visible while an invalid draft preserves the committed plan`, async () => {
                const changed = mock.fn();
                const view = await render(<ConfigProvider designSystem={designSystem} locale={locale}>
                    <style>{compiledCss}</style>
                    {/* Host width exercises wrapping without recreating component CSS. */}
                    <div style={{ width: 240, margin: 24 }}>
                        <CronPicker label="Schedule" defaultValue="30 9 * * 1-5" previewCount={0} onValueChange={changed} />
                    </div>
                </ConfigProvider>);
                const input = requiredElement<HTMLInputElement>(view.container, 'input[aria-haspopup="dialog"]');
                const user = userEvent.setup();
                await act(() => input.focus());
                await act(async () => { await user.click(input); });
                await settleLayout();
                const dialog = requiredElement<HTMLElement>(document, '[role="dialog"]');
                expectDescriptionOutsidePanel(input, dialog);
                // Exercise the browser input path rather than changing the DOM
                // value outside React and manufacturing one input event.
                await act(async () => {
                    await user.clear(input);
                    await user.type(input, 'invalid-cron');
                });
                await settleLayout();
                expect(input.value).toBe('invalid-cron');
                expect(input.getAttribute('aria-invalid')).toBe('true');
                const error = expectDescriptionOutsidePanel(input, dialog);
                expect(error.getAttribute('role')).toBe('alert');
                expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
                const expressionLabel = locale === 'zh-CN' ? '生成的 Cron 表达式' : 'Generated Cron expression';
                expect(requiredElement<HTMLElement>(dialog, `[aria-label="${expressionLabel}"]`).textContent).toBe('30 9 * * 1-5');
                await act(async () => { await user.keyboard('{Enter}'); });
                expect(input.value).toBe('invalid-cron');
                expect(changed).not.toHaveBeenCalled();
                expectDescriptionOutsidePanel(input, dialog);
            });
        }
    }
});

describe('CronPicker published syntax direction', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps ${designSystem} ${colorMode} Cron fields in syntax order across direction changes`, async () => {
                const changed = mock.fn();
                const fixture = (direction: 'ltr' | 'rtl') => (
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                        <style>{compiledCss}</style>
                        <CronPicker label="Schedule" defaultValue="30 9 * * 1-5" open previewCount={0} onValueChange={changed} />
                    </ConfigProvider>
                );
                const view = await render(fixture('ltr'));
                const input = requiredElement<HTMLInputElement>(view.container, 'input[aria-haspopup="dialog"]');
                let firstExpression: HTMLElement | undefined;
                for (const direction of ['ltr', 'rtl', 'ltr'] as const) {
                    await view.rerender(fixture(direction));
                    await settleLayout();
                    const dialog = requiredElement<HTMLElement>(document, '[role="dialog"]');
                    const expression = requiredElement<HTMLElement>(dialog, '[aria-label="生成的 Cron 表达式"]');
                    firstExpression ??= expression;
                    expect(expression).toBe(firstExpression);
                    expect(requiredElement(view.container, 'input[aria-haspopup="dialog"]')).toBe(input);
                    expect(input.value).toBe('30 9 * * 1-5');
                    expect(getComputedStyle(input).direction).toBe('ltr');
                    expect(getComputedStyle(dialog).direction).toBe(direction);
                    expect(getComputedStyle(expression).direction).toBe('ltr');
                    expect(getComputedStyle(expression).unicodeBidi).toBe('isolate');
                    const text = expression.firstChild;
                    if (!text || text.nodeType !== globalThis.Node.TEXT_NODE) throw new Error('Missing Cron syntax text');
                    const words = [...(text.textContent ?? '').matchAll(/\S+/g)];
                    expect(words.map(word => word[0])).toEqual(['30', '9', '*', '*', '1-5']);
                    const bounds = words.map(word => {
                        const range = document.createRange();
                        range.setStart(text, word.index);
                        range.setEnd(text, word.index + word[0].length);
                        return range.getBoundingClientRect();
                    });
                    // Actual glyph geometry catches bidi reordering even when
                    // textContent and the parsed Cron value are unchanged.
                    for (let index = 1; index < bounds.length; index++) {
                        expect(bounds[index].width).toBeGreaterThan(0);
                        expect(bounds[index].left).toBeGreaterThan(bounds[index - 1].right);
                        expect(bounds[index].top).toBe(bounds[0].top);
                    }
                }
                expect(changed).not.toHaveBeenCalled();
            });
        }
    }
});
