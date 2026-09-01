import { css, cx } from '@crab-dev/css';
import { createElement, useEffect, useReducer, useRef, useState } from 'react';
import Alert from '@crab-dev/rc-alert';
import Button from '@crab-dev/rc-button';
import { useEventCallback } from '@crab-dev/rc-hooks';
import Spin from '@crab-dev/rc-spin';

import { RealmErrorBoundary } from './errorBoundary.js';
import { loadRemoteModule } from './loader.js';
import { applyStyleSheets, ensureShadowRoot } from './sandbox.js';
import token from './token.js';
import { RealmError } from './types.js';
import type { MountLifecycle, RealmProps, RealmRemoteProps } from './types.js';
import type { ComponentType, ReactNode } from 'react';

/* ────────────────────────────────── 静态样式 ────────────────────────────────── */

const hostStyle = css`
    position: relative;
    display: block;
`;

/* 远程内容就绪淡入：只是修饰, reduce 下移除；加载中反馈由 rc-spin 承担 */
const appearStyle = css`
    animation: rc-realm-appear ${token.motion.appear} both;

    @keyframes rc-realm-appear {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

/* loading 占位下限：防 Spin 包裹遮罩塌陷成 0 高、防内容就绪时布局跳动 */
const placeholderStyle = css`
    min-block-size: ${token.placeholder['min-block-size']};
