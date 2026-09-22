import { afterAll, afterEach, beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act } from '@crab-dev/wake/test/react';
import { definePdfEditor } from '../web-component.js';
import type { PdfEditorElement } from '../web-component-types.js';
import wasmBase64 from '../../.fixtures/test-wasm.json';
import workerCode from '../../.fixtures/test-worker.json';
import { fixture } from './fixture.js';

const wasmBinary = Uint8Array.from(atob(wasmBase64), character => character.charCodeAt(0)).buffer;
const elements = new Set<PdfEditorElement>();
let releaseCount = 0;
const released = mock.fn(() => { releaseCount++; });
let workerUrl: string;
const NativeResizeObserver = globalThis.ResizeObserver;

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
    await act(async () => { elements.forEach(element => element.remove()); });
    elements.clear();
});
afterAll(() => { URL.revokeObjectURL(workerUrl); globalThis.ResizeObserver = NativeResizeObserver; });

async function mount() {
    const element = document.createElement('crab-pdf-editor');
    elements.add(element);
    await act(async () => { document.body.append(element); });
    await act(async () => { await element.ready(); });
    return element;
}

describe('PDF 编辑器 Web Component', () => {
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
            element.readOnly = true; element.theme = 'dark';
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
        expect(element.getState().document?.sessionId).not.toBe(session);
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
        Object.defineProperty(element, 'theme', { value: 'dark', configurable: true });
        elements.add(element); document.body.append(element);
        await act(async () => {
            definePdfEditor({ tagName: 'crab-pdf-preupgrade', styleText: '', createRuntime: () => ({ runtime: { workerUrl, wasmBinary } }) });
        });
        await act(async () => { await element.ready(); });
        expect(element.readOnly).toBe(true); expect(element.theme).toBe('dark');
        expect(Object.hasOwn(element, 'initialDocument')).toBe(false);
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
