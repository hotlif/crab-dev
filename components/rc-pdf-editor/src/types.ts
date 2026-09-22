import type { HTMLAttributes, ReactElement, Ref } from 'react';
import type { PdfEditorActionId } from './actions.js';

/** URL 请求可显式携带认证信息；二进制输入始终复制，不转移调用方的所有权。 */
export type PdfSource = string | URL | Blob | ArrayBuffer | Uint8Array | {
    url: string | URL;
    headers?: HeadersInit;
    credentials?: RequestCredentials;
};

export type PdfEditorRuntime = { workerUrl: string | URL } & (
    | { wasmUrl: string | URL; wasmBinary?: never }
    | { wasmBinary: ArrayBuffer; wasmUrl?: never }
);

/** 文档输入与业务身份一起传递；同一 id 再次打开也会产生新的 sessionId。 */
export interface PdfDocumentInput {
    id: string;
    source: PdfSource;
    fileName?: string;
    password?: string;
}

/** 可嵌入 PDF 的完整 TrueType 字体；不接受 WOFF、字体集合或 CFF。 */
export interface PdfFont {
    id: string;
    family: string;
    source: PdfSource;
}

export interface PdfDocumentState {
    readonly id: string;
    readonly sessionId: string;
    readonly fileName: string;
    readonly revision: number;
    readonly pageCount: number;
    /** 页索引从 0 开始。 */
    readonly currentPageIndex: number;
    readonly dirty: boolean;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    /** PDF 文档权限；最终可编辑性还受 readOnly 限制。 */
    readonly editable: boolean;
}

export type PdfOperation = 'open' | 'close' | 'edit' | 'undo' | 'redo' | 'export' | 'extract' | 'save' | 'capture';

export interface PdfEditorState {
    readonly status: 'initializing' | 'ready' | 'failed' | 'disposed';
    /** 空编辑器、初始化失败和关闭后的文档为 null。 */
    readonly document: PdfDocumentState | null;
    /** 已排队及正在执行的操作；不包含页面像素渲染。 */
    readonly pendingOperations: readonly PdfOperation[];
    readonly readOnly: boolean;
    readonly canEdit: boolean;
}

/** 导出时的不可变快照，不能用之后的当前页或当前文档来推断其归属。 */
export interface PdfExportResult {
    readonly blob: Blob;
    readonly fileName: string;
    readonly documentId: string;
    readonly sessionId: string;
    readonly revision: number;
}

export interface PdfOperationOptions {
    /** 提交到 Worker 前可取消；已提交的文档变更不会假装被回滚。 */
    signal?: AbortSignal;
}

export interface PdfDocumentChangeRequest {
    reason: 'open' | 'close';
    current: PdfDocumentState;
    next: PdfDocumentInput | null;
    signal: AbortSignal;
}

export type PdfDocumentChangeGuard = (request: PdfDocumentChangeRequest) => boolean | Promise<boolean>;
export type PdfSaveHandler = (result: PdfExportResult, options: PdfOperationOptions) => void | Promise<void>;
export type PdfEditorErrorCode = 'runtime' | 'source' | 'password' | 'document' | 'permission' | 'font' | 'unsupported' | 'operation' | 'cancelled' | 'busy' | 'stale' | 'plugin';

export class PdfEditorError extends Error {
    readonly code: PdfEditorErrorCode;

    constructor(code: PdfEditorErrorCode, message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'PdfEditorError';
        this.code = code;
    }
}

