import {
    act,
    beforeAll,
    describe,
    expect,
    fireEvent,
    it,
    mock,
    render,
    screen,
    type MockFunction,
} from '@crab-dev/wake/test/react';
import { StrictMode, memo } from 'react';

import { RealmError } from '../types.js';
import type { MountLifecycle, RealmError as RealmErrorType, RealmRemoteProps } from '../types.js';

type LoaderModule = typeof import('../loader.js');

const loadMock = mock.fn<LoaderModule['loadRemoteModule']>();

// realm.tsx 使用该相对说明符加载远程模块；以受控替身驱动组件状态机。
mock.module('./loader.js', () => ({
    loadRemoteModule: loadMock,
    preloadRemote: mock.fn(),
    clearRemoteCache: mock.fn(),
    canUseDom: () => true,
}));

let Realm: (typeof import('../realm.js'))['default'];

beforeAll(async () => {
    const realmModule = await mock.import<typeof import('../realm.js')>('../realm.js');
    Realm = realmModule.default;
});

interface Deferred {
    resolve: (value: unknown) => void;
    reject: (cause: unknown) => void;
}

/** 让 loadRemoteModule 返回可手动结算的 Promise */
const deferLoad = (): Deferred[] => {
    const handles: Deferred[] = [];
    loadMock.implement(
        () =>
            new Promise((resolve, reject) => {
                handles.push({ resolve: resolve as Deferred['resolve'], reject });
            }),
    );
    return handles;
};

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });
};

const BASE = { entry: 'https://cdn.example.com/remoteEntry.js', scope: 'demo', module: './Widget' };

const RemoteHello = ({ message }: { message?: unknown }) => (
    <div>远程内容: {String(message ?? 'hello')}</div>
);

