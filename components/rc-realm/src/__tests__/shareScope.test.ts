import { afterEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import * as ReactNS from 'react';

import { resolveShareScope as resolveViaDefaultRegistry } from '../shareScope.js';
import type { ShareScope, SharedVersionEntry } from '../types.js';

type ShareScopeModule = typeof import('../shareScope.js');

// 模块内的自建 scope 是惰性单例, 用 isolate 为每个用例取全新模块实例
const importIsolated = async (): Promise<ShareScopeModule> => {
    let mod: ShareScopeModule | undefined;
    await mock.isolate(async () => {
        mod = await mock.import<ShareScopeModule>('../shareScope.js');
    });
    return mod as ShareScopeModule;
};

const hostReact = (): unknown => {
    const ns = ReactNS as { default?: unknown };
    return ns.default ?? ns;
};

const BUILTINS = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'];

describe('resolveShareScope', () => {
    afterEach(() => {
        delete (globalThis as Record<string, unknown>).__webpack_init_sharing__;
        delete (globalThis as Record<string, unknown>).__webpack_share_scopes__;
        mock.restoreAll();
    });

    it('非 webpack 宿主：自建 scope 并注入 react 四件套, loaded=1 且版本为运行时真值', async () => {
        const { resolveShareScope } = await importIsolated();
        const scope = await resolveShareScope();
        for (const name of BUILTINS) {
            const entry = scope[name]?.[ReactNS.version];
            expect(entry).toBeDefined();
            expect(entry.loaded).toBe(1);
            expect(entry.from).toBe('@crab-dev/rc-realm');
        }
    });

    it('注入的 react 工厂产物与宿主 React 是同一实例', async () => {
        // 此用例必须用默认模块注册表的实例：isolate 会连 react 一起
        // 重新实例化, 造成"两份 react"的假象——真实宿主环境只有一份
        const scope = await resolveViaDefaultRegistry();
        const factory = await scope.react[ReactNS.version].get();
        const produced = factory() as { default?: unknown };
        expect(produced.default ?? produced).toBe(hostReact());
    });

    it('自建 scope 是单例：两次调用返回同一对象引用', async () => {
        const { resolveShareScope } = await importIsolated();
        const first = await resolveShareScope();
        const second = await resolveShareScope();
        expect(second).toBe(first);
    });

    it('webpack MF 宿主：复用其 default scope, 保留既有条目并补齐 react', async () => {
        const initSharing = mock.fn<(scopeName: string) => Promise<void>>(async () => undefined);
        const lodashEntry: SharedVersionEntry = {
            get: () => Promise.resolve(() => ({})),
            loaded: 1,
        };
        const hostScope: ShareScope = { lodash: { '4.17.21': lodashEntry } };
        (globalThis as Record<string, unknown>).__webpack_init_sharing__ = initSharing;
        (globalThis as Record<string, unknown>).__webpack_share_scopes__ = { default: hostScope };

        const { resolveShareScope } = await importIsolated();
        const scope = await resolveShareScope();
        expect(initSharing).toHaveBeenCalledWith('default');
        expect(scope).toBe(hostScope);
        expect(scope.lodash['4.17.21']).toBe(lodashEntry);
        expect(scope.react?.[ReactNS.version]).toBeDefined();
    });

    it('只补缺不覆盖：宿主已注册的 react 条目不被替换', async () => {
        const hostReactEntry: SharedVersionEntry = {
            get: () => Promise.resolve(() => ({})),
            loaded: 1,
            from: 'host-webpack',
        };
        (globalThis as Record<string, unknown>).__webpack_init_sharing__ = mock.fn(
            async () => undefined,
        );
        (globalThis as Record<string, unknown>).__webpack_share_scopes__ = {
            default: { react: { [ReactNS.version]: hostReactEntry } },
        };

        const { resolveShareScope } = await importIsolated();
        const scope = await resolveShareScope();
        expect(scope.react[ReactNS.version]).toBe(hostReactEntry);
    });

    it('webpack sharing 运行时异常：降级自建 scope', async () => {
        (globalThis as Record<string, unknown>).__webpack_init_sharing__ = mock.fn(() => {
            throw new Error('sharing runtime broken');
        });
        (globalThis as Record<string, unknown>).__webpack_share_scopes__ = {};

        const { resolveShareScope } = await importIsolated();
        const scope = await resolveShareScope();
        expect(scope.react?.[ReactNS.version]).toBeDefined();
        // 降级后与 webpack 的 scope 容器无关
        expect((globalThis as { __webpack_share_scopes__?: Record<string, ShareScope> })
            .__webpack_share_scopes__?.default).toBeUndefined();
    });

    it('用户扩展 shared：异步 get 注入且经 interop 规范化补 default', async () => {
        const { resolveShareScope } = await importIsolated();
        const dayjsModule = { format: () => 'formatted' };
        const scope = await resolveShareScope({
            dayjs: { version: '1.11.0', get: async () => dayjsModule },
        });
        const entry = scope.dayjs['1.11.0'];
        expect(entry.loaded).toBe(1);
        const factory = await entry.get();
        const produced = factory() as { default?: unknown; format?: unknown };
        expect(produced.default).toBe(dayjsModule);
        expect(produced.format).toBe(dayjsModule.format);
    });
});
