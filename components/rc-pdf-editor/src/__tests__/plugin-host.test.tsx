import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { PdfPluginHost } from '../plugin-host.js';
import { createRegionOcrPlugin } from '../plugins/region-ocr.js';
import type { PdfEditorPlugin, PdfEditorPluginContext, PdfEditorRef, PdfEditorState, PdfRegionImage } from '../types.js';

const document = { id: 'test', sessionId: 'session-1', fileName: 'test.pdf', revision: 1, pageCount: 2, currentPageIndex: 0, dirty: false, canUndo: false, canRedo: false, editable: true };
function harness(overrides: Partial<PdfEditorRef> = {}) {
    let state: PdfEditorState = { status: 'ready', document, pendingOperations: [], readOnly: false, canEdit: true };
    const listeners = new Set<() => void>();
    const unused = (): never => { throw new Error('本用例不应调用该命令'); };
    const editor: PdfEditorRef = {
        ready: async () => {}, getState: () => state, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener); }; },
        open: unused, close: unused, save: unused, exportPdf: unused, extractPages: unused, undo: unused, redo: unused,
        goToPage: unused, fitToPage: unused, getPages: unused, selectRegion: unused, createRegionSelection: unused, captureRegion: unused, ...overrides,
    };
    return { editor, update: (change: Partial<PdfEditorState>) => { state = { ...state, ...change }; listeners.forEach(listener => listener()); }, listeners };
}
function gate() { let resolve!: () => void; const promise = new Promise<void>(done => { resolve = done; }); return { promise, resolve }; }
const icon = <svg viewBox="0 0 24 24" />;

