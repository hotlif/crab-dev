import { asError, downloadPdf, PdfClient, sourceBytes } from './client.js';
import type { DocumentInfo, EditCommand } from './protocol.js';
import { captureRegionImage } from './capture-region.js';
import { validateRegions } from './regions.js';
import { PdfEditorError } from './types.js';
import type {
    PdfDocumentChangeGuard, PdfDocumentInput, PdfDocumentState, PdfEditorRuntime, PdfEditorState,
    PdfExportResult, PdfOperation, PdfOperationOptions, PdfSaveHandler,
    PdfPageDescriptor, PdfPageRegion, PdfRegionCaptureOptions, PdfRegionImage, PdfRegionSelection,
} from './types.js';

interface SessionSnapshot { state: PdfEditorState; client?: PdfClient; info?: DocumentInfo }

function deferred() {
    let resolve!: () => void, reject!: (error: unknown) => void;
    const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
    // 挂载后不一定有人调用 ready，仍需处理初始化拒绝。
    void promise.catch(() => {});
    return { promise, resolve, reject };
}

function checkSignal(signal?: AbortSignal) {
    if (signal?.aborted) throw new PdfEditorError('cancelled', '操作已取消');
}

/** 只取消等待，不声称可以撤销外部已经完成的持久化。 */
function cancellable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const cancel = () => { reject(new PdfEditorError('cancelled', '操作已取消')); };
        if (signal.aborted) cancel(); else signal.addEventListener('abort', cancel, { once: true });
        void promise.then(value => { signal.removeEventListener('abort', cancel); resolve(value); }, error => {
            signal.removeEventListener('abort', cancel); reject(error);
        });
    });
}

/** React 与命令式调用共用的文档事务边界；构造函数不创建 Worker。 */
export class PdfSession {
    private snapshot: SessionSnapshot;
    private readonly listeners = new Set<() => void>();
    private initialization = deferred();
    private lifetime = new AbortController();
    private queue: Promise<unknown> = Promise.resolve();
    private readonly operations = new Map<PdfOperation, number>();
    private saving = false;
    private runtimeFailure?: PdfEditorError;
    private documentEpoch = 0;
    private readonly loads = new Set<AbortController>();

    constructor(readOnly: boolean) {
        this.snapshot = { state: Object.freeze({ status: 'initializing', document: null, pendingOperations: Object.freeze([]), readOnly, canEdit: false }) };
    }

    getSnapshot = (): SessionSnapshot => this.snapshot;
    getState = (): PdfEditorState => this.snapshot.state;
    subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
    ready = (): Promise<void> => this.snapshot.state.status === 'disposed'
        ? Promise.reject(new PdfEditorError('cancelled', '编辑器已卸载'))
        : this.runtimeFailure ? Promise.reject(this.runtimeFailure) : this.initialization.promise;

    private update(state: Partial<PdfEditorState>, internal: Partial<SessionSnapshot> = {}) {
        const next = { ...this.snapshot.state, ...state };
        next.canEdit = next.status === 'ready' && !next.readOnly && !!next.document?.editable;
        this.snapshot = { ...this.snapshot, ...internal, state: Object.freeze(next) };
        this.listeners.forEach(listener => listener());
    }

    start(runtime: PdfEditorRuntime): Promise<void> {
        if (this.snapshot.client) return this.ready();
        if (this.lifetime.signal.aborted) { this.lifetime = new AbortController(); this.initialization = deferred(); }
        const initialization = this.initialization;
        this.runtimeFailure = undefined;
        try {
            const client = new PdfClient(runtime, error => {
                if (this.snapshot.client !== client || error.code === 'cancelled') return;
                this.runtimeFailure = error;
                this.update({ status: 'failed' }); initialization.reject(error);
            });
            this.update({ status: 'initializing' }, { client });
            void client.ready.then(() => {
                if (this.snapshot.client !== client) return;
                this.update({ status: 'ready' }); initialization.resolve();
            }, error => {
                if (this.snapshot.client !== client) return;
                this.runtimeFailure = asError(error);
                this.update({ status: 'failed' }); initialization.reject(this.runtimeFailure);
            });
        } catch (error) { this.runtimeFailure = asError(error); this.update({ status: 'failed' }); initialization.reject(this.runtimeFailure); }
        return initialization.promise;
    }

    dispose() {
        this.documentEpoch++;
        this.lifetime.abort(); this.snapshot.client?.close();
        this.initialization.reject(new PdfEditorError('cancelled', '编辑器已卸载'));
        this.update({ status: 'disposed', document: null }, { client: undefined, info: undefined });
    }

    setReadOnly(readOnly: boolean) {
        if (readOnly !== this.snapshot.state.readOnly) this.update({ readOnly });
    }

