import { createRoot, type Root } from 'react-dom/client';
import ConfigProvider from '@crab-dev/rc-config-provider';
import PdfEditor from './pdf-editor.js';
import { PdfEditorError } from './types.js';
import type {
    PdfDocumentInput, PdfEditorRef, PdfEditorRuntime, PdfEditorState,
    PdfFont, PdfDocumentChangeGuard, PdfSaveHandler, PdfOperationOptions,
    PdfPageRegion, PdfRegionSelection, PdfRegionCaptureOptions,
} from './types.js';
import type { PdfEditorElementConstructor, PdfEditorElementEventMap, PdfEditorElementOptions, PdfEditorElementToolbar } from './web-component-types.js';

function deferredEditor() {
    let resolve!: (editor: PdfEditorRef) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<PdfEditorRef>((yes, no) => { resolve = yes; reject = no; });
    void promise.catch(() => {});
    return { promise, resolve, reject };
}

/** 注册是显式行为；导入 React 包不会访问 HTMLElement 或自动注册标签。 */
export function definePdfEditor(options: PdfEditorElementOptions): PdfEditorElementConstructor {
    const tagName = options.tagName ?? 'crab-pdf-editor';
    const existing = globalThis.customElements.get(tagName);
    if (existing) return existing as PdfEditorElementConstructor;
    const sheets = new WeakMap<Document, CSSStyleSheet>();

    class CrabPdfEditor extends HTMLElement implements PdfEditorRef {
        static observedAttributes = ['readonly', 'theme'];
        private root?: Root;
        private api?: PdfEditorRef;
        private mounted = deferredEditor();
        private pendingRender?: ReturnType<typeof deferredEditor>;
        private releaseRuntime?: () => void;
        private configuredRuntime?: PdfEditorRuntime;
        private activeRuntime?: PdfEditorRuntime;
        private documentInput?: PdfDocumentInput;
        private activeDocument?: PdfDocumentInput;
        private configuredFonts?: readonly PdfFont[];
        private configuredToolbar?: PdfEditorElementToolbar;
        private changeGuard?: PdfDocumentChangeGuard;
        private saveHandler?: PdfSaveHandler;
        private queued = false;
        private generation = 0;
        private listeners = new Set<() => void>();
        private snapshot: PdfEditorState = {
            status: 'initializing', document: null, pendingOperations: [], readOnly: false, canEdit: false,
        };
        private readonly receiveRef = (api: PdfEditorRef | null) => {
            this.api = api ?? undefined;
            if (api) {
                this.mounted.resolve(api);
                this.pendingRender?.resolve(api); this.pendingRender = undefined;
            }
        };

        get runtime() { return this.configuredRuntime; }
        set runtime(value: PdfEditorRuntime | undefined) {
            this.assertUnmounted('runtime'); this.configuredRuntime = value;
        }
        get initialDocument() { return this.documentInput; }
        set initialDocument(value: PdfDocumentInput | undefined) {
            this.assertUnmounted('initialDocument'); this.documentInput = value;
        }
        get fonts() { return this.configuredFonts; }
        set fonts(value: readonly PdfFont[] | undefined) { this.configuredFonts = value; this.scheduleRender(); }
        get toolbar() { return this.configuredToolbar; }
        set toolbar(value: PdfEditorElementToolbar | undefined) { this.configuredToolbar = value; this.scheduleRender(); }
        get beforeDocumentChange() { return this.changeGuard; }
        set beforeDocumentChange(value: PdfDocumentChangeGuard | undefined) { this.changeGuard = value; this.scheduleRender(); }
        get onSave() { return this.saveHandler; }
        set onSave(value: PdfSaveHandler | undefined) { this.saveHandler = value; this.scheduleRender(); }
        get readOnly() { return this.hasAttribute('readonly'); }
        set readOnly(value: boolean) { this.toggleAttribute('readonly', value); }
        get theme(): 'light' | 'dark' { return this.getAttribute('theme') === 'dark' ? 'dark' : 'light'; }
        set theme(value: 'light' | 'dark') { this.setAttribute('theme', value); }

        connectedCallback() {
            // 接管脚本加载前赋值的 own properties，防止它们遮蔽原型 setter。
            for (const name of ['runtime', 'initialDocument', 'fonts', 'toolbar', 'beforeDocumentChange', 'onSave', 'readOnly', 'theme'] as const) {
                const descriptor = Object.getOwnPropertyDescriptor(this, name);
                if (descriptor && 'value' in descriptor) {
                    Reflect.deleteProperty(this, name); Reflect.set(this, name, descriptor.value);
                }
            }
            this.scheduleRender();
        }

        disconnectedCallback() {
            // 同一任务内的 DOM 移动保留会话；真正移除才清理 Worker 和 React root。
            queueMicrotask(() => { if (!this.isConnected) this.dispose(); });
        }

        attributeChangedCallback() { this.scheduleRender(); }

        private assertUnmounted(name: string) {
            if (this.root) throw new PdfEditorError('busy', `${name} 仅在挂载前配置；切换文档请调用 open()`);
        }

        private emit<K extends keyof PdfEditorElementEventMap>(name: K, detail: PdfEditorElementEventMap[K]['detail']) {
            if (!this.isConnected) return;
            this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
        }

        private scheduleRender() {
            if (this.queued || !this.isConnected) return;
            this.pendingRender ??= deferredEditor();
            this.queued = true;
            queueMicrotask(() => {
                this.queued = false;
                if (!this.isConnected) return;
                try { this.renderEditor(); } catch (cause) {
                    const error = cause instanceof PdfEditorError ? cause : new PdfEditorError('runtime', 'Web Component 初始化失败', { cause });
                    this.mounted.reject(error); this.pendingRender?.reject(error); this.pendingRender = undefined;
                    this.releaseRuntime?.(); this.releaseRuntime = undefined;
                    this.snapshot = { ...this.snapshot, status: 'failed' };
                    this.emit('crab-error', error);
                }
            });
        }

        private renderEditor() {
            if (!this.root) {
                const lease = this.configuredRuntime ? { runtime: this.configuredRuntime } : options.createRuntime?.();
                if (!lease) throw new PdfEditorError('runtime', '请在挂载前配置 runtime，或使用包含运行时的独立 JS');
                this.activeRuntime = lease.runtime;
                this.releaseRuntime = lease.dispose;
                const src = this.getAttribute('src');
                this.activeDocument = this.documentInput ?? (src ? {
                    id: src, source: new URL(src, this.baseURI), fileName: this.getAttribute('file-name') ?? undefined,
                } : undefined);
                const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
                const mount = this.ownerDocument.createElement('div');
                mount.setAttribute('part', 'container');
                shadow.replaceChildren(mount);
                const css = ':host { display: block; } :host([hidden]) { display: none; }\n' + options.styleText;
                if ('adoptedStyleSheets' in shadow && typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype) {
                    let sheet = sheets.get(this.ownerDocument);
                    if (!sheet) { sheet = new CSSStyleSheet(); sheet.replaceSync(css); sheets.set(this.ownerDocument, sheet); }
                    shadow.adoptedStyleSheets = [sheet];
                } else {
                    const style = this.ownerDocument.createElement('style');
                    style.textContent = css; shadow.prepend(style);
                }
                this.root = createRoot(mount, { onUncaughtError: cause => {
                    const error = new PdfEditorError('runtime', 'PDF 编辑器渲染失败', { cause });
                    this.mounted.reject(error); this.pendingRender?.reject(error); this.pendingRender = undefined;
                    this.emit('crab-error', error);
                } });
                const generation = ++this.generation;
                void this.mounted.promise.then(api => api.ready()).then(() => {
                    if (generation === this.generation && this.isConnected) this.emit('crab-ready', undefined);
                }, () => { /* PdfEditor 的 onError 统一报告运行时初始化错误。 */ });
            }
            this.root.render(<ConfigProvider theme={this.theme}>
                <PdfEditor ref={this.receiveRef} runtime={this.activeRuntime!} initialDocument={this.activeDocument}
                    fonts={this.configuredFonts} readOnly={this.readOnly} toolbar={this.configuredToolbar && {
                        ...this.configuredToolbar,
                        extraActions: this.configuredToolbar.extraActions?.map(action => ({
                            ...action,
                            icon: <svg viewBox={action.icon.viewBox ?? '0 0 24 24'} fill="currentColor" focusable="false" aria-hidden="true"><path d={action.icon.path} /></svg>,
                        })),
                    }}
                    beforeDocumentChange={this.changeGuard} onSave={this.saveHandler}
                    onDocumentLoad={document => this.emit('crab-document-load', document)}
                    onStateChange={state => {
                        this.snapshot = state; this.listeners.forEach(listener => listener()); this.emit('crab-state-change', state);
                    }}
                    onSaved={result => this.emit('crab-saved', result)} onError={error => this.emit('crab-error', error)} />
            </ConfigProvider>);
        }

        private dispose() {
            this.generation++;
            this.mounted.reject(new PdfEditorError('cancelled', '编辑器已卸载'));
            this.pendingRender?.reject(new PdfEditorError('cancelled', '编辑器已卸载')); this.pendingRender = undefined;
            this.root?.unmount(); this.root = undefined; this.api = undefined;
            this.releaseRuntime?.(); this.releaseRuntime = undefined; this.activeRuntime = undefined;
            this.mounted = deferredEditor();
            this.snapshot = { status: 'disposed', document: null, pendingOperations: [], readOnly: this.readOnly, canEdit: false };
            this.listeners.forEach(listener => listener());
        }

        private editor(): Promise<PdfEditorRef> {
            return this.isConnected ? (this.pendingRender?.promise ?? (this.api ? Promise.resolve(this.api) : this.mounted.promise))
                : Promise.reject(new PdfEditorError('cancelled', '请先将编辑器插入文档'));
        }
        private current(): PdfEditorRef {
            if (!this.isConnected || !this.api) throw new PdfEditorError('busy', '请先等待 ready()');
            return this.api;
        }

        async ready() { await (await this.editor()).ready(); }
        getState() { return this.api?.getState() ?? this.snapshot; }
        subscribe(listener: () => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
        getPages() { return this.current().getPages(); }
        async open(document: PdfDocumentInput, operation?: PdfOperationOptions) { return (await this.editor()).open(document, operation); }
        async close(operation?: PdfOperationOptions) { return (await this.editor()).close(operation); }
        async exportPdf(operation?: PdfOperationOptions) { return (await this.editor()).exportPdf(operation); }
        async extractPages(indices: readonly number[], operation?: PdfOperationOptions) { return (await this.editor()).extractPages(indices, operation); }
        async save(operation?: PdfOperationOptions) { return (await this.editor()).save(operation); }
        async undo(operation?: PdfOperationOptions) { return (await this.editor()).undo(operation); }
        async redo(operation?: PdfOperationOptions) { return (await this.editor()).redo(operation); }
        goToPage(index: number) { this.current().goToPage(index); }
        fitToPage() { return this.current().fitToPage(); }
        async selectRegion(operation?: PdfOperationOptions) { return (await this.editor()).selectRegion(operation); }
        createRegionSelection(regions: readonly PdfPageRegion[]) { return this.current().createRegionSelection(regions); }
        async captureRegion(selection: PdfRegionSelection, operation?: PdfRegionCaptureOptions) { return (await this.editor()).captureRegion(selection, operation); }
    }

    globalThis.customElements.define(tagName, CrabPdfEditor);
    return CrabPdfEditor;
}
