import { importModule } from './importer.js';
import { resolveShareScope } from './shareScope.js';
import { RealmError } from './types.js';
import type { RemoteContainer, SharedConfig } from './types.js';

export interface LoadRemoteOptions {
    /** remoteEntry.js 完整 URL */
    entry: string;
    /** MF 容器全局名（ModuleFederationPlugin 的 name） */
    scope: string;
    /** exposes 键, 如 './Widget' */
    module: string;
    /** remote 产物格式, 默认 'var' */
    entryType?: 'var' | 'module';
    /** 额外注入 share scope 的共享依赖 */
    shared?: SharedConfig;
    /** 全程期限毫秒, 默认 15000 */
    timeout?: number;
}

const DEFAULT_TIMEOUT = 15000;

export const canUseDom = (): boolean =>
    typeof window !== 'undefined' && typeof document !== 'undefined';

/*
 * 两级 Promise 缓存（模块级）：缓存 Promise 本身, N 个实例并发首载只注入一个 script、
 * 只 init 一次。container 级 Promise 覆盖 script/import → 容器校验 → init 完成全程,
 * "每容器恰一次 init"由此天然成立。
 * 缓存键用 JSON 数组序列化——entry 是含 ':' 的 URL, 拼接分隔符无法安全反解。
 */
const containerCache = new Map<string, Promise<RemoteContainer>>();
const moduleCache = new Map<string, Promise<unknown>>();
const scriptElements = new Map<string, HTMLScriptElement>();

const containerKeyOf = (options: LoadRemoteOptions): string =>
    JSON.stringify([options.entryType ?? 'var', options.entry, options.scope]);

const moduleKeyOf = (containerKey: string, module: string): string =>
    JSON.stringify([containerKey, module]);

const removeScript = (containerKey: string): void => {
    const script = scriptElements.get(containerKey);
    if (script !== undefined) {
        script.remove();
        scriptElements.delete(containerKey);
    }
};

/**
 * 失效必须校验身份：旧 Promise 可能在"超时失效 → 用户重试 → 新 Promise 已入缓存"
 * 之后才 reject, 无条件 delete 会误杀新一轮加载。
 */
const invalidateContainerIfCurrent = (key: string, promise: Promise<RemoteContainer>): void => {
    if (containerCache.get(key) === promise) {
        containerCache.delete(key);
        removeScript(key);
    }
};

const invalidateModuleIfCurrent = (key: string, promise: Promise<unknown>): void => {
    if (moduleCache.get(key) === promise) {
        moduleCache.delete(key);
    }
};

const isRemoteContainer = (value: unknown): value is RemoteContainer =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RemoteContainer).init === 'function' &&
    typeof (value as RemoteContainer).get === 'function';

const injectScript = (entry: string, scope: string, containerKey: string): Promise<RemoteContainer> =>
    new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = entry;
        script.async = true;
        scriptElements.set(containerKey, script);
        script.addEventListener('load', () => {
            const candidate = (globalThis as Record<string, unknown>)[scope];
            if (isRemoteContainer(candidate)) {
                resolve(candidate);
            } else {
                reject(
                    new RealmError(
                        'container',
                        entry,
                        scope,
                        `remoteEntry 加载完成但 globalThis['${scope}'] 不是 MF 容器：` +
                            'scope 与 ModuleFederationPlugin.name 不符, 或该脚本不是 var 格式的 remote',
                    ),
                );
            }
        });
        script.addEventListener('error', () => {
            reject(new RealmError('script', entry, scope, `remoteEntry 脚本加载失败：${entry}`));
        });
        document.head.appendChild(script);
    });

const createContainer = async (
    options: LoadRemoteOptions,
    containerKey: string,
): Promise<RemoteContainer> => {
    const { entry, scope } = options;
    let container: RemoteContainer;
    if ((options.entryType ?? 'var') === 'module') {
        let ns: unknown;
        try {
            ns = await importModule(entry);
        } catch (cause) {
            throw new RealmError('script', entry, scope, `remoteEntry 模块导入失败：${entry}`, {
                cause,
            });
        }
        const candidate = (ns as { default?: unknown }).default ?? ns;
        if (!isRemoteContainer(candidate)) {
            throw new RealmError(
                'container',
                entry,
                scope,
                'remoteEntry 模块的导出不是 MF 容器（缺少 init/get）',
            );
        }
        container = candidate;
    } else {
        // 预注册短路：globalThis[scope] 已存在合法容器则跳过 script 注入
        //（同时服务宿主预注册、demo 离线运行、测试免 HTTP 三个场景）
        const preRegistered = (globalThis as Record<string, unknown>)[scope];
        container = isRemoteContainer(preRegistered)
            ? preRegistered
            : await injectScript(entry, scope, containerKey);
    }
    const shareScope = await resolveShareScope(options.shared);
    try {
        await container.init(shareScope);
    } catch (cause) {
        // 宿主自身已 init 过同一容器时静默豁免（宽进）, 其余照常判失败
        if (!(cause instanceof Error && cause.message.includes('already been initialized'))) {
            throw new RealmError('init', entry, scope, '远程容器 init(shareScope) 抛出异常', {
                cause,
            });
        }
    }
    return container;
};