    private track<T>(operation: PdfOperation, task: () => Promise<T>): Promise<T> {
        this.operations.set(operation, (this.operations.get(operation) ?? 0) + 1);
        this.update({ pendingOperations: Object.freeze([...this.operations.keys()]) });
        return task().catch(error => { throw asError(error); }).finally(() => {
            const count = this.operations.get(operation)! - 1;
            if (count) this.operations.set(operation, count); else this.operations.delete(operation);
            this.update({ pendingOperations: Object.freeze([...this.operations.keys()]) });
        });
    }

    private enqueue<T>(operation: PdfOperation, task: (client: PdfClient) => Promise<T>, options: PdfOperationOptions = {}): Promise<T> {
        const lifetime = this.lifetime;
        return this.track(operation, () => {
            const signal = options.signal ? AbortSignal.any([lifetime.signal, options.signal]) : lifetime.signal;
            let submitted = false;
            const result = this.queue.then(async () => {
                checkSignal(lifetime.signal); checkSignal(options.signal);
                await cancellable(this.ready(), signal);
                checkSignal(lifetime.signal); checkSignal(options.signal);
                const client = this.snapshot.client;
                if (!client) throw new PdfEditorError('runtime', 'PDF 引擎尚未就绪');
                submitted = true;
                return task(client);
            });
            this.queue = result.catch(() => {});
            return new Promise<T>((resolve, reject) => {
                const cancel = () => { if (!submitted) reject(new PdfEditorError('cancelled', '操作已取消')); };
                if (signal.aborted) cancel(); else signal.addEventListener('abort', cancel, { once: true });
                void result.then(value => { signal.removeEventListener('abort', cancel); resolve(value); }, error => {
                    signal.removeEventListener('abort', cancel); reject(error);
                });
            });
        });
    }

    private document(sessionId?: string): PdfDocumentState {
        const document = this.snapshot.state.document;
        if (!document) throw new PdfEditorError('document', '请先打开 PDF');
        if (sessionId && document.sessionId !== sessionId) throw new PdfEditorError('cancelled', '文档已切换');
        return document;
    }

    private accept(info: DocumentInfo, identity = this.document()): PdfDocumentState {
        const document: PdfDocumentState = Object.freeze({
            ...identity, revision: info.revision, pageCount: info.pages.length,
            currentPageIndex: Math.min(identity.currentPageIndex, info.pages.length - 1),
            dirty: info.dirty, canUndo: info.canUndo, canRedo: info.canRedo, editable: info.editable,
        });
        this.update({ document }, { info });
        return document;
    }

    private async guard(next: PdfDocumentInput | null, signal: AbortSignal, guard?: PdfDocumentChangeGuard) {
        const current = this.snapshot.state.document;
        if (current && guard && !await cancellable(Promise.resolve(guard({ reason: next ? 'open' : 'close', current, next, signal })), signal)) {
            throw new PdfEditorError('cancelled', '已取消文档切换');
        }
        return current;
    }

    private checkReplacement(expected: PdfDocumentState | null, epoch: number) {
        const actual = this.snapshot.state.document;
        if (epoch !== this.documentEpoch || actual?.sessionId !== expected?.sessionId || actual?.revision !== expected?.revision) {
            throw new PdfEditorError('cancelled', '等待期间文档已变化，请重新打开或关闭');
        }
    }

    open(input: PdfDocumentInput, options: PdfOperationOptions = {}, guard?: PdfDocumentChangeGuard): Promise<PdfDocumentState> {
        const lifetime = this.lifetime, epoch = this.documentEpoch, load = new AbortController();
        this.loads.add(load);
        return this.track('open', async () => {
            checkSignal(options.signal); checkSignal(lifetime.signal);
            if (typeof input.id !== 'string' || !input.id.trim()) throw new PdfEditorError('source', '文档 id 不能为空');
            const signal = AbortSignal.any([lifetime.signal, load.signal, ...(options.signal ? [options.signal] : [])]);
            const previous = await this.guard(input, signal, guard);
            const bytes = await cancellable(sourceBytes(input.source, signal), signal);
            return this.enqueue('open', async client => {
                this.checkReplacement(previous, epoch);
                const info = await client.request('open', { bytes, password: input.password ?? '' });
                checkSignal(lifetime.signal);
                this.documentEpoch++;
                const fileName = (input.fileName || (input.source instanceof File ? input.source.name : 'document.pdf')).replace(/(?:\.pdf)?$/i, '.pdf');
                return this.accept(info, {
                    id: input.id, sessionId: crypto.randomUUID(), fileName, revision: info.revision,
                    pageCount: info.pages.length, currentPageIndex: 0, dirty: false, canUndo: false, canRedo: false, editable: info.editable,
                });
            }, { signal });
        }).finally(() => { this.loads.delete(load); });
    }

