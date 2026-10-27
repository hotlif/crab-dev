import { useEffect, useId, useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Button from '@crab-dev/rc-button';
import Realm, { clearRemoteCache, type RemoteContainer } from '@crab-dev/rc-realm';

export const meta = {
    title: '可重放的加载与错误',
    description: '使用预注册的真实远程容器协议，将模块 Promise 保持待定。通过按钮完成或拒绝请求；Realm 自己显示加载、默认错误与重试。每次重放清除本实例缓存，不依赖网络或短暂计时窗口。',
};

type PendingModule = { resolve: (factory: () => unknown) => void; reject: (error: Error) => void };
const controlsStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;
const contentStyle = css`padding: ${token.space['card-padding']}; min-block-size: 100px; border: 1px solid ${token.color.border.default};`;
const entry = '/virtual/visual-states/remoteEntry.js';

function RemoteContent() {
    return <div className={contentStyle}>远程内容已加载 Ready。主题、语言和方向继续由宿主配置继承。</div>;
}

export default function VisualStatesDemo() {
    const id = useId();
    const scope = `crabRealmVisual${id}`;
    const [registered, setRegistered] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [replay, setReplay] = useState(0);
    // 可变传输实例：保存未完成的模块请求，仅在 effect/事件中增删，卸载时拒绝并清理。
    const pending = useRef(new Set<PendingModule>());

    useEffect(() => {
        const requests = pending.current;
        let disposed = false;
        const container: RemoteContainer = {
            init: () => undefined,
            get: () => {
                if (disposed) return Promise.reject(new Error('该演示实例已经卸载'));
                setWaiting(true);
                return new Promise((resolve, reject) => { requests.add({ resolve, reject }); });
            },
        };
        const registry = globalThis as Record<string, unknown>;
        registry[scope] = container;
        setRegistered(true);
        return () => {
            disposed = true;
            for (const request of requests) request.reject(new Error('演示已卸载，取消等待请求'));
            requests.clear();
            clearRemoteCache(entry, scope);
            if (registry[scope] === container) delete registry[scope];
        };
    }, [scope]);

    const finish = (failure: boolean) => {
        for (const request of pending.current) {
            if (failure) request.reject(new Error('可重放的模块加载错误'));
            else request.resolve(() => ({ default: RemoteContent }));
        }
        pending.current.clear();
        setWaiting(false);
    };
    const restart = () => {
        finish(true);
        clearRemoteCache(entry, scope);
        setReplay(value => value + 1);
    };

    return <section aria-label="远程模块请求状态">
        <div className={controlsStyle}>
            <Button appearance="outlined" onClick={restart}>重新加载</Button>
            <Button appearance="outlined" disabled={!waiting} onClick={() => finish(true)}>返回错误</Button>
            <Button appearance="outlined" disabled={!waiting} onClick={() => finish(false)}>完成加载</Button>
        </div>
        {registered && <Realm key={replay} entry={entry} scope={scope} module="./VisualState" delay={0} timeout={600000} />}
    </section>;
}
