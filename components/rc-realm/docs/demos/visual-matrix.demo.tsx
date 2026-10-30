import { useEffect, useId, useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import Realm, { clearRemoteCache, type MountLifecycle, type RemoteContainer } from '@crab-dev/rc-realm';
import Button from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '远程协议视觉矩阵', description: '真实容器 Promise 保持待定，完成、失败和重试均通过公开协议；含保留草稿的 React 远程和 Shadow DOM mount 远程。' };
const stackStyle = css`display: flex; flex-direction: column; gap: ${token.space['stack-gap']};`;
const rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;
const sceneStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.default}; min-block-size: 160px; overflow-wrap: anywhere;`;
const fieldStyle = css`display: block; margin-block: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; font: inherit; max-inline-size: 100%; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; }`;
const entry = '/virtual/professional-visual/remoteEntry.js';
type Request = { resolve: (factory: () => unknown) => void; reject: (error: Error) => void };

function RemoteContent() {
    const { locale } = useLocale();
    const [draft, setDraft] = useState('CRAB-2026');
    return <div data-remote-ready="component">
        <p>{locale === 'en-US' ? 'Remote content is ready. The host owns configuration.' : '远程内容已就绪，配置由最近宿主边界提供。'}</p>
        <label>Remote draft<input className={fieldStyle} value={draft} onChange={event => setDraft(event.target.value)} /></label>
    </div>;
}

const shadowStyles = [`label { display: block; padding: ${token.space['component-gap']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; font-family: ${token.font.family.body}; } input { display: block; max-width: 100%; font: inherit; color: inherit; background: inherit; border: 1px solid ${token.color.border.default}; padding: ${token.space['component-gap']}; } input:focus-visible { outline: 2px solid ${token.color.focus.ring}; }`];
const sandboxLifecycle: MountLifecycle = {
    mount(container) {
        const label = container.ownerDocument.createElement('label');
        label.textContent = 'Shadow draft';
        const input = container.ownerDocument.createElement('input');
        input.value = 'Shadow CRAB-2026';
        label.append(input); container.append(label);
        return () => label.remove();
    },
};

export default function VisualMatrixDemo() {
    const id = useId(), scope = `crabProfessionalRealm${id}`;
    const [registered, setRegistered] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [protocol, setProtocol] = useState<'component' | 'mount'>('component');
    // Transport instance: only effects and events touch the active protocol requests.
    const pending = useRef(new Set<Request>());
    useEffect(() => {
        const requests = pending.current;
        const container: RemoteContainer = { init: () => undefined, get: () => {
            setWaiting(true);
            return new Promise((resolve, reject) => requests.add({ resolve, reject }));
        } };
        const registry = globalThis as Record<string, unknown>;
        registry[scope] = container; setRegistered(true);
        return () => {
            for (const request of requests) request.reject(new Error('Remote demo unmounted'));
            requests.clear(); clearRemoteCache(entry, scope);
            if (registry[scope] === container) delete registry[scope];
        };
    }, [scope]);
    function finish(failure: boolean) {
        for (const request of pending.current) {
            if (failure) request.reject(new Error('Deliberate remote transport failure'));
            else request.resolve(() => ({ default: protocol === 'mount' ? sandboxLifecycle : RemoteContent }));
        }
        pending.current.clear(); setWaiting(false);
    }
    function restart(nextProtocol = protocol) {
        finish(true); clearRemoteCache(entry, scope); setProtocol(nextProtocol); setAttempt(value => value + 1);
    }
    const common = { entry, scope, module: './VisualMatrix', delay: 0, timeout: 600000 };
    return <div className={stackStyle}>
        <div className={rowStyle}>
            <Button appearance="outlined" onClick={() => restart()}>重新请求</Button>
            <Button appearance="outlined" disabled={!waiting} onClick={() => finish(false)}>完成请求</Button>
            <Button appearance="outlined" disabled={!waiting} onClick={() => finish(true)}>请求失败</Button>
            <Button appearance="outlined" onClick={() => restart(protocol === 'mount' ? 'component' : 'mount')}>切换协议</Button>
        </div>
        <section className={sceneStyle} aria-label="Realm visual matrix" data-protocol={protocol}>
            {registered && (protocol === 'component' ? <Realm key={attempt} {...common} /> : <Realm key={attempt} {...common} protocol="mount" sandbox styleSheets={shadowStyles} />)}
        </section>
    </div>;
}
