import { PdfEditorError, type PdfDocumentState, type PdfOperationOptions, type PdfPageRegion, type PdfRegionSelection } from './types.js';
import type { PdfSession } from './session.js';

/** 一次性选区请求与 React 渲染分离，保证同一轮连续调用及取消都立即生效。 */
export class RegionSelection {
    private document: PdfDocumentState | null = null;
    private readonly listeners = new Set<() => void>();
    private finish?: (regions?: readonly PdfPageRegion[], error?: PdfEditorError) => void;
    constructor(private readonly session: PdfSession) {}
    getSnapshot = () => this.document;
    subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
    private update(document: PdfDocumentState | null) { this.document = document; this.listeners.forEach(listener => listener()); }

    start = (options: PdfOperationOptions = {}): Promise<PdfRegionSelection> => {
        if (options.signal?.aborted) return Promise.reject(new PdfEditorError('cancelled', '区域选择已取消'));
        if (this.finish) return Promise.reject(new PdfEditorError('busy', '已有区域选择正在进行'));
        const state = this.session.getState(), document = state.document;
        if (state.status !== 'ready' || !document) return Promise.reject(new PdfEditorError('document', '请先打开 PDF'));
        if (state.pendingOperations.length) return Promise.reject(new PdfEditorError('busy', '请等待文档操作完成'));
        return new Promise((resolve, reject) => {
            const cancel = () => this.cancel();
            const unsubscribe = this.session.subscribe(() => {
                const next = this.session.getState();
                if (next.status !== 'ready' || next.document?.sessionId !== document.sessionId || next.document.revision !== document.revision) this.cancel();
            });
            this.finish = (regions, error) => {
                this.finish = undefined; unsubscribe(); options.signal?.removeEventListener('abort', cancel);
                if (error) reject(error);
                else {
                    try { resolve(this.session.createRegionSelection(regions!)); } catch (failure) { reject(failure); }
                }
                this.update(null);
            };
            options.signal?.addEventListener('abort', cancel, { once: true });
            this.update(document);
        });
    };
    complete = (regions: readonly PdfPageRegion[]) => { this.finish?.(regions); };
    cancel = () => { this.finish?.(undefined, new PdfEditorError('cancelled', '区域选择已取消')); };
}
