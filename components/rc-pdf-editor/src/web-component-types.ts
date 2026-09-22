import type {
    PdfDocumentInput, PdfDocumentState, PdfEditorError, PdfEditorRef, PdfEditorRuntime,
    PdfEditorState, PdfEditorToolbar, PdfExportResult, PdfFont, PdfDocumentChangeGuard, PdfSaveHandler,
} from './types.js';

/** Web 接口只接受数据配置；React 图标和 React 插件仍使用原 React 入口。 */
export interface PdfEditorElement extends HTMLElement, PdfEditorRef {
    runtime: PdfEditorRuntime | undefined;
    initialDocument: PdfDocumentInput | undefined;
    fonts: readonly PdfFont[] | undefined;
    toolbar: Pick<PdfEditorToolbar, 'visibility'> | undefined;
    readOnly: boolean;
    theme: 'light' | 'dark';
    beforeDocumentChange: PdfDocumentChangeGuard | undefined;
    onSave: PdfSaveHandler | undefined;
}

export interface PdfEditorElementEventMap {
    'crab-ready': CustomEvent<void>;
    'crab-document-load': CustomEvent<PdfDocumentState>;
    'crab-state-change': CustomEvent<PdfEditorState>;
    'crab-saved': CustomEvent<PdfExportResult>;
    'crab-error': CustomEvent<PdfEditorError>;
}

export interface PdfEditorElementOptions {
    /** 默认 crab-pdf-editor；同名重复注册返回已注册的构造函数。 */
    tagName?: string;
    /** 构建期收集的主题和组件 CSS，不包含外部 @import。 */
    styleText: string;
    /** 每次挂载创建，卸载时释放；元素 runtime property 优先。 */
    createRuntime?: () => { runtime: PdfEditorRuntime; dispose?: () => void };
}

export interface PdfEditorElementConstructor extends CustomElementConstructor {
    new(): PdfEditorElement;
}

declare global {
    interface HTMLElementTagNameMap {
        'crab-pdf-editor': PdfEditorElement;
    }
}