describe('Realm', () => {
    it('loading：容器 aria-busy=true, delay=0 时 Spin 指示器可见', async () => {
        deferLoad();
        const { container } = await render(<Realm {...BASE} delay={0} data-testid="realm" />);
        await flush();
        expect(screen.getByTestId('realm').getAttribute('aria-busy')).toBe('true');
        expect(container.querySelector('[role="status"]')).not.toBeNull();
    });

    it('loading：自定义 fallback 占位生效', async () => {
        deferLoad();
        await render(
            <Realm {...BASE} delay={0} fallback={<div data-testid="skeleton">占位</div>} />,
        );
        await flush();
        expect(screen.getByTestId('skeleton')).toBeDefined();
    });

    it('成功：远程组件渲染、remoteProps 透传、onReady 恰一次、aria-busy 撤下', async () => {
        const handles = deferLoad();
        const onReady = mock.fn();
        await render(
            <Realm
                {...BASE}
                delay={0}
                remoteProps={{ message: 'from-host' }}
                onReady={onReady}
                data-testid="realm"
            />,
        );
        await flush();
        handles[0].resolve({ default: RemoteHello });
        await flush();
        expect(screen.getByText('远程内容: from-host')).toBeDefined();
        expect(onReady).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('realm').getAttribute('aria-busy')).toBe('false');
    });

    it('exportName：从具名导出取远程组件', async () => {
        const handles = deferLoad();
        await render(<Realm {...BASE} delay={0} exportName="Widget" />);
        await flush();
        handles[0].resolve({ Widget: RemoteHello });
        await flush();
        expect(screen.getByText('远程内容: hello')).toBeDefined();
    });

    it('memo 包裹的远程组件（$$typeof 对象）通过协议校验', async () => {
        const handles = deferLoad();
        await render(<Realm {...BASE} delay={0} />);
        await flush();
        handles[0].resolve({ default: memo(RemoteHello) });
        await flush();
        expect(screen.getByText('远程内容: hello')).toBeDefined();
    });

    it('导出不是组件：protocol 错误且文案指向 mount 协议', async () => {
        const handles = deferLoad();
        const onError = mock.fn<(error: RealmErrorType) => void>();
        await render(<Realm {...BASE} delay={0} onError={onError} />);
        await flush();
        handles[0].resolve({ default: 42 });
        await flush();
        expect(onError).toHaveBeenCalledTimes(1);
        const error = onError.calls.calls[0][0];
        expect(error.code).toBe('protocol');
        expect(error.message).toContain('protocol="mount"');
    });

    it('失败：默认渲染 rc-alert 错误态, 点击重试重新加载后恢复', async () => {
        const handles = deferLoad();
        const onError = mock.fn<(error: RealmErrorType) => void>();
        await render(<Realm {...BASE} delay={0} onError={onError} />);
        await flush();
        handles[0].reject(new RealmError('script', BASE.entry, BASE.scope, '脚本加载失败'));
        await flush();
        expect(screen.getByText('远程模块加载失败')).toBeDefined();
        expect(screen.getByText('脚本加载失败')).toBeDefined();
        expect(onError.calls.calls[0][0].code).toBe('script');

        await fireEvent.click(screen.getByRole('button', { name: '重试' }));
        await flush();
        expect(loadMock).toHaveBeenCalledTimes(2);
        handles[1].resolve({ default: RemoteHello });
        await flush();
        expect(screen.getByText('远程内容: hello')).toBeDefined();
    });

    it('自定义 errorFallback 收到错误与 retry', async () => {
        const handles = deferLoad();
        await render(
            <Realm
                {...BASE}
                delay={0}
                errorFallback={(error, retry) => (
                    <div>
                        <span>{`code=${error.code}`}</span>
                        <button onClick={retry}>再来一次</button>
                    </div>
                )}
            />,
        );
        await flush();
        handles[0].reject(new RealmError('timeout', BASE.entry, BASE.scope, '超时'));
        await flush();
        expect(screen.getByText('code=timeout')).toBeDefined();
        await fireEvent.click(screen.getByRole('button', { name: '再来一次' }));
        await flush();
        expect(loadMock).toHaveBeenCalledTimes(2);
    });

    it('卸载竞态：pending 中卸载后 resolve, onReady 不触发也无 act 警告', async () => {
        const handles = deferLoad();
        const onReady = mock.fn();
        const errorSpy = mock.spyOn(console, 'error').implement(() => undefined);
        const { unmount } = await render(<Realm {...BASE} delay={0} onReady={onReady} />);
        await flush();
        await unmount();
        handles[0].resolve({ default: RemoteHello });
        await flush();
        expect(onReady).not.toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
        errorSpy.restore();
    });

    it('StrictMode 双跑：onReady 仍恰一次', async () => {
        const handles = deferLoad();
        const onReady = mock.fn();
        await render(
            <StrictMode>
                <Realm {...BASE} delay={0} onReady={onReady} />
            </StrictMode>,
        );
        await flush();
        handles.forEach((handle) => handle.resolve({ default: RemoteHello }));
        await flush();
        expect(screen.getByText('远程内容: hello')).toBeDefined();
        expect(onReady).toHaveBeenCalledTimes(1);
    });

    it('remoteProps 变化：component 协议不触发重新加载', async () => {
        const handles = deferLoad();
        const { rerender } = await render(<Realm {...BASE} delay={0} remoteProps={{ message: 'a' }} />);
        await flush();
        handles[0].resolve({ default: RemoteHello });
        await flush();
        expect(screen.getByText('远程内容: a')).toBeDefined();

        await rerender(<Realm {...BASE} delay={0} remoteProps={{ message: 'b' }} />);
        await flush();
        expect(screen.getByText('远程内容: b')).toBeDefined();
        expect(loadMock).toHaveBeenCalledTimes(1);
    });

    it('entry 变化：作废旧加载并重新加载新目标', async () => {
        const handles = deferLoad();
        const onError = mock.fn();
        const { rerender } = await render(<Realm {...BASE} delay={0} onError={onError} />);
        await flush();
        await rerender(
            <Realm
                {...BASE}
                entry="https://cdn.example.com/v2/remoteEntry.js"
                delay={0}
                onError={onError}
            />,
        );
        await flush();
        expect(loadMock).toHaveBeenCalledTimes(2);
        // 旧加载迟到的失败不得触碰状态
        handles[0].reject(new RealmError('script', BASE.entry, BASE.scope, '旧目标失败'));
        handles[1].resolve({ default: RemoteHello });
        await flush();
        expect(screen.getByText('远程内容: hello')).toBeDefined();
        expect(onError).not.toHaveBeenCalled();
    });

    describe('渲染期错误', () => {
        beforeAll(() => {
            // React 会向 console.error 打印边界捕获的错误, 静音以保持输出干净
            mock.spyOn(console, 'error').implement(() => undefined);
        });

        it('ErrorBoundary 捕获 → code=render 错误态, 重试借 key 重建恢复', async () => {
            const handles = deferLoad();
            const onError = mock.fn<(error: RealmErrorType) => void>();
            let shouldThrow = true;
            const Exploding = () => {
                if (shouldThrow) {
                    throw new Error('render boom');
                }
                return <div>恢复正常</div>;
            };
            await render(<Realm {...BASE} delay={0} onError={onError} />);
            await flush();
            handles[0].resolve({ default: Exploding });
            await flush();
            expect(onError.calls.calls[0][0].code).toBe('render');
            expect(screen.getByText('远程模块加载失败')).toBeDefined();

            shouldThrow = false;
            await fireEvent.click(screen.getByRole('button', { name: '重试' }));
            await flush();
            handles[1].resolve({ default: Exploding });
            await flush();
            expect(screen.getByText('恢复正常')).toBeDefined();
        });
    });

    describe('mount 协议', () => {
        it('mount 收到容器与 props；update 走增量；卸载时 cleanup 与 unmount 依次调用且容器清空', async () => {
            const handles = deferLoad();
            const cleanupFn = mock.fn();
            const lifecycle: MountLifecycle & {
                mount: MockFunction<MountLifecycle['mount']>;
                update: MockFunction<(props: RealmRemoteProps) => void>;
                unmount: MockFunction<(container: HTMLElement) => void>;
            } = {
                mount: mock.fn<MountLifecycle['mount']>((container, props) => {
                    const el = document.createElement('p');
                    el.textContent = `mounted:${String(props.label)}`;
                    container.append(el);
                    return cleanupFn;
                }),
                update: mock.fn<(props: RealmRemoteProps) => void>(),
                unmount: mock.fn<(container: HTMLElement) => void>(),
            };
            const { container, rerender, unmount } = await render(
                <Realm {...BASE} protocol="mount" delay={0} remoteProps={{ label: 'a' }} />,
            );
            await flush();
            handles[0].resolve({ default: lifecycle });
            await flush();

            expect(lifecycle.mount).toHaveBeenCalledTimes(1);
            const host = container.querySelector('[data-realm-host]') as HTMLElement;
            expect(host).not.toBeNull();
            expect(host.textContent).toBe('mounted:a');

            const nextProps = { label: 'b' };
            await rerender(<Realm {...BASE} protocol="mount" delay={0} remoteProps={nextProps} />);
            await flush();
            expect(lifecycle.update).toHaveBeenCalledWith(nextProps);
            expect(lifecycle.mount).toHaveBeenCalledTimes(1);

            await unmount();
            expect(cleanupFn).toHaveBeenCalledTimes(1);
            expect(lifecycle.unmount).toHaveBeenCalledTimes(1);
            const mountedContainer = lifecycle.mount.calls.calls[0][0];
            expect(mountedContainer.childElementCount).toBe(0);
        });

        it('无 update 的远程：remoteProps 变化触发 unmount → mount 全量重挂', async () => {
            const handles = deferLoad();
            const lifecycle = {
                mount: mock.fn<MountLifecycle['mount']>((container, props) => {
                    container.textContent = `full:${String(props.label)}`;
                }),
            };
            const { container, rerender } = await render(
                <Realm {...BASE} protocol="mount" delay={0} remoteProps={{ label: 'a' }} />,
            );
            await flush();
            handles[0].resolve({ default: lifecycle });
            await flush();
            expect(lifecycle.mount).toHaveBeenCalledTimes(1);

            await rerender(<Realm {...BASE} protocol="mount" delay={0} remoteProps={{ label: 'b' }} />);
            await flush();
            expect(lifecycle.mount).toHaveBeenCalledTimes(2);
            expect(container.querySelector('[data-realm-host]')?.textContent).toBe('full:b');
        });

        it('mount() 抛错：code=render 错误态', async () => {
            const handles = deferLoad();
            const onError = mock.fn<(error: RealmErrorType) => void>();
            const lifecycle = {
                mount: mock.fn(() => {
                    throw new Error('mount boom');
                }),
            };
            await render(<Realm {...BASE} protocol="mount" delay={0} onError={onError} />);
            await flush();
            handles[0].resolve({ default: lifecycle });
            await flush();
            expect(onError.calls.calls[0][0].code).toBe('render');
        });

        it('远程导出缺 mount()：protocol 错误且文案指向 component 协议', async () => {
            const handles = deferLoad();
            const onError = mock.fn<(error: RealmErrorType) => void>();
            await render(<Realm {...BASE} protocol="mount" delay={0} onError={onError} />);
            await flush();
            handles[0].resolve({ default: RemoteHello });
            await flush();
            const error = onError.calls.calls[0][0];
            expect(error.code).toBe('protocol');
            expect(error.message).toContain('protocol="component"');
        });
    });

    describe('sandbox（Shadow DOM 样式隔离）', () => {
        it('远程内容进入 shadow root, 宿主查询不可见, 样式经 <style> 回退注入', async () => {
            const handles = deferLoad();
            const lifecycle = {
                mount: mock.fn<MountLifecycle['mount']>((container) => {
                    const el = document.createElement('div');
                    el.className = 'remote-title';
                    el.textContent = '沙箱内的远程内容';
                    container.append(el);
                }),
            };
            const { container } = await render(
                <Realm
                    {...BASE}
                    protocol="mount"
                    sandbox
                    styleSheets={['.remote-title { color: red; }']}
                    delay={0}
                />,
            );
            await flush();
            handles[0].resolve({ default: lifecycle });
            await flush();

            const host = container.querySelector('[data-realm-host]') as HTMLElement;
            expect(host.shadowRoot).not.toBeNull();
            // 隔离生效：light DOM 查询不到远程内容, shadow root 内可查到
            expect(screen.queryByText('沙箱内的远程内容')).toBeNull();
            expect(host.shadowRoot?.textContent).toContain('沙箱内的远程内容');
            // Wake DOM 支持 adoptedStyleSheets；旧环境则回退为 <style>，两条样式均应存在。
            const adoptedCount = host.shadowRoot?.adoptedStyleSheets.length ?? 0;
            const fallbackCount = host.shadowRoot?.querySelectorAll('style[data-realm-style]').length ?? 0;
            expect(adoptedCount + fallbackCount).toBe(2);
        });
    });

    it('ref 指向 Realm 容器 div', async () => {
        deferLoad();
        let node: HTMLDivElement | null = null;
        await render(
            <Realm
                {...BASE}
                delay={0}
                ref={(el) => {
                    node = el;
                }}
            />,
        );
        await flush();
        expect(node).toBeInstanceOf(HTMLDivElement);
    });
});

/* ── 静态类型用例：协议 × 沙箱的可辨识联合在编译期挡住非法组合 ── */
const typeOnlyAssertions = (): void => {
    // @ts-expect-error component 协议禁用 sandbox
    void (<Realm {...BASE} sandbox />);
    // @ts-expect-error component 协议禁用 styleSheets
    void (<Realm {...BASE} styleSheets={['.a {}']} />);
    // @ts-expect-error mount 协议 sandbox:false 时禁用 styleSheets
    void (<Realm {...BASE} protocol="mount" sandbox={false} styleSheets={['.a {}']} />);
};
void typeOnlyAssertions;
