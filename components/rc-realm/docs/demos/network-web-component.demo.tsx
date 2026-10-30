import { useEffect, useId, useState } from 'react';
import { css } from '@crab-dev/css';
import Realm from '@crab-dev/rc-realm';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '网络入口与真实 Web Component', description: '本机 public/remote 资源通过 Realm 的真实 script 或 ESM 入口加载；远程注册自定义元素并维护独立 Shadow DOM 草稿，未预注册容器。' };
const sceneStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.default}; overflow-wrap: anywhere;`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;
const remoteStyles = `:host { display: block; color: ${token.color.text.primary}; font-family: ${token.font.family.body}; } p { margin-block: 0 ${token.space['stack-gap']}; } label { display: block; } input { display: block; box-sizing: border-box; max-inline-size: 100%; margin-block-start: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; color: inherit; font: inherit; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; } input:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;

export default function NetworkWebComponentDemo() {
    const instanceId = useId();
    const [remoteBase, setRemoteBase] = useState('');
    const [entryType, setEntryType] = useState<'var' | 'module'>('var');
    const [mounted, setMounted] = useState(false);
    const [status, setStatus] = useState('idle');
    const [caption, setCaption] = useState('A real network-loaded Web Component');
    useEffect(() => { setRemoteBase(new URL('./remote/', document.baseURI).href); }, []);
    const entry = `${remoteBase}web-component-entry.${entryType === 'var' ? 'js' : 'mjs'}`;
    return <div>
        <div className={rowStyle}>
            <label>远程入口格式 <select aria-label="远程入口格式" value={entryType} disabled={mounted} onChange={event => setEntryType(event.target.value as 'var' | 'module')}><option value="var">script / var</option><option value="module">ES module</option></select></label>
            <Button appearance="outlined" disabled={!remoteBase || mounted} onClick={() => { setStatus('loading'); setMounted(true); }}>加载远程 Web Component</Button>
            <Button appearance="outlined" disabled={!mounted} onClick={() => { setMounted(false); setStatus('idle'); }}>卸载远程内容</Button>
            <Button appearance="outlined" disabled={status !== 'ready'} onClick={() => setCaption('Updated through the mount lifecycle')}>更新远程属性</Button>
        </div>
        <section className={sceneStyle} aria-label="Realm network Web Component" data-entry-type={entryType} data-status={status}>
            {mounted && <Realm entry={entry} scope="crabRealmNetworkDemo" module="./WebComponent" entryType={entryType} protocol="mount"
                remoteProps={{ instanceId, caption, styleText: remoteStyles }} onReady={() => setStatus('ready')} onError={() => setStatus('error')} />}
        </section>
    </div>;
}
