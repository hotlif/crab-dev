// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type P = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type RealmError = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SharedConfig = DocsTypePlaceholder;

export interface RealmProps {
    /**
     * Props forwarded to the remote component or mount lifecycle without changing its protocol.
     */
    "remoteProps"?: P;

    /**
     * remoteEntry.js 完整 URL
     */
    "entry": string;

    /**
     * MF 容器全局名（ModuleFederationPlugin 的 name）；module 型下仅作缓存键与错误信息
     */
    "scope": string;

    /**
     * exposes 键, 如 ’./Widget’
     */
    "module": string;

    /**
     * remote 产物格式：’var’（默认, script 注入后取 globalThis[scope]）| ’module’（ESM, 经 import() 加载）
     */
    "entryType"?: 'var' | 'module';

    /**
     * 远程模块上的导出名, 默认 ’default’
     */
    "exportName"?: string;

    /**
     * 额外注入 share scope 的共享依赖
     */
    "shared"?: SharedConfig;

    /**
     * 全程加载期限（毫秒, script → init → get 全覆盖）, 超时判失败并使缓存失效。默认 15000
     */
    "timeout"?: number;

    /**
     * 透传 rc-spin 的 delay 防闪烁, 默认 300
     */
    "delay"?: number;

    /**
     * 透传 rc-spin 的 tip；缺省根据 locale 显示加载提示
     */
    "tip"?: ReactNode;

    /**
     * loading 期 Spin 包裹的占位内容（如 rc-skeleton）；默认 min-block-size 占位 div
     */
    "fallback"?: ReactNode;

    /**
     * 自定义错误态，接收原始诊断；缺省为按 locale 显示的 rc-alert + 重试操作
     */
    "errorFallback"?: (error: RealmError, retry: () => void) => ReactNode;

    /**
     * 远程内容就绪（已渲染 / 已 mount）回调
     */
    "onReady"?: () => void;

    /**
     * 任意阶段失败的原始诊断（含渲染期），不因 locale 改写；Base 已 Omit 原生 onError
     */
    "onError"?: (error: RealmError) => void;

    /**
     * ref 指向 Realm 容器 div
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 暂无说明。
     */
    "protocol"?: 'component' | 'mount';

    /**
     * 暂无说明。
     */
    "sandbox"?: true | false;

    /**
     * 暂无说明。
     */
    "styleSheets"?: string[];
}
