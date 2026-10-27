import { afterAll, afterEach, beforeAll, describe, expect, it } from '@crab-dev/wake/test';
import bundleCode from '../.fixtures/test-web-component.json';
import { fixture } from '../src/__tests__/fixture.js';
import type { PdfEditorElement } from '../src/web-component-types.js';
import { THUMBNAIL_HEIGHT } from '../src/page-selection.js';
import { vars as pdfVars } from '../src/token.js';

const elements: PdfEditorElement[] = [];
const scripts: HTMLScriptElement[] = [];
let frame: HTMLIFrameElement;
let page: Document;
const failures: string[] = [];
function install() {
    const script = page.createElement('script');
    script.textContent = bundleCode;
    page.head.append(script); scripts.push(script);
}
beforeAll(async () => {
    // 产物运行在真正的无框架页面中，不共享 Wake 测试宿主的 React 或 act 全局状态。
    frame = document.createElement('iframe'); frame.width = '1280'; frame.height = '900';
    const loaded = new Promise<void>(resolve => { frame.addEventListener('load', () => resolve(), { once: true }); });
    document.body.append(frame); await loaded;
    page = frame.contentDocument!;
    page.defaultView!.addEventListener('error', event => { failures.push(event.message); });
    page.defaultView!.addEventListener('unhandledrejection', event => { failures.push(String(event.reason)); });
    page.addEventListener('crab-error', event => { failures.push(String((event as CustomEvent).detail)); });
    // iframe 有自己的全局对象；显式限制其 fetch，确保不会绕开父测试页的网络门禁。
    const fetch = page.defaultView!.fetch.bind(page.defaultView);
    page.defaultView!.fetch = (input, init) => {
        if (!/^(blob:|data:)/.test(String(input))) {
            const message = `Standalone bundle attempted an external request: ${String(input)}`;
            failures.push(message); return Promise.reject(new Error(message));
        }
        return fetch(input, init);
    };
    install();
});
afterAll(() => { scripts.forEach(script => script.remove()); frame.remove(); });
afterEach(async () => {
    elements.splice(0).forEach(element => element.remove());
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(failures).toEqual([]);
});

async function until(assertion: () => void) {
    const deadline = Date.now() + 15000;
    let failure: unknown;
    do {
        try { assertion(); return; } catch (error) { failure = error; }
        await new Promise(resolve => setTimeout(resolve, 30));
    } while (Date.now() < deadline);
    throw failure;
}
async function editor() {
    const element = page.createElement('crab-pdf-editor');
    elements.push(element); page.body.append(element);
    await element.ready(); return element;
}

async function expectThumbnailFocusInside(element: PdfEditorElement) {
    await until(() => {
        expect(element.shadowRoot!.querySelector('[data-page-index="0"]')).not.toBe(null);
    });
    const thumbnail = element.shadowRoot!.querySelector<HTMLButtonElement>('[data-page-index="0"]')!;
    const row = thumbnail.closest<HTMLElement>('[data-page-row]')!;
    const before = row.getBoundingClientRect();
    thumbnail.focus();
    await until(() => {
        expect(element.shadowRoot!.activeElement).toBe(thumbnail);
        expect(thumbnail.matches(':focus-visible')).toBe(true);
        const style = page.defaultView!.getComputedStyle(thumbnail);
        const width = parseFloat(style.outlineWidth), offset = parseFloat(style.outlineOffset);
        expect(style.outlineStyle).toBe('solid'); expect(width).toBeGreaterThan(0);
        const extent = width + offset, bounds = thumbnail.getBoundingClientRect();
        let clippedAncestors = 0;
        for (let ancestor = thumbnail.parentElement; ancestor; ancestor = ancestor.parentElement) {
            if (!['auto', 'scroll', 'hidden', 'clip'].includes(page.defaultView!.getComputedStyle(ancestor).overflowX)) continue;
            const clip = ancestor.getBoundingClientRect();
            const left = clip.left + ancestor.clientLeft;
            expect(bounds.left - extent).toBeGreaterThanOrEqual(left - 0.5);
            expect(bounds.right + extent).toBeLessThanOrEqual(left + ancestor.clientWidth + 0.5);
            clippedAncestors++;
        }
        expect(clippedAncestors).toBeGreaterThan(0);
        const after = row.getBoundingClientRect();
        expect(after.height).toBe(THUMBNAIL_HEIGHT);
        expect(after.width).toBe(before.width); expect(after.height).toBe(before.height);
        expect(bounds.top - extent).toBeGreaterThanOrEqual(after.top - 0.5);
        expect(bounds.bottom + extent).toBeLessThanOrEqual(after.bottom + 0.5);
    });
}

