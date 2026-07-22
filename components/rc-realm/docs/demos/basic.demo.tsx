/**
 * title = "基础用法"
 * description = "component 协议加载远程 React 组件：远程与宿主共享同一 React 实例, remoteProps 实时透传, 与本地组件表现无异。此例通过预注册容器演示（globalThis[scope] 已存在时跳过 script 注入, 零网络）。"
 */
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import Realm from '../../src/index.js';
import type { RemoteContainer } from '../../src/index.js';

const RemoteCounter = ({ message }: { message?: unknown }) => {
    const [count, setCount] = useState(0);
    return (
        <div style={{ padding: 12, border: '1px dashed currentColor' }}>
            <p>我是「远程」组件：宿主消息 = {String(message)}</p>
            <Button onClick={() => setCount((current) => current + 1)}>
                远程内部状态 {count}
            </Button>
        </div>
    );
};

// 预注册 MF 容器：真实场景由 remoteEntry.js 注册, demo 里手工注册以便离线运行
const container: RemoteContainer = {
    init: () => undefined,
    get: (moduleId) =>
        moduleId === './Counter'
            ? Promise.resolve(() => ({ default: RemoteCounter }))
            : Promise.reject(new Error(`unknown module: ${moduleId}`)),
};
(globalThis as Record<string, unknown>).crabRealmBasic ??= container;

const BasicDemo = () => {
    const [message, setMessage] = useState('hello');
    return (
        <div>
            <Button onClick={() => setMessage(message === 'hello' ? 'world' : 'hello')}>
                切换宿主消息（当前 {message}）
            </Button>
            <Realm
                entry="/virtual/remoteEntry.js"
                scope="crabRealmBasic"
                module="./Counter"
                remoteProps={{ message }}
            />
        </div>
    );
};

export default BasicDemo;
