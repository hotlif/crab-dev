import { beforeAll, afterAll, beforeEach, afterEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { createRef, useState, type ComponentProps } from 'react';
import PdfEditor from '../pdf-editor.js';
import { bitmap, PdfClient } from '../client.js';
import type { PdfEditorActionVisibility, PdfEditorPlugin, PdfEditorRef, PdfEditorToolbarAction } from '../types.js';
import { PDF_EDITOR_ACTIONS } from '../actions.js';
import wasmBase64 from '../../.fixtures/test-wasm.json';
import workerCode from '../../.fixtures/test-worker.json';
import { fixture } from './fixture.js';
import { passwordFixture } from './password-fixture.js';
import PageStage from '../page-stage.js';
import DocumentStage from '../document-stage.js';
import { DEFAULT_SHAPE_STYLE, SHAPE_LABELS } from '../drawing.js';
import type { DocumentInfo, Drawing, PdfObject, Request, Transform } from '../protocol.js';

let workerUrl: string;
let frameId = 0;
const frameCallbacks = new Map<number, FrameRequestCallback>();
const NativeResizeObserver = globalThis.ResizeObserver;
const resizeTargets = new Map<Element, (width: number, height: number) => void>();
const wasmBinary = Uint8Array.from(atob(wasmBase64), character => character.charCodeAt(0)).buffer;
beforeAll(() => {
    workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
    // 显式触发尺寸变化，防止原生测量回调越过测试的 act 边界。
    globalThis.ResizeObserver = class {
        private targets = new Set<Element>();
        constructor(private callback: ResizeObserverCallback) {}
        observe(target: Element) {
            this.targets.add(target);
            resizeTargets.set(target, (width, height) => this.callback([{ target, contentRect: new globalThis.DOMRect(0, 0, width, height),
                borderBoxSize: [], contentBoxSize: [], devicePixelContentBoxSize: [] }], this));
        }
        unobserve(target: Element) { this.targets.delete(target); resizeTargets.delete(target); }
        disconnect() { this.targets.forEach(target => resizeTargets.delete(target)); this.targets.clear(); }
    };
});
afterAll(() => { URL.revokeObjectURL(workerUrl); globalThis.ResizeObserver = NativeResizeObserver; });
beforeEach(() => {
    // 明确推进真实 Canvas 绘制帧，既验证画面交接，也避免无限 rAF 阻止 act 收敛。
    frameCallbacks.clear();
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(callback => { frameCallbacks.set(++frameId, callback); return frameId; });
    mock.spyOn(globalThis, 'cancelAnimationFrame').implement(id => { frameCallbacks.delete(id); });
});
afterEach(() => { mock.restoreAll(); });

function button(container: HTMLElement, label: string): HTMLButtonElement {
    const result = [...container.querySelectorAll('button')].find(value => value.textContent?.trim() === label || value.getAttribute('aria-label') === label);
    if (!result) throw new Error(`找不到按钮：${label}`);
    return result;
}

function objectItem(container: HTMLElement, label: string): HTMLElement {
    const result = [...container.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(value => value.textContent === label);
    if (!result) throw new Error(`找不到对象：${label}`);
    return result;
}

async function settled(assertion: () => void, paint = true) {
    const deadline = Date.now() + 15000;
    let failure: unknown;
    do {
        // 真实 Worker 的回包需要浏览器任务队列；每次让出队列都留在异步 act 内。
        await act(async () => {
            await new Promise<void>(resolve => {
                const channel = new MessageChannel();
                channel.port1.onmessage = () => { channel.port1.close(); channel.port2.close(); resolve(); };
                channel.port2.postMessage(null);
            });
            if (paint) {
                const callbacks = [...frameCallbacks.values()]; frameCallbacks.clear();
                callbacks.forEach(callback => callback(performance.now()));
            }
        });
        try { assertion(); return; } catch (error) { failure = error; }
    } while (Date.now() < deadline);
    throw failure;
}

function stageProps(client: PdfClient, info: DocumentInfo, selected?: PdfObject): ComponentProps<typeof PageStage> {
    return { client, page: info.pages[0], revision: info.revision, selected, transform: selected ? { ...selected.bounds, rotation: 0 } : undefined,
        viewport: { zoom: 1, panX: 10, panY: 10 }, width: 400, height: 300, disabled: false, tool: 'select', drawingStyle: DEFAULT_SHAPE_STYLE,
        onDraw: async () => true, onSelect: mock.fn(), onTransform: mock.fn(), onCommit: mock.fn(async () => true), onViewport: mock.fn(), onError: mock.fn(), onPending: mock.fn(), onPresented: mock.fn() };
}
function visibleCanvas(container: HTMLElement) { return container.querySelector<HTMLCanvasElement>('[data-page-frame][data-visible="true"] canvas'); }
function framePixels(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2')!, pixels = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
}
function redWidth(canvas: HTMLCanvasElement) {
    const pixels = framePixels(canvas);
    let left = canvas.width, right = -1;
    for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 200 && pixels[i + 1] < 80 && pixels[i + 2] < 80 && pixels[i + 3] > 240) {
        const x = (i / 4) % canvas.width;
        left = Math.min(left, x); right = Math.max(right, x);
    }
    return Math.max(0, right - left + 1) / canvas.width * 400;
}
function bluePixels(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2')!, pixels = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 10 && pixels[i + 1] < 10 && pixels[i + 2] > 240 && pixels[i + 3] > 240) count++;
    return count;
}
function blueCenter(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2')!, pixels = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    let count = 0, x = 0, y = 0;
    for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 10 && pixels[i + 1] < 10 && pixels[i + 2] > 240 && pixels[i + 3] > 240) {
        count++; x += (i / 4) % canvas.width + 0.5; y += canvas.height - Math.floor(i / 4 / canvas.width) - 0.5;
    }
    return { x: x / count / canvas.width * 400, y: y / count / canvas.height * 300 };
}

