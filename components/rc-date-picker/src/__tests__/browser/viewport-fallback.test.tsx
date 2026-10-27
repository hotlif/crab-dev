import { afterAll, beforeAll, describe, expect, it } from '@crab-dev/wake/test';
import { act, render, userEvent } from '@crab-dev/wake/test/react';
import { createPortal } from 'react-dom';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';
import DatePicker from '../../../esm/index.mjs';
import ActualDateDemo from '../../../.cache/viewport-demo.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const temporalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'Temporal');
beforeAll(() => {
    if (!temporalDescriptor) Object.defineProperty(globalThis, 'Temporal', { value: TemporalPolyfill, configurable: true });
});
afterAll(() => {
    if (!temporalDescriptor) Reflect.deleteProperty(globalThis, 'Temporal');
});

const cases = [
    { name: 'original-demo-720x480', width: 720, height: 480, placement: 'below', anchor: 'demo' },
    { name: 'below', width: 720, height: 640, placement: 'below', anchor: 'top' },
    { name: 'above', width: 720, height: 640, placement: 'above', anchor: 'bottom' },
    { name: 'available-right', width: 720, height: 480, placement: 'right', anchor: 'left' },
    { name: 'available-left', width: 720, height: 480, placement: 'left', anchor: 'right' },
    { name: 'narrow', width: 320, height: 640, placement: 'below', anchor: 'top' },
    { name: 'short', width: 720, height: 320, placement: 'below', anchor: 'middle' },
    { name: 'short-bottom-anchor', width: 720, height: 320, placement: 'above', anchor: 'bottom' },
] as const;