const getContainer = (
    options: LoadRemoteOptions,
    containerKey: string,
): Promise<RemoteContainer> => {
    const cached = containerCache.get(containerKey);
    if (cached !== undefined) {
        return cached;
    }
    const created = createContainer(options, containerKey);
    containerCache.set(containerKey, created);
    // 失败自失效挂在缓存写入点, 重试自然重走全链；成功的容器长留（多实例共享是特性）
    created.catch(() => invalidateContainerIfCurrent(containerKey, created));
    return created;
};

const getModule = (options: LoadRemoteOptions, containerKey: string): Promise<unknown> => {
    const moduleKey = moduleKeyOf(containerKey, options.module);
    const cached = moduleCache.get(moduleKey);
    if (cached !== undefined) {
        return cached;
    }
    const created = (async () => {
        const container = await getContainer(options, containerKey);
        let factory: () => unknown;
        try {
            factory = await container.get(options.module);
        } catch (cause) {
            throw new RealmError(
                'factory',
                options.entry,
                options.scope,
                `容器不含模块 '${options.module}' 或其加载失败`,
                { cause },
            );
        }
        try {
            return factory();
        } catch (cause) {
            throw new RealmError(
                'factory',
                options.entry,
                options.scope,
                `模块 '${options.module}' 的工厂执行抛出异常`,
                { cause },
            );
        }
    })();
    moduleCache.set(moduleKey, created);
    created.catch(() => invalidateModuleIfCurrent(moduleKey, created));
    return created;
};

/**
 * 加载 MF 远程模块：script/import → 容器校验 → init(shareScope) → get(module) → 工厂执行。
 * 结果按 (entryType, entry, scope, module) 缓存并发去重；失败与超时自动失效, 重试重走全链。
 * 供高级用户绕过 <Realm> 组件直接使用。
 */
export function loadRemoteModule<T = unknown>(options: LoadRemoteOptions): Promise<T> {
    if (!canUseDom()) {
        return Promise.reject(
            new RealmError('ssr', options.entry, options.scope, '非浏览器环境无法加载远程模块'),
        );
    }
    const containerKey = containerKeyOf(options);
    const modulePromise = getModule(options, containerKey);
    const timeout = options.timeout ?? DEFAULT_TIMEOUT;
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
            // 超时视同失败：两级缓存立即失效, 让下一次重试重走全链。
            // 此回调能运行说明 modulePromise 仍 pending（settle 会先 clearTimeout）,
            // 因此当前缓存条目必属本轮加载, 直接失效不会误杀新一轮；
            // 仍在等待同一底层 Promise 的其他实例不受影响, 各按各的 timeout 结算。
            invalidateModuleIfCurrent(moduleKeyOf(containerKey, options.module), modulePromise);
            const currentContainer = containerCache.get(containerKey);
            if (currentContainer !== undefined) {
                invalidateContainerIfCurrent(containerKey, currentContainer);
            }
            reject(
                new RealmError(
                    'timeout',
                    options.entry,
                    options.scope,
                    `远程模块加载超过 ${timeout}ms 期限`,
                ),
            );
        }, timeout);
        modulePromise.then(
            (value) => {
                clearTimeout(timer);
                resolve(value as T);
            },
            (cause: unknown) => {
                clearTimeout(timer);
                reject(cause);
            },
        );
    });
}

/** loadRemoteModule 的吞错薄封装：预热缓存（如 hover 时机）, 失败静默留给正式加载重试 */
export function preloadRemote(options: LoadRemoteOptions): void {
    loadRemoteModule(options).catch(() => undefined);
}

/**
 * 清除远程缓存。无参清全部；带参只清匹配 entry（及可选 scope）的条目。
 * 不删除 globalThis[scope]——它可能被宿主或其他消费方持有。测试隔离与热更新用, 生产慎用。
 */
export function clearRemoteCache(entry?: string, scope?: string): void {
    for (const key of [...containerCache.keys()]) {
        const [, keyEntry, keyScope] = JSON.parse(key) as [string, string, string];
        if ((entry === undefined || keyEntry === entry) && (scope === undefined || keyScope === scope)) {
            containerCache.delete(key);
            removeScript(key);
            for (const moduleKey of [...moduleCache.keys()]) {
                const [parentKey] = JSON.parse(moduleKey) as [string, string];
                if (parentKey === key) {
                    moduleCache.delete(moduleKey);
                }
            }
        }
    }
}
