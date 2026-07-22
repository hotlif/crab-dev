/* global __webpack_init_sharing__, __webpack_share_scopes__ -- webpack MF 宿主注入的
   sharing 运行时自由变量, 类型声明见 types.ts 的 declare global, 运行时 typeof 守卫后访问 */
import * as ReactNS from 'react';
import * as ReactDomNS from 'react-dom';
import * as ReactDomClientNS from 'react-dom/client';
import * as JsxRuntimeNS from 'react/jsx-runtime';

import type { ShareScope, SharedConfig, SharedVersionEntry } from './types.js';

/**
 * "远程与宿主共享同一 React 实例"的机制本身：以上四个静态顶层 import 被 packify
 * 判为 external 原样保留在产物中, 任何宿主打包器都会把它们解析到宿主自己的 React——
 * 与宿主是否 webpack 无关。注入 scope 后, remote 侧 shared 配 singleton 即命中宿主实例。
 */
const builtinShared: ReadonlyArray<readonly [string, object]> = [
    ['react', ReactNS],
    ['react-dom', ReactDomNS],
    ['react-dom/client', ReactDomClientNS],
    ['react/jsx-runtime', JsxRuntimeNS],
];

/**
 * ESM/CJS interop 规范化：remote 是 webpack 构建, 其 `import React from 'react'`
 * 经 interop 取 default。命名空间若无 default, 补 default 自引用并挂不可枚举的
 * __esModule 标记, 消除 default-import 拿到裸命名空间的翻车点。
 */
const toShareModule = (ns: object): unknown => {
    if ('default' in ns && (ns as { default?: unknown }).default !== undefined) {
        return ns;
    }
    const mod: Record<string, unknown> = { ...ns, default: ns };
    Object.defineProperty(mod, '__esModule', { value: true, enumerable: false });
    return mod;
};

const makeEntry = (factory: () => unknown): SharedVersionEntry => ({
    // 统一返回 Promise：webpack consume 运行时对 get() 的返回值直接 .then
    get: () => Promise.resolve(() => factory()),
    loaded: 1,
    from: '@crab-dev/rc-realm',
});

// 自建 scope 惰性单例：MF 语义要求所有容器 init 收到同一个 scope 对象引用
let ownScope: ShareScope | undefined;

const getOwnScope = (): ShareScope => (ownScope ??= {});

/** 只补缺、不覆盖：宿主 webpack 已注册的条目一律尊重 */
const mergeMissingEntries = (scope: ShareScope, shared?: SharedConfig): void => {
    for (const [name, ns] of builtinShared) {
        const versions = (scope[name] ??= {});
        // 版本一律取运行时真值, 不硬编码（react-dom 系与 react 同版发布）
        versions[ReactNS.version] ??= makeEntry(() => toShareModule(ns));
    }
    if (shared === undefined) {
        return;
    }
    for (const [name, config] of Object.entries(shared)) {
        const versions = (scope[name] ??= {});
        versions[config.version] ??= {
            get: async () => {
                const mod = await config.get();
                return () => toShareModule(mod as object);
            },
            loaded: 1,
            from: '@crab-dev/rc-realm',
        };
    }
};

/**
 * 解析 share scope：宿主是 webpack MF 环境（sharing 运行时可用）则复用其 default scope,
 * 否则用自建单例；两种情况都补齐 react 四件套与用户扩展的共享依赖。
 */
export async function resolveShareScope(shared?: SharedConfig): Promise<ShareScope> {
    let scope: ShareScope;
    try {
        if (
            typeof __webpack_init_sharing__ === 'function' &&
            typeof __webpack_share_scopes__ === 'object'
        ) {
            await __webpack_init_sharing__('default');
            scope = (__webpack_share_scopes__['default'] ??= {});
        } else {
            scope = getOwnScope();
        }
    } catch {
        // 宿主形似 webpack 但 sharing 运行时异常 → 降级自建
        scope = getOwnScope();
    }
    mergeMissingEntries(scope, shared);
    return scope;
}
