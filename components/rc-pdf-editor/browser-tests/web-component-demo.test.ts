import { afterEach, beforeEach, describe, expect, it } from '@crab-dev/wake/test';
import bundleCode from '../.fixtures/test-web-component.json';
import demo from '../.fixtures/test-web-component-demo.json';
import type { PdfEditorElement } from '../src/web-component-types.js';

let frame: HTMLIFrameElement;
let page: Document;
const failures: string[] = [];
const requests: string[] = [];

async function until(assertion: () => void) {
    const deadline = Date.now() + 12000;
    let failure: unknown;
    do {
        try { assertion(); return; } catch (error) { failure = error; }
        await new Promise(resolve => setTimeout(resolve, 30));
    } while (Date.now() < deadline);
    throw failure;
}

function editor(): PdfEditorElement { return page.querySelector('crab-pdf-editor')!; }
function button(name: string): HTMLButtonElement {
    const result = [...page.querySelectorAll('button'), ...editor().shadowRoot!.querySelectorAll('button')]
        .find(node => node.textContent?.trim() === name || node.getAttribute('aria-label') === name);
    if (!result) throw new Error(`Missing demo button: ${name}`);
    return result;
}
async function click(name: string) {
    await until(() => expect(button(name).disabled).toBe(false));
    button(name).click();
}
function checkbox(label: string) {
    const result = [...page.querySelectorAll('label')].find(node => node.textContent?.trim() === label)?.querySelector('input');
    if (!result) throw new Error(`Missing demo checkbox: ${label}`);
    result.click();
}
function contains(text: string) { expect(page.body.textContent).toContain(text); }

beforeEach(async () => {
    failures.length = 0; requests.length = 0;
    frame = document.createElement('iframe'); frame.width = '1280'; frame.height = '900';
    const loaded = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }));
    document.body.append(frame); await loaded;
    page = frame.contentDocument!;
    page.defaultView!.addEventListener('error', event => failures.push(event.message));
    page.defaultView!.addEventListener('unhandledrejection', event => failures.push(String(event.reason)));
    const fetch = page.defaultView!.fetch.bind(page.defaultView);
    page.defaultView!.fetch = (input, init) => {
        const url = String(input);
        if (/^(blob:|data:)/.test(url)) return fetch(input, init);
        requests.push(url);
        if (url === new URL('./samples/server-demo.pdf', page.baseURI).href) {
            return Promise.resolve(new Response(Uint8Array.from(atob(demo.pdfBase64), character => character.charCodeAt(0)), { headers: { 'Content-Type': 'application/pdf' } }));
        }
        failures.push(`Unexpected demo request: ${url}`);
        return Promise.reject(new Error('Unexpected network request'));
    };
    const container = page.createElement('div'); container.id = 'demo'; page.body.append(container);
    const styles = page.createElement('style'); styles.textContent = demo.css; page.head.append(styles);
    for (const code of [bundleCode, demo.code]) {
        const script = page.createElement('script'); script.textContent = code; page.head.append(script);
    }
    await until(() => expect(editor()?.getState().status).toBe('ready'));
});

afterEach(async () => {
    // 先断开自定义元素，给它一次微任务释放 Worker，再销毁整页。
    editor()?.remove();
    await new Promise(resolve => setTimeout(resolve, 30));
    frame.remove(); expect(failures).toEqual([]);
});

