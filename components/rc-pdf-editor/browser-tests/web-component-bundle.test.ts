import { afterAll, afterEach, beforeAll, describe, expect, it } from '@crab-dev/wake/test';
import bundleCode from '../.fixtures/test-web-component.json';
import { fixture } from '../src/__tests__/fixture.js';
import type { PdfEditorElement } from '../src/web-component-types.js';

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

describe('无需框架、网络或额外资源的独立 JS', () => {
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
        const first = await editor(), second = await editor();
        second.theme = 'dark';
        await until(() => { expect(second.shadowRoot?.querySelector('[data-theme="dark"]')).not.toBe(null); });
        const firstRoot = first.shadowRoot!.querySelector<HTMLElement>('[data-theme] > div')!;
        const secondRoot = second.shadowRoot!.querySelector<HTMLElement>('[data-theme] > div')!;
        expect(getComputedStyle(firstRoot).backgroundColor).not.toBe(getComputedStyle(secondRoot).backgroundColor);
        const button = second.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="打开 PDF"]');
        expect(button).not.toBe(null); button!.focus();
        await until(() => { expect(second.shadowRoot!.querySelector('[role="tooltip"]')).not.toBe(null); });
        expect(page.querySelector('[role="tooltip"]')).toBe(null);
    });
});