`;

/* ────────────────────────────────── 状态机 ────────────────────────────────── */

type LoadedRemote<P extends RealmRemoteProps> =
    | { kind: 'component'; Component: ComponentType<P> }
    | { kind: 'mount'; lifecycle: MountLifecycle<P> };

type RealmState<P extends RealmRemoteProps> =
    | { status: 'loading' }
    | { status: 'ready'; loaded: LoadedRemote<P> }
    | { status: 'error'; error: RealmError };

type RealmAction<P extends RealmRemoteProps> =
    | { type: 'load' }
    | { type: 'ready'; loaded: LoadedRemote<P> }
    | { type: 'error'; error: RealmError };

function reducer<P extends RealmRemoteProps>(
    state: RealmState<P>,
    action: RealmAction<P>,
): RealmState<P> {
    switch (action.type) {
        case 'load':
            // loading → loading 返回原引用, 避免首次 effect 的冗余重渲染
            return state.status === 'loading' ? state : { status: 'loading' };
        case 'ready':
            return { status: 'ready', loaded: action.loaded };
        case 'error':
            return { status: 'error', error: action.error };
    }
}

/* ────────────────────────────────── 协议校验 ────────────────────────────────── */

// memo() / lazy() 包裹的组件 typeof 为 'object', 必须放行 $$typeof
const isComponentLike = (value: unknown): boolean =>
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && '$$typeof' in value);

/** 防错优于报错：形态不符立即给出指向另一协议的可行动提示, 而非渲染期才炸 */
function pickRemote<P extends RealmRemoteProps>(
    ns: unknown,
    protocol: 'component' | 'mount',
    exportName: string,
    entry: string,
    scope: string,
): LoadedRemote<P> {
    const record = (typeof ns === 'object' && ns !== null ? ns : {}) as Record<string, unknown>;
    const candidate = record[exportName] ?? ns;
    if (protocol === 'mount') {
        if (
            typeof candidate === 'object' &&
            candidate !== null &&
            typeof (candidate as MountLifecycle<P>).mount === 'function'
        ) {
            return { kind: 'mount', lifecycle: candidate as MountLifecycle<P> };
        }
        throw new RealmError(
            'protocol',
            entry,
            scope,
            `远程导出 '${exportName}' 不含 mount() 生命周期；若远程导出的是 React 组件, 请改用 protocol="component"`,
        );
    }
    if (isComponentLike(candidate)) {
        return { kind: 'component', Component: candidate as ComponentType<P> };
    }
    throw new RealmError(
        'protocol',
        entry,
        scope,
        `远程导出 '${exportName}' 不是 React 组件；若远程导出 mount/unmount 生命周期, 请改用 protocol="mount"`,
    );
}

const toRealmError = (cause: unknown, entry: string, scope: string): RealmError => {
    if (cause instanceof RealmError) {
        return cause;
    }
    return new RealmError(
        'factory',
        entry,
        scope,
        cause instanceof Error ? cause.message : '远程模块加载失败',
        { cause },
    );
};

/* ────────────────────────────────── 组件 ────────────────────────────────── */

/**
 * Realm 沙箱容器：运行时加载 webpack Module Federation 远程模块并嵌入宿主页面。
 *
 * - component 协议（默认）：远程导出 React 组件, 与宿主共享同一 React 实例, 同树内联渲染
 *   ——宿主 context、合成事件、portal 全部穿透, 远程组件表现与本地组件无异
 * - mount 协议：远程导出 mount/unmount 生命周期, 适配跨框架或不同 React 版本的远程,
 *   可选 `sandbox` 开启 Shadow DOM 样式隔离（component 协议在类型层禁用 sandbox）
 * - 宿主是否 webpack MF 环境均可工作：优先复用宿主 share scope, 否则自建并注入宿主 React
 * - 加载态复用 rc-spin（`delay` 防闪烁）, 错误态复用 rc-alert + rc-button 重试
 */
function Realm<P extends RealmRemoteProps>(props: RealmProps<P>): ReactNode {
    const {
        entry,
        scope,
        module: moduleId,
        entryType,
        exportName,
        shared,
        timeout,
        protocol,
        remoteProps,
        sandbox,
        styleSheets,
        delay = 300,
        tip = '正在加载远程模块',
        fallback,
        errorFallback,
        onReady,
        onError,
        className,
        ref,
        ...restProps
    } = props;

    const realmReducer: (state: RealmState<P>, action: RealmAction<P>) => RealmState<P> = reducer;
    const resolveRemote: (
        ns: unknown,
        protocol: 'component' | 'mount',
        exportName: string,
        entry: string,
        scope: string,
    ) => LoadedRemote<P> = pickRemote;
    const [state, dispatch] = useReducer(realmReducer, { status: 'loading' });
    const [attempt, setAttempt] = useState(0);
    // 失败时缓存已由 loader 自动失效, retry 只需 bump attempt 触发 effect 重跑；
    // 渲染期错误的场景缓存仍有效, 重试命中缓存快速恢复并借 key 重建边界子树
    const retry = () => setAttempt((current) => current + 1);

    const handleError = useEventCallback((error: RealmError) => {
        dispatch({ type: 'error', error });
        onError?.(error);
    });
    const handleReady = useEventCallback((loaded: LoadedRemote<P>) => {
        dispatch({ type: 'ready', loaded });
        onReady?.();
    });
    const handleRenderError = useEventCallback((cause: unknown) => {
        handleError(new RealmError('render', entry, scope, '远程组件渲染时抛出异常', { cause }));
    });

    useEffect(() => {
        let cancelled = false;
        dispatch({ type: 'load' });
        loadRemoteModule({ entry, scope, module: moduleId, entryType, shared, timeout }).then(
            (ns) => {
                if (cancelled) {
                    return;
                }
                try {
                    handleReady(
                        resolveRemote(ns, protocol ?? 'component', exportName ?? 'default', entry, scope),
                    );
                } catch (error) {
                    handleError(error as RealmError);
                }
            },
            (cause: unknown) => {
                if (!cancelled) {
                    handleError(toRealmError(cause, entry, scope));
                }
            },
        );
        return () => {
            // 竞态守卫：目标变更 / 卸载后, 迟到的 settle 不再触碰状态与回调
            cancelled = true;
        };
        // shared / timeout 是一次性加载配置, 有意不入依赖：变更不触发重载
    }, [entry, scope, moduleId, entryType, exportName, protocol, attempt]);

    /* ── mount 协议出口 ── */

    // 可变实例状态 ref（tech-stack §4.1 例外第 1 类）：跨渲染持有当前 mount 实例
    // 与其已消费的 props, 不应触发渲染
    const lifecycleHandleRef = useRef<{
        lifecycle: MountLifecycle<P>;
        container: HTMLElement;
        props: P | undefined;
    } | null>(null);
    const [remountKey, setRemountKey] = useState(0);

    // mount 由 effect 驱动而非 ref callback：ref attach 发生在本组件 layout effect 之前,
    // 任何"稳定引用 + 读最新值"的 ref callback 在 loading → ready 的更新渲染里读到的
    // 都是旧闭包；effect 的闭包则总是本次渲染的, 且卸载清理天然由 cleanup 承接
    const mountHostRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = mountHostRef.current;
        if (node === null || state.status !== 'ready' || state.loaded.kind !== 'mount') {
            return;
        }
        const lifecycle = state.loaded.lifecycle;
        let container: HTMLElement = node;
        if (sandbox === true) {
            const root = ensureShadowRoot(node);
            const inner = document.createElement('div');
            // 先就位子节点再注样式：applyStyleSheets 的回退分支产出 root 的子节点
            root.replaceChildren(inner);
            applyStyleSheets(root, styleSheets ?? []);
            container = inner;
        }
        let cleanup: (() => void) | undefined;
        try {
            const result = lifecycle.mount(container, (remoteProps ?? {}) as P);
            if (typeof result === 'function') {
                cleanup = result;
            }
        } catch (cause) {
            handleError(new RealmError('render', entry, scope, '远程模块 mount() 抛出异常', { cause }));
            return;
        }
        lifecycleHandleRef.current = { lifecycle, container, props: remoteProps as P | undefined };
        return () => {
            lifecycleHandleRef.current = null;
            try {
                cleanup?.();
                lifecycle.unmount?.(container);
            } finally {
                // 兜底清空, 防远程实现清理不彻底
                container.replaceChildren();
            }
        };
        // remoteProps / styleSheets 有意不入依赖：前者由下方 update effect 增量处理,
        // 后者只在挂载时应用（消费方内联数组字面量不应引发远程重挂）
    }, [state, remountKey, sandbox]);

    // remoteProps 变化：远程有 update 走增量, 否则换 key 重挂
    //（React 先跑旧 cleanup 再 attach 新 mount）；handle.props 引用比较天然跳过首挂
    useEffect(() => {
        const handle = lifecycleHandleRef.current;
        if (handle === null || handle.props === remoteProps) {
            return;
        }
        handle.props = remoteProps as P | undefined;
        if (handle.lifecycle.update !== undefined) {
            handle.lifecycle.update((remoteProps ?? {}) as P);
        } else {
            setRemountKey((current) => current + 1);
        }
    }, [remoteProps]);

    /* ── 渲染编排 ── */

    const errorNode = (error: RealmError): ReactNode =>
        errorFallback !== undefined ? (
            errorFallback(error, retry)
        ) : (
            <Alert
                type="error"
                title="远程模块加载失败"
                action={
                    <Button appearance="subtle" size="small" onClick={retry}>
                        重试
                    </Button>
                }
            >
                {error.message}
            </Alert>
        );

    const RemoteComponent = state.status === 'ready' && state.loaded.kind === 'component'
        ? state.loaded.Component
        : null;
    const resolvedRemoteProps = (remoteProps ?? {}) as P;

    return (
        <div
            {...restProps}
            ref={ref}
            className={cx(hostStyle, state.status === 'ready' && appearStyle, className)}
            aria-busy={state.status === 'loading'}
        >
            {state.status === 'error' ? (
                errorNode(state.error)
            ) : (
                <Spin spinning={state.status === 'loading'} delay={delay} tip={tip}>
                    {state.status === 'ready' ? (
                        RemoteComponent !== null ? (
                            // 同树内联、零额外 wrapper：宿主 context / 合成事件 / portal 全穿透
                            <RealmErrorBoundary key={attempt} onRenderError={handleRenderError}>
                                {createElement(RemoteComponent, resolvedRemoteProps)}
                            </RealmErrorBoundary>
                        ) : (
                            <div key={remountKey} data-realm-host ref={mountHostRef} />
                        )
                    ) : (
                        (fallback ?? <div className={placeholderStyle} aria-hidden="true" />)
                    )}
                </Spin>
            )}
        </div>
    );
}

export default Realm;