describe('无需框架、网络或额外资源的独立 JS', () => {
    it('紧凑缩放字段在浅深色中完整容纳最大百分比及后缀，不依赖宿主样式重置', async () => {
        const element = await editor();
        for (const theme of ['light', 'dark'] as const) {
            element.colorMode = theme;
            await until(() => {
                expect(element.shadowRoot!.querySelector(`[data-theme="${theme}"]`)).not.toBe(null);
            });
            await page.fonts.ready;
            const input = element.shadowRoot!.querySelector<HTMLInputElement>('input[aria-label="缩放百分比"]')!;
            const control = input.closest<HTMLElement>('[data-field-control]')!;
            const suffix = control.querySelector<HTMLElement>('[data-field-suffix]')!;
            const inputStyle = page.defaultView!.getComputedStyle(input);
            const measure = page.createElement('span');
            Object.assign(measure.style, {
                position: 'absolute', whiteSpace: 'pre', font: inputStyle.font,
                fontVariantNumeric: inputStyle.fontVariantNumeric,
                letterSpacing: inputStyle.letterSpacing,
            });
            page.body.append(measure);
            try {
                // Measure the full supported numeric range with the actual font,
                // including values wider than the empty editor's initial 75%.
                for (const value of ['8', '75', '600']) {
                    measure.textContent = value;
                    const available = input.getBoundingClientRect().width
                        - parseFloat(inputStyle.paddingInlineStart) - parseFloat(inputStyle.paddingInlineEnd);
                    expect(available).toBeGreaterThanOrEqual(measure.getBoundingClientRect().width);
                }
            } finally {
                measure.remove();
            }
            expect(input.disabled).toBe(true);
            expect(input.value).toBe('75');
            expect(input.scrollWidth).toBe(input.clientWidth);
            const bounds = control.getBoundingClientRect();
            const suffixBounds = suffix.getBoundingClientRect();
            expect(suffix.textContent).toBe('%');
            expect(suffixBounds.left).toBeGreaterThanOrEqual(bounds.left);
            expect(suffixBounds.right).toBeLessThanOrEqual(bounds.right);
            if (page.defaultView!.matchMedia('(pointer: fine)').matches) {
                expect(bounds.height).toBe(32);
            }
        }
    });

    it('初始化内嵌 Worker/WASM，绘制真实 PDF，并导出有效文件', async () => {
        const element = await editor();
        const source = `data:application/pdf;base64,${btoa(String.fromCharCode(...fixture(2)))}`;
        await element.open({ id: 'standalone', source, fileName: 'standalone.pdf' });
        await until(() => {
            const canvas = element.shadowRoot?.querySelector<HTMLCanvasElement>('[data-page-frame][data-visible="true"] canvas');
            expect(canvas).not.toBe(null); expect(canvas!.width).toBeGreaterThan(0);
        });
        expect(element.getState().document?.pageCount).toBe(2);
        const result = await element.exportPdf();
        expect((await result.blob.text()).startsWith('%PDF')).toBe(true);
        expect(result.fileName).toBe('standalone.pdf');
        const root = element.shadowRoot!.querySelector<HTMLElement>('[data-theme] > div')!;
        expect(getComputedStyle(root).display).toBe('flex');
        expect(root.getBoundingClientRect().height).toBeGreaterThan(400);
        expect(page.querySelector('[data-page-frame]')).toBe(null);
        let persisted = 0;
        element.onSave = async () => { persisted++; };
        await element.save();
        expect(persisted).toBe(1);

        const remove = element.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="删除页面"]')!;
        await until(() => { expect(remove.disabled).toBe(false); });
        remove.click();
        await until(() => { expect(element.shadowRoot!.querySelector<HTMLDialogElement>('dialog[open]')).not.toBe(null); });
        const dialog = element.shadowRoot!.querySelector<HTMLDialogElement>('dialog[open]')!;
        const cancel = [...dialog.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.trim() === '取消')!;
        expect(cancel).toBeDefined(); cancel.click();
        await until(() => { expect(dialog.open).toBe(false); });
        expect(element.getState().document?.pageCount).toBe(2);
    });

    it('重复加载同一脚本不重新注册，明暗主题互不影响，提示浮层保持在对应 Shadow DOM 内', async () => {
        const constructor = page.createElement('crab-pdf-editor').constructor;
        install(); expect(page.createElement('crab-pdf-editor').constructor).toBe(constructor);
        // Styles are owned by each Shadow root. Importing/reloading the public
        // standalone script must not inject duplicate component CSS in the host.
        expect(page.head.querySelectorAll('style')).toHaveLength(0);
        const first = await editor(), second = await editor();
        second.colorMode = 'dark';
        await until(() => { expect(second.shadowRoot?.querySelector('[data-theme="dark"]')).not.toBe(null); });
        const firstRoot = first.shadowRoot!.querySelector<HTMLElement>('[data-theme] > div')!;
        const secondRoot = second.shadowRoot!.querySelector<HTMLElement>('[data-theme] > div')!;
        expect(getComputedStyle(firstRoot).backgroundColor).not.toBe(getComputedStyle(secondRoot).backgroundColor);
        const button = second.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="打开 PDF"]');
        expect(button).not.toBe(null); button!.focus();
        await until(() => { expect(second.shadowRoot!.querySelector('[role="tooltip"]')).not.toBe(null); });
        expect(page.querySelector('[role="tooltip"]')).toBe(null);
    });

    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        it(`将 ${designSystem} 的明暗、语言和方向配置传到真实 Shadow 样式并保留会话`, async () => {
            const element = await editor();
            await element.open({ id: 'config', source: fixture(1) });
            const session = element.getState().document!.sessionId;
            const mount = element.shadowRoot!.querySelector('[part="container"]');
            const backgrounds: string[] = [];
            for (const colorMode of ['light', 'dark'] as const) {
                element.designSystem = designSystem; element.colorMode = colorMode;
                element.locale = 'en-US'; element.direction = 'rtl';
                element.size = 'small'; element.density = 'compact';
                await until(() => {
                    const boundary = element.shadowRoot!.querySelector<HTMLElement>('[part="container"] > [data-crab-design]')!;
                    expect(boundary.dataset.crabDesign).toBe(designSystem);
                    expect(boundary.dataset.theme).toBe(colorMode);
                    expect(boundary.dataset.crabSize).toBe('small'); expect(boundary.dataset.crabDensity).toBe('compact');
                    expect(boundary.lang).toBe('en-US'); expect(boundary.dir).toBe('rtl');
                    expect(page.defaultView!.getComputedStyle(boundary).direction).toBe('rtl');
                    // Real collected theme CSS must resolve the independent field contract.
                    expect(page.defaultView!.getComputedStyle(boundary).getPropertyValue('--token-semantic-field-control-min-height').trim()).toBe(designSystem === 'md3' ? '56px' : '0px');
                    expect(element.shadowRoot!.querySelector('[aria-label="Open PDF"]')).not.toBe(null);
                    expect(element.shadowRoot!.querySelector('[aria-label="Zoom percentage"]')).not.toBe(null);
                });
                const content = element.shadowRoot!.querySelector<HTMLElement>('[part="container"] > [data-crab-design] > div')!;
                const style = page.defaultView!.getComputedStyle(content);
                expect(style.display).toBe('flex'); expect(content.getBoundingClientRect().height).toBeGreaterThan(400);
                backgrounds.push(style.backgroundColor);
                // The real standalone CSS keeps the outward ring inside the
                // clipped virtual column, including selected thumbnails in RTL.
                await expectThumbnailFocusInside(element);
                element.style.setProperty(pdfVars['thumbnail.outline-width-focus'], '4px');
                element.style.setProperty(pdfVars['thumbnail.outline-offset-focus'], '3px');
                await expectThumbnailFocusInside(element);
                element.style.removeProperty(pdfVars['thumbnail.outline-width-focus']);
                element.style.removeProperty(pdfVars['thumbnail.outline-offset-focus']);
                expect(element.getState().document!.sessionId).toBe(session);
                expect(element.shadowRoot!.querySelector('[part="container"]')).toBe(mount);
            }
            expect(backgrounds[0]).not.toBe(backgrounds[1]);
            element.locale = 'zh-CN'; element.direction = 'ltr'; element.size = 'large'; element.density = 'comfortable';
            await until(() => {
                const boundary = element.shadowRoot!.querySelector<HTMLElement>('[part="container"] > [data-crab-design]')!;
                expect(boundary.lang).toBe('zh-CN'); expect(boundary.dir).toBe('ltr');
                expect(boundary.dataset.crabSize).toBe('large'); expect(boundary.dataset.crabDensity).toBe('comfortable');
                expect(element.shadowRoot!.querySelector('[aria-label="打开 PDF"]')).not.toBe(null);
            });
            expect(element.getState().document!.sessionId).toBe(session);
            expect((await element.exportPdf()).blob.size).toBeGreaterThan(0);
        });
    }

    it('在实际 style-src nonce 策略下加载静态及品牌样式，动态更新配置不重建 root', async () => {
        const isolated = document.createElement('iframe');
        isolated.width = '1280'; isolated.height = '900';
        isolated.srcdoc = '<!doctype html><meta http-equiv="Content-Security-Policy" content="style-src &#39;nonce-pdf-styles&#39; &#39;nonce-next-styles&#39;">';
        const loaded = new Promise<void>(resolve => isolated.addEventListener('load', () => resolve(), { once: true }));
        document.body.append(isolated); await loaded;
        const target = isolated.contentDocument!;
        const violations: { directive: string; blockedURI: string; sourceFile: string; sample: string }[] = [];
        const errors: string[] = [];
        target.defaultView!.addEventListener('error', event => errors.push(event.message));
        target.defaultView!.addEventListener('unhandledrejection', event => errors.push(String(event.reason)));
        target.addEventListener('securitypolicyviolation', event => violations.push({
            directive: event.violatedDirective, blockedURI: event.blockedURI, sourceFile: event.sourceFile, sample: event.sample,
        }));
        const fetch = target.defaultView!.fetch.bind(target.defaultView);
        target.defaultView!.fetch = (input, init) => {
            if (/^(blob:|data:)/.test(String(input))) return fetch(input, init);
            const message = `CSP fixture attempted an external request: ${String(input)}`;
            errors.push(message); return Promise.reject(new Error(message));
        };
        const script = target.createElement('script'); script.textContent = bundleCode; target.head.append(script);
        const element = target.createElement('crab-pdf-editor');
        element.nonce = 'pdf-styles'; element.designSystem = 'apple'; element.brandColor = '#16F';
        target.body.append(element);
        try {
            await element.ready();
            const mount = element.shadowRoot!.querySelector('[part="container"]');
            const verify = (nonce: string) => {
                const boundary = element.shadowRoot!.querySelector<HTMLElement>('[part="container"] > [data-crab-design]')!;
                expect(boundary.nonce).toBe(nonce);
                expect(element.shadowRoot!.querySelector<HTMLStyleElement>('style[data-crab-pdf-style]')?.nonce).toBe(nonce);
                expect(boundary.querySelector<HTMLStyleElement>('style[data-crab-brand-style]')?.nonce).toBe(nonce);
                const content = boundary.querySelector<HTMLElement>(':scope > div')!;
                expect(target.defaultView!.getComputedStyle(content).display).toBe('flex');
                expect(content.getBoundingClientRect().height).toBeGreaterThan(400);
                expect(element.shadowRoot!.adoptedStyleSheets).toHaveLength(0);
            };
            await until(() => verify('pdf-styles'));
            const boundary = element.shadowRoot!.querySelector<HTMLElement>('[part="container"] > [data-crab-design]')!;
            const firstBrand = target.defaultView!.getComputedStyle(boundary).getPropertyValue('--token-semantic-color-brand-primary');
            expect(firstBrand).not.toBe('');
            const firstStyle = element.shadowRoot!.querySelector('style[data-crab-pdf-style]');
            element.nonce = 'next-styles'; element.brandColor = '#f70';
            await until(() => verify('next-styles'));
            expect(target.defaultView!.getComputedStyle(boundary).getPropertyValue('--token-semantic-color-brand-primary')).not.toBe(firstBrand);
            expect(firstStyle!.isConnected).toBe(false);
            expect(element.shadowRoot!.querySelector('[part="container"]')).toBe(mount);
            expect(element.shadowRoot!.querySelectorAll('style[data-crab-pdf-style]')).toHaveLength(1);
            element.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="打开 PDF"]')!.focus();
            await until(() => {
                const tooltip = element.shadowRoot!.querySelector<HTMLElement>('[role="tooltip"]');
                expect(tooltip).not.toBe(null);
                const tooltipBoundary = tooltip!.closest<HTMLElement>('[data-crab-design]')!;
                expect(tooltipBoundary.dataset.crabDesign).toBe('apple');
                expect(tooltipBoundary.nonce).toBe('next-styles');
            });
            expect(target.querySelector('[role="tooltip"]')).toBe(null);
            expect(target.head.querySelectorAll('style')).toHaveLength(0);
            expect(violations).toEqual([]);
            expect(errors).toEqual([]);
        } finally {
            element.remove(); await new Promise<void>(resolve => queueMicrotask(resolve)); isolated.remove();
        }
    });
});
