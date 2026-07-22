import type { HTMLAttributes, ReactNode, Ref } from 'react';

/* ──────────────── Module Federation 运行时协议（与 webpack 5 sharing 线格式对齐） ──────────────── */

/** share scope 中"包名 → 某版本"的条目 */
export interface SharedVersionEntry {
    /**
     * 返回模块工厂的 Promise, 工厂调用返回模块命名空间。
     * 统一返回 Promise：webpack consume 运行时对 get() 的返回值直接 .then, 同步返回会炸。
     */
    get: () => Promise<() => unknown>;
    /** 1 = 已加载。singleton 消费端优先选取已加载版本, 杜绝 remote fallback 副本被激活成双 React */
    loaded?: 0 | 1 | boolean;
    /** 提供方标识, 仅用于诊断 */
    from?: string;
    eager?: boolean;
}

/** 形如 `{ react: { '19.2.7': SharedVersionEntry } }` */
export type ShareScope = Record<string, Record<string, SharedVersionEntry>>;

/** remoteEntry 暴露的容器（var 型挂在 globalThis[scope]；module 型是 ESM 命名空间或其 default） */
export interface RemoteContainer {
    init: (shareScope: ShareScope) => void | Promise<void>;
    get: (module: string) => Promise<() => unknown>;
}

declare global {
    // webpack MF 宿主的 sharing 运行时自由变量, 非 webpack 宿主下恒为 undefined。
    // 声明仅为包内 tsc --noEmit 通过（rollup 不检查自由变量）；运行时一律 typeof 守卫后访问。
    var __webpack_init_sharing__: ((scopeName: string) => Promise<void>) | undefined;
    var __webpack_share_scopes__: Record<string, ShareScope> | undefined;
}

/* ──────────────── 远程接入协议 ──────────────── */

export type RealmRemoteProps = Record<string, unknown>;

/**
 * 协议 b（mount）：远程导出的生命周期对象。
 * 适配跨框架 / 与宿主不同 React 版本的远程, 此协议下可选配 Shadow DOM 沙箱。
 */
export interface MountLifecycle<P extends RealmRemoteProps = RealmRemoteProps> {
    /** 挂载。可返回 cleanup（卸载时 cleanup 与 unmount 都会被调用, cleanup 先） */
    mount: (container: HTMLElement, props: P) => void | (() => void);
    /** remoteProps 变化时调用；未提供则 Realm 换 key 走 unmount → mount 全量重挂 */
    update?: (props: P) => void;
    unmount?: (container: HTMLElement) => void;
}

/* ──────────────── 结构化错误 ──────────────── */

export type RealmErrorCode =
    | 'ssr' // 非浏览器环境触发加载
    | 'script' // remoteEntry 网络加载失败（script onerror / module import 失败）
    | 'container' // 加载成功但容器不存在或形状不符（scope 名错 / 非 MF remote）
    | 'init' // container.init(shareScope) 抛错
    | 'factory' // container.get(module) 或工厂执行抛错
    | 'timeout' // 全程超时
    | 'protocol' // 模块形态与所选协议不符（component 无组件导出 / mount 无 mount 函数）
    | 'render'; // 远程组件渲染期 / mount() 执行期抛错

export class RealmError extends Error {
    readonly code: RealmErrorCode;

    readonly entry: string;

    readonly scope: string;

    constructor(
        code: RealmErrorCode,
        entry: string,
        scope: string,
        message: string,
        options?: { cause?: unknown },
    ) {
        super(message, options);
        this.name = 'RealmError';
        this.code = code;
        this.entry = entry;
        this.scope = scope;
    }
}

/* ──────────────── 用户扩展共享依赖（react 系四件套已内建, 无须声明） ──────────────── */

export interface SharedEntryConfig {
    /** 精确版本号, 供 remote 侧 requiredVersion 做 semver 匹配 */
    version: string;
    /** 返回模块命名空间（可异步）；Realm 内部做 ESM/CJS interop 规范化后入 scope */
    get: () => unknown | Promise<unknown>;
}

export type SharedConfig = Record<string, SharedEntryConfig>;

/* ──────────────── RealmProps：协议 × 沙箱 的可辨识联合 ──────────────── */

interface RealmBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onError'> {
    /** remoteEntry.js 完整 URL */
    entry: string;
    /** MF 容器全局名（ModuleFederationPlugin 的 name）；module 型下仅作缓存键与错误信息 */
    scope: string;
    /** exposes 键, 如 './Widget' */
    module: string;
    /** remote 产物格式：'var'（默认, script 注入后取 globalThis[scope]）| 'module'（ESM, 经 import() 加载） */
    entryType?: 'var' | 'module';
    /** 远程模块上的导出名, 默认 'default' */
    exportName?: string;
    /** 额外注入 share scope 的共享依赖 */
    shared?: SharedConfig;
    /** 全程加载期限（毫秒, script → init → get 全覆盖）, 超时判失败并使缓存失效。默认 15000 */
    timeout?: number;
    /** 透传 rc-spin 的 delay 防闪烁, 默认 300 */
    delay?: number;
    /** 透传 rc-spin 的 tip, 默认"正在加载远程模块" */
    tip?: ReactNode;
    /** loading 期 Spin 包裹的占位内容（如 rc-skeleton）；默认 min-block-size 占位 div */
    fallback?: ReactNode;
    /** 自定义错误态；缺省渲染 rc-alert(type=error) + 操作区 rc-button 重试 */
    errorFallback?: (error: RealmError, retry: () => void) => ReactNode;
    /** 远程内容就绪（已渲染 / 已 mount）回调 */
    onReady?: () => void;
    /** 任意阶段失败回调（含渲染期）。Base 已 Omit 原生 onError, 避免与 HTMLAttributes 冲突 */
    onError?: (error: RealmError) => void;
    /** ref 指向 Realm 容器 div */
    ref?: Ref<HTMLDivElement>;
}

/**
 * 限制原则（编译期防错）：component 协议禁用 sandbox——标准 MF React 远程组件的样式
 * （style-loader / mini-css-extract）注入 document.head, Shadow 隔离必致样式丢失,
 * "看似隔离实则丢样式"违反概念模型；styleSheets 仅在 sandbox: true 分支允许。
 */
type RealmProtocolProps<P extends RealmRemoteProps> =
    | { protocol?: 'component'; remoteProps?: P; sandbox?: never; styleSheets?: never }
    | { protocol: 'mount'; remoteProps?: P; sandbox: true; styleSheets?: string[] }
    | { protocol: 'mount'; remoteProps?: P; sandbox?: false; styleSheets?: never };

export type RealmProps<P extends RealmRemoteProps = RealmRemoteProps> = RealmBaseProps &
    RealmProtocolProps<P>;
