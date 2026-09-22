import { afterAll, afterEach, beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { PdfSession } from '../session.js';
import { PdfClient, sourceBytes } from '../client.js';
import type { PdfExportResult } from '../types.js';
import wasmBase64 from '../../.fixtures/test-wasm.json';
import workerCode from '../../.fixtures/test-worker.json';
import { fixture } from './fixture.js';
import { RegionSelection } from '../region-selection.js';

let workerUrl: string;
const wasmBinary = Uint8Array.from(atob(wasmBase64), character => character.charCodeAt(0)).buffer;
beforeAll(() => { workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' })); });
afterAll(() => { URL.revokeObjectURL(workerUrl); });
afterEach(() => { mock.restoreAll(); });

async function opened() {
    const session = new PdfSession(false);
    await session.start({ workerUrl, wasmBinary });
    await session.open({ id: 'invoice', source: fixture(3), fileName: 'invoice' });
    return session;
}

function gate() {
    let resolve!: () => void;
    const promise = new Promise<void>(yes => { resolve = yes; });
    return { promise, resolve };
}

describe('公开文档会话契约', () => {
    it('只读会话按版本采集跨页 PNG，去掉页间空白并提供坐标回映，过期选区拒绝', async () => {
        const session = await opened();
        try {
            session.setReadOnly(true);
            const page = session.getPages()[0];
            const selection = session.createRegionSelection([
                { pageIndex: 1, x: 10, y: 0, width: 50, height: 20 },
                { pageIndex: 0, x: 10, y: page.height - 20, width: 50, height: 20 },
            ]);
            const image = await session.captureRegion(selection, { scale: 2 });
            expect(image.width).toBe(100); expect(image.height).toBe(80); expect(image.blob.type).toBe('image/png');
            expect(image.parts[0].imageBounds).toEqual({ x: 0, y: 0, width: 100, height: 40 });
            expect(image.parts[1].imageBounds).toEqual({ x: 0, y: 40, width: 100, height: 40 });
            expect(image.parts[1].sourceBounds).toEqual({ x: 10, y: 0, width: 50, height: 20 });
            const bitmap = await globalThis.createImageBitmap(image.blob);
            expect(bitmap.width).toBe(100); expect(bitmap.height).toBe(80); bitmap.close();
            expect(session.getState().document?.dirty).toBe(false); expect(Object.isFrozen(image.selection.regions[0])).toBe(true);
            session.setReadOnly(false);
            await session.edit({ kind: 'rotatePages', pages: [0], turns: 1 }, selection.revision);
            expect(session.getPages()[0].rotation).toBe(90);
            await expect(session.captureRegion(selection)).rejects.toThrow('版本已变化');
            await session.open({ id: 'invoice', source: fixture() });
            await expect(session.captureRegion(selection)).rejects.toThrow('版本已变化');
            const invalid = session.createRegionSelection([{ pageIndex: 0, x: 1, y: 1, width: 10, height: 10 }]);
            await expect(session.captureRegion(invalid, { signal: AbortSignal.abort() })).rejects.toThrow('取消');
            await expect(session.captureRegion(invalid, { scale: NaN })).rejects.toThrow('倍率');
        } finally { session.dispose(); }
    });

    it('采集预算在渲染前检查，选区请求互斥且跟随文档变化和 signal 取消', async () => {
        const session = await opened(), selector = new RegionSelection(session);
        try {
            const first = selector.start();
            await expect(selector.start()).rejects.toThrow('已有区域选择');
            selector.complete([{ pageIndex: 0, x: 0, y: 0, width: 10, height: 10 }]);
            expect((await first).documentId).toBe('invoice');
            const controller = new AbortController(), cancelled = selector.start({ signal: controller.signal });
            controller.abort(); await expect(cancelled).rejects.toThrow('取消');
            const changed = selector.start(), rejection = expect(changed).rejects.toThrow('取消');
            await session.open({ id: 'large', source: fixture(12) }); await rejection;
            expect(selector.getSnapshot()).toBe(null);
            const selection = session.createRegionSelection(session.getPages().map(page => ({ pageIndex: page.index, x: 0, y: 0, width: page.width, height: page.height })));
            await expect(session.captureRegion(selection, { scale: 8 })).rejects.toThrow('拼接图像过大');
            expect(session.getState().pendingOperations.length).toBe(0);
        } finally { selector.cancel(); session.dispose(); }
    });
    it('初始化、文档身份、只读能力、关闭和重新打开均有不可变状态', async () => {
        const session = new PdfSession(false);
        const initial = session.getState();
        expect(initial.status).toBe('initializing'); expect(initial.document).toBe(null);
        let changes = 0;
        const unsubscribe = session.subscribe(() => { changes++; });
        try {
            await session.start({ workerUrl, wasmBinary }); await session.ready();
            expect(session.getState().status).toBe('ready');
            const source = fixture();
            const first = await session.open({ id: 'contract', source, fileName: 'contract' });
            expect(source.byteLength).toBeGreaterThan(0);
            expect(first.fileName).toBe('contract.pdf'); expect(first.id).toBe('contract');
            expect(first.currentPageIndex).toBe(0); expect(session.getState().canEdit).toBe(true);
            expect(Object.isFrozen(first)).toBe(true); expect(Object.isFrozen(session.getState())).toBe(true);
            session.setReadOnly(true);
            expect(session.getState().canEdit).toBe(false); expect(first.editable).toBe(true);
            await expect(session.history('undo')).rejects.toThrow('只读');
            session.setPage(1); expect(session.getState().document?.currentPageIndex).toBe(1);
            expect(first.currentPageIndex).toBe(0);
            expect(() => session.setPage(999)).toThrow('页码');
            await session.close();
            expect(session.getState().document).toBe(null); expect(session.getState().status).toBe('ready');
            await expect(session.history('undo')).rejects.toThrow('请先打开');
            const second = await session.open({ id: 'contract', source });
            expect(second.sessionId).not.toBe(first.sessionId); expect(changes).toBeGreaterThan(5);
        } finally { unsubscribe(); session.dispose(); }
        expect(initial.document).toBe(null); expect(session.getState().status).toBe('disposed');
        await expect(session.exportPdf()).rejects.toThrow('取消');
    });

    it('保存快照绑定实际导出版本，保存期间的新编辑仍然 dirty，撤销回保存点变为干净', async () => {
        const session = await opened(), entered = gate(), finish = gate();
        try {
            await session.edit({ kind: 'rotatePages', pages: [0], turns: 1 }, session.getState().document!.revision);
            let captured: PdfExportResult | undefined;
            const saving = session.save(async result => { captured = result; entered.resolve(); await finish.promise; });
            await entered.promise;
            expect(session.getState().pendingOperations).toContain('save');
            await expect(session.save()).rejects.toThrow('已有保存');
            await session.edit({ kind: 'insert', at: 1 }, session.getState().document!.revision);
            finish.resolve(); const result = await saving;
            expect(result).toBe(captured); expect(result.documentId).toBe('invoice');
            expect(result.revision).not.toBe(session.getState().document?.revision);
            expect(session.getState().document?.dirty).toBe(true);
            const reader = new PdfClient({ workerUrl, wasmBinary });
            try { expect((await reader.request('open', { bytes: new Uint8Array(await result.blob.arrayBuffer()), password: '' })).pages.length).toBe(3); }
            finally { reader.close(); }
            expect((await session.history('undo')).dirty).toBe(false);
            expect(session.getState().pendingOperations.length).toBe(0);
        } finally { finish.resolve(); session.dispose(); }
    });

    it('旧文档保存完成不会清除新文档的修改，结果仍归属旧会话', async () => {
        const session = await opened(), entered = gate(), finish = gate();
        try {
            const oldSession = session.getState().document!.sessionId;
            const saving = session.save(async () => { entered.resolve(); await finish.promise; });
            await entered.promise;
            await session.open({ id: 'other', source: fixture(1) });
            await session.edit({ kind: 'insert', at: 1 }, session.getState().document!.revision);
            finish.resolve(); const result = await saving;
            expect(result.sessionId).toBe(oldSession); expect(result.documentId).toBe('invoice');
            expect(session.getState().document?.id).toBe('other'); expect(session.getState().document?.dirty).toBe(true);
        } finally { finish.resolve(); session.dispose(); }
    });

    it('打开或关闭守卫可以先保存，拒绝、失败和取消均保留当前文档', async () => {
        const session = await opened();
        try {
            await session.edit({ kind: 'insert', at: 0 }, session.getState().document!.revision);
            const original = session.getState().document!;
            await expect(session.open({ id: 'other', source: fixture() }, {}, () => false)).rejects.toThrow('取消');
            await expect(session.close({}, () => false)).rejects.toThrow('取消');
            await expect(session.open({ id: 'bad', source: new Uint8Array([0, 1]) })).rejects.toThrow();
            expect(session.getState().document?.sessionId).toBe(original.sessionId);
            const abort = new AbortController(); abort.abort();
            await expect(session.open({ id: 'other', source: fixture() }, { signal: abort.signal })).rejects.toThrow('取消');
            await expect(session.save(async () => { throw new Error('网络失败'); })).rejects.toThrow('网络失败');
            expect(session.getState().document?.dirty).toBe(true);
            let saved = false;
            await session.close({}, async request => {
                expect(request.reason).toBe('close'); expect(request.current.dirty).toBe(true);
                await session.save(async () => { saved = true; });
                return true;
            });
            expect(saved).toBe(true); expect(session.getState().document).toBe(null);
        } finally { session.dispose(); }
    });

    it('同一轮调用连续历史和导出不会读取 React 旧快照；提取不下载、不清除修改', async () => {
        const session = await opened();
        try {
            await session.edit({ kind: 'insert', at: 1 }, session.getState().document!.revision);
            const editedRevision = session.getState().document!.revision;
            const undo = session.history('undo'), redo = session.history('redo'), exported = session.exportPdf();
            await undo; await redo;
            expect((await exported).revision).toBe(editedRevision);
            const result = await session.exportPdf({}, [2, 0]);
            expect(result.fileName).toBe('pages.pdf'); expect(session.getState().document?.dirty).toBe(true);
            const reader = new PdfClient({ workerUrl, wasmBinary });
            try { expect((await reader.request('open', { bytes: new Uint8Array(await result.blob.arrayBuffer()), password: '' })).pages.length).toBe(2); }
            finally { reader.close(); }
            await expect(session.exportPdf({}, [])).rejects.toThrow('有效页面');
        } finally { session.dispose(); }
    });

    it('异步守卫等待时发生修改，不会用旧确认丢弃新编辑', async () => {
        const session = await opened(), entered = gate(), finish = gate();
        try {
            const opening = session.open({ id: 'other', source: fixture() }, {}, async () => { entered.resolve(); await finish.promise; return true; });
            const rejected = expect(opening).rejects.toThrow('文档已变化');
            await entered.promise;
            await session.edit({ kind: 'insert', at: 1 }, session.getState().document!.revision);
            finish.resolve(); await rejected;
            expect(session.getState().document?.id).toBe('invoice'); expect(session.getState().document?.dirty).toBe(true);
        } finally { finish.resolve(); session.dispose(); }
    });

    it('预先取消适用于所有输入类型；初始化失败可由 ready 和状态同时识别', async () => {
        const controller = new AbortController(); controller.abort();
        await expect(sourceBytes(new Uint8Array([1]), controller.signal)).rejects.toThrow('取消');
        const session = new PdfSession(false);
        try {
            await expect(session.start({ workerUrl, wasmBinary: new ArrayBuffer(1) })).rejects.toThrow();
            await expect(session.ready()).rejects.toThrow(); expect(session.getState().status).toBe('failed');
        } finally { session.dispose(); }
    });

    it('卸载会结束等待中的保存与守卫，即使宿主回调未处理取消信号', async () => {
        const session = await opened(), entered = gate(), finish = gate();
        try {
            const saving = session.save(async () => { entered.resolve(); await finish.promise; });
            const savedRejection = expect(saving).rejects.toThrow('取消');
            await entered.promise;
            const closing = session.close({}, async () => { await finish.promise; return true; });
            const closeRejection = expect(closing).rejects.toThrow('取消');
            session.dispose();
            await savedRejection; await closeRejection;
            await expect(session.ready()).rejects.toThrow('卸载');
            expect(session.getState().pendingOperations.length).toBe(0);
        } finally { finish.resolve(); session.dispose(); }
    });

    it('URL 描述符透传认证信息，网络故障保留 source 分类与 cause', async () => {
        let request: RequestInit | undefined;
        const fetch = mock.spyOn(globalThis, 'fetch').implement(async (_input, options) => {
            request = options; return new Response(fixture());
        });
        const signal = new AbortController().signal;
        const bytes = await sourceBytes({ url: '/private.pdf', headers: { Authorization: 'Bearer fixture-token' }, credentials: 'include' }, signal);
        expect(bytes.byteLength).toBeGreaterThan(0);
        expect(new Headers(request?.headers).get('Authorization')).toBe('Bearer fixture-token');
        expect(request?.credentials).toBe('include'); expect(request?.signal).toBe(signal);
        const failure = new Error('offline');
        fetch.implement(async () => { throw failure; });
        try { await sourceBytes('/private.pdf'); throw new Error('Expected source failure'); }
        catch (error) {
            expect(error instanceof Error && error.cause).toBe(failure);
            expect(error && typeof error === 'object' && 'code' in error && error.code).toBe('source');
        }
    });

    it('空编辑器关闭时也取消未完成加载，晚到的文件不得重新打开', async () => {
        const session = new PdfSession(false), entered = gate(), finish = gate();
        class SlowBlob extends Blob {
            override async arrayBuffer(): Promise<ArrayBuffer> { entered.resolve(); await finish.promise; return fixture().buffer; }
        }
        try {
            await session.start({ workerUrl, wasmBinary });
            const loading = session.open({ id: 'late', source: new SlowBlob() });
            const rejection = expect(loading).rejects.toThrow('取消');
            await entered.promise;
            await session.close(); await rejection;
            expect(session.getState().document).toBe(null);
            finish.resolve();
            await session.ready();
            expect(session.getState().document).toBe(null); expect(session.getState().pendingOperations.length).toBe(0);
        } finally { finish.resolve(); session.dispose(); }
    });
});
