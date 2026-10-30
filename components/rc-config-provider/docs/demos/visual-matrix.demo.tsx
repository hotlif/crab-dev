import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@crab-dev/css';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import ConfigProvider, { ConfigBoundary, useConfig } from '@crab-dev/rc-config-provider';

export const meta = { title: '继承、品牌与 Portal', description: '同一输入保留草稿；嵌套边界与实际 Portal 分别输出最近配置。' };
const frame = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere;`;
const panel = css`padding: ${token.space['component-gap']}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; background: ${token.color.background.surface}; color: ${token.color.text.primary};`;
const editor = css`box-sizing: border-box; width: 100%; min-width: 0; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;
const accent = css`padding: ${token.space['control-padding-y']}; color: ${token.color.brand['on-container']}; background: ${token.color.brand.container}; border: 1px solid ${token.color.brand.primary};`;

function Summary({ name }: { name: string }) {
    const config = useConfig();
    return <section aria-label={name} className={panel}><strong>{name}</strong><p data-config-summary>{config.designSystem} / {config.colorMode} / {config.size} / {config.density} / {config.locale} / {config.direction}</p><span className={accent}>品牌与表面 · Brand and surface</span></section>;
}

export default function VisualMatrixDemo() {
    const config = useConfig();
    const [state, setState] = useState('default');
    const [draft, setDraft] = useState('保留草稿 · Retained draft');
    const [portal, setPortal] = useState<HTMLElement | null>(null);
    useEffect(() => { setPortal(globalThis.document.body); }, []);
    const nextDesign = Object.keys(designSystemRegistry).find(value => value !== config.designSystem) as typeof config.designSystem;
    return <section className={frame} aria-label="ConfigProvider visual matrix">
        <label>验收状态 <select value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'brand', 'portal'].map(value => <option key={value}>{value}</option>)}</select></label>
        <ConfigProvider brandColor={state === 'brand' ? '#0e7490' : undefined} nonce="visual-boundary">
            <label>业务草稿 <input className={editor} value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
            <Summary name="Inherited boundary" />
            <ConfigProvider designSystem={nextDesign} colorMode={config.colorMode === 'light' ? 'dark' : 'light'} size="small"><Summary name="Nested boundary" /></ConfigProvider>
            {state === 'portal' && portal && createPortal(<ConfigBoundary className={frame} role="region" aria-label="Portal boundary"><Summary name="Portal content" /><label>Portal draft <input className={editor} value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label></ConfigBoundary>, portal)}
        </ConfigProvider>
    </section>;
}