function frame() {
    return new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
}
function fieldGeometry(input: HTMLInputElement) {
    const control = input.closest<HTMLElement>('[data-field-control]');
    if (!control) throw new Error('Actual picker field-control is missing');
    const parent = control.parentElement;
    const field = parent?.hasAttribute('data-field-root') ? parent : control;
    const rects = [field.getBoundingClientRect(), ...Array.from(field.querySelectorAll<HTMLElement>(':scope > label, :scope > [data-field-support]'), text => text.getBoundingClientRect())];
    return { left: Math.min(...rects.map(r => r.left)), top: Math.min(...rects.map(r => r.top)), right: Math.max(...rects.map(r => r.right)), bottom: Math.max(...rects.map(r => r.bottom)) };
}
function requirePopup(input: HTMLInputElement) {
    const id = input.getAttribute('aria-controls'), popup = id ? input.ownerDocument.getElementById(id) : null;
    if (!popup) throw new Error('Actual published dropdown dialog is missing');
    return popup;
}
async function settle(input: HTMLInputElement) {
    await act(async () => {
        const started = performance.now();
        let previous = '', equalFrames = 0;
        while (performance.now() - started < 3500) {
            await frame();
            const id = input.getAttribute('aria-controls'), popup = id ? input.ownerDocument.getElementById(id) : null;
            const current = JSON.stringify([fieldGeometry(input), popup?.getBoundingClientRect().toJSON(), popup?.getAttribute('data-state')]);
            equalFrames = current === previous ? equalFrames + 1 : 0;
            previous = current;
            if (equalFrames >= 4 && performance.now() - started >= 400) return;
        }
        throw new Error('Actual dropdown geometry did not settle on natural frames');
    });
}
function visibleButton(button: HTMLElement, popup: HTMLElement) {
    const rect = button.getBoundingClientRect(), frameRect = popup.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(frameRect.left);
    expect(rect.right).toBeLessThanOrEqual(frameRect.right);
    expect(rect.top).toBeGreaterThanOrEqual(frameRect.top);
    expect(rect.bottom).toBeLessThanOrEqual(frameRect.bottom);
    const hit = button.ownerDocument.elementFromPoint((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);
    expect(hit === button || button.contains(hit)).toBe(true);
}

describe('published dropdown viewport fallback with actual picker fields', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                for (const scenario of cases) {
                    it(`${scenario.name}/${designSystem}/${colorMode}/${direction}: contains the frame and reaches real navigation/confirm`, async () => {
                        // An actual same-origin iframe supplies a real layout viewport.
                        // This is CSS720x480 (etc.), not a native browser200% claim.
                        const iframe = document.createElement('iframe');
                        iframe.width = String(scenario.width);
                        iframe.height = String(scenario.height);
                        Object.assign(iframe.style, { position: 'fixed', left: '0', top: '0', border: '0', zIndex: '20000' });
                        document.body.append(iframe);
                        const doc = iframe.contentDocument, win = iframe.contentWindow;
                        if (!doc || !win) throw new Error('Same-origin browser iframe unavailable');
                        doc.body.style.margin = '0';
                        const anchor = scenario.anchor;
                        const position = {
                            position: 'fixed' as const, width: 250,
                            ...(anchor === 'left' ? { left: 8, top: 180 }
                                : anchor === 'right' ? { right: 8, top: 180 }
                                    : anchor === 'bottom' ? { left: (scenario.width - 250) / 2, bottom: 8 }
                                        : { left: (scenario.width - 250) / 2, top: anchor === 'middle' ? 100 : 8 }),
                        };
                        const view = await render(createPortal(<>
                            <style>{compiledCss}</style>
                            <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction} locale="zh-CN">
                                <div style={position} data-viewport-picker>
                                    {anchor === 'demo' ? <ActualDateDemo /> : <DatePicker label="计划日期" supportingText="日期面板的选中项与今天标记分别呈现。" />}
                                </div>
                            </ConfigProvider>
                        </>, doc.body));
                        const keyTrace: { realm: string; type: string; key: string | null; code: string | null; keyCode: number | null; charCode: number | null; trusted: boolean; target: string | null; buttonDisabled: boolean | null; defaultPrevented: boolean; finalDefaultPrevented: boolean; iframeActive: string | null; parentActive: string | null }[] = [];
                        const observeKeys = (realm: string) => (event: Event) => {
                            const key = event as KeyboardEvent, target = event.target as Element | null, button = target?.closest('button');
                            const entry = { realm, type: event.type, key: key.key ?? null, code: key.code ?? null, keyCode: key.keyCode ?? null, charCode: key.charCode ?? null,
                                trusted: event.isTrusted, target: target?.nodeName ?? null, buttonDisabled: button?.disabled ?? null, defaultPrevented: event.defaultPrevented, finalDefaultPrevented: event.defaultPrevented,
                                iframeActive: doc.activeElement?.tagName ?? null, parentActive: document.activeElement?.tagName ?? null };
                            keyTrace.push(entry);
                            queueMicrotask(() => { entry.finalDefaultPrevented = event.defaultPrevented; });
                            if (keyTrace.length > 20) keyTrace.shift();
                        };
                        const iframeKeys = observeKeys('iframe'), parentKeys = observeKeys('parent');
                        const observedEvents = ['keydown', 'keyup', 'keypress', 'click'];
                        for (const type of observedEvents) {
                            doc.addEventListener(type, iframeKeys, true);
                            document.addEventListener(type, parentKeys, true);
                        }
                        try {
                            expect(win.innerWidth).toBe(scenario.width);
                            expect(win.innerHeight).toBe(scenario.height);
                            await doc.fonts.ready;
                            const input = doc.querySelector<HTMLInputElement>('[data-viewport-picker] input');
                            if (!input) throw new Error('Actual picker input missing');
                            const user = userEvent.setup();
                            // Wake's pointer target API is restricted to its own
                            // Element realm. Native DOM focus opens this real
                            // iframe field; subsequent keys use trusted CDP.
                            // Mouse activation is covered by the Native200 run.
                            await act(() => input.focus({ preventScroll: true }));
                            expect(doc.activeElement).toBe(input);
                            await settle(input);
                            const popup = requirePopup(input), bounds = fieldGeometry(input), rect = popup.getBoundingClientRect();
                            expect(input.getAttribute('aria-expanded')).toBe('true');
                            expect(popup.getAttribute('data-crab-design')).toBe(designSystem);
                            expect(popup.getAttribute('data-theme')).toBe(colorMode);
                            expect(popup.getAttribute('dir')).toBe(direction);
                            expect(rect.width).toBeGreaterThan(0);
                            expect(rect.height).toBeGreaterThan(0);
                            expect(rect.left).toBeGreaterThanOrEqual(7.5);
                            expect(rect.right).toBeLessThanOrEqual(scenario.width - 7.5);
                            expect(rect.top).toBeGreaterThanOrEqual(7.5);
                            expect(rect.bottom).toBeLessThanOrEqual(scenario.height - 7.5);
                            // Keep real labels/support clear on every possible side.
                            expect(rect.right <= bounds.left - 5 || rect.left >= bounds.right + 5 || rect.bottom <= bounds.top - 5 || rect.top >= bounds.bottom + 5).toBe(true);
                            if (scenario.placement === 'below') expect(rect.top).toBeGreaterThanOrEqual(bounds.bottom + 5);
                            if (scenario.placement === 'above') expect(rect.bottom).toBeLessThanOrEqual(bounds.top - 5);
                            if (scenario.placement === 'right') expect(rect.left).toBeGreaterThanOrEqual(bounds.right + 5);
                            if (scenario.placement === 'left') expect(rect.right).toBeLessThanOrEqual(bounds.left - 5);
                            const navigation = Array.from(popup.querySelectorAll<HTMLButtonElement>('button[aria-label]')).slice(0, 4);
                            expect(navigation.length).toBe(4);
                            for (const button of navigation) visibleButton(button, popup);
                            const previousText = popup.textContent;
                            await act(() => navigation[1]!.focus({ preventScroll: true }));
                            expect(doc.activeElement).toBe(navigation[1]);
                            // Wake0.1.45's Enter bridge emits no native button
                            // activation; Space exercises a real default click.
                            // The recorded trusted events below must prove it.
                            await act(() => user.keyboard(' '));
                            await settle(input);
                            expect({ monthChanged: popup.textContent !== previousText, keyTrace,
                                iframeActive: doc.activeElement?.tagName, parentActive: document.activeElement?.tagName,
                                keyboardBridge: user.keyboard.toString().slice(0, 2400), navigationDisabled: navigation[1]!.disabled }).toEqual(expect.objectContaining({ monthChanged: true }));
                            expect(keyTrace.some(event => event.type === 'click' && event.trusted && event.realm === 'iframe')).toBe(true);
                            if (scenario.name === 'original-demo-720x480' && designSystem === 'md3' && colorMode === 'light' && direction === 'ltr') console.info('Native iframe Space activation trace', JSON.stringify(keyTrace));
                            const next = Array.from(popup.querySelectorAll<HTMLButtonElement>('button[aria-label]'))[2];
                            if (!next) throw new Error('Real next-month button missing');
                            await act(() => next.focus({ preventScroll: true }));
                            expect(doc.activeElement).toBe(next);
                            await act(() => user.keyboard(' '));
                            await settle(input);
                            expect(popup.textContent).toBe(previousText);
                            const confirm = Array.from(popup.querySelectorAll<HTMLButtonElement>('button')).find(button => button.textContent?.trim() === '确定');
                            if (!confirm) throw new Error('Real confirm action missing');
                            // Native Tab scrolls the real clipped container; no scrollTop,
                            // scrollIntoView, synthetic keyboard event or DOM relocation.
                            for (let step = 0; step < 70 && doc.activeElement !== confirm; step++) await act(() => user.tab());
                            expect(doc.activeElement).toBe(confirm);
                            expect(input.getAttribute('aria-expanded')).toBe('true');
                            visibleButton(confirm, popup);
                            if (popup.scrollHeight > popup.clientHeight + 1) expect(popup.scrollTop).toBeGreaterThan(0);
                            const beforeConfirm = popup.getBoundingClientRect();
                            expect(beforeConfirm.left).toBeGreaterThanOrEqual(7.5);
                            expect(beforeConfirm.right).toBeLessThanOrEqual(scenario.width - 7.5);
                            await act(() => user.keyboard(' '));
                            await settle(input);
                            expect(input.getAttribute('aria-expanded')).toBe('false');
                        } finally {
                            for (const type of observedEvents) {
                                doc.removeEventListener(type, iframeKeys, true);
                                document.removeEventListener(type, parentKeys, true);
                            }
                            await act(async () => { await view.unmount(); });
                            iframe.remove();
                        }
                    });
                }
            }
        }
    }
});
