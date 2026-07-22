import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as ReactNS from 'react';

// Jest ESM 下动态 import 无法直接拦截, importer.ts 即为此预留的 mock 接缝
jest.mock('../importer.js', () => ({
    __esModule: true,
    importModule: jest.fn(),
}));

import { importModule } from '../importer.js';
import { canUseDom, clearRemoteCache, loadRemoteModule, preloadRemote } from '../loader.js';
import type { ShareScope } from '../types.js';

const importModuleMock = jest.mocked(importModule);

const ENTRY = 'https://cdn.example.com/remoteEntry.js';
const SCOPE = 'testRemote';
const MODULE = './Widget';

const makeContainer = (moduleMap: Record<string, unknown> = { [MODULE]: { default: 'widget' } }) => ({
    init: jest.fn((_scope: ShareScope): void => undefined),
    get: jest.fn((id: string): Promise<() => unknown> => {
        const mod = moduleMap[id];
        if (mod === undefined) {
            return Promise.reject(new Error(`unknown module: ${id}`));
        }
        return Promise.resolve(() => mod);
    }),
});

// jsdom 不会真的加载外部 script, spy 仅用于观察注入行为, load/error 由用例手动派发
const spyOnAppend = () => jest.spyOn(document.head, 'appendChild');

describe('loadRemoteModule', () => {
    let appendSpy: ReturnType<typeof spyOnAppend>;

    const lastScript = (): HTMLScriptElement => {
        const calls = appendSpy.mock.calls;
        return calls[calls.length - 1][0] as HTMLScriptElement;
    };

    beforeEach(() => {
        appendSpy = spyOnAppend();
    });

    afterEach(() => {
        clearRemoteCache();
        delete (globalThis as Record<string, unknown>)[SCOPE];
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it('canUseDom 在 jsdom 环境为真', () => {
        expect(canUseDom()).toBe(true);
    });

    it('完整成功链：注入 script → init 收到含宿主 react 的 scope → 返回模块', async () => {
        const container = makeContainer({ [MODULE]: { default: 'remote-widget' } });
        const promise = loadRemoteModule<{ default: string }>({
            entry: ENTRY,
            scope: SCOPE,
            module: MODULE,
        });
        expect(appendSpy).toHaveBeenCalledTimes(1);
        const script = lastScript();
        expect(script.src).toBe(ENTRY);
        expect(script.async).toBe(true);

        (globalThis as Record<string, unknown>)[SCOPE] = container;
        script.dispatchEvent(new Event('load'));

        const mod = await promise;
        expect(mod.default).toBe('remote-widget');
        expect(container.init).toHaveBeenCalledTimes(1);
        const shareScope = container.init.mock.calls[0][0];
        const reactEntry = shareScope.react?.[ReactNS.version];
        expect(reactEntry).toBeDefined();
        expect(reactEntry.loaded).toBe(1);
    });

    it('预注册短路：globalThis[scope] 已存在合法容器时不注入 script', async () => {
        const container = makeContainer();
        (globalThis as Record<string, unknown>)[SCOPE] = container;
        const mod = await loadRemoteModule<{ default: string }>({
            entry: ENTRY,
            scope: SCOPE,
            module: MODULE,
        });
        expect(mod.default).toBe('widget');
        expect(appendSpy).not.toHaveBeenCalled();
    });

    it('并发去重：同参并发只注入一个 script、init 恰一次、模块引用相同', async () => {
        const container = makeContainer();
        const first = loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE });
        const second = loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE });
        expect(appendSpy).toHaveBeenCalledTimes(1);

        (globalThis as Record<string, unknown>)[SCOPE] = container;
        lastScript().dispatchEvent(new Event('load'));

        const [modA, modB] = await Promise.all([first, second]);
        expect(modA).toBe(modB);
        expect(container.init).toHaveBeenCalledTimes(1);
    });

    it('script 加载失败：reject code=script、移除 script、缓存失效后可重试成功', async () => {
        const promise = loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE });
        const failure = expect(promise).rejects.toMatchObject({
            name: 'RealmError',
            code: 'script',
        });
        const failedScript = lastScript();
        failedScript.dispatchEvent(new Event('error'));
        await failure;
        expect(failedScript.isConnected).toBe(false);

        const container = makeContainer();
        const retried = loadRemoteModule<{ default: string }>({
            entry: ENTRY,
            scope: SCOPE,
            module: MODULE,
        });
        expect(appendSpy).toHaveBeenCalledTimes(2);
        (globalThis as Record<string, unknown>)[SCOPE] = container;
        lastScript().dispatchEvent(new Event('load'));
        await expect(retried).resolves.toMatchObject({ default: 'widget' });
    });

    it('load 后容器缺失或形状不符：reject code=container', async () => {
        const promise = loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE });
        const failure = expect(promise).rejects.toMatchObject({ code: 'container' });
        // 不挂 globalThis[scope], 直接派发 load
        lastScript().dispatchEvent(new Event('load'));
        await failure;
    });

    it('init 抛 already been initialized：静默豁免不视为失败', async () => {
        const container = makeContainer();
        container.init.mockImplementation(() => {
            throw new Error('Container has already been initialized');
        });
        (globalThis as Record<string, unknown>)[SCOPE] = container;
        await expect(
            loadRemoteModule<{ default: string }>({ entry: ENTRY, scope: SCOPE, module: MODULE }),
        ).resolves.toMatchObject({ default: 'widget' });
    });

    it('init 抛其他异常：reject code=init 且缓存失效', async () => {
        const container = makeContainer();
        container.init.mockImplementation(() => {
            throw new Error('share scope shape mismatch');
        });
        (globalThis as Record<string, unknown>)[SCOPE] = container;
        await expect(
            loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE }),
        ).rejects.toMatchObject({ code: 'init' });

        // 失效后重试重走 init（预注册短路, 不注入 script）
        container.init.mockImplementation(() => undefined);
        await expect(
            loadRemoteModule<{ default: string }>({ entry: ENTRY, scope: SCOPE, module: MODULE }),
        ).resolves.toMatchObject({ default: 'widget' });
        expect(container.init).toHaveBeenCalledTimes(2);
    });

    it('factory 失败：reject code=factory, 仅 module 级失效（container 缓存保留, init 不重跑）', async () => {
        const container = makeContainer();
        container.get.mockRejectedValueOnce(new Error('chunk load failed'));
        (globalThis as Record<string, unknown>)[SCOPE] = container;

        await expect(
            loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE }),
        ).rejects.toMatchObject({ code: 'factory' });

        await expect(
            loadRemoteModule<{ default: string }>({ entry: ENTRY, scope: SCOPE, module: MODULE }),
        ).resolves.toMatchObject({ default: 'widget' });
        expect(container.init).toHaveBeenCalledTimes(1);
    });

    it('超时：期限内未完成 → reject code=timeout, 失效后可重试', async () => {
        jest.useFakeTimers();
        const promise = loadRemoteModule({
            entry: ENTRY,
            scope: SCOPE,
            module: MODULE,
            timeout: 5000,
        });
        const failure = expect(promise).rejects.toMatchObject({ code: 'timeout' });
        jest.advanceTimersByTime(5000);
        await failure;
        jest.useRealTimers();

        const container = makeContainer();
        const retried = loadRemoteModule<{ default: string }>({
            entry: ENTRY,
            scope: SCOPE,
            module: MODULE,
        });
        expect(appendSpy).toHaveBeenCalledTimes(2);
        (globalThis as Record<string, unknown>)[SCOPE] = container;
        lastScript().dispatchEvent(new Event('load'));
        await expect(retried).resolves.toMatchObject({ default: 'widget' });
    });

    it('module 型 remote：经 importModule 加载, 不注入 script', async () => {
        const container = makeContainer({ './W': { default: 42 } });
        importModuleMock.mockResolvedValue({ default: container });
        const mod = await loadRemoteModule<{ default: number }>({
            entry: 'https://cdn.example.com/remote.mjs',
            scope: 'moduleScope',
            module: './W',
            entryType: 'module',
        });
        expect(importModuleMock).toHaveBeenCalledWith('https://cdn.example.com/remote.mjs');
        expect(mod.default).toBe(42);
        expect(appendSpy).not.toHaveBeenCalled();
        clearRemoteCache('https://cdn.example.com/remote.mjs');
    });

    it('module 型导出不是容器：reject code=container', async () => {
        importModuleMock.mockResolvedValue({ default: { notAContainer: true } });
        await expect(
            loadRemoteModule({
                entry: 'https://cdn.example.com/broken.mjs',
                scope: 'brokenScope',
                module: './W',
                entryType: 'module',
            }),
        ).rejects.toMatchObject({ code: 'container' });
    });

    it('clearRemoteCache 后全链重走', async () => {
        const container = makeContainer();
        (globalThis as Record<string, unknown>)[SCOPE] = container;
        await loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE });
        clearRemoteCache(ENTRY, SCOPE);
        await loadRemoteModule({ entry: ENTRY, scope: SCOPE, module: MODULE });
        // 预注册短路下不注入 script, 但 init 因缓存清除重跑了一次
        expect(container.init).toHaveBeenCalledTimes(2);
    });

    it('preloadRemote 吞掉失败不产生未处理拒绝', async () => {
        preloadRemote({ entry: ENTRY, scope: SCOPE, module: MODULE });
        expect(appendSpy).toHaveBeenCalledTimes(1);
        lastScript().dispatchEvent(new Event('error'));
        // 静默失败：等待微任务队列清空, 若产生 unhandled rejection 将由 Jest 报错
        await new Promise((resolve) => {
            setTimeout(resolve, 0);
        });
    });
});