export interface PdfEditorRef {
    /** 只等待 Worker/WASM 就绪，不代表初始文档或页面已绘制。 */
    ready(): Promise<void>;
    getState(): PdfEditorState;
    /** 状态变化通知；返回解除订阅函数，回调内通过 getState 读取快照。 */
    subscribe(listener: () => void): () => void;
    /** 当前文档的显示尺寸，单位 pt，已应用页面旋转与裁剪框。 */
    getPages(): readonly PdfPageDescriptor[];
    /** 捕获一次交互选区，可跨页；Esc、signal、文档变化或卸载会取消。 */
    selectRegion(options?: PdfOperationOptions): Promise<PdfRegionSelection>;
    /** 为宿主提供的页面区域创建绑定当前版本的不可变选区。 */
    createRegionSelection(regions: readonly PdfPageRegion[]): PdfRegionSelection;
    /** 去除页间空隙并纵向拼接为 PNG；只读可用，过期选区拒绝。 */
    captureRegion(selection: PdfRegionSelection, options?: PdfRegionCaptureOptions): Promise<PdfRegionImage>;
    open(document: PdfDocumentInput, options?: PdfOperationOptions): Promise<PdfDocumentState>;
    /** 释放文档和历史，保留运行时与字体；受 beforeDocumentChange 约束。 */
    close(options?: PdfOperationOptions): Promise<void>;
    /** 返回当前完整 PDF 快照，不下载、不清除 dirty。 */
    exportPdf(options?: PdfOperationOptions): Promise<PdfExportResult>;
    /** 提取指定页，页索引从 0 开始，不下载、不修改源文档。 */
    extractPages(pageIndices: readonly number[], options?: PdfOperationOptions): Promise<PdfExportResult>;
    /** 与工具栏共用保存流程；同一时刻只接受一次保存。 */
    save(options?: PdfOperationOptions): Promise<PdfExportResult>;
    undo(options?: PdfOperationOptions): Promise<PdfDocumentState>;
    redo(options?: PdfOperationOptions): Promise<PdfDocumentState>;
    /** 无文档或索引无效时抛出错误；只保证发出导航请求，不等待像素绘制。 */
    goToPage(pageIndex: number): void;
    /** 尚未测量容器时返回 false；无文档时抛出错误。 */
    fitToPage(): boolean;
}

/** 未配置的动作默认显示；false 只隐藏入口，不改变快捷键、文档权限或 ref。 */
export type PdfEditorActionVisibility = Readonly<Partial<Record<PdfEditorActionId, boolean>>>;

export interface PdfEditorToolbarAction {
    /** 扩展动作内唯一且稳定，推荐使用业务命名空间。 */
    readonly id: string;
    /** 必填无障碍名称，同时用于 Tooltip。 */
    readonly label: string;
    /** 非交互图标；外层统一隐藏其无障碍语义。 */
    readonly icon: ReactElement;
    readonly placement: 'main' | 'tools' | 'status';
    readonly visible?: boolean;
    /** 纯函数，在渲染及执行前以最新会话状态评估；忙碌时始终禁用。 */
    readonly disabled?: boolean | ((state: PdfEditorState) => boolean);
    /** 使用与 ref 相同的公开接口；Promise 纳入忙碌态，失败交给 onError。 */
    readonly onSelect: (editor: PdfEditorRef) => void | Promise<void>;
}

export interface PdfEditorToolbar {
    readonly visibility?: PdfEditorActionVisibility;
    /** 按数组顺序追加到指定区域；不会替换或覆盖内置动作。 */
    readonly extraActions?: readonly PdfEditorToolbarAction[];
}

export interface PdfPageDescriptor {
    readonly index: number;
    readonly width: number;
    readonly height: number;
    /** 页面顺时针旋转角度：0、90、180 或 270；width/height 已应用该旋转。 */
    readonly rotation: number;
}

/** 显示页面左上角为原点，x 向右、y 向下，单位 pt（1/72 英寸）。 */
export interface PdfRegionBounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface PdfPageRegion extends PdfRegionBounds {
    readonly pageIndex: number;
}

export interface PdfRegionSelection {
    readonly documentId: string;
    readonly sessionId: string;
    readonly revision: number;
    /** 每页一个矩形，按页码升序，排除页面之间的空白。 */
    readonly regions: readonly PdfPageRegion[];
}

export interface PdfRegionCaptureOptions extends PdfOperationOptions {
    /** 每 pt 的像素数，默认 2（144 DPI），范围 0.25–8；超出图像预算拒绝，不偷偷降采样。 */
    scale?: number;
}