describe('插件注册与生命周期', () => {
    it('插件对象可复用到多个编辑器，setup 只安装一次，替换命令接口不重复安装，卸载独立清理', () => {
        const contexts: PdfEditorPluginContext[] = [], cleanup = mock.fn(), report = mock.fn();
        const plugin: PdfEditorPlugin = { id: 'lifecycle', setup: context => { contexts.push(context); return cleanup; } };
        const a = new PdfPluginHost(), b = new PdfPluginHost(), first = harness(), second = harness();
        a.setEditor(first.editor); b.setEditor(second.editor);
        a.reconcile([plugin], report); b.reconcile([plugin], report); a.reconcile([plugin], report);
        expect(contexts.length).toBe(2); expect(contexts[0].getEditor()).toBe(first.editor);
        a.setEditor(second.editor); expect(contexts[0].getEditor()).toBe(second.editor);
        a.reconcile([], report); expect(cleanup).toHaveBeenCalledTimes(1); expect(contexts[0].signal.aborted).toBe(true);
        expect(contexts[1].signal.aborted).toBe(false); expect(() => contexts[0].getEditor()).toThrow('取消');
        b.dispose(); a.dispose(); expect(cleanup).toHaveBeenCalledTimes(2); expect(report).not.toHaveBeenCalled();
    });

    it('动作 ID 按插件隔离，重排保持生命周期，重复插件拒绝且安装错误可报告', () => {
        const host = new PdfPluginHost(), report = mock.fn(), setup = mock.fn(), api = harness(); host.setEditor(api.editor);
        const make = (id: string): PdfEditorPlugin => ({ id, setup, actions: [{ id: 'same', label: id, icon, placement: 'tools', onSelect() {} }] });
        const a = make('a'), b = make('b');
        host.reconcile([a, b], report); expect(host.getSnapshot().actions[0].id).not.toBe(host.getSnapshot().actions[1].id);
        host.reconcile([b, a], report); expect(host.getSnapshot().actions[0].label).toBe('b'); expect(setup).toHaveBeenCalledTimes(2);
        host.reconcile([a, a], report); expect(report).toHaveBeenCalledTimes(1);
        host.reconcile([{ id: 'broken', setup() { throw new Error('setup failed'); } }], report);
        expect(report).toHaveBeenCalledTimes(2); expect(host.getSnapshot().actions.length).toBe(0); host.dispose();
    });

    it('文档作用域任务在版本变化时取消，不受翻页影响，等待中的任务可被手动取消', async () => {
        const host = new PdfPluginHost(), api = harness(), entered = gate(), finish = gate(), report = mock.fn();
        let signal: AbortSignal | undefined;
        host.setEditor(api.editor);
        host.reconcile([{ id: 'job', actions: [{ id: 'run', label: '处理', icon, placement: 'tools',
            async onSelect(context) { signal = context.signal; entered.resolve(); await finish.promise; } }] }], report);
        const running = host.run('job', 'run'); await entered.promise;
        api.update({ document: { ...document, currentPageIndex: 1 } }); expect(signal?.aborted).toBe(false);
        const rejection = expect(running).rejects.toThrow('取消');
        api.update({ document: { ...document, revision: 2 } }); await rejection;
        expect(signal?.aborted).toBe(true); expect(host.getSnapshot().task).toBe(null); expect(api.listeners.size).toBe(0);
        const again = host.run('job', 'run'), cancelled = expect(again).rejects.toThrow('取消'); host.cancel(); await cancelled;
        finish.resolve(); host.dispose();
    });

    it('OCR 插件把采集接口输出交给适配器，卸载后迟到的识别结果不会调用 onResult', async () => {
        const selection = { documentId: 'test', sessionId: 'session-1', revision: 1, regions: [{ pageIndex: 0, x: 0, y: 0, width: 10, height: 10 }] };
        const image: PdfRegionImage = { selection, blob: new Blob(), width: 20, height: 20, parts: [] };
        const entered = gate(), finish = gate(), result = mock.fn(), capture = mock.fn(async () => image), select = mock.fn(async () => selection);
        const api = harness({ selectRegion: select, captureRegion: capture }), host = new PdfPluginHost(); host.setEditor(api.editor);
        const plugin = createRegionOcrPlugin({ id: 'ocr', recognize: async (input, { signal }) => {
            expect(input).toBe(image); expect(signal.aborted).toBe(false); entered.resolve(); await finish.promise; return '文字';
        }, onResult: result });
        host.reconcile([plugin], mock.fn());
        const running = host.run('ocr', 'recognize-region'); await entered.promise;
        expect(select).toHaveBeenCalledTimes(1); expect(capture).toHaveBeenCalledTimes(1);
        const rejection = expect(running).rejects.toThrow('取消'); host.reconcile([], mock.fn()); await rejection;
        finish.resolve(); await finish.promise; await Promise.resolve();
        expect(result).not.toHaveBeenCalled(); host.dispose();
    });

    it('OCR 结果处理也属于任务，等待异步交付并传播拒绝和取消信号', async () => {
        const selection = { documentId: 'test', sessionId: 'session-1', revision: 1, regions: [{ pageIndex: 0, x: 0, y: 0, width: 10, height: 10 }] };
        const image: PdfRegionImage = { selection, blob: new Blob(), width: 20, height: 20, parts: [] };
        const api = harness({ selectRegion: async () => selection, captureRegion: async () => image });
        const host = new PdfPluginHost(), entered = gate(), finish = gate(); host.setEditor(api.editor);
        let deliverySignal: AbortSignal | undefined;
        host.reconcile([createRegionOcrPlugin({ id: 'delivery', recognize: async () => '订单',
            async onResult(result, input, { signal }) {
                expect(result).toBe('订单'); expect(input).toBe(image); deliverySignal = signal;
                entered.resolve(); await finish.promise; throw new Error('结果存储失败');
            },
        })], mock.fn());
        const running = host.run('delivery', 'recognize-region'); await entered.promise;
        expect(host.getSnapshot().task?.pluginId).toBe('delivery'); expect(deliverySignal?.aborted).toBe(false);
        const rejection = expect(running).rejects.toThrow('结果存储失败'); finish.resolve(); await rejection;
        expect(host.getSnapshot().task).toBe(null); expect(deliverySignal?.aborted).toBe(true); host.dispose();
    });
});
