import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import type { PdfEditorElement, PdfEditorState, PdfExportResult } from '@crab-dev/rc-pdf-editor';
import { useConfig } from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '独立 Web Component 与远程文档', description: '加载实际独立JS产物，内部生产React/CSS/Worker/WASM保持隔离；八项配置显式传入真实元素，同源PDF与字体通过网络加载。' };
const sceneStyle = css`padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; max-inline-size: 100%;`;
const rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;
const mountStyle = css`display: block; min-inline-size: 0; max-inline-size: 100%;`;

export default function WebComponentRuntimeDemo() {
    const config = useConfig(), mount = useRef<HTMLDivElement>(null), element = useRef<PdfEditorElement>(null);
    const [state, setState] = useState<PdfEditorState>(), [failure, setFailure] = useState('');
    const [saved, setSaved] = useState(false), [exported, setExported] = useState<PdfExportResult>(), [url, setUrl] = useState('');
    const applyConfiguration = useEffectEvent((editor: PdfEditorElement) => {
        editor.designSystem = config.designSystem; editor.colorMode = config.colorMode;
        editor.size = config.size; editor.density = config.density; editor.brandColor = config.brandColor;
        editor.locale = config.locale; editor.direction = config.direction;
        if (config.nonce === undefined) editor.removeAttribute('nonce'); else editor.nonce = config.nonce;
    });
    useEffect(() => {
        let cancelled = false, instance: PdfEditorElement | undefined;
        const script = globalThis.document.createElement('script');
        script.src = new URL('./runtime/pdf-editor.js', globalThis.document.baseURI).href;
        const loaded = new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('独立 PDF 产物加载失败')); });
        globalThis.document.head.append(script);
        const receive = (event: Event) => setState((event as CustomEvent<PdfEditorState>).detail);
        const receiveError = (event: Event) => setFailure((event as CustomEvent<Error>).detail.message);
        void loaded.then(async () => {
            await globalThis.customElements.whenDefined('crab-pdf-editor');
            if (cancelled || !mount.current) return;
            instance = globalThis.document.createElement('crab-pdf-editor');
            instance.fonts = [{ id: 'liberation', family: 'Liberation Sans', source: new URL('./fixtures/LiberationSans-Regular.ttf', globalThis.document.baseURI) }];
            instance.initialDocument = { id: 'professional-web-component', fileName: 'professional-web-component.pdf', source: new URL('./fixtures/visual-document.pdf', globalThis.document.baseURI) };
            instance.onSave = () => { setSaved(true); };
            instance.addEventListener('crab-state-change', receive);
            instance.addEventListener('crab-error', receiveError);
            applyConfiguration(instance); element.current = instance; mount.current.append(instance);
            await instance.ready(); if (!cancelled) setState(instance.getState());
        }).catch(error => { if (!cancelled) setFailure(error instanceof Error ? error.message : String(error)); });
        return () => { cancelled = true; script.remove(); if (instance) { instance.removeEventListener('crab-state-change', receive); instance.removeEventListener('crab-error', receiveError); instance.remove(); } element.current = null; };
    }, []);
    useEffect(() => { if (element.current) applyConfiguration(element.current); }, [config]);
    useEffect(() => { if (!exported) return; const next = URL.createObjectURL(exported.blob); setUrl(next); return () => URL.revokeObjectURL(next); }, [exported]);
    return <section className={sceneStyle} aria-label="PdfEditor visual matrix" data-status={state?.status ?? 'initializing'} data-document={state?.document?.id ?? ''} data-revision={state?.document?.revision ?? 0} data-dirty={String(state?.document?.dirty ?? false)}>
        <div className={rowStyle}><Button appearance="outlined" disabled={!state?.document} onClick={() => { if (element.current) void element.current.exportPdf().then(setExported, error => setFailure(String(error))); }}>导出 Web Component PDF</Button></div>
        {failure && <p role="alert">{failure}</p>}
        <div className={mountStyle} ref={mount} />
        {saved && <p role="status">Web Component 文档已保存</p>}
        {url && <a href={url} download={exported!.fileName} aria-label="下载 Web Component PDF">下载 {exported!.fileName}</a>}
    </section>;
}
