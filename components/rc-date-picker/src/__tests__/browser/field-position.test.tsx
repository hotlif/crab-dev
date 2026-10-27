import { afterAll, beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { createRef, StrictMode } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';
import DatePicker, { DateTimePicker, TimePicker } from '../../../esm/index.mjs';
import type { PickerFieldProps } from '../../types.js';
import compiledCss from '../../../.cache/browser-css.json';

const temporalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'Temporal');
beforeAll(() => {
    if (!temporalDescriptor) Object.defineProperty(globalThis, 'Temporal', { value: TemporalPolyfill, configurable: true });
});
afterAll(() => {
    if (!temporalDescriptor) Reflect.deleteProperty(globalThis, 'Temporal');
});

async function settle() {
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        // Isolate final layout geometry in this regression. Finishing finite
        // animations is not evidence of natural motion completion; the separate
        // normal-motion CDP capture suite must keep animations running normally.
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

function geometry(container: HTMLElement) {
    const input = container.querySelector<HTMLInputElement>('[data-own-picker] input');
    const control = input?.closest<HTMLElement>('[data-field-control]');
    if (!input || !control) throw new Error('Missing published picker input/control');
    const parent = control.parentElement;
    const field = parent?.hasAttribute('data-field-root') ? parent : control;
    const id = input.getAttribute('aria-controls');
    const popup = id ? document.getElementById(id) : null;
    return { input, control, field, popup };
}

const variants: PickerFieldProps[] = [
    {},
    { supportingText: 'This description belongs only to this field.' },
    // Keep the same field root while inserting an MD3 label that may not
    // change its layout dimensions. The observer must still refresh geometry.
    { label: '预约日期与时间', supportingText: 'This description belongs only to this field.' },
    { label: '预约日期与时间' },
    { label: '预约日期与时间', supportingText: 'This description belongs only to this field.' },
    { label: '预约日期与时间', supportingText: '说明文字自动换行。Long supporting text remains readable beside neighboring fields. '.repeat(2) },
    { label: '预约日期与时间', errorText: '请选择有效日期或时间。Choose an available date or time.' },
    { label: '预约日期与时间', appearance: 'filled', errorText: 'Filled field error remains outside the popup.' },
    {},
];

describe('published picker field positioning keeps its DOM reference', () => {
    for (const kind of ['date', 'datetime', 'time'] as const) {
        for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
            for (const colorMode of ['light', 'dark'] as const) {
                for (const side of ['below', 'above'] as const) {
                    it(`${kind} clears its own label/support/error ${side} (${designSystem}/${colorMode})`, async () => {
                        const inputRef = createRef<HTMLInputElement>();
                        const fixture = (field: PickerFieldProps, open: boolean) => <StrictMode>
                            <style>{compiledCss}</style>
                            <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                                <div style={{ position: 'fixed', left: 32, width: 240, ...(side === 'below' ? { top: 32 } : { bottom: 24 }) }}>
                                    <div data-own-picker="">
                                        {kind === 'date' ? <DatePicker {...field} ref={inputRef} open={open} />
                                            : kind === 'datetime' ? <DateTimePicker {...field} ref={inputRef} open={open} />
                                                : <TimePicker {...field} ref={inputRef} open={open} panelProps={{ defaultMode: 'input' }} />}
                                    </div>
                                    <div data-sibling-field="" style={{ position: 'absolute', top: 0, left: 280, width: 180, height: 80 }}>Sibling field is outside this boundary.</div>
                                </div>
                            </ConfigProvider>
                        </StrictMode>;
                        const view = await render(fixture(variants[0]!, false));
                        for (const fieldProps of variants) {
                            await view.rerender(fixture(fieldProps, false));
                            await settle();
                            const closed = geometry(view.container);
                            const closedWidth = closed.control.getBoundingClientRect().width;
                            await view.rerender(fixture(fieldProps, true));
                            // TimePicker does not open on focus by itself. The
                            // already-open fixture must still cover its floating
                            // label while the original input owns keyboard focus.
                            await act(async () => { inputRef.current?.focus(); });
                            await settle();
                            const { input, control, field, popup } = geometry(view.container);
                            if (!popup) throw new Error('Expected actual Portal dialog');
                            expect(input).toBe(closed.input);
                            expect(inputRef.current).toBe(input);
                            expect(control.getBoundingClientRect().width).toBeCloseTo(closedWidth, 1);
                            // Portals stay in the nearest theme boundary; they
                            // leave the field, not necessarily the render host.
                            expect(field.contains(popup)).toBe(false);
                            expect(input.closest('[data-own-picker]')?.contains(popup)).toBe(false);
                            expect(popup.getAttribute('data-crab-design')).toBe(designSystem);
                            expect(popup.getAttribute('data-theme')).toBe(colorMode);
                            const bounds = field.getBoundingClientRect();
                            const floating = popup.getBoundingClientRect();
                            expect(floating.width).toBeGreaterThan(0);
                            expect(floating.left).toBeCloseTo(control.getBoundingClientRect().left, 1);
                            if (side === 'below') expect(floating.top).toBeGreaterThanOrEqual(bounds.bottom + 5);
                            else expect(floating.bottom).toBeLessThanOrEqual(bounds.top - 5);
                            // Floating MD3 labels can paint outside the root box:
                            // checking only the box would miss a remaining overlap.
                            for (const text of field.querySelectorAll<HTMLElement>(':scope > label, :scope > [data-field-support]')) {
                                const rect = text.getBoundingClientRect();
                                if (side === 'below') expect(floating.top).toBeGreaterThanOrEqual(rect.bottom);
                                else expect(floating.bottom).toBeLessThanOrEqual(rect.top);
                            }
                            expect(input.getAttribute('aria-expanded')).toBe('true');
                        }
                    });
                }

                it(`${kind} preserves input ref, Escape and a single semantic clear (${designSystem}/${colorMode})`, async () => {
                    const changed = mock.fn();
                    const nativeInput = mock.fn();
                    const nativeChange = mock.fn();
                    const inputRef = createRef<HTMLInputElement>();
                    const value = Temporal.ZonedDateTime.from('2026-10-25T09:30:00+08:00[Asia/Shanghai]');
                    const shared = { ref: inputRef, label: '已选值', supportingText: 'Own description', defaultOpen: true, onValueChange: changed };
                    const view = await render(<StrictMode>
                        <style>{compiledCss}</style>
                        <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                            <div data-own-picker="" style={{ position: 'fixed', top: 32, left: 32, width: 240 }}>
                                {kind === 'date' ? <DatePicker {...shared} defaultValue={value} />
                                    : kind === 'datetime' ? <DateTimePicker {...shared} defaultValue={value} />
                                        : <TimePicker {...shared} defaultValue={{ hour: 9, minute: 30, second: 0 }} panelProps={{ defaultMode: 'input' }} />}
                            </div>
                        </ConfigProvider>
                    </StrictMode>);
                    await settle();
                    const { input, control } = geometry(view.container);
                    const width = control.getBoundingClientRect().width;
                    expect(inputRef.current).toBe(input);
                    input.addEventListener('input', nativeInput);
                    input.addEventListener('change', nativeChange);
                    await act(async () => { input.focus(); });
                    await fireEvent(input, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
                    await settle();
                    expect(input.getAttribute('aria-expanded')).toBe('false');
                    expect(document.activeElement).toBe(input);
                    expect(changed).toHaveBeenCalledTimes(0);
                    // Focus is on the original suffix button, not a field wrapper.
                    const action = control.querySelector<HTMLButtonElement>('button');
                    if (!action) throw new Error('Missing actual picker action');
                    await act(async () => { action.focus(); });
                    expect(action.getAttribute('data-role')).toBe('picker-clear');
                    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
                    await fireEvent(action, click);
                    await settle();
                    expect(changed).toHaveBeenCalledTimes(1);
                    expect(changed.calls.calls[0][0]).toBe(null);
                    expect(changed.calls.calls[0][1].reason).toBe('clear');
                    expect(changed.calls.calls[0][1].event.nativeEvent).toBe(click);
                    expect(nativeInput).toHaveBeenCalledTimes(0);
                    expect(nativeChange).toHaveBeenCalledTimes(0);
                    expect(input.value).toBe('');
                    expect(input.getAttribute('aria-expanded')).toBe('false');
                    expect(document.activeElement).toBe(input);
                    expect(inputRef.current).toBe(input);
                    expect(control.getBoundingClientRect().width).toBeCloseTo(width, 1);
                    input.removeEventListener('input', nativeInput);
                    input.removeEventListener('change', nativeChange);
                });
            }
        }
    }
});
