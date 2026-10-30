import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@crab-dev/css';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import ConfigProvider, { useConfig, type ConfigDesignSystem } from '@crab-dev/rc-config-provider';
import { Canvas, Rect, Text } from '@crab-dev/rc-canvas';

export const meta = {
    title: 'iframe 内 Shadow 画布主题',
    description: '真实主题资源进入目标文档与 Shadow；最近边界切换重绘，保留显式 DPR、草稿、节点和世界坐标。',
};
const frame = css`
    display: grid;
    min-width: 0;
    gap: ${token.space['component-gap']};
    padding: ${token.space['component-gap']};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    font-family: ${token.font.family.body};
`;
const embedded = css`
    box-sizing: border-box;
    width: 100%;
    height: 380px;
    min-width: 0;
    border: 1px solid ${token.color.border.default};
`;
const editor = css`
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']};
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.shape.control};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    font: inherit;
    &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }
`;
const localScroll = css`max-width: 100%; overflow: auto;`;
const drawingColor = css`color: ${token.color.text.primary};`;

// The workbench has already loaded the public Theme CSS and actual component
// styles. Install those exact resource URLs/rules in each new CSS scope; a
// React portal alone cannot carry styles into a Document or ShadowRoot.
async function installStyleResources(source: Document, target: Document | ShadowRoot): Promise<() => void> {
    const destination = 'head' in target ? target.head : target;
    const copies: HTMLElement[] = [];
    const loads: Promise<void>[] = [];
    for (const sheet of source.head.querySelectorAll('link[rel="stylesheet"], style')) {
        const copy = sheet.cloneNode(true) as HTMLElement;
        if (sheet.tagName === 'LINK') {
            copy.setAttribute('href', (sheet as HTMLLinkElement).href);
            loads.push(new Promise((resolve, reject) => {
                copy.addEventListener('load', () => resolve(), { once: true });
                copy.addEventListener('error', () => reject(new Error('Actual Theme stylesheet failed to load')), { once: true });
            }));
        }
        copies.push(copy);
        destination.append(copy);
    }
    const remove = () => { for (const copy of copies) copy.remove(); };
    try { await Promise.all(loads); return remove; }
    catch (error) { remove(); throw error; }
}

function ShadowCanvas() {
    const host = useRef<HTMLDivElement>(null);
    const drawing = useRef<HTMLElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    // Mutable instance telemetry records only completed GPU frames, not renders.
    const frames = useRef(0);
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const [error, setError] = useState('');
    const [draft, setDraft] = useState('跨文档业务草稿 / Retained draft');
    const [position, setPosition] = useState({ x: 32, y: 64 });
    useEffect(() => {
        const element = host.current;
        if (!element) return;
        const root = element.shadowRoot ?? element.attachShadow({ mode: 'open' });
        const mount = element.ownerDocument.createElement('div');
        let active = true;
        let removeStyles: (() => void) | undefined;
        void installStyleResources(element.ownerDocument, root).then(remove => {
            removeStyles = remove;
            if (!active) { remove(); return; }
            root.append(mount);
            setTarget(mount);
        }, reason => { if (active) setError(String(reason)); });
        return () => { active = false; mount.remove(); removeStyles?.(); };
    }, []);
    return <>
        <div ref={host} data-canvas-shadow-host />
        {error && <p role="alert">{error}</p>}
        {target && createPortal(
            // Deliberately no inner ConfigBoundary: the nearest actual theme
            // is outside this foreign ShadowRoot, across its host.
            <section ref={drawing} className={frame} aria-label="iframe Shadow canvas">
                <span className={drawingColor} data-drawing-color>矩形使用当前文本前景角色 / Theme foreground</span>
                <label>跨文档画布草稿<input className={editor} value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
                <div className={localScroll} role="region" aria-label="跨文档画布局部滚动区">
                    <Canvas ref={canvas} width={360} height={160} dpr={1.5} onRender={() => {
                        const node = canvas.current, output = drawing.current;
                        const gl = node?.getContext('webgl2');
                        if (!node || !output || !gl) return;
                        const shape = new Uint8Array(4), empty = new Uint8Array(4);
                        // Read the real GPU buffer in the production onRender
                        // callback, before the compositor can discard it.
                        gl.readPixels(Math.floor((position.x + 60) * 1.5), Math.floor((160 - position.y - 32) * 1.5), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, shape);
                        gl.readPixels(1, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, empty);
                        output.dataset.renderCount = String(++frames.current);
                        output.dataset.renderPixels = JSON.stringify({ shape: [...shape], empty: [...empty], error: gl.getError(), bitmap: [node.width, node.height] });
                    }}>
                        <Text x={16} y={16} fontSize={18}>iframe + Shadow DOM</Text>
                        <Rect x={position.x} y={position.y} width={120} height={64} fill={token.color.text.primary} draggable cursor="grab" onDrag={({ localDx, localDy }) => setPosition(value => ({ x: value.x + localDx, y: value.y + localDy }))} />
                    </Canvas>
                </div>
                <output aria-label="跨文档画布坐标">{Math.round(position.x)},{Math.round(position.y)}</output>
            </section>, target,
        )}
    </>;
}

const frameDocument = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';
export default function DocumentShadowDemo() {
    const config = useConfig();
    const iframe = useRef<HTMLIFrameElement>(null);
    const [owner, setOwner] = useState<Document | null>(null);
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const [error, setError] = useState('');
    const [designSystem, setDesignSystem] = useState(config.designSystem);
    const [colorMode, setColorMode] = useState(config.colorMode);
    const [outerMode, setOuterMode] = useState(config.colorMode === 'light' ? 'dark' : 'light');
    useEffect(() => {
        const source = iframe.current?.ownerDocument;
        if (!source || !owner) return;
        let active = true;
        let removeStyles: (() => void) | undefined;
        void installStyleResources(source, owner).then(remove => {
            removeStyles = remove;
            if (!active) { remove(); return; }
            setTarget(owner.body);
        }, reason => { if (active) setError(String(reason)); });
        return () => { active = false; removeStyles?.(); };
    }, [owner]);
    return <section className={frame} aria-label="Canvas foreign Shadow document">
        <label>最近边界设计体系<select value={designSystem} onChange={event => setDesignSystem(event.currentTarget.value as ConfigDesignSystem)}>
            {Object.entries(designSystemRegistry).map(([id, design]) => <option key={id} value={id}>{design.label}</option>)}
        </select></label>
        <label>最近边界明暗<select value={colorMode} onChange={event => setColorMode(event.currentTarget.value === 'dark' ? 'dark' : 'light')}><option value="light">light</option><option value="dark">dark</option></select></label>
        <label>外层边界明暗<select value={outerMode} onChange={event => setOuterMode(event.currentTarget.value)}><option value="light">light</option><option value="dark">dark</option></select></label>
        {error && <p role="alert">{error}</p>}
        <iframe ref={iframe} title="Canvas iframe Shadow boundary" className={embedded} srcDoc={frameDocument} onLoad={event => setOwner(event.currentTarget.contentDocument)} />
        {target && createPortal(
            <ConfigProvider colorMode={outerMode === 'dark' ? 'dark' : 'light'} aria-label="Outer Canvas theme" role="region">
                <ConfigProvider designSystem={designSystem} colorMode={colorMode} className={frame} aria-label="Nearest Canvas theme" role="region">
                    <ShadowCanvas />
                </ConfigProvider>
            </ConfigProvider>, target,
        )}
    </section>;
}