describe('Web Component 控制演示', () => {
    it('通过工具配置、DOM 属性和 HTTP source 驱动真实编辑器，截图后输出明确标记的模拟结果', async () => {
        expect(editor().shadowRoot!.querySelector('[aria-label="添加文字"]')).toBe(null);
        const noLocalPdf = () => {
            expect(editor().shadowRoot!.querySelector('input[type="file"][accept*="pdf"]')).toBe(null);
            expect(editor().shadowRoot!.querySelector('[aria-label="打开 PDF"]')).toBe(null);
            expect(editor().shadowRoot!.querySelector('[aria-label="合并 PDF"]')).toBe(null);
            expect(editor().shadowRoot!.textContent).not.toContain('选择 PDF 文件');
        };
        noLocalPdf();
        expect(button('框选并模拟 OCR').closest('[role="toolbar"]')?.getAttribute('aria-label')).toBe('绘图工具栏');
        expect(button('框选并模拟 OCR').disabled).toBe(true);
        expect(button('模拟识别当前页').disabled).toBe(true);
        await click('加载服务器 PDF');
        await until(() => contains('已从服务器加载 server-demo.pdf，共 2 页'));
        expect(requests).toEqual([new URL('./samples/server-demo.pdf', page.baseURI).href]);
        const session = editor().getState().document!.sessionId;
        const root = editor().shadowRoot!.querySelector<HTMLElement>('[data-theme] > div')!;
        expect(Math.round(root.getBoundingClientRect().height)).toBe(640);

        checkbox('仅显示固定工具');
        await until(() => expect(editor().shadowRoot!.querySelector('[aria-label="添加文字"]')).not.toBe(null));
        noLocalPdf();
        expect(button('框选并模拟 OCR').disabled).toBe(false);
        checkbox('只读模式'); checkbox('深色主题');
        await until(() => {
            expect(editor().getState().readOnly).toBe(true);
            expect(editor().shadowRoot!.querySelector('[data-theme="dark"]')).not.toBe(null);
        });
        expect(editor().getState().document!.sessionId).toBe(session);
        noLocalPdf();

        await click('模拟识别当前页');
        await until(() => contains('模拟 OCR 完成'));
        contains('【模拟数据 · 非真实识别结果】'); contains('截图页码：1');
        await until(() => {
            const preview = page.querySelector<HTMLImageElement>('img[alt="传给模拟 OCR 的真实 PDF 区域截图"]');
            expect(preview?.naturalWidth).toBe(600); expect(preview?.naturalHeight).toBe(420);
        });
        expect(requests.length).toBe(1);

        await click('加载服务器 PDF');
        await until(() => expect(editor().getState().document!.sessionId).not.toBe(session));
        await until(() => expect(page.querySelector('[aria-label="模拟 OCR 结果"]')).toBe(null));
    });

    it('取消框选、文档变更时取消在途 OCR，不保留旧结果；HTTP 失败可恢复', async () => {
        await click('加载服务器 PDF');
        await until(() => contains('已从服务器加载 server-demo.pdf，共 2 页'));
        await click('框选并模拟 OCR');
        await until(() => contains('在 PDF 上拖拽选择区域'));
        await click('取消 OCR');
        await until(() => contains('OCR 已取消'));
        expect(page.querySelector('[aria-label="模拟 OCR 结果"]')).toBe(null);

        await click('模拟识别当前页');
        await until(() => contains('正在模拟 OCR 响应'));
        await click('加载服务器 PDF');
        await until(() => contains('OCR 已取消'));
        expect(page.querySelector('[aria-label="模拟 OCR 结果"]')).toBe(null);

        const originalFetch = page.defaultView!.fetch;
        page.defaultView!.fetch = (input, init) => String(input).endsWith('/samples/server-demo.pdf')
            ? Promise.resolve(new Response('Not found', { status: 404 })) : originalFetch(input, init);
        await until(() => expect(button('加载服务器 PDF').disabled).toBe(false));
        await click('加载服务器 PDF');
        await until(() => contains('加载失败：'));
        expect(page.querySelector('input[aria-invalid="true"]')).not.toBe(null);
        expect(editor().getState().document?.pageCount).toBe(2);
        page.defaultView!.fetch = originalFetch;
        const session = editor().getState().document!.sessionId;
        await click('加载服务器 PDF');
        await until(() => expect(editor().getState().document!.sessionId).not.toBe(session));
        await until(() => contains('已从服务器加载 server-demo.pdf，共 2 页'));
    });

    it('键盘框选真实区域并输出 PNG；选择模式也能通过 Esc 取消', async () => {
        await click('加载服务器 PDF');
        await until(() => contains('已从服务器加载 server-demo.pdf，共 2 页'));
        await click('框选并模拟 OCR');
        await until(() => expect(editor().shadowRoot!.querySelector('[data-region-selector]')).not.toBe(null));
        const selector = editor().shadowRoot!.querySelector<HTMLElement>('[data-region-selector]')!;
        selector.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }));
        // 等待 React 提交每一步，后续按键必须使用已更新的选区端点。
        await new Promise(resolve => setTimeout(resolve, 30));
        selector.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true }));
        await until(() => expect(selector.querySelector('rect')).not.toBe(null));
        selector.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await until(() => contains('模拟 OCR 完成'));
        await until(() => {
            const image = page.querySelector<HTMLImageElement>('img[alt="传给模拟 OCR 的真实 PDF 区域截图"]');
            expect(image?.naturalWidth ?? 0).toBeGreaterThan(0);
            expect(image!.naturalWidth).toBeLessThan(600);
        });
        await click('框选并模拟 OCR');
        await until(() => expect(editor().shadowRoot!.querySelector('[data-region-selector]')).not.toBe(null));
        editor().shadowRoot!.querySelector('[data-region-selector]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await until(() => expect(button('框选并模拟 OCR').disabled).toBe(false));
        contains('OCR 已取消');
        expect(page.querySelector('[aria-label="模拟 OCR 结果"]')).toBe(null);
    });
});
