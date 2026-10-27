import { afterAll, afterEach, beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act } from '@crab-dev/wake/test/react';
import type { ConfigValue } from '@crab-dev/rc-config-provider';
import { definePdfEditor } from '../web-component.js';
import type { PdfEditorElement } from '../web-component-types.js';
import type { PdfEditorRef } from '../types.js';
import wasmBase64 from '../../.fixtures/test-wasm.json';
import workerCode from '../../.fixtures/test-worker.json';
import { fixture } from './fixture.js';

const wasmBinary = Uint8Array.from(atob(wasmBase64), character => character.charCodeAt(0)).buffer;
const elements = new Set<PdfEditorElement>();
let releaseCount = 0;
const released = mock.fn(() => { releaseCount++; });
let workerUrl: string;
const NativeResizeObserver = globalThis.ResizeObserver;

const nextTask = () => new Promise<void>(resolve => setTimeout(resolve, 0));

async function settleEditorUi(element: PdfEditorElement) {
    // ready() waits for the engine, not PdfEditor's async font transition or
    // the real Floating UI ref/position work. Yield tasks inside act and wait
    // for the actual rendered busy contract; do not assume a fixed delay.
    const deadline = Date.now() + 15000;
    do {
        await act(nextTask);
        const root = element.shadowRoot?.querySelector('[data-pdf-layout][aria-busy]');
        if (root?.getAttribute('aria-busy') === 'false') return;
    } while (Date.now() < deadline);
    throw new Error(`PDF UI did not settle after ready(): ${element.getState().status}`);
}

async function releaseElements(targets: Iterable<PdfEditorElement>) {
    const mounted = Array.from(targets);
    await act(async () => {
        for (const element of mounted) element.remove();
        // disconnectedCallback disposes in a microtask. One full task also
        // drains rejected Worker/transition and computePosition callbacks while
        // React's act scope is still active, as in the Dropdown regressions.
        await nextTask();
    });
    for (const element of mounted) elements.delete(element);
}

beforeAll(() => {
    workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
    // 此处只测试元素生命周期和公开命令；真实布局由独立产物浏览器测试覆盖。
    globalThis.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    definePdfEditor({ styleText: '', createRuntime: () => ({ runtime: { workerUrl, wasmBinary }, dispose: released }) });
});
afterEach(async () => {
    await releaseElements(elements);
});
afterAll(() => { URL.revokeObjectURL(workerUrl); globalThis.ResizeObserver = NativeResizeObserver; });

async function mount(configure?: (element: PdfEditorElement) => void) {
    const element = document.createElement('crab-pdf-editor');
    elements.add(element);
    configure?.(element);
    await act(async () => { document.body.append(element); });
    await act(async () => { await element.ready(); });
    await settleEditorUi(element);
    return element;
}

const defaultConfig: ConfigValue = {
    designSystem: 'md3', colorMode: 'light', brandColor: null, size: 'medium', density: 'standard',
    locale: 'zh-CN', direction: 'ltr', nonce: undefined,
};

function provider(element: PdfEditorElement): HTMLElement {
    const providers = element.shadowRoot!.querySelectorAll<HTMLElement>('[part="container"] > [data-crab-design][data-theme]');
    expect(providers).toHaveLength(1);
    return providers[0];
}

function expectConfig(element: PdfEditorElement, overrides: Partial<ConfigValue> = {}) {
    const expected = { ...defaultConfig, ...overrides };
    const boundary = provider(element);
    expect(boundary.dataset.crabDesign).toBe(expected.designSystem);
    expect(boundary.dataset.theme).toBe(expected.colorMode);
    expect(boundary.dataset.crabSize).toBe(expected.size);
    expect(boundary.dataset.crabDensity).toBe(expected.density);
    expect(boundary.lang).toBe(expected.locale);
    expect(boundary.dir).toBe(expected.direction);
    expect(boundary.nonce).toBe(expected.nonce ?? '');
    const sheets = boundary.querySelectorAll<HTMLStyleElement>(':scope > style[data-crab-brand-style]');
    if (expected.brandColor === null) {
        expect(boundary.hasAttribute('data-crab-brand')).toBe(false);
        expect(sheets).toHaveLength(0);
    } else {
        expect(sheets).toHaveLength(1);
        expect(sheets[0].nonce).toBe(expected.nonce ?? '');
        expect(sheets[0].textContent).toContain(`[data-crab-brand="${boundary.dataset.crabBrand}"]`);
        expect(sheets[0].textContent).toContain(`[data-crab-design="${expected.designSystem}"]`);
    }
    return boundary;
}