    close(options: PdfOperationOptions = {}, guard?: PdfDocumentChangeGuard): Promise<void> {
        const lifetime = this.lifetime, epoch = this.documentEpoch;
        return this.track('close', async () => {
            checkSignal(options.signal); checkSignal(lifetime.signal);
            const signal = options.signal ? AbortSignal.any([lifetime.signal, options.signal]) : lifetime.signal;
            const previous = await this.guard(null, signal, guard);
            await this.enqueue('close', async client => {
                this.checkReplacement(previous, epoch);
                await client.request('closeDocument', undefined);
                checkSignal(lifetime.signal);
                this.documentEpoch++;
                this.loads.forEach(load => load.abort());
                this.update({ document: null }, { info: undefined });
            }, options);
        });
    }

    setPage(index: number) {
        const document = this.document();
        if (!Number.isInteger(index) || index < 0 || index >= document.pageCount) throw new PdfEditorError('operation', '页码超出范围');
        if (index !== document.currentPageIndex) this.update({ document: Object.freeze({ ...document, currentPageIndex: index }) });
    }

    getPages = (): readonly PdfPageDescriptor[] => {
        this.document();
        return Object.freeze(this.snapshot.info!.pages.map(({ index, width, height, rotation }) => Object.freeze({ index, width, height, rotation: rotation * 90 })));
    };

    createRegionSelection = (regions: readonly PdfPageRegion[]): PdfRegionSelection => {
        const document = this.document();
        return Object.freeze({ documentId: document.id, sessionId: document.sessionId, revision: document.revision,
            regions: validateRegions(regions, this.getPages()) });
    };

    captureRegion = async (selection: PdfRegionSelection, options: PdfRegionCaptureOptions = {}): Promise<PdfRegionImage> => {
        const captured = { ...selection, regions: selection.regions.map(region => ({ ...region })) };
        const signal = options.signal ? AbortSignal.any([this.lifetime.signal, options.signal]) : this.lifetime.signal;
        const scale = options.scale ?? 2;
        return this.enqueue('capture', async client => {
            const current = this.snapshot.state.document;
            if (!current || current.id !== captured.documentId || current.sessionId !== captured.sessionId || current.revision !== captured.revision) {
                throw new PdfEditorError('stale', '选区对应的文档版本已变化，请重新选择区域');
            }
            const validated = this.createRegionSelection(captured.regions);
            return captureRegionImage(client, validated, this.snapshot.info!.pages, scale, signal);
        }, { signal });
    };

    private assertEditable() {
        if (!this.snapshot.state.canEdit) throw new PdfEditorError('permission', '当前文档为只读');
    }

    edit(command: EditCommand, revision: number): Promise<DocumentInfo> {
        const sessionId = this.snapshot.state.document?.sessionId;
        return this.enqueue('edit', async client => {
            if (!sessionId) throw new PdfEditorError('document', '请先打开 PDF');
            this.document(sessionId); this.assertEditable();
            const info = await client.request('edit', { command, revision });
            this.accept(info); return info;
        });
    }

    history(direction: 'undo' | 'redo', options: PdfOperationOptions = {}): Promise<PdfDocumentState> {
        const sessionId = this.snapshot.state.document?.sessionId;
        return this.enqueue(direction, async client => {
            if (!sessionId) throw new PdfEditorError('document', '请先打开 PDF');
            this.document(sessionId); this.assertEditable();
            return this.accept(await client.request(direction, undefined));
        }, options);
    }

    exportPdf(options: PdfOperationOptions = {}, pages?: readonly number[]): Promise<PdfExportResult> {
        const sessionId = this.snapshot.state.document?.sessionId;
        const indices = pages ? [...pages] : undefined;
        return this.enqueue(indices ? 'extract' : 'export', async client => {
            if (!sessionId) throw new PdfEditorError('document', '请先打开 PDF');
            const document = this.document(sessionId);
            const bytes = indices ? await client.request('extract', { pages: indices }) : await client.request('export', undefined);
            return Object.freeze({ blob: new Blob([bytes], { type: 'application/pdf' }), fileName: indices ? 'pages.pdf' : document.fileName,
                documentId: document.id, sessionId: document.sessionId, revision: document.revision });
        }, options);
    }

    save(handler?: PdfSaveHandler, options: PdfOperationOptions = {}): Promise<PdfExportResult> {
        if (this.saving) return Promise.reject(new PdfEditorError('busy', '已有保存正在进行'));
        this.saving = true;
        const lifetime = this.lifetime;
        const signal = options.signal ? AbortSignal.any([lifetime.signal, options.signal]) : lifetime.signal;
        return this.track('save', async () => {
            const result = await this.exportPdf({ signal });
            checkSignal(signal);
            if (handler) await cancellable(Promise.resolve(handler(result, { signal })), signal); else downloadPdf(result.blob, result.fileName);
            checkSignal(signal);
            // 保存期间允许切换文档或继续编辑；只确认快照对应版本，绝不把新文档标记已保存。
            await this.enqueue('save', async client => {
                if (this.snapshot.state.document?.sessionId === result.sessionId) {
                    this.accept(await client.request('saved', { revision: result.revision }));
                }
            }, { signal });
            return result;
        }).finally(() => { this.saving = false; });
    }
}