export interface PdfRegionImagePart {
    readonly pageIndex: number;
    /** 像素边界向外取整后实际覆盖的 PDF 页面区域，单位 pt。 */
    readonly sourceBounds: PdfRegionBounds;
    /** 在拼接 PNG 中的位置和尺寸，单位 px，可用于反算 OCR 框的页面坐标。 */
    readonly imageBounds: PdfRegionBounds;
}

export interface PdfRegionImage {
    readonly selection: PdfRegionSelection;
    readonly blob: Blob;
    readonly width: number;
    readonly height: number;
    readonly parts: readonly PdfRegionImagePart[];
}

export interface PdfEditorPluginContext {
    /** 获取最近一次提交的命令接口；setup 内长期持有 context 时也不会捕获旧 props。 */
    getEditor(): PdfEditorRef;
    /** setup 对应插件生命周期，动作对应本次任务；必须传给网络请求及区域命令。 */
    readonly signal: AbortSignal;
}

export interface PdfEditorPluginAction extends Omit<PdfEditorToolbarAction, 'onSelect'> {
    /** 默认 document：要求已有文档，切换或修改文档时取消；editor 可用于打开文件等全局操作。 */
    readonly scope?: 'document' | 'editor';
    readonly onSelect: (context: PdfEditorPluginContext) => void | Promise<void>;
}

export interface PdfEditorPlugin {
    /** 在同一编辑器内唯一。保持插件对象引用稳定；替换对象会卸载并重新安装。 */
    readonly id: string;
    readonly actions?: readonly PdfEditorPluginAction[];
    /** 在 effect 中安装；移除、替换或编辑器卸载时中止 signal 并执行清理。 */
    readonly setup?: (context: PdfEditorPluginContext) => void | (() => void);
}

export interface PdfRegionOcrPluginOptions<Result> {
    readonly id: string;
    readonly label?: string;
    readonly scale?: number;
    /** 宿主注入 OCR 引擎或服务；核心包不上传文档、不绑定 OCR 厂商。 */
    readonly recognize: (image: PdfRegionImage, options: { signal: AbortSignal }) => Promise<Result>;
    /** 可异步持久化或展示结果；拒绝时由插件宿主统一报告。 */
    readonly onResult: (result: Result, image: PdfRegionImage, options: { signal: AbortSignal }) => void | Promise<void>;
}

export interface PdfEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'onError' | 'onLoad'> {
    /** 文档命令接口；不是根 div 的 DOM ref。 */
    ref?: Ref<PdfEditorRef>;
    /** 仅在挂载时读取；之后通过 ref.open / ref.close 切换文档。 */
    initialDocument?: PdfDocumentInput;
    /** 挂载时的运行时配置；更换运行时请使用 React key 重建编辑器。 */
    runtime: PdfEditorRuntime;
    /** 完整 TTF 字体资源；保持数组引用稳定，更换数组会重新注册字体。 */
    fonts?: readonly PdfFont[];
    /** 禁用文档修改，保留浏览、提取、导出和保存。 */
    readOnly?: boolean;
    /** 可实时更新的图标显隐和业务动作；省略时保留全部内置入口。 */
    toolbar?: PdfEditorToolbar;
    /** 可动态安装和卸载的插件；通过公开命令、状态订阅与区域服务组合业务能力。 */
    plugins?: readonly PdfEditorPlugin[];
    /** 文档成功提交后通知；不代表页面像素已经呈现。 */
    onDocumentLoad?: (document: PdfDocumentState) => void;
    /** 包括初始化、空状态、关闭、排队、文档及页索引变化。 */
    onStateChange?: (state: PdfEditorState) => void;
    /** 所有打开/关闭入口共用的守卫；false 表示取消。卸载不运行异步守卫。 */
    beforeDocumentChange?: PdfDocumentChangeGuard;
    /** 持久化快照；拒绝时保留 dirty。省略时发起浏览器下载并视为已交付。 */
    onSave?: PdfSaveHandler;
    /** 持久化回调成功或下载已发起后通知，结果可能属于已经切走的文档。 */
    onSaved?: (result: PdfExportResult) => void;
    /** 内置 UI 和初始化错误；命令式方法只拒绝 Promise，避免重复通知。 */
    onError?: (error: PdfEditorError) => void;
}