describe('独立 Worker 与编辑器交互', () => {
    it('只读编辑器安装区域插件，选择模式可从 UI 取消，卸载插件会清理并取消未完成任务', async () => {
        const ref = createRef<PdfEditorRef>(), setup = mock.fn(), cleanup = mock.fn(), onError = mock.fn();
        const plugin: PdfEditorPlugin = { id: 'region', setup: context => { setup(context); return cleanup; }, actions: [{
            id: 'choose', label: '插件区域选择', placement: 'tools', icon: <svg viewBox="0 0 24 24" />,
            async onSelect({ getEditor, signal }) { await getEditor().selectRegion({ signal }); },
        }] };
        const props = { ref, runtime: { workerUrl, wasmBinary }, initialDocument: { id: 'plugins', source: fixture() }, readOnly: true, onError };
        const view = await render(<PdfEditor {...props} plugins={[plugin]} />);
        try {
            await settled(() => expect(button(view.container, '插件区域选择').disabled).toBe(false));
            await fireEvent.click(button(view.container, '插件区域选择'));
            expect(button(view.container, '取消区域选择')).toBeDefined();
            await fireEvent.click(button(view.container, '取消区域选择'));
            await settled(() => expect(button(view.container, '插件区域选择').disabled).toBe(false));
            await fireEvent.click(button(view.container, '插件区域选择'));
            await view.rerender(<PdfEditor {...props} plugins={[]} />);
            await settled(() => expect(view.container.textContent).not.toContain('取消区域选择'));
            expect(setup).toHaveBeenCalledTimes(1); expect(cleanup).toHaveBeenCalledTimes(1);
            expect(ref.current?.getState().document?.dirty).toBe(false); expect(onError).not.toHaveBeenCalled();
        } finally { await view.unmount(); }
    });

    it('全部图标可动态移除和恢复，不重开文档，隐藏打开入口后 ref 仍可打开文件', async () => {
        const ref = createRef<PdfEditorRef>(), runtime = { workerUrl, wasmBinary };
        const props = { ref, runtime, initialDocument: { id: 'visibility', source: fixture() } };
        const view = await render(<PdfEditor {...props} />);
        try {
            await settled(() => expect(ref.current?.getState().document?.id).toBe('visibility'));
            const sessionId = ref.current!.getState().document!.sessionId;
            const visibility: PdfEditorActionVisibility = Object.fromEntries(PDF_EDITOR_ACTIONS.map(action => [action.id, false]));
            await view.rerender(<PdfEditor {...props} toolbar={{ visibility }} />);
            for (const action of PDF_EDITOR_ACTIONS) expect(view.container.querySelector(`button[aria-label="${action.label}"]`)).toBe(null);
            expect(view.container.querySelector('[data-action-divider]')).toBe(null);
            expect(view.container.querySelector('input[type="file"][accept*="pdf"]')).toBe(null);
            expect(view.container.querySelector('[aria-label="绘图工具栏"]')).toBe(null);
            expect(ref.current!.getState().document!.sessionId).toBe(sessionId);
            await act(async () => { expect((await ref.current!.exportPdf()).blob.size).toBeGreaterThan(0); await ref.current!.close(); });
            expect(view.container.querySelector('main button')).toBe(null);
            expect(view.container.textContent).toContain('等待加载 PDF');
            expect(view.container.textContent).not.toContain('请选择 PDF 文件');
            await act(async () => { await ref.current!.open({ id: 'external', source: fixture(1) }); });
            await view.rerender(<PdfEditor {...props} toolbar={{ visibility: {} }} />);
            for (const action of PDF_EDITOR_ACTIONS) expect(button(view.container, action.label)).toBeDefined();
            expect(view.container.querySelectorAll('input[type="file"][accept*="pdf"]')).toHaveLength(2);
            expect(ref.current!.getState().document?.id).toBe('external');
        } finally { await view.unmount(); }
    });

    it('隐藏当前工具会退出且恢复后不重新激活，隐藏撤销按钮保留键盘撤销', async () => {
        const ref = createRef<PdfEditorRef>(), props = { ref, runtime: { workerUrl, wasmBinary }, initialDocument: { id: 'tools', source: fixture(1) } };
        const view = await render(<PdfEditor {...props} />);
        try {
            await settled(() => expect(ref.current?.getState().document?.pageCount).toBe(1));
            await fireEvent.click(button(view.container, '插入空白页'));
            await settled(() => expect(ref.current?.getState().document?.pageCount).toBe(2));
            await fireEvent.click(button(view.container, '矩形边框'));
            expect(button(view.container, '矩形边框').getAttribute('aria-pressed')).toBe('true');
            await view.rerender(<PdfEditor {...props} toolbar={{ visibility: { rectangle: false, undo: false } }} />);
            expect(button(view.container, '选择对象').getAttribute('aria-pressed')).toBe('true');
            await fireEvent.keyDown(view.container.querySelector('main')!, { key: 'z', ctrlKey: true });
            await settled(() => expect(ref.current?.getState().document?.pageCount).toBe(1));
            await view.rerender(<PdfEditor {...props} toolbar={{ visibility: { undo: false } }} />);
            expect(button(view.container, '矩形边框').getAttribute('aria-pressed')).toBe('false');
            await view.rerender(<PdfEditor {...props} readOnly toolbar={{ visibility: { insertPage: true } }} />);
            expect(button(view.container, '插入空白页').disabled).toBe(true);
        } finally { await view.unmount(); }
    });

    it('侧栏开关隐藏后收起面板把焦点还给画布', async () => {
        const ref = createRef<PdfEditorRef>();
        const props = { ref, runtime: { workerUrl, wasmBinary }, initialDocument: { id: 'focus', source: fixture() } };
        const view = await render(<PdfEditor {...props} />);
        try {
            await settled(() => expect(ref.current?.getState().document?.id).toBe('focus'));
            if (button(view.container, '页面面板').getAttribute('aria-expanded') === 'false') await fireEvent.click(button(view.container, '页面面板'));
            await view.rerender(<PdfEditor {...props} toolbar={{ visibility: { togglePages: false } }} />);
            await fireEvent.click(button(view.container, '收起页面面板'));
            expect(document.activeElement).toBe(view.container.querySelector('main'));
            expect(view.container.querySelector('aside[aria-label="页面管理"]')?.hasAttribute('hidden')).toBe(true);
        } finally { await view.unmount(); }
    });

    it('扩展动作分区渲染、动态禁用、异步忙碌及错误共用宿主契约，不能绕过只读权限', async () => {
        const ref = createRef<PdfEditorRef>(), onError = mock.fn();
        let fail: (error: Error) => void = () => {};
        const request = new Promise<void>((_resolve, reject) => { fail = reject; });
        const onSelect = mock.fn(() => request);
        const icon = <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /></svg>;
        const actions: readonly PdfEditorToolbarAction[] = [
            { id: 'test.main', label: '扩展请求', icon, placement: 'main', disabled: state => !state.document, onSelect },
            { id: 'test.tools', label: '扩展历史', icon, placement: 'tools', onSelect: async editor => { await editor.undo(); } },
            { id: 'test.status', label: '扩展定位', icon, placement: 'status', disabled: state => !state.document, onSelect: editor => editor.goToPage(1) },
            { id: 'test.hidden', label: '隐藏扩展', icon, placement: 'main', visible: false, onSelect },
        ];
        const view = await render(<PdfEditor ref={ref} runtime={{ workerUrl, wasmBinary }} readOnly toolbar={{ extraActions: actions }} onError={onError} />);
        try {
            await act(async () => { await ref.current!.ready(); });
            expect(button(view.container, '扩展请求').disabled).toBe(true);
            await act(async () => { await ref.current!.open({ id: 'custom', source: fixture() }); });
            expect(button(view.container, '扩展请求').closest('[role="toolbar"]')?.getAttribute('aria-label')).toBe('PDF 编辑工具栏');
            expect(button(view.container, '扩展历史').closest('[role="toolbar"]')?.getAttribute('aria-label')).toBe('绘图工具栏');
            expect(button(view.container, '扩展定位').closest('[role="toolbar"]')).toBe(null);
            expect(view.container.querySelector('button[aria-label="隐藏扩展"]')).toBe(null);
            await fireEvent.click(button(view.container, '扩展定位'));
            expect(ref.current!.getState().document?.currentPageIndex).toBe(1);
            await fireEvent.click(button(view.container, '扩展请求'));
            expect(button(view.container, '扩展请求').disabled).toBe(true);
            await fireEvent.click(button(view.container, '扩展请求'));
            expect(onSelect).toHaveBeenCalledTimes(1);
            await act(async () => { fail(new Error('业务扩展失败')); });
            expect(onError).toHaveBeenCalledTimes(1);
            expect(view.container.querySelector('[role="alert"]')?.textContent).toBe('业务扩展失败');
            expect(button(view.container, '扩展请求').disabled).toBe(false);
            await fireEvent.click(button(view.container, '扩展历史'));
            await settled(() => expect(onError).toHaveBeenCalledTimes(2));
            expect(ref.current!.getState().canEdit).toBe(false);
            expect(ref.current!.getState().document?.dirty).toBe(false);
        } finally { await view.unmount(); }
    });

    it('公开 ref 与状态事件共用会话：初始输入只读一次、外部保存、提取、关闭和重开', async () => {
        const ref = createRef<PdfEditorRef>(), onStateChange = mock.fn(), onSaved = mock.fn(), onError = mock.fn();
        const onSave = mock.fn(async () => {}), runtime = { workerUrl, wasmBinary };
        const view = await render(<PdfEditor ref={ref} runtime={runtime} initialDocument={{ id: 'first', source: fixture(), fileName: 'first.pdf' }}
            onStateChange={onStateChange} onSave={onSave} onSaved={onSaved} onError={onError} />);
        try {
            await settled(() => expect(ref.current?.getState().document?.id).toBe('first'));
            await act(async () => { await ref.current!.ready(); });
            const sessionId = ref.current!.getState().document!.sessionId;
            // 新建输入对象及不同 initialDocument 不得隐式重载当前编辑会话。
            await view.rerender(<PdfEditor ref={ref} runtime={{ ...runtime }} initialDocument={{ id: 'ignored', source: fixture(1) }}
                onStateChange={onStateChange} onSave={onSave} onSaved={onSaved} onError={onError} />);
            expect(ref.current!.getState().document?.sessionId).toBe(sessionId);
            await act(async () => {
                const saved = await ref.current!.save();
                expect(saved.documentId).toBe('first'); expect(saved.fileName).toBe('first.pdf');
                expect((await ref.current!.extractPages([0])).blob.type).toBe('application/pdf');
            });
            expect(onSave).toHaveBeenCalledTimes(1); expect(onSaved).toHaveBeenCalledTimes(1);
            await act(async () => { await ref.current!.close(); });
            expect(ref.current!.getState().document).toBe(null);
            expect(view.container.textContent).toContain('请选择 PDF 文件');
            await act(async () => { await ref.current!.open({ id: 'second', source: fixture(1), fileName: 'second.pdf' }); });
            expect(ref.current!.getState().document?.pageCount).toBe(1);
            expect(view.container.textContent).toContain('second.pdf');
            expect(onStateChange).toHaveBeenCalled(); expect(onError).not.toHaveBeenCalled();
        } finally { await view.unmount(); }
    });

    it('命令式打开失败只拒绝 Promise，不弹出密码 UI 或重复触发 onError，关闭走统一守卫', async () => {
        const ref = createRef<PdfEditorRef>(), onError = mock.fn(), guard = mock.fn(() => false);
        const protectedPdf = await passwordFixture(wasmBinary);
        const view = await render(<PdfEditor ref={ref} runtime={{ workerUrl, wasmBinary }}
            initialDocument={{ id: 'first', source: fixture() }} beforeDocumentChange={guard} onError={onError} />);
        try {
            await settled(() => expect(ref.current?.getState().document?.id).toBe('first'));
            await act(async () => {
                await expect(ref.current!.close()).rejects.toThrow('取消');
                await expect(ref.current!.open({ id: 'bad', source: new Uint8Array([1, 2]) })).rejects.toThrow('取消');
            });
            expect(guard).toHaveBeenCalledTimes(2); expect(onError).not.toHaveBeenCalled();
            expect(ref.current!.getState().document?.id).toBe('first');
            guard.implement(() => true);
            await act(async () => { await expect(ref.current!.open({ id: 'protected', source: protectedPdf })).rejects.toThrow('密码'); });
            expect(view.container.querySelector('input[type="password"]')).toBe(null);
            expect(onError).not.toHaveBeenCalled();
            await act(async () => { await ref.current!.open({ id: 'protected', source: protectedPdf, password: 'reader' }); });
            expect(ref.current!.getState().document?.editable).toBe(false); expect(ref.current!.getState().canEdit).toBe(false);
        } finally { await view.unmount(); }
    });

    it('真实 WebGL 上下文恢复后无需重新打开 PDF 即可重绘页面', async () => {
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(), password: '' }), props = stageProps(client, opened);
        const view = await render(<PageStage {...props} />);
        try {
            await settled(() => expect(visibleCanvas(view.container)).not.toBe(null));
            const canvas = visibleCanvas(view.container)!, gl = canvas.getContext('webgl2')!;
            const extension = gl.getExtension('WEBGL_lose_context')!;
            await act(async () => {
                const lost = new Promise<Event>(resolve => canvas.addEventListener('webglcontextlost', resolve, { once: true }));
                extension.loseContext();
                expect((await lost).defaultPrevented).toBe(true);
            });
            expect(gl.isContextLost()).toBe(true);
            await act(async () => {
                const restored = new Promise<void>(resolve => canvas.addEventListener('webglcontextrestored', () => resolve(), { once: true }));
                extension.restoreContext(); await restored;
            });
            await settled(() => expect(bluePixels(canvas)).toBeGreaterThan(20));
            expect(gl.isContextLost()).toBe(false);
            expect(visibleCanvas(view.container)).toBe(canvas);
            expect(props.onError).not.toHaveBeenCalled();
        } finally { await view.unmount(); client.close(); }
    });
    it('反复跨页挂载缩略图后，主画布仍持有有效 WebGL 上下文与页面像素', async () => {
        const editor = createRef<PdfEditorRef>();
        const view = await render(<PdfEditor ref={editor} runtime={{ workerUrl, wasmBinary }} initialDocument={{ id: 'test', source: fixture(30) }} />);
        // 保留移出的 DOM 引用，覆盖浏览器尚未 GC 已卸载缩略图的连续滚动场景。
        const retired = new Set<HTMLCanvasElement>();
        try {
            await settled(() => expect(objectItem(view.container, '文字：Page 1')).toBeDefined());
            await act(async () => {
                for (const [target, resize] of resizeTargets) {
                    if (target.closest('[aria-label="PDF 页面列表"]')) resize(208, 420);
                    if (target.parentElement?.getAttribute('aria-label') === 'PDF 页面画布') resize(640, 480);
                }
            });
            const main = [...view.container.querySelectorAll<HTMLCanvasElement>('[aria-label="PDF 页面画布"] canvas')];
            for (const index of [5, 10, 15, 20, 25, 29, 20, 10, 0, 15, 0]) {
                view.container.querySelectorAll('canvas').forEach(canvas => retired.add(canvas));
                await act(async () => editor.current!.goToPage(index));
                await settled(() => expect(objectItem(view.container, `文字：Page ${index + 1}`)).toBeDefined());
            }
            expect(retired.size).toBeGreaterThan(32);
            for (const canvas of main) expect(canvas.getContext('webgl2')!.isContextLost()).toBe(false);
            expect(bluePixels(visibleCanvas(view.container)!)).toBeGreaterThan(20);
        } finally { await view.unmount(); retired.clear(); }
    });
    it('连续预览与当前页只渲染一次，往返已缓存页面不会再次请求 Worker', async () => {
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(), password: '' });
        const sent = mock.spyOn(globalThis.Worker.prototype, 'postMessage');
        const props = stageProps(client, opened), onCurrentPage = mock.fn();
        const view = await render(<DocumentStage {...props} pages={opened.pages} navigation={{ index: 0, sequence: 0 }} onCurrentPage={onCurrentPage} />);
        try {
            await settled(() => expect(props.onPresented).toHaveBeenCalledWith(opened.pages[0], expect.any(Array)));
            await view.rerender(<DocumentStage {...props} page={opened.pages[1]} pages={opened.pages} navigation={{ index: 1, sequence: 1 }} onCurrentPage={onCurrentPage} />);
            await settled(() => expect(props.onPresented).toHaveBeenCalledWith(opened.pages[1], expect.any(Array)));
            expect(sent.calls.calls.length).toBe(2);
            await view.rerender(<DocumentStage {...props} pages={opened.pages} navigation={{ index: 0, sequence: 2 }} onCurrentPage={onCurrentPage} />);
            await settled(() => expect(props.onPresented).toHaveBeenCalledTimes(3));
            expect(sent.calls.calls.length).toBe(2);
            expect(bluePixels(visibleCanvas(view.container)!)).toBeGreaterThan(20);
            expect(props.onError).not.toHaveBeenCalled();
        } finally { await view.unmount(); client.close(); }
    });
    it('跨页等待新画面时工具栏与旧对象树保持显示，拦截旧对象并在就绪后整体接替', async () => {
        const editor = createRef<PdfEditorRef>();
        const view = await render(<PdfEditor ref={editor} runtime={{ workerUrl, wasmBinary }} initialDocument={{ id: 'test', source: fixture(3) }} />);
        let release!: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        const load = PdfClient.prototype.frame;
        try {
            await settled(() => expect(objectItem(view.container, '文字：Page 1')).toBeDefined());
            // 延迟页帧交接，稳定覆盖真实滚动中“当前页已变，像素和对象仍未就绪”的窗口。
            mock.spyOn(PdfClient.prototype, 'frame').implement(async function (this: PdfClient, ...args: Parameters<PdfClient['frame']>) {
                await gate;
                return load.call(this, ...args);
            });
            const names = ['添加图片', '插入空白页', '合并 PDF', '旋转页面', '删除页面', '矩形边框', '圆形/椭圆', '直线'];
            const controls = names.map(name => button(view.container, name));
            const tree = view.container.querySelector('[role="tree"]')!;
            const original = objectItem(view.container, '文字：Page 1');
            for (const index of [1, 2, 0, 2, 1]) {
                await act(async () => editor.current!.goToPage(index));
                names.forEach((name, offset) => {
                    expect(button(view.container, name)).toBe(controls[offset]);
                    expect(controls[offset].disabled).toBe(false);
                });
                expect(objectItem(view.container, '文字：Page 1')).toBe(original);
                expect(original.getAttribute('aria-disabled')).toBe('false');
                if (index !== 0) {
                    expect(tree.closest('[aria-busy]')?.getAttribute('aria-busy')).toBe('true');
                    // 旧列表保留焦点与外观，等待期间仍拒绝把前一页的同序号对象选到新页。
                    await fireEvent(original, new PointerEvent('pointerup', { bubbles: true, button: 0 }));
                    await fireEvent.keyDown(tree, { key: 'ArrowDown' });
                    expect(view.container.querySelector('[aria-label="属性字段"]')).toBe(null);
                }
            }
            release();
            await settled(() => {
                expect(objectItem(view.container, '文字：Page 2')).toBeDefined();
                expect(tree.closest('[aria-busy]')?.getAttribute('aria-busy')).toBe('false');
            });
            await fireEvent(objectItem(view.container, '文字：Page 2'), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
            expect(view.container.querySelector('[aria-label="属性字段"] textarea')?.textContent).toBe('Page 2');
            expect(button(view.container, '撤销').disabled).toBe(true);
        } finally { release(); await view.unmount(); }
    });
    it('手动缩放不被对象选择、面板尺寸、翻页或加载失败覆盖，显式适应和新文档仍可重置', async () => {
        const editor = createRef<PdfEditorRef>(), source = fixture(3), runtime = { workerUrl, wasmBinary };
        const view = await render(<PdfEditor ref={editor} runtime={runtime} initialDocument={{ id: 'test', source }} />);
        await settled(() => expect(objectItem(view.container, '文字：Page 1')).toBeDefined());
        const measured = view.container.querySelector('[aria-label="PDF 页面画布"] > div')!;
        const resize = async (width: number, height: number) => { await act(async () => { resizeTargets.get(measured)!(width, height); }); };
        const zoom = view.container.querySelector<HTMLInputElement>('input[aria-label="缩放百分比"]')!;
        const setZoom = async () => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(zoom, '250');
            await fireEvent.input(zoom); await fireEvent(zoom, new FocusEvent('focusout', { bubbles: true }));
        };
        await resize(640, 480);
        await settled(() => expect(zoom.value).toBe('202'));
        await setZoom(); expect(zoom.value).toBe('250');
        await settled(() => expect(button(view.container, '添加图片').disabled).toBe(false));
        await fireEvent(objectItem(view.container, '文字：Page 1'), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
        await resize(625, 480); expect(zoom.value).toBe('250');
        await fireEvent.click(button(view.container, '属性面板'));
        await resize(905, 460); expect(zoom.value).toBe('250');
        await act(async () => editor.current?.goToPage(1)); expect(zoom.value).toBe('250');
        await act(async () => { await expect(editor.current!.open({ id: 'invalid', source: new Uint8Array([1, 2, 3]) })).rejects.toThrow(); });
        expect(zoom.value).toBe('250');
        await act(async () => editor.current?.fitToPage());
        expect(zoom.value).toBe('193');
        await setZoom();
        await act(async () => editor.current?.open({ id: 'second', source: fixture(2) }));
        await settled(() => expect(zoom.value).toBe('193'));
        await view.unmount();
    });
    it('Ctrl/Command 滚轮在只读预览中按鼠标锚点缩放，合并帧、限制倍率且卸载取消待处理输入', async () => {
        mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(() => new globalThis.DOMRect(0, 0, 400, 300));
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(4), password: '' });
        const props = stageProps(client, opened), onZoom = mock.fn(), onCurrentPage = mock.fn();
        function ZoomPreview() {
            const [viewport, setViewport] = useState({ ...props.viewport, zoom: 1.5 });
            return <DocumentStage {...props} viewport={viewport} disabled pages={opened.pages} navigation={{ index: 0, sequence: 0 }}
                onCurrentPage={onCurrentPage} onViewport={value => { onZoom(value.zoom); setViewport(value); }} />;
        }
        const view = await render(<ZoomPreview />);
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(null));
        const before = blueCenter(visibleCanvas(view.container)!), count = bluePixels(visibleCanvas(view.container)!);
        const wheel = async (deltaY: number, metaKey = false, deltaMode = 0) => {
            const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, ctrlKey: !metaKey, metaKey, deltaY, deltaMode, clientX: before.x, clientY: before.y });
            await fireEvent(visibleCanvas(view.container)!, event); expect(event.defaultPrevented).toBe(true);
        };
        await wheel(-Math.log(2) / 0.004); await wheel(-Math.log(2) / 0.004, true);
        expect(onZoom).not.toHaveBeenCalled();
        await settled(() => { expect(onZoom).toHaveBeenCalledWith(3); expect(bluePixels(visibleCanvas(view.container)!)).toBeGreaterThan(count * 3); });
        const after = blueCenter(visibleCanvas(view.container)!);
        expect(Math.abs(after.x - before.x)).toBeLessThan(1); expect(Math.abs(after.y - before.y)).toBeLessThan(1);
        expect(onZoom).toHaveBeenCalledTimes(1); expect(onCurrentPage).not.toHaveBeenCalled();
        await wheel(-1000000, false, 1); await settled(() => expect(onZoom).toHaveBeenCalledWith(8));
        await wheel(1000000, false, 2); await settled(() => expect(onZoom).toHaveBeenCalledWith(0.1));
        const calls = onZoom.calls.calls.length;
        await wheel(-50); await view.unmount();
        await settled(() => expect(onZoom.calls.calls.length).toBe(calls));
        client.close(); expect(props.onError).not.toHaveBeenCalled();
    });
    it('连续预览滚轮浏览不缩放，导航与键盘可定位远页，页面共用三个画布', async () => {
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(20), password: '' });
        const props = stageProps(client, opened), onCurrentPage = mock.fn();
        const navigation = { index: 0, sequence: 0 };
        const view = await render(<DocumentStage {...props} pages={opened.pages} navigation={navigation} onCurrentPage={onCurrentPage} />);
        const grid = view.container.querySelector<HTMLElement>('[aria-label="PDF 连续页面预览"]')!;
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(null));
        expect(view.container.querySelectorAll('canvas').length).toBe(3);
        const background = view.container.querySelector('canvas')!;
        await settled(() => expect(bluePixels(background)).toBeGreaterThan(20));
        await fireEvent(background, new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 200 }));
        await settled(() => expect(onCurrentPage).toHaveBeenCalledWith(1));
        expect(props.onViewport).not.toHaveBeenCalled();
        await view.rerender(<DocumentStage {...props} page={opened.pages[9]} pages={opened.pages} navigation={{ index: 9, sequence: 1 }} onCurrentPage={onCurrentPage} />);
        await settled(() => {
            expect(props.onPresented).toHaveBeenCalledWith(opened.pages[9], expect.any(Array));
            expect(bluePixels(visibleCanvas(view.container)!)).toBeGreaterThan(20);
        });
        await fireEvent.keyDown(grid, { key: 'End' });
        await settled(() => expect(onCurrentPage).toHaveBeenCalledWith(19));
        await fireEvent.keyDown(grid, { key: 'Home' });
        await settled(() => expect(onCurrentPage).toHaveBeenCalledWith(0));
        expect(view.container.querySelectorAll('canvas').length).toBe(3);
        await view.unmount(); client.close(); expect(props.onError).not.toHaveBeenCalled();
    });
    it('等待渲染及纹理准备时保留上一帧，真正绘制后整体替换并释放旧位图', async () => {
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(), password: '' }), props = stageProps(client, opened);
        const view = await render(<PageStage {...props} />);
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(null));
        const originalCanvas = visibleCanvas(view.container)!;
        const canvases = [...view.container.querySelectorAll('canvas')];
        expect(bluePixels(originalCanvas)).toBeGreaterThan(20);
        const close = mock.spyOn(globalThis.ImageBitmap.prototype, 'close');
        let release!: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        const load = client.frame.bind(client);
        mock.spyOn(PdfClient.prototype, 'frame').implement(async (...args) => { await gate; return load(...args); });
        const edited = await client.request('edit', { revision: opened.revision, command: { kind: 'update', page: 0, object: 0, patch: { fontSize: 28 } } });
        await view.rerender(<PageStage {...props} page={edited.pages[0]} revision={edited.revision} />);
        for (let i = 0; i < 3; i++) await settled(() => { expect(visibleCanvas(view.container)).toBe(originalCanvas); expect(bluePixels(originalCanvas)).toBeGreaterThan(20); });
        expect(close).not.toHaveBeenCalled();
        release();
        await settled(() => expect(view.container.querySelector('[data-page-frame][data-visible="false"]')).not.toBe(null), false);
        expect(visibleCanvas(view.container)).toBe(originalCanvas); expect(close).not.toHaveBeenCalled();
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(originalCanvas));
        expect(bluePixels(visibleCanvas(view.container)!)).toBeGreaterThan(20); expect(close).toHaveBeenCalledTimes(1);
        expect([...view.container.querySelectorAll('canvas')]).toEqual(canvases);
        await view.unmount(); client.close();
        expect(close).toHaveBeenCalledTimes(2); expect(props.onError).not.toHaveBeenCalled();
    });
    for (const shape of ['rectangle', 'ellipse'] as const) it(`${SHAPE_LABELS[shape]}松手后旧尺寸不会覆盖完整选区，接替帧第一帧就包含控制柄`, async () => {
        mock.spyOn(Element.prototype, 'setPointerCapture').implement(() => {});
        mock.spyOn(Element.prototype, 'releasePointerCapture').implement(() => {});
        mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(() => new globalThis.DOMRect(0, 0, 400, 300));
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(), password: '' });
        const info = await client.request('edit', { revision: opened.revision, command: { kind: 'shape', page: 0,
            drawing: { shape, points: [{ x: 80, y: 70 }, { x: 140, y: 120 }], style: { ...DEFAULT_SHAPE_STYLE, stroke: [255, 0, 0, 255], strokeWidth: 4 } } } });
        const object = (await client.request('page', { page: 0, revision: info.revision })).objects[2];
        let transformed: Transform | undefined;
        let props = { ...stageProps(client, info, object), onTransform: (value: Transform) => { transformed = value; } };
        const view = await render(<PageStage {...props} />);
        let release!: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        try {
            await settled(() => expect(visibleCanvas(view.container)).not.toBe(null));
            await settled(() => expect(props.onPresented).toHaveBeenCalled());
            const original = visibleCanvas(view.container)!;
            const pointer = (type: string, x: number, y: number) => fireEvent(original, new PointerEvent(type, { bubbles: true, pointerId: 1, button: 0, clientX: x, clientY: y }));
            const x = 10 + object.bounds.x + object.bounds.width, y = 10 + object.bounds.y + object.bounds.height;
            await pointer('pointerdown', x, y);
            for (const delta of [10, 20, 30]) {
                await pointer('pointermove', x + delta, y + delta / 2);
                expect(transformed?.width).toBeCloseTo(object.bounds.width + delta, 2);
                props = { ...props, transform: transformed };
                await view.rerender(<PageStage {...props} />);
                await settled(() => expect(bluePixels(original)).toBeGreaterThan(20));
            }
            await pointer('pointerup', x + 30, y + 15);
            expect(props.onCommit).toHaveBeenCalledWith(transformed);
            const target = transformed!;
            const preview = framePixels(original);
            // 提交期间滚动条/侧栏测量可能改变画布尺寸；下一次 rAF 前仍须保留最终预览。
            const resizedWidth = redWidth(original);
            const bitmapWidth = original.width;
            await view.rerender(<PageStage {...props} width={401} disabled />);
            expect(redWidth(original)).toBeGreaterThan(resizedWidth - 2);
            await settled(() => {
                expect(original.width).toBeGreaterThan(bitmapWidth);
                expect(redWidth(original)).toBeGreaterThan(resizedWidth - 2);
            });
            await view.rerender(<PageStage {...props} disabled />);
            expect(redWidth(original)).toBeGreaterThan(resizedWidth - 2);
            await settled(() => expect(framePixels(original).every((value, index) => value === preview[index])).toBe(true));
            // 模拟提交中的交互锁；画面必须逐像素保持，而不是卸载控制柄。
            await view.rerender(<PageStage {...props} disabled />);
            await settled(() => expect(framePixels(original).every((value, index) => value === preview[index])).toBe(true));
            // 自动提交尚未完成时，上层仍可能回传旧文档尺寸；已松手的最终预览不能被覆盖。
            await view.rerender(<PageStage {...props} transform={{ ...object.bounds, rotation: 0 }} disabled />);
            await settled(() => expect(framePixels(original).every((value, index) => value === preview[index])).toBe(true));
            await pointer('pointerdown', x + 30, y + 15);
            await pointer('pointermove', x + 40, y + 20);
            await pointer('pointerup', x + 40, y + 20);
            expect(transformed).toBe(target);
            expect(props.onCommit).toHaveBeenCalledTimes(1);
            // 即使父级提前解除忙碌状态，仍保留同一份最终预览直到新画面接替。
            await view.rerender(<PageStage {...props} />);
            await settled(() => expect(framePixels(original).every((value, index) => value === preview[index])).toBe(true));
            const load = client.frame.bind(client);
            mock.spyOn(PdfClient.prototype, 'frame').implement(async (...args) => { await gate; return load(...args); });
            const edited = await client.request('edit', { revision: info.revision, command: { kind: 'update', page: 0, object: object.index,
                patch: { transform: transformed, shapeStyle: object.shapeStyle } } });
            const next = (await client.request('page', { page: 0, revision: edited.revision })).objects[2];
            expect(next.bounds.x).toBeCloseTo(target.x, 2);
            expect(next.bounds.y).toBeCloseTo(target.y, 2);
            expect(next.bounds.width).toBeCloseTo(target.width, 2);
            expect(next.bounds.height).toBeCloseTo(target.height, 2);
            props = { ...props, page: edited.pages[0], revision: edited.revision, selected: next, transform: { ...next.bounds, rotation: 0 } };
            await view.rerender(<PageStage {...props} disabled />);
            await settled(() => expect(framePixels(original).every((value, index) => value === preview[index])).toBe(true));
            release();
            await settled(() => expect(visibleCanvas(view.container)).not.toBe(original));
            const committed = visibleCanvas(view.container)!, firstPaint = framePixels(committed);
            await view.rerender(<PageStage {...props} />);
            // 解锁交互不应再多绘制一帧控制柄，避免接替画面闪一下。
            await settled(() => expect(framePixels(committed).every((value, index) => value === firstPaint[index])).toBe(true));
            // 下一次提交失败后解除快照锁，仍能修改或重置草稿。
            const failCommit = mock.fn(async () => false);
            props = { ...props, onCommit: failCommit };
            await view.rerender(<PageStage {...props} />);
            await settled(() => expect(committed.closest('[inert]')).toBe(null));
            const nextPointer = (type: string, dx: number) => fireEvent(committed, new PointerEvent(type, { bubbles: true, pointerId: 2, button: 0,
                clientX: 10 + next.bounds.x + next.bounds.width + dx, clientY: 10 + next.bounds.y + next.bounds.height }));
            await nextPointer('pointerdown', 0); await nextPointer('pointermove', -8);
            props = { ...props, transform: transformed };
            await view.rerender(<PageStage {...props} />);
            await nextPointer('pointerup', -8);
            await settled(() => { expect(failCommit).toHaveBeenCalledTimes(1); expect(committed.closest('[inert]')).toBe(null); });
            await view.rerender(<PageStage {...props} transform={{ ...next.bounds, rotation: 0 }} />);
            await settled(() => expect(framePixels(committed).every((value, index) => value === firstPaint[index])).toBe(true));
            expect(props.onError).not.toHaveBeenCalled();
        } finally { release(); await view.unmount(); client.close(); }
    });
    for (const shape of ['rectangle', 'ellipse'] as const) it(`${SHAPE_LABELS[shape]}拖拽提交保持尺寸与工具栏图标，等待期间拒绝重复操作`, async () => {
        mock.spyOn(Element.prototype, 'setPointerCapture').implement(() => {});
        mock.spyOn(Element.prototype, 'releasePointerCapture').implement(() => {});
        mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(() => new globalThis.DOMRect(0, 0, 400, 300));
        const sourceClient = new PdfClient({ workerUrl, wasmBinary });
        const opened = await sourceClient.request('open', { bytes: fixture(1), password: '' });
        const info = await sourceClient.request('edit', { revision: opened.revision, command: { kind: 'shape', page: 0,
            drawing: { shape, points: [{ x: 80, y: 70 }, { x: 140, y: 120 }], style: { ...DEFAULT_SHAPE_STYLE, stroke: [255, 0, 0, 255], strokeWidth: 4 } } } });
        const object = (await sourceClient.request('page', { page: 0, revision: info.revision })).objects[2];
        const source = await sourceClient.request('export', undefined); sourceClient.close();
        const editor = createRef<PdfEditorRef>(), onError = mock.fn();
        const view = await render(<PdfEditor ref={editor} runtime={{ workerUrl, wasmBinary }} initialDocument={{ id: 'test', source }} onError={onError} />);
        const samples: number[] = [];
        let sampling = false;
        const observer = new MutationObserver(() => {
            const shown = visibleCanvas(view.container);
            if (sampling) samples.push(shown ? redWidth(shown) : 0);
        });
        observer.observe(view.container, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-visible', 'width', 'height'] });
        mock.spyOn(globalThis, 'requestAnimationFrame').implement(callback => {
            frameCallbacks.set(++frameId, time => {
                callback(time);
                const shown = visibleCanvas(view.container);
                if (sampling && shown) samples.push(redWidth(shown));
            });
            return frameId;
        });
        let release!: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        let finishEdit!: () => void;
        const editGate = new Promise<void>(resolve => { finishEdit = resolve; });
        try {
            await settled(() => expect(objectItem(view.container, `${SHAPE_LABELS[shape]} 3`)).toBeDefined());
            await act(async () => {
                const measured = view.container.querySelector('[aria-label="PDF 页面画布"] > div')!;
                resizeTargets.get(measured)!(400, 300);
            });
            const zoom = view.container.querySelector<HTMLInputElement>('input[aria-label="缩放百分比"]')!;
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(zoom, '75');
            await fireEvent.input(zoom); await fireEvent(zoom, new FocusEvent('focusout', { bubbles: true }));
            await settled(() => expect(button(view.container, '添加图片').disabled).toBe(false));
            const pageCanvas = visibleCanvas(view.container)!;
            await fireEvent(objectItem(view.container, `${SHAPE_LABELS[shape]} 3`), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
            await settled(() => expect(visibleCanvas(view.container)).not.toBe(pageCanvas));
            await settled(() => expect(button(view.container, '应用修改').disabled).toBe(false));
            const canvas = visibleCanvas(view.container)!;
            const pointer = (type: string, x: number, y: number) => fireEvent(canvas, new PointerEvent(type, { bubbles: true, pointerId: 1, button: 0, clientX: x, clientY: y }));
            const x = 90 + object.bounds.x + object.bounds.width, y = 24 + object.bounds.y + object.bounds.height;
            const before = redWidth(canvas);
            const labels = ['打开 PDF', '添加图片', '插入空白页', '合并 PDF', '旋转页面', '提取页面', '保存 PDF', '选择对象', '抓手平移', '矩形边框', '圆形/椭圆', '直线'];
            const controls = labels.map(label => button(view.container, label));
            const icons = controls.map(control => control.querySelector('svg'));
            const iconOpacity = icons.map(icon => getComputedStyle(icon!.parentElement!).opacity);
            const toolbars = [...view.container.querySelectorAll<HTMLElement>('[role="toolbar"]')];
            const assertToolbarStable = () => labels.forEach((label, index) => {
                const control = button(view.container, label);
                expect(control).toBe(controls[index]);
                expect(control.querySelector('svg')).toBe(icons[index]);
                expect(control.disabled).toBe(false);
                expect(control.getAttribute('aria-disabled')).toBe('false');
                expect(getComputedStyle(icons[index]!.parentElement!).opacity).toBe(iconOpacity[index]);
            });
            assertToolbarStable();
            const fields = view.container.querySelector<HTMLElement>('[aria-label="属性字段"]')!;
            const propertyControls = [...fields.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button')];
            const treeItem = objectItem(view.container, `${SHAPE_LABELS[shape]} 3`);
            const treeIcon = treeItem.querySelector('svg');
            const status = view.container.querySelector('[role="status"]')!;
            const statusText = status.textContent;
            const thumbnails = [...view.container.querySelectorAll('[data-page-index="0"] canvas')];
            const assertPanelsStable = () => {
                expect(view.container.querySelector('[aria-label="属性字段"]')).toBe(fields);
                expect([...fields.querySelectorAll('input, button')]).toEqual(propertyControls);
                propertyControls.forEach(control => expect(control.disabled).toBe(false));
                expect(button(view.container, '应用修改').disabled).toBe(false);
                expect(button(view.container, '删除对象').disabled).toBe(false);
                expect(objectItem(view.container, `${SHAPE_LABELS[shape]} 3`)).toBe(treeItem);
                expect(treeItem.getAttribute('aria-disabled')).toBe('false');
                expect(treeItem.querySelector('svg')).toBe(treeIcon);
                expect(status.textContent).toBe(statusText);
                expect([...view.container.querySelectorAll('[data-page-index="0"] canvas')]).toEqual(thumbnails);
            };
            assertPanelsStable();
            await pointer('pointerdown', x, y);
            await pointer('pointermove', x + 30, y + 15);
            await settled(() => expect(redWidth(canvas)).toBeGreaterThan(before + 25));
            assertToolbarStable();
            const targetWidth = redWidth(canvas);
            sampling = true;
            const send = globalThis.Worker.prototype.postMessage, sent: Request[] = [];
            mock.spyOn(globalThis.Worker.prototype, 'postMessage').implement(function (this: Worker, message: Request) {
                sent.push(message);
                if (message.type === 'edit') void editGate.then(() => send.call(this, message));
                else send.call(this, message);
            });
            const load = PdfClient.prototype.frame;
            let requested = false;
            mock.spyOn(PdfClient.prototype, 'frame').implement(async function (this: PdfClient, ...args: Parameters<PdfClient['frame']>) {
                requested = true; await gate; return load.call(this, ...args);
            });
            const requests = mock.spyOn(PdfClient.prototype, 'request');
            await pointer('pointerup', x + 30, y + 15);
            await settled(() => expect(sent.some(message => message.type === 'edit')).toBe(true));
            assertToolbarStable();
            assertPanelsStable();
            toolbars.forEach(toolbar => expect(toolbar.getAttribute('aria-busy')).toBe('true'));
            expect(fields.closest('[aria-busy]')?.getAttribute('aria-busy')).toBe('true');
            await fireEvent.click(button(view.container, '应用修改'));
            await fireEvent.click(button(view.container, '删除对象'));
            await fireEvent(objectItem(view.container, '文字：Page 1'), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
            expect(treeItem.getAttribute('aria-selected')).toBe('true');
            await fireEvent.click(button(view.container, '旋转页面'));
            await fireEvent.click(button(view.container, '保存 PDF'));
            await fireEvent.click(button(view.container, '矩形边框'));
            await fireEvent.keyDown(view.container.querySelector('[aria-label="PDF 页面画布"]')!, { key: 'z', ctrlKey: true });
            expect(requests).toHaveBeenCalledTimes(1);
            expect(sent.filter(message => ['edit', 'export', 'undo'].includes(message.type))).toHaveLength(1);
            expect(button(view.container, '选择对象').getAttribute('aria-pressed')).toBe('true');
            // 保留真实业务禁用条件：没有字体、没有历史、不能删除最后一页。
            for (const label of ['添加文字', '撤销', '重做', '删除页面']) expect(button(view.container, label).disabled).toBe(true);
            finishEdit();
            await settled(() => expect(requested).toBe(true));
            assertPanelsStable();
            for (let i = 0; i < 3; i++) await settled(() => {});
            expect(Math.min(...samples)).toBeGreaterThan(targetWidth - 2);
            release();
            await settled(() => expect(visibleCanvas(view.container)).not.toBe(canvas));
            await settled(() => expect(button(view.container, '应用修改').disabled).toBe(false));
            assertToolbarStable();
            assertPanelsStable();
            toolbars.forEach(toolbar => expect(toolbar.getAttribute('aria-busy')).toBe('false'));
            expect(fields.closest('[aria-busy]')?.getAttribute('aria-busy')).toBe('false');
            expect(samples.length).toBeGreaterThan(3);
            expect(Math.min(...samples)).toBeGreaterThan(targetWidth - 2);
            sampling = false;
            // 撤销清除选区；椭圆两端不再被控制柄遮住，容许两侧各 1px 的边缘差异。
            await act(async () => editor.current!.undo());
            await settled(() => expect(Math.abs(redWidth(visibleCanvas(view.container)!) - before)).toBeLessThanOrEqual(2));
            await act(async () => editor.current!.redo());
            await settled(() => expect(Math.abs(redWidth(visibleCanvas(view.container)!) - targetWidth)).toBeLessThanOrEqual(2));
            expect(onError).not.toHaveBeenCalled();
        } finally { sampling = false; observer.disconnect(); finishEdit(); release(); await view.unmount(); }
    });
    it('渲染失败保留可见内容并允许重试，慢版本不会覆盖已绘制的新版本', async () => {
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(), password: '' }), props = stageProps(client, opened);
        const view = await render(<PageStage {...props} />);
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(null));
        const originalCanvas = visibleCanvas(view.container)!;
        const load = client.frame.bind(client);
        let fail = true, release!: () => void, slowVersion = -1, entered = false;
        const gate = new Promise<void>(resolve => { release = resolve; });
        mock.spyOn(PdfClient.prototype, 'frame').implement(async (...args) => {
            if (fail) { fail = false; throw new Error('模拟渲染失败'); }
            const result = await load(...args);
            if (args[0].contentRevision === slowVersion) { entered = true; await gate; }
            return result;
        });
        let edited = await client.request('edit', { revision: opened.revision, command: { kind: 'rotatePages', pages: [0], turns: 1 } });
        await view.rerender(<PageStage {...props} page={edited.pages[0]} revision={edited.revision} />);
        await settled(() => expect(button(view.container, '重试页面渲染')).toBeDefined());
        expect(visibleCanvas(view.container)).toBe(originalCanvas); expect(bluePixels(originalCanvas)).toBeGreaterThan(20);
        await fireEvent.click(button(view.container, '重试页面渲染'));
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(originalCanvas));
        edited = await client.request('edit', { revision: edited.revision, command: { kind: 'rotatePages', pages: [0], turns: 1 } });
        slowVersion = edited.pages[0].contentRevision;
        await view.rerender(<PageStage {...props} page={edited.pages[0]} revision={edited.revision} />);
        await settled(() => expect(entered).toBe(true));
        edited = await client.request('edit', { revision: edited.revision, command: { kind: 'rotatePages', pages: [0], turns: 1 } });
        await view.rerender(<PageStage {...props} page={edited.pages[0]} revision={edited.revision} />);
        await settled(() => expect(view.container.querySelector('[data-visible="true"]')?.getAttribute('data-page-frame')).toBe(String(edited.pages[0].contentRevision)));
        const newest = visibleCanvas(view.container);
        release();
        await settled(() => expect(visibleCanvas(view.container)).toBe(newest));
        expect(props.onError).toHaveBeenCalledTimes(1);
        await view.unmount(); client.close();
    });
    it('松开鼠标后保留绘图预览直到新帧接管，提交失败只移除本次预览', async () => {
        mock.spyOn(Element.prototype, 'setPointerCapture').implement(() => {});
        mock.spyOn(Element.prototype, 'hasPointerCapture').implement(() => true);
        mock.spyOn(Element.prototype, 'releasePointerCapture').implement(() => {});
        mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(() => new globalThis.DOMRect(0, 0, 400, 300));
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(), password: '' }), props = stageProps(client, opened);
        let finish!: (success: boolean) => void, submitted: Drawing | undefined;
        const onDraw = mock.fn((drawing: Drawing) => { submitted = drawing; return new Promise<boolean>(resolve => { finish = resolve; }); });
        const drawingStyle = { ...DEFAULT_SHAPE_STYLE, stroke: [0, 0, 255, 255] as [number, number, number, number], strokeWidth: 5 };
        const view = await render(<PageStage {...props} tool="rectangle" drawingStyle={drawingStyle} onDraw={onDraw} />);
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(null));
        const original = visibleCanvas(view.container)!, before = bluePixels(original);
        const surface = view.container.firstElementChild!;
        const pointer = (type: string, x: number, y: number) => fireEvent(surface, new PointerEvent(type, { bubbles: true, pointerId: 1, button: 0, clientX: x, clientY: y }));
        await pointer('pointerdown', 100, 80); await pointer('pointermove', 150, 130); await pointer('pointerup', 150, 130);
        await settled(() => expect(bluePixels(original)).toBeGreaterThan(before + 100));
        expect(onDraw).toHaveBeenCalledTimes(1);
        const edited = await client.request('edit', { revision: opened.revision, command: { kind: 'shape', page: 0, drawing: submitted! } });
        await act(async () => { finish(true); });
        await view.rerender(<PageStage {...props} page={edited.pages[0]} revision={edited.revision} tool="rectangle" drawingStyle={drawingStyle} onDraw={onDraw} />);
        expect(visibleCanvas(view.container)).toBe(original); expect(bluePixels(original)).toBeGreaterThan(before + 100);
        await settled(() => expect(visibleCanvas(view.container)).not.toBe(original));
        const committed = visibleCanvas(view.container)!, saved = bluePixels(committed);
        expect(saved).toBeGreaterThan(before + 100);
        await pointer('pointerdown', 160, 80); await pointer('pointermove', 200, 130); await pointer('pointerup', 200, 130);
        await settled(() => expect(bluePixels(committed)).toBeGreaterThan(saved + 100));
        await act(async () => { finish(false); });
        await settled(() => expect(bluePixels(committed)).toBe(saved));
        expect(visibleCanvas(view.container)).toBe(committed); expect(onDraw).toHaveBeenCalledTimes(2);
        await view.unmount(); client.close(); expect(props.onError).not.toHaveBeenCalled();
    });
    it('缩略图缓存按页面内容版本复用，取消排队任务不会发送给 Worker', async () => {
        const client = new PdfClient({ workerUrl, wasmBinary });
        const opened = await client.request('open', { bytes: fixture(3), password: '' }), abort = new AbortController();
        const first = await client.thumbnail(opened.pages[0], opened.revision, 0.5, abort.signal);
        const edited = await client.request('edit', { revision: opened.revision, command: { kind: 'rotatePages', pages: [1], turns: 1 } });
        expect(await client.thumbnail(edited.pages[0], edited.revision, 0.5, abort.signal)).toBe(first);
        abort.abort();
        await expect(client.frame(edited.pages[1], edited.revision, 1, undefined, abort.signal)).rejects.toThrow('渲染已取消');
        client.close();
    });
    it('页面缩略图无复选框，Ctrl 多选、全选、键盘和只读选择保持批量操作状态', async () => {
        const source = fixture(3), runtime = { workerUrl, wasmBinary }, onError = mock.fn();
        const editor = createRef<PdfEditorRef>();
        const view = await render(<PdfEditor ref={editor} runtime={runtime} initialDocument={{ id: 'test', source }} onError={onError} />);
        const list = () => view.container.querySelector('[role="listbox"][aria-label="PDF 页面列表"]')!;
        const option = (index: number) => view.container.querySelector(`[role="option"][data-page-index="${index}"]`)!;
        await settled(() => expect(option(1)).not.toBe(null));
        await settled(() => expect(button(view.container, '保存 PDF').disabled).toBe(false));
        expect(view.container.querySelector('nav[aria-label="PDF 页面分页"]')).toBe(null);
        expect(view.container.querySelector('[aria-label="PDF 连续页面预览"]')).not.toBe(null);
        await act(async () => editor.current?.goToPage(2));
        expect(view.container.textContent).toContain('第 3 / 3 页');
        await act(async () => editor.current?.goToPage(1));
        expect(option(1).getAttribute('aria-selected')).toBe('true');
        await act(async () => editor.current?.goToPage(0));
        await settled(() => expect(button(view.container, '添加图片').disabled).toBe(false));
        expect(list().getAttribute('aria-multiselectable')).toBe('true');
        expect(list().querySelector('input[type="checkbox"]')).toBe(null);
        await fireEvent.click(option(1), { ctrlKey: true });
        expect(option(0).getAttribute('aria-selected')).toBe('true');
        expect(option(1).getAttribute('aria-selected')).toBe('true');
        expect(view.container.textContent).toContain('已选择 2 页');
        await fireEvent.click(option(1), { ctrlKey: true });
        expect(option(1).getAttribute('aria-selected')).toBe('false');
        await fireEvent.keyDown(list(), { key: 'a', ctrlKey: true });
        expect(view.container.textContent).toContain('已选择 3 页');
        expect(button(view.container, '删除页面').disabled).toBe(true);
        await fireEvent.keyDown(list(), { key: 'Escape' });
        await fireEvent.keyDown(list(), { key: 'ArrowDown' });
        expect(option(1).getAttribute('aria-selected')).toBe('true');
        expect(button(view.container, '撤销').disabled).toBe(true);
        await fireEvent.keyDown(list(), { key: ' ' });
        expect(view.container.textContent).toContain('未选择页面');
        expect(button(view.container, '提取页面').disabled).toBe(true);
        await view.rerender(<PdfEditor ref={editor} runtime={runtime} initialDocument={{ id: 'test', source }} onError={onError} readOnly />);
        await fireEvent.click(option(1));
        expect(option(1).getAttribute('data-draggable')).toBe('false');
        expect(button(view.container, '提取页面').disabled).toBe(false);
        await act(async () => editor.current?.goToPage(2));
        expect(view.container.textContent).toContain('第 3 / 3 页');
        expect(onError.calls.calls).toEqual([]);
        await view.unmount();
    });
    it('半透明页面图层上传 WebGL 后保留原始颜色，避免选中时重复乘透明度', async () => {
        const image = await bitmap({ width: 1, height: 1, rgba: new Uint8ClampedArray([255, 230, 0, 64]) });
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2')!;
        expect(gl).not.toBe(null);
        const texture = gl.createTexture(), framebuffer = gl.createFramebuffer();
        try {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            const rgba = new Uint8Array(4);
            gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
            expect([...rgba]).toEqual([255, 230, 0, 64]);
        } finally {
            gl.deleteFramebuffer(framebuffer); gl.deleteTexture(texture); image.close();
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
    });
    it('输入框与中文组合键不触发文档快捷键，保存失败保留修改', async () => {
        const onError = mock.fn();
        let finishSave!: () => void;
        const gate = new Promise<void>(resolve => { finishSave = resolve; });
        const onSave = mock.fn(async () => { await gate; throw new Error('保存回调失败'); });
        const source = fixture();
        const { container, unmount } = await render(<PdfEditor runtime={{ workerUrl, wasmBinary }} initialDocument={{ id: 'test', source }} onError={onError} onSave={onSave} />);
        await settled(() => expect(objectItem(container, '文字：Page 1')).toBeDefined());
        await settled(() => expect(button(container, '保存 PDF').disabled).toBe(false));
        await fireEvent(objectItem(container, '文字：Page 1'), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
        const canvas = container.querySelector('[aria-label="PDF 页面画布"]')!;
        await fireEvent.keyDown(canvas, { key: 'ArrowRight' });
        await settled(() => expect(button(container, '撤销').disabled).toBe(false));
        const input = container.querySelector('input[role="spinbutton"]')!;
        await fireEvent.keyDown(input, { key: 'z', ctrlKey: true });
        await fireEvent.keyDown(canvas, { key: 'z', ctrlKey: true, isComposing: true });
        expect(button(container, '撤销').disabled).toBe(false);
        const save = button(container, '保存 PDF'), icon = save.querySelector('svg');
        try {
            await fireEvent.click(save);
            await settled(() => expect(onSave).toHaveBeenCalledTimes(1));
            expect(save.disabled).toBe(false);
            expect(save.querySelector('svg')).toBe(icon);
            expect(save.closest('[role="toolbar"]')?.getAttribute('aria-busy')).toBe('true');
            await fireEvent.click(save);
            expect(onSave).toHaveBeenCalledTimes(1);
        } finally { finishSave(); }
        await settled(() => expect(onError).toHaveBeenCalled());
        await settled(() => expect(save.closest('[role="toolbar"]')?.getAttribute('aria-busy')).toBe('false'));
        expect(save.disabled).toBe(false);
        expect(container.textContent).toContain('未保存');
        expect(container.textContent).toContain('保存回调失败');
        expect(button(container, '撤销').disabled).toBe(false);
        expect(onSave).toHaveBeenCalledTimes(1);
        await fireEvent.click(button(container, '矩形边框'));
        expect(button(container, '矩形边框').getAttribute('aria-pressed')).toBe('true');
        await unmount();
    });
    it('通过真实 Worker 打开、编辑、回读并拒绝关闭后的请求', async () => {
        const client = new PdfClient({ workerUrl, wasmBinary });
        try {
            const opened = await client.request('open', { bytes: fixture(), password: '' });
            const edited = await client.request('edit', { revision: opened.revision, command: { kind: 'rotatePages', pages: [0], turns: 1 } });
            expect(edited.pages[0].rotation).toBe(1);
            const bytes = await client.request('export', undefined);
            expect((await client.request('open', { bytes, password: '' })).pages[0].rotation).toBe(1);
        } finally { client.close(); }
        await expect(client.request('export', undefined)).rejects.toThrow('编辑器已关闭');
    });
    it('无效 WASM 拒绝初始化，卸载中断未完成请求', async () => {
        const invalid = new PdfClient({ workerUrl, wasmBinary: new ArrayBuffer(8) });
        try { await expect(invalid.ready).rejects.toThrow(); } finally { invalid.close(); }
        const cancelled = new PdfClient({ workerUrl, wasmBinary });
        const result = cancelled.request('open', { bytes: fixture(), password: '' });
        cancelled.close();
        await expect(result).rejects.toThrow();
    });
    it('侧栏图标保持展开语义和对象选择，关闭恢复焦点，窄屏开关互斥', async () => {
        let compact = false;
        const matchMedia = window.matchMedia.bind(window);
        mock.spyOn(window, 'matchMedia').implement(query => {
            const result = matchMedia(query);
            if (query === '(max-width: 1000px)') Object.defineProperty(result, 'matches', { value: compact });
            return result;
        });
        const view = await render(<PdfEditor runtime={{ workerUrl, wasmBinary }} initialDocument={{ id: 'test', source: fixture() }} />);
        try {
            await settled(() => expect(objectItem(view.container, '文字：Page 1')).toBeDefined());
            const pages = view.container.querySelector<HTMLElement>('aside[aria-label="页面管理"]')!;
            const properties = view.container.querySelector<HTMLElement>('aside[aria-label="对象属性"]')!;
            const pagesToggle = button(view.container, '页面面板'), propertiesToggle = button(view.container, '属性面板');
            for (const [control, panel] of [[pagesToggle, pages], [propertiesToggle, properties]] as const) {
                expect(control.getAttribute('aria-controls')).toBe(panel.id);
                expect(control.getAttribute('aria-expanded')).toBe('true');
                expect(control.getAttribute('aria-pressed')).toBe('true');
                expect(control.closest('[role="toolbar"]')).not.toBe(null);
                expect(control.textContent).toBe('');
            }
            await fireEvent.click(propertiesToggle);
            expect(properties.hidden).toBe(true); expect(pages.hidden).toBe(false);
            expect(propertiesToggle.getAttribute('aria-expanded')).toBe('false');
            await fireEvent.click(propertiesToggle);
            expect(properties.hidden).toBe(false); expect(pages.hidden).toBe(false);
            await fireEvent(objectItem(view.container, '文字：Page 1'), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
            await fireEvent.click(button(view.container, '收起属性面板'));
            expect(document.activeElement).toBe(propertiesToggle);
            expect(properties.hidden).toBe(true);
            await fireEvent.click(propertiesToggle);
            expect(objectItem(view.container, '文字：Page 1').getAttribute('aria-selected')).toBe('true');
            expect(properties.querySelector('textarea')?.value).toBe('Page 1');
            await fireEvent.click(button(view.container, '收起页面面板'));
            expect(document.activeElement).toBe(pagesToggle);
            expect(pages.hidden).toBe(true); expect(properties.hidden).toBe(false);
            compact = true;
            await fireEvent.click(pagesToggle);
            expect(pages.hidden).toBe(false); expect(properties.hidden).toBe(true);
            await fireEvent.click(propertiesToggle);
            expect(properties.hidden).toBe(false); expect(pages.hidden).toBe(true);
            await fireEvent.click(propertiesToggle);
            expect(properties.hidden).toBe(true); expect(pages.hidden).toBe(true);
            expect(button(view.container, '撤销').disabled).toBe(true);
        } finally { await view.unmount(); }
    });
    it('对象树导航不移动对象，图标操作、画布键盘、只读与失败保留原文档', async () => {
        const ref = createRef<PdfEditorRef>();
        const onLoad = mock.fn();
        const onError = mock.fn();
        const source = fixture();
        const runtime = { workerUrl, wasmBinary };
        const { container, rerender, unmount } = await render(<PdfEditor ref={ref} runtime={runtime} initialDocument={{ id: 'test', source }} onDocumentLoad={onLoad} onError={onError} />);
        await settled(() => expect(onLoad).toHaveBeenCalled());
        await settled(() => expect(objectItem(container, '文字：Page 1')).toBeDefined());
        await settled(() => expect(button(container, '保存 PDF').disabled).toBe(false));
        for (const control of container.querySelectorAll('[role="toolbar"] button')) {
            expect(control.getAttribute('aria-label')).toBeTruthy();
            expect(control.querySelector('svg[aria-hidden="true"]')).not.toBe(null);
            expect(control.textContent).toBe('');
        }
        for (const label of ['插入空白页', '合并 PDF', '旋转页面', '删除页面', '页面前移', '页面后移', '提取页面', '重做', '添加文字', '添加图片']) {
            expect(button(container, label).closest('[aria-label="PDF 编辑工具栏"]')).not.toBe(null);
        }
        expect(container.querySelector('[aria-label="更多操作"]')).toBe(null);
        expect(container.textContent).not.toContain('文档操作');
        await fireEvent.click(button(container, '矩形边框'));
        expect(button(container, '矩形边框').getAttribute('aria-pressed')).toBe('true');
        expect(container.textContent).toContain('填充图形');
        expect(button(container, '撤销').disabled).toBe(true);
        await fireEvent.keyDown(container.firstElementChild!, { key: 'Escape' });
        expect(button(container, '选择对象').getAttribute('aria-pressed')).toBe('true');
        await fireEvent(objectItem(container, '文字：Page 1'), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
        expect(objectItem(container, '文字：Page 1').getAttribute('aria-selected')).toBe('true');
        const tree = container.querySelector('[role="tree"]')!;
        await fireEvent.keyDown(tree, { key: 'ArrowDown' });
        expect(objectItem(container, '其他对象 2').getAttribute('aria-selected')).toBe('true');
        expect(button(container, '撤销').disabled).toBe(true);
        await fireEvent.keyDown(tree, { key: 'ArrowUp' });
        expect(objectItem(container, '文字：Page 1').getAttribute('aria-selected')).toBe('true');
        const canvas = container.querySelector('[aria-label="PDF 页面画布"]')!;
        await fireEvent.keyDown(canvas, { key: 'ArrowRight' });
        await settled(() => expect(button(container, '撤销').disabled).toBe(false));
        await fireEvent.click(button(container, '撤销'));
        await settled(() => expect(button(container, '重做').disabled).toBe(false));
        let before = 0;
        await act(async () => { before = (await ref.current!.exportPdf()).blob.size; });
        await act(async () => { await expect(ref.current!.open({ id: 'invalid', source: new Uint8Array([0, 1]) })).rejects.toThrow(); });
        await act(async () => { expect((await ref.current!.exportPdf()).blob.size).toBe(before); });
        await rerender(<PdfEditor ref={ref} runtime={runtime} initialDocument={{ id: 'test', source }} readOnly onError={onError} />);
        expect(button(container, '添加图片').disabled).toBe(true);
        for (const label of ['插入空白页', '合并 PDF', '旋转页面', '删除页面', '页面前移', '页面后移']) expect(button(container, label).disabled).toBe(true);
        expect(button(container, '提取页面').disabled).toBe(false);
        expect(button(container, '自由手绘').disabled).toBe(true);
        await fireEvent.click(button(container, '抓手平移'));
        expect(button(container, '抓手平移').getAttribute('aria-pressed')).toBe('true');
        expect(button(container, '保存 PDF').disabled).toBe(false);
        // 文档命令已完成不代表像素已呈现；等待撤销后的页面交接再选择对象。
        await settled(() => expect(objectItem(container, '其他对象 2').closest('[aria-busy]')?.getAttribute('aria-busy')).toBe('false'));
        await fireEvent(objectItem(container, '其他对象 2'), new PointerEvent('pointerup', { bubbles: true, button: 0 }));
        expect(objectItem(container, '其他对象 2').getAttribute('aria-selected')).toBe('true');
        await act(async () => { await expect(ref.current!.redo()).rejects.toThrow('只读'); });
        expect(onError).not.toHaveBeenCalled();
        await unmount();
        expect(ref.current).toBe(null);
    });
});
