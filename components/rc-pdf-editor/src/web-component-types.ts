import type {
    PdfDocumentInput, PdfDocumentState, PdfEditorError, PdfEditorRef, PdfEditorRuntime,
    PdfEditorState, PdfEditorToolbar, PdfEditorToolbarAction, PdfExportResult, PdfFont, PdfDocumentChangeGuard, PdfSaveHandler,
} from './types.js';

/** 普通 JS 工具栏动作；图标只接受 SVG 路径数据，不接受 HTML 或 ReactNode。 */
export interface PdfEditorElementToolbarAction extends Omit<PdfEditorToolbarAction, 'icon'> {
    readonly icon: { readonly path: string; readonly viewBox?: string };
}

export interface PdfEditorElementToolbar extends Omit<PdfEditorToolbar, 'extraActions'> {
    readonly extraActions?: readonly PdfEditorElementToolbarAction[];
}

/** Web 接口接受数据配置和命令回调；React 插件仍使用原 React 入口。 */
export interface PdfEditorElement extends HTMLElement, PdfEditorRef {
    runtime: PdfEditorRuntime | undefined;
    initialDocument: PdfDocumentInput | undefined;
    fonts: readonly PdfFont[] | undefined;
    toolbar: PdfEditorElementToolbar | undefined;
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
