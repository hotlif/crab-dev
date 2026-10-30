import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@crab-dev/css';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import ConfigProvider, { ConfigBoundary, useConfig } from '@crab-dev/rc-config-provider';

export const meta = { title: 'iframe 与 Shadow DOM 配置边界', description: '向目标文档安装真实样式，Portal 延续最近配置；跨文档输入共享草稿。' };
const frame = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere; min-inline-size: 0;`;
const editor = css`box-sizing: border-box; inline-size: 100%; min-inline-size: 0; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;
const embedded = css`box-sizing: border-box; inline-size: 100%; block-size: 320px; border: 1px solid ${token.color.border.default}; min-inline-size: 0;`;

// A Document/ShadowRoot needs the application's actual stylesheets. Context
// inheritance alone cannot install CSS across either boundary. Copy only this
// workbench's stylesheet resources; no generated or simulated state styles.
function installStyles(source: Document, target: Document | ShadowRoot): () => void {
    const container = target.nodeType === 9 ? (target as Document).head : target;
    const copies = [...source.head.querySelectorAll('link[rel="stylesheet"], style')].map(sheet => {
        const copy = sheet.cloneNode(true) as HTMLElement;
        if (sheet.tagName === 'LINK') (copy as HTMLLinkElement).href = (sheet as HTMLLinkElement).href;
        container.append(copy);
        return copy;
    });
    return () => { for (const copy of copies) copy.remove(); };
}

function BoundaryContent({ name, draft, onChange }: { name: string; draft: string; onChange: (value: string) => void }) {
    const config = useConfig();
    return <ConfigBoundary role="region" aria-label={name} className={frame}>
        <strong>{name}</strong>
        <output data-resolved-config>{JSON.stringify(config)}</output>
        <label>跨文档草稿<input className={editor} value={draft} onChange={event => onChange(event.currentTarget.value)} /></label>
    </ConfigBoundary>;
}

export default function ConfigDocumentsDemo() {
    const config = useConfig();
    const shadowHost = useRef<HTMLDivElement>(null);
    const [shadow, setShadow] = useState<HTMLElement | null>(null);
    const [documentTarget, setDocumentTarget] = useState<HTMLElement | null>(null);
    const [draft, setDraft] = useState('保留跨文档草稿 · Retained across documents');
    useEffect(() => {
        const host = shadowHost.current;
        if (!host) return;
        const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
        const removeStyles = installStyles(host.ownerDocument, root);
        const target = host.ownerDocument.createElement('div');
        root.append(target); setShadow(target);
        return () => { target.remove(); removeStyles(); };
    }, []);
    const nextDesign = Object.keys(designSystemRegistry).find(value => value !== config.designSystem) as typeof config.designSystem;
    return <section className={frame} role="region" aria-label="ConfigProvider document boundaries">
        <label>业务草稿<input className={editor} value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
        <ConfigProvider designSystem={nextDesign} colorMode={config.colorMode === 'light' ? 'dark' : 'light'} size="small" brandColor="#0e7490" locale="en-US" direction="rtl" nonce="documents-boundary">
            <iframe title="ConfigProvider iframe" className={embedded} srcDoc="<!doctype html><html><head><meta charset='utf-8'></head><body></body></html>" onLoad={event => {
                const target = event.currentTarget.contentDocument;
                if (!target || target.body.dataset.initialized) return;
                target.body.dataset.initialized = 'true';
                installStyles(event.currentTarget.ownerDocument, target);
                setDocumentTarget(target.body);
            }} />
            <div ref={shadowHost} data-document-boundary="shadow" />
            {documentTarget && createPortal(<BoundaryContent name="iframe boundary" draft={draft} onChange={setDraft} />, documentTarget)}
            {shadow && createPortal(<BoundaryContent name="Shadow boundary" draft={draft} onChange={setDraft} />, shadow)}
        </ConfigProvider>
    </section>;
}
