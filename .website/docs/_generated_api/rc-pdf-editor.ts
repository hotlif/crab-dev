/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type PdfDocumentChangeGuard = DocsTypePlaceholder;
type PdfDocumentInput = DocsTypePlaceholder;
type PdfDocumentState = DocsTypePlaceholder;
type PdfEditorError = DocsTypePlaceholder;
type PdfEditorPlugin = DocsTypePlaceholder;
type PdfEditorRef = DocsTypePlaceholder;
type PdfEditorRuntime = DocsTypePlaceholder;
type PdfEditorState = DocsTypePlaceholder;
type PdfEditorToolbar = DocsTypePlaceholder;
type PdfExportResult = DocsTypePlaceholder;
type PdfFont = DocsTypePlaceholder;
type PdfSaveHandler = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface PdfEditorProps {
    /**
     * 所有打开/关闭入口共用的守卫；false 表示取消。卸载不运行异步守卫。
     */
    "beforeDocumentChange"?: PdfDocumentChangeGuard;

    /**
     * 完整 TTF 字体资源；保持数组引用稳定，更换数组会重新注册字体。
     */
    "fonts"?: readonly PdfFont[];

    /**
     * 仅在挂载时读取；之后通过 ref.open / ref.close 切换文档。
     */
    "initialDocument"?: PdfDocumentInput;

    /**
     * 文档成功提交后通知；不代表页面像素已经呈现。
     */
    "onDocumentLoad"?: (document: PdfDocumentState) => void;

    /**
     * 内置 UI 和初始化错误；命令式方法只拒绝 Promise，避免重复通知。
     */
    "onError"?: (error: PdfEditorError) => void;

    /**
     * 持久化快照；拒绝时保留 dirty。省略时发起浏览器下载并视为已交付。
     */
    "onSave"?: PdfSaveHandler;

    /**
     * 持久化回调成功或下载已发起后通知，结果可能属于已经切走的文档。
     */
    "onSaved"?: (result: PdfExportResult) => void;

    /**
     * 包括初始化、空状态、关闭、排队、文档及页索引变化。
     */
    "onStateChange"?: (state: PdfEditorState) => void;

    /**
     * 可动态安装和卸载的插件；通过公开命令、状态订阅与区域服务组合业务能力。
     */
    "plugins"?: readonly PdfEditorPlugin[];

    /**
     * 禁用文档修改，保留浏览、提取、导出和保存。
     * @default false
     */
    "readOnly"?: boolean;

    /**
     * 文档命令接口；不是根 div 的 DOM ref。
     */
    "ref"?: Ref<PdfEditorRef>;

    /**
     * 挂载时的运行时配置；更换运行时请使用 React key 重建编辑器。
     */
    "runtime": PdfEditorRuntime;

    /**
     * 可实时更新的图标显隐和业务动作；省略时保留全部内置入口。
     */
    "toolbar"?: PdfEditorToolbar;
}