describe('PDF 编辑器 Web Component', () => {
    it('未配置时使用独立根默认值，挂载前后的 HTML 属性映射到同一配置边界', async () => {
        const element = await mount();
        const boundary = expectConfig(element);
        for (const name of ['designSystem', 'colorMode', 'size', 'density', 'locale', 'direction'] as const) {
            expect(element[name]).toBeUndefined();
        }
        expect(element.brandColor).toBe(null);
        expect(element.nonce).toBe('');
        expect('theme' in element).toBe(false);

        const attributes = {
            'design-system': 'apple', 'color-mode': 'dark', 'brand-color': '#AbC', size: 'large',
            density: 'comfortable', lang: 'en-US', dir: 'rtl', nonce: 'attribute-nonce',
        };
        const configured = await mount(candidate => {
            for (const [name, value] of Object.entries(attributes)) candidate.setAttribute(name, value);
        });
        expectConfig(configured, {
            designSystem: 'apple', colorMode: 'dark', brandColor: '#aabbcc', size: 'large', density: 'comfortable',
            locale: 'en-US', direction: 'rtl', nonce: 'attribute-nonce',
        });
        expect(configured.brandColor).toBe('#aabbcc');
        await act(async () => {
            for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
        });
        expect(provider(element)).toBe(boundary);
        expectConfig(element, {
            designSystem: 'apple', colorMode: 'dark', brandColor: '#aabbcc', size: 'large', density: 'comfortable',
            locale: 'en-US', direction: 'rtl', nonce: 'attribute-nonce',
        });
        await act(async () => {
            for (const name of Object.keys(attributes)) element.removeAttribute(name);
        });
        expectConfig(element);
        expect(provider(element)).toBe(boundary);
        expect(element.brandColor).toBe(null);
    });

    it('公共枚举 property 反射合法值，undefined 移除属性并恢复默认配置', async () => {
        const element = await mount();
        for (const value of ['apple', 'shadcn', 'md3'] as const) {
            await act(async () => { element.designSystem = value; });
            expect(element.designSystem).toBe(value); expect(element.getAttribute('design-system')).toBe(value);
            expectConfig(element, { designSystem: value });
        }
        for (const value of ['dark', 'light'] as const) {
            await act(async () => { element.colorMode = value; });
            expect(element.colorMode).toBe(value); expect(element.getAttribute('color-mode')).toBe(value);
            expectConfig(element, { colorMode: value });
        }
        for (const value of ['small', 'large', 'medium'] as const) {
            await act(async () => { element.size = value; });
            expect(element.size).toBe(value); expect(element.getAttribute('size')).toBe(value);
            expectConfig(element, { size: value });
        }
        for (const value of ['compact', 'comfortable', 'standard'] as const) {
            await act(async () => { element.density = value; });
            expect(element.density).toBe(value); expect(element.getAttribute('density')).toBe(value);
            expectConfig(element, { density: value });
        }
        for (const value of ['en-US', 'zh-CN'] as const) {
            await act(async () => { element.locale = value; });
            expect(element.locale).toBe(value); expect(element.getAttribute('lang')).toBe(value);
            expectConfig(element, { locale: value });
        }
        for (const value of ['rtl', 'ltr'] as const) {
            await act(async () => { element.direction = value; });
            expect(element.direction).toBe(value); expect(element.getAttribute('dir')).toBe(value);
            expectConfig(element, { direction: value });
        }
        await act(async () => {
            element.designSystem = undefined; element.colorMode = undefined; element.size = undefined;
            element.density = undefined; element.locale = undefined; element.direction = undefined;
        });
        for (const name of ['design-system', 'color-mode', 'size', 'density', 'lang', 'dir']) expect(element.hasAttribute(name)).toBe(false);
        for (const name of ['designSystem', 'colorMode', 'size', 'density', 'locale', 'direction'] as const) expect(element[name]).toBeUndefined();
        expectConfig(element);
    });

    it('非法 property 同步拒绝且不改变原值，旧设计 ID 不作为合法公共配置', async () => {
        const element = await mount(candidate => {
            candidate.designSystem = 'apple'; candidate.colorMode = 'dark'; candidate.brandColor = '#123456';
            candidate.size = 'large'; candidate.density = 'comfortable'; candidate.locale = 'en-US'; candidate.direction = 'rtl';
        });
        const invalid = [
            ['designSystem', 'design-system', 'material'], ['designSystem', 'design-system', 'macos'],
            ['colorMode', 'color-mode', 'system'], ['brandColor', 'brand-color', 'red'],
            ['size', 'size', 'xs'], ['density', 'density', 'regular'], ['locale', 'lang', 'fr-FR'],
            ['direction', 'dir', 'auto'],
        ] as const;
        const boundary = provider(element);
        for (const [property, attribute, value] of invalid) {
            const previous = element[property];
            const previousAttribute = element.getAttribute(attribute);
            expect(() => { Reflect.set(element, property, value); }).toThrow(RangeError);
            expect(element[property]).toBe(previous);
            expect(element.getAttribute(attribute)).toBe(previousAttribute);
        }
        expect(provider(element)).toBe(boundary);
        expectConfig(element, {
            designSystem: 'apple', colorMode: 'dark', brandColor: '#123456', size: 'large',
            density: 'comfortable', locale: 'en-US', direction: 'rtl',
        });
    });

    it('无效原始属性按未提供处理，恢复 Provider 默认且不派发初始化错误', async () => {
        const element = await mount(candidate => {
            candidate.designSystem = 'shadcn'; candidate.colorMode = 'dark'; candidate.brandColor = '#123456';
            candidate.size = 'large'; candidate.density = 'compact'; candidate.locale = 'en-US'; candidate.direction = 'rtl';
        });
        const errors = mock.fn();
        element.addEventListener('crab-error', errors);
        await act(async () => {
            element.setAttribute('design-system', 'macos'); element.setAttribute('color-mode', 'system');
            element.setAttribute('brand-color', 'red'); element.setAttribute('size', 'xs');
            element.setAttribute('density', 'regular'); element.setAttribute('lang', 'fr-FR'); element.setAttribute('dir', 'auto');
        });
        for (const name of ['designSystem', 'colorMode', 'size', 'density', 'locale', 'direction'] as const) expect(element[name]).toBeUndefined();
        expect(element.brandColor).toBe(null);
        expectConfig(element);
        await act(async () => { element.setAttribute('design-system', 'material'); });
        expect(element.designSystem).toBeUndefined();
        expectConfig(element);
        expect(errors).not.toHaveBeenCalled();
    });

    it('八项配置实时变更保留同一文档与运行时，并更新真实语言和 nonce 样式', async () => {
        const element = await mount(candidate => {
            candidate.designSystem = 'apple'; candidate.colorMode = 'dark'; candidate.brandColor = '#AbC';
            candidate.size = 'large'; candidate.density = 'comfortable'; candidate.locale = 'en-US';
            candidate.direction = 'rtl'; candidate.nonce = 'config-before-mount';
        });
        const loaded = mock.fn();
        element.addEventListener('crab-document-load', loaded);
        await act(async () => { await element.open({ id: 'config-session', source: fixture(2) }); element.goToPage(1); });
        const session = element.getState().document!.sessionId;
        const count = releaseCount;
        const boundary = expectConfig(element, {
            designSystem: 'apple', colorMode: 'dark', brandColor: '#aabbcc', size: 'large', density: 'comfortable',
            locale: 'en-US', direction: 'rtl', nonce: 'config-before-mount',
        });
        const mountNode = boundary.parentElement;
        expect(element.shadowRoot!.querySelector('button[aria-label="Open PDF"]')).not.toBe(null);
        expect(element.shadowRoot!.querySelector('input[aria-label="Zoom percentage"]')).not.toBe(null);
        expect(element.shadowRoot!.querySelector('[role="toolbar"][aria-label="Drawing toolbar"]')).not.toBe(null);
        expect(element.shadowRoot!.querySelector<HTMLStyleElement>('style[data-crab-pdf-style]')?.nonce).toBe('config-before-mount');
        await act(async () => {
            element.designSystem = 'shadcn'; element.colorMode = 'light'; element.brandColor = '#1677ff';
            element.size = 'small'; element.density = 'compact'; element.locale = 'zh-CN';
            element.direction = 'ltr'; element.nonce = 'config-after-mount';
        });
        expectConfig(element, {
            designSystem: 'shadcn', brandColor: '#1677ff', size: 'small', density: 'compact', nonce: 'config-after-mount',
        });
        expect(provider(element)).toBe(boundary);
        expect(boundary.parentElement).toBe(mountNode);
        expect(element.shadowRoot!.querySelector('button[aria-label="打开 PDF"]')).not.toBe(null);
        expect(element.shadowRoot!.querySelector('input[aria-label="缩放百分比"]')).not.toBe(null);
        expect(element.shadowRoot!.querySelector('[role="toolbar"][aria-label="绘图工具栏"]')).not.toBe(null);
        expect(element.shadowRoot!.querySelector('button[aria-label="Open PDF"]')).toBe(null);
        expect(element.shadowRoot!.querySelector<HTMLStyleElement>('style[data-crab-pdf-style]')?.nonce).toBe('config-after-mount');
        expect(element.shadowRoot!.querySelectorAll('style[data-crab-pdf-style]')).toHaveLength(1);
        expect(element.getState().document?.sessionId).toBe(session);
        expect(element.getState().document?.id).toBe('config-session');
        expect(element.getState().document?.pageCount).toBe(2);
        expect(element.getState().document?.currentPageIndex).toBe(1);
        expect(loaded).toHaveBeenCalledTimes(1);
        expect(releaseCount).toBe(count);
        await act(async () => { element.brandColor = null; element.nonce = ''; });
        expectConfig(element, { designSystem: 'shadcn', size: 'small', density: 'compact' });
        expect(element.hasAttribute('brand-color')).toBe(false);
        for (const style of element.shadowRoot!.querySelectorAll<HTMLStyleElement>('style')) expect(style.nonce).toBe('');
        expect(provider(element)).toBe(boundary);
        expect(element.getState().document?.sessionId).toBe(session);
        expect(releaseCount).toBe(count);
    });

    it('两个配置实例隔离品牌、语言、方向和 nonce，品牌复位不留下作用域样式', async () => {
        const hostBrandSheets = Array.from(document.head.querySelectorAll('[data-crab-brand-style]'));
        const mounted: PdfEditorElement[] = [];
        const scopedSheets = (element: PdfEditorElement, nonce: string) => {
            const shadow = element.shadowRoot!;
            const sheets = Array.from(shadow.querySelectorAll<HTMLStyleElement>('style[data-crab-brand-style]'));
            const boundaries = Array.from(shadow.querySelectorAll<HTMLElement>('[data-crab-brand]'));
            const scopes = sheets.map(sheet => sheet.getAttribute('data-crab-brand-style'));
            expect(new Set(scopes).size).toBe(sheets.length);
            expect(boundaries).toHaveLength(sheets.length);
            // Each ConfigBoundary/Portal owns an inherited scoped brand rule.
            // Multiple scopes are valid; duplicate/orphan rules are not.
            for (const sheet of sheets) {
                const scope = sheet.getAttribute('data-crab-brand-style');
                expect(scope?.length).toBeGreaterThan(0);
                const owners = boundaries.filter(boundary => boundary.getAttribute('data-crab-brand') === scope);
                expect(owners).toHaveLength(1);
                expect(sheet.parentElement).toBe(owners[0]);
                expect(sheet.textContent).toContain(`[data-crab-brand="${scope}"]`);
                expect(sheet.textContent).toContain(`[data-crab-design="${owners[0].dataset.crabDesign}"]`);
            }
            for (const sheet of shadow.querySelectorAll<HTMLStyleElement>('style')) expect(sheet.nonce).toBe(nonce);
            return sheets;
        };
        const rootSheet = (element: PdfEditorElement, nonce: string) => {
            const scope = provider(element).getAttribute('data-crab-brand');
            const sheets = scopedSheets(element, nonce).filter(sheet => sheet.getAttribute('data-crab-brand-style') === scope);
            expect(sheets).toHaveLength(1);
            return sheets[0];
        };
        try {
            const first = await mount(candidate => {
                mounted.push(candidate); candidate.brandColor = '#AbC'; candidate.nonce = 'first-nonce';
            });
            const second = await mount(candidate => {
                mounted.push(candidate);
                candidate.designSystem = 'apple'; candidate.colorMode = 'dark'; candidate.brandColor = '#1677ff';
                candidate.locale = 'en-US'; candidate.direction = 'rtl'; candidate.nonce = 'second-nonce';
            });
            const firstBoundary = provider(first), secondBoundary = provider(second);
            const secondSheets = scopedSheets(second, 'second-nonce').map(sheet => ({ sheet, css: sheet.textContent }));
            const firstSheet = rootSheet(first, 'first-nonce');
            const firstCss = firstSheet.textContent;
            const expectSecondUnchanged = () => {
                const current = scopedSheets(second, 'second-nonce');
                expect(current).toHaveLength(secondSheets.length);
                for (const [index, original] of secondSheets.entries()) {
                    expect(current[index]).toBe(original.sheet);
                    expect(current[index].textContent).toBe(original.css);
                }
                expectConfig(second, { designSystem: 'apple', colorMode: 'dark', brandColor: '#1677ff', locale: 'en-US', direction: 'rtl', nonce: 'second-nonce' });
            };
            expect(first.brandColor).toBe('#aabbcc');
            await act(async () => { first.brandColor = '#e76f00'; first.locale = 'en-US'; first.direction = 'rtl'; });
            expectConfig(first, { brandColor: '#e76f00', locale: 'en-US', direction: 'rtl', nonce: 'first-nonce' });
            expect(rootSheet(first, 'first-nonce')).toBe(firstSheet);
            expect(firstSheet.textContent).not.toBe(firstCss);
            expectSecondUnchanged();
            for (const reset of [null, undefined]) {
                await act(async () => { first.brandColor = '#123456'; });
                expect(rootSheet(first, 'first-nonce')).not.toBeUndefined();
                expectSecondUnchanged();
                await act(async () => { first.brandColor = reset; });
                expect(first.brandColor).toBe(null);
                expect(first.hasAttribute('brand-color')).toBe(false);
                expectConfig(first, { locale: 'en-US', direction: 'rtl', nonce: 'first-nonce' });
                expect(scopedSheets(first, 'first-nonce')).toHaveLength(0);
                expect(first.shadowRoot!.querySelectorAll('[data-crab-brand]')).toHaveLength(0);
                expectSecondUnchanged();
            }
            expect(provider(first)).toBe(firstBoundary); expect(provider(second)).toBe(secondBoundary);
            expect(Array.from(document.head.querySelectorAll('[data-crab-brand-style]'))).toEqual(hostBrandSheets);
        } finally {
            await releaseElements(mounted);
        }
    });

    it('标签重复注册幂等，插入后初始化，并桥接打开、导出和有类型的 DOM 通知', async () => {
        expect(definePdfEditor({ styleText: '' })).toBe(globalThis.customElements.get('crab-pdf-editor'));
        const element = await mount();
        const events: CustomEvent[] = [];
        const load = mock.fn((event: Event) => { if (event instanceof CustomEvent) events.push(event); });
        const state = mock.fn(), saved = mock.fn(), persist = mock.fn(async () => {});
        element.addEventListener('crab-document-load', load);
        element.addEventListener('crab-state-change', state);
        element.addEventListener('crab-saved', saved);
        await act(async () => { element.onSave = persist; });
        await act(async () => {
            const opened = await element.open({ id: 'web', source: fixture(2), fileName: 'web.pdf' });
            expect(opened.pageCount).toBe(2);
        });
        expect(load).toHaveBeenCalledTimes(1);
        const event = events[0];
        expect(event.detail.id).toBe('web'); expect(event.bubbles).toBe(true); expect(event.composed).toBe(true);
        expect(state).toHaveBeenCalled();
        await act(async () => {
            expect((await element.exportPdf()).blob.size).toBeGreaterThan(0);
            expect((await element.extractPages([0])).fileName).toBeDefined();
            await element.save();
        });
        expect(persist).toHaveBeenCalledTimes(1); expect(saved).toHaveBeenCalledTimes(1);
        expect(element.getPages()).toHaveLength(2);
        await act(async () => { element.goToPage(1); });
        expect(element.getState().document?.currentPageIndex).toBe(1);
        const latestSave = mock.fn(async () => {});
        await act(async () => { element.onSave = latestSave; });
        await act(async () => { await element.save(); });
        expect(latestSave).toHaveBeenCalledTimes(1);
    });

    it('实时更新只读、主题、工具栏和守卫时保留文档，命令使用最新的回调', async () => {
        const element = await mount();
        await act(async () => { await element.open({ id: 'original', source: fixture(1) }); });
        const session = element.getState().document?.sessionId;
        const guard = mock.fn(async () => false);
        await act(async () => {
            element.readOnly = true; element.colorMode = 'dark';
            element.toolbar = { visibility: { open: false } };
            element.beforeDocumentChange = guard;
        });
        expect(element.hasAttribute('readonly')).toBe(true);
        expect(element.shadowRoot?.querySelector('[data-theme="dark"]')).not.toBe(null);
        expect(element.getState().readOnly).toBe(true);
        expect(element.getState().document?.sessionId).toBe(session);
        await act(async () => { await expect(element.close()).rejects.toThrow(); });
        expect(guard).toHaveBeenCalledTimes(1);
        expect(element.getState().document?.id).toBe('original');
        await act(async () => { element.beforeDocumentChange = undefined; element.removeAttribute('readonly'); });
        await act(async () => { await element.close(); });
        expect(element.getState().document).toBe(null);
        expect(element.getState().readOnly).toBe(false);
    });

    it('同步 DOM 移动保留会话，实际移除释放运行时，重新插入创建新会话', async () => {
        const element = await mount();
        await act(async () => { await element.open({ id: 'move', source: fixture(1) }); });
        const session = element.getState().document?.sessionId;
        const count = releaseCount;
        await act(async () => { element.remove(); document.body.append(element); });
        expect(element.getState().document?.sessionId).toBe(session);
        expect(releaseCount).toBe(count);
        await act(async () => { element.remove(); });
        expect(releaseCount).toBe(count + 1);
        expect(element.getState().status).toBe('disposed');
        await expect(element.ready()).rejects.toThrow('插入');
        await act(async () => { document.body.append(element); });
        await act(async () => { await element.ready(); await element.open({ id: 'new', source: fixture(1) }); });
        await settleEditorUi(element);
        expect(element.getState().document?.sessionId).not.toBe(session);
    });

    it('普通 JS 动作在编辑器工具栏渲染 SVG、调用命令接口，并支持动态禁用和移除', async () => {
        const element = await mount();
        const onSelect = mock.fn((api: PdfEditorRef) => { expect(api.getState().document?.id).toBe('toolbar'); });
        const action = { id: 'web-region', label: '框选区域', placement: 'tools' as const, icon: { path: 'M3 3h6v2H5v4H3z' }, onSelect };
        await act(async () => {
            element.toolbar = { visibility: { open: false, merge: false }, extraActions: [{ ...action, disabled: state => !state.document }] };
        });
        const button = () => element.shadowRoot!.querySelector<HTMLButtonElement>('[role="toolbar"] button[aria-label="框选区域"]')!;
        expect(button().disabled).toBe(true);
        expect(button().querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24');
        expect(button().querySelector('path')?.getAttribute('d')).toBe(action.icon.path);
        expect(element.shadowRoot!.querySelector('input[type="file"][accept*="pdf"]')).toBe(null);
        await act(async () => { await element.open({ id: 'toolbar', source: fixture(1) }); });
        const session = element.getState().document!.sessionId;
        expect(button().disabled).toBe(false);
        await act(async () => { button().click(); });
        expect(onSelect).toHaveBeenCalledTimes(1);
        await act(async () => { element.toolbar = { extraActions: [{ ...action, disabled: true }] }; });
        expect(button().disabled).toBe(true);
        await act(async () => { button().click(); });
        expect(onSelect).toHaveBeenCalledTimes(1);
        await act(async () => { element.toolbar = undefined; });
        expect(button()).toBe(null);
        expect(element.getState().document!.sessionId).toBe(session);
    });

    it('不同实例隔离文档，命令错误只拒绝 Promise，不重复派发 UI 错误', async () => {
        const first = await mount(), second = await mount(), error = mock.fn();
        first.addEventListener('crab-error', error);
        await act(async () => {
            await first.open({ id: 'first', source: fixture(1) });
            await second.open({ id: 'second', source: fixture(2) });
        });
        await act(async () => { await expect(first.open({ id: 'bad', source: new Uint8Array([1, 2, 3]) })).rejects.toThrow(); });
        expect(first.getState().document?.id).toBe('first');
        expect(second.getState().document?.pageCount).toBe(2);
        expect(error).not.toHaveBeenCalled();
        expect(() => { first.runtime = { workerUrl, wasmBinary }; }).toThrow('挂载前');
    });

    it('接管定义前的 property，移除正在初始化的元素会拒绝等待并释放运行时', async () => {
        const element = document.createElement('crab-pdf-preupgrade') as PdfEditorElement;
        Object.defineProperty(element, 'initialDocument', { value: { id: 'before-define', source: fixture(1) }, configurable: true });
        Object.defineProperty(element, 'readOnly', { value: true, configurable: true });
        const upgradedConfig = {
            designSystem: 'apple', colorMode: 'dark', brandColor: '#AbC', size: 'large', density: 'comfortable',
            locale: 'en-US', direction: 'rtl', nonce: 'preupgrade-nonce',
        };
        for (const [name, value] of Object.entries(upgradedConfig)) {
            Object.defineProperty(element, name, { value, configurable: true });
        }
        // ready 只等待引擎；先确认初始文档已提交，再测试 close，避免与自动打开竞争。
        const loaded = new Promise<void>(resolve => {
            element.addEventListener('crab-document-load', () => resolve(), { once: true });
        });
        elements.add(element); document.body.append(element);
        await act(async () => {
            definePdfEditor({ tagName: 'crab-pdf-preupgrade', styleText: '', createRuntime: () => ({ runtime: { workerUrl, wasmBinary } }) });
        });
        await act(async () => { await element.ready(); await loaded; });
        await settleEditorUi(element);
        expect(element.readOnly).toBe(true); expect(element.colorMode).toBe('dark');
        expectConfig(element, {
            designSystem: 'apple', colorMode: 'dark', brandColor: '#aabbcc', size: 'large', density: 'comfortable',
            locale: 'en-US', direction: 'rtl', nonce: 'preupgrade-nonce',
        });
        for (const name of Object.keys(upgradedConfig)) expect(Object.hasOwn(element, name)).toBe(false);
        expect(element.nonce).toBe('preupgrade-nonce');
        expect(element.shadowRoot!.querySelector<HTMLStyleElement>('style[data-crab-pdf-style]')?.nonce).toBe('preupgrade-nonce');
        expect(Object.hasOwn(element, 'initialDocument')).toBe(false);
        expect(element.getState().document?.id).toBe('before-define');
        await act(async () => { await element.close(); });

        const pending = document.createElement('crab-pdf-editor'); elements.add(pending);
        let ready: Promise<void>;
        await act(async () => {
            document.body.append(pending); ready = pending.ready();
            void ready.catch(() => {}); pending.remove();
        });
        await expect(ready!).rejects.toThrow('卸载');
    });
});
