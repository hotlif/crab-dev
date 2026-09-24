import { createElement, startTransition, useActionState, useEffect, useId, useOptimistic, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import Checkbox from '@crab-dev/rc-checkbox';
import ConfigProvider from '@crab-dev/rc-config-provider';
import LineEdit from '@crab-dev/rc-line-edit';
import { PDF_EDITOR_ACTIONS, type PdfEditorActionId } from '../../src/actions.js';
import type { PdfEditorState, PdfRegionImage } from '../../src/types.js';
import type { PdfEditorElement } from '../../src/web-component-types.js';
import token from '../../src/token.js';
import { simulateOcr } from './simulate-ocr.js';

const fixedActions: readonly PdfEditorActionId[] = ['save', 'pan', 'togglePages', 'closePages', 'fitPage'];
const fixedVisibility = Object.fromEntries(PDF_EDITOR_ACTIONS.map(({ id }) => [id, fixedActions.includes(id)]));
const serverOnlyVisibility = { open: false, merge: false } as const;
const regionIcon = { path: 'M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 0h2v6h-6v-2h4v-4zM7 8h10v2h-4v7h-2v-7H7V8z' };
const initialState: PdfEditorState = { status: 'initializing', document: null, pendingOperations: [], readOnly: false, canEdit: false };
const pageStyle = css`
    min-height: 100vh; box-sizing: border-box; padding: ${token.canvas.padding};
    background: ${token.canvas.background}; color: ${token.root.color};
    font-family: ${token.root['font-family']}; font-size: ${token.root['font-size']}; line-height: ${token.root['line-height']};
`;
const stackStyle = css`display: flex; flex-direction: column; gap: ${token.panel.gap}; min-width: 0;`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.toolbar.gap};`;
const gridStyle = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, ${token.demo.panel.width}), 1fr)); gap: ${token.panel.padding};`;
const cardStyle = css`
    display: flex; flex-direction: column; align-items: stretch; gap: ${token.panel.gap}; min-width: 0;
    padding: ${token.panel.padding}; background: ${token.root.background}; border-radius: ${token.root['border-radius']};
`;
const titleStyle = css`margin: 0; font-size: ${token.demo.title['font-size']}; font-weight: ${token.panel.heading['font-weight']};`;
const headingStyle = css`margin: 0; font-size: ${token.panel.heading['font-size']}; font-weight: ${token.panel.heading['font-weight']};`;
const hintStyle = css`margin: 0; color: ${token.status.color}; font-size: ${token.status['font-size']}; overflow-wrap: anywhere;`;
const errorStyle = css`margin: 0; color: ${token.root['color-error']}; overflow-wrap: anywhere;`;
const editorStyle = css`
    display: block; min-width: 0;
    --pdf-editor-root-height: ${token.demo.editor.height};
`;
const codeStyle = css`
    margin: 0; white-space: pre-wrap; overflow-wrap: anywhere;
    padding: ${token.panel.padding}; background: ${token.toolbar.background}; border-radius: ${token.root['border-radius']};
`;
const imageStyle = css`display: block; max-width: 100%; max-height: ${token.demo.preview.height}; object-fit: contain; object-position: left top;`;

function errorMessage(error: unknown) { return error instanceof Error ? error.message : String(error); }
interface LoadResult { message: string; error?: string }

function CapturePreview({ image }: { image: PdfRegionImage }) {
    const [url, setUrl] = useState<string>();
    useEffect(() => {
        const next = URL.createObjectURL(image.blob); setUrl(next);
        return () => URL.revokeObjectURL(next);
    }, [image]);
    return <div className={stackStyle}>
        <p className={hintStyle}>真实截图 · 第 {image.parts.map(part => part.pageIndex + 1).join('、')} 页 · {image.width} × {image.height} px</p>
        {url && <img className={imageStyle} src={url} alt="传给模拟 OCR 的真实 PDF 区域截图" />}
    </div>;
}

function Demo() {
    // 可变外部实例：DOM 接口及取消控制器不参与渲染，卸载时释放进行中的任务。
    const editor = useRef<PdfEditorElement>(null);
    const openRequest = useRef<AbortController | null>(null);
    const ocrRequest = useRef<AbortController | null>(null);
    const [state, setState] = useState(initialState);
    const [fixed, setFixed] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [dark, setDark] = useState(false);
    const [url, setUrl] = useState('./samples/server-demo.pdf');
    const [runtimeError, setRuntimeError] = useState('');
    const [ocrStep, setOcrStep] = useOptimistic('');
    const [ocrResult, setOcrResult] = useState<{ image: PdfRegionImage; text: string }>();
    const layoutId = useId(), sourceId = useId(), ocrId = useId(), editorId = useId(), resultId = useId();

    // 稳定 callback ref：面板更新时保留同一个元素、订阅和文档会话。
    const [attachEditor] = useState(() => (node: PdfEditorElement | null) => {
        if (!node) return;
        // 在首次渲染前关闭全部 PDF 文件选择入口，避免初始化期间短暂出现本地入口。
        node.toolbar = { visibility: { ...fixedVisibility, ...serverOnlyVisibility } };
        editor.current = node;
        let connected = true;
        let previous = node.getState().document;
        const unsubscribe = node.subscribe(() => {
            const next = node.getState();
            if (previous?.sessionId !== next.document?.sessionId || previous?.revision !== next.document?.revision) {
                ocrRequest.current?.abort(); setOcrResult(undefined);
            }
            previous = next.document; setState(next);
        });
        const onError = (event: Event) => { if (event instanceof CustomEvent) setRuntimeError(errorMessage(event.detail)); };
        node.addEventListener('crab-error', onError);
        void node.ready().then(() => { if (connected) setState(node.getState()); }, error => { if (connected) setRuntimeError(errorMessage(error)); });
        return () => {
            connected = false;
            unsubscribe(); node.removeEventListener('crab-error', onError);
            openRequest.current?.abort(); ocrRequest.current?.abort(); editor.current = null;
        };
    });

    useEffect(() => { if (editor.current) editor.current.readOnly = readOnly; }, [readOnly]);
    useEffect(() => { if (editor.current) editor.current.theme = dark ? 'dark' : 'light'; }, [dark]);

    const [loadResult, load, loading] = useActionState(async (): Promise<LoadResult> => {
        const target = editor.current;
        if (!target) return { message: '编辑器尚未挂载' };
        const controller = new AbortController(); openRequest.current = controller;
        ocrRequest.current?.abort(); setRuntimeError('');
        try {
            const source = new URL(url.trim(), document.baseURI);
            if (!url.trim() || !['http:', 'https:'].includes(source.protocol)) throw new Error('请输入 HTTP(S) PDF 地址或相对路径');
            const result = await target.open({ id: source.href, source, fileName: decodeURIComponent(source.pathname.split('/').pop() || 'server.pdf') }, { signal: controller.signal });
            return { message: `已从服务器加载 ${result.fileName}，共 ${result.pageCount} 页` };
        } catch (error) {
            return controller.signal.aborted ? { message: '已取消加载' }
                : { message: '请检查 PDF 地址和服务器响应后重试。', error: `加载失败：${errorMessage(error)}` };
        } finally { if (openRequest.current === controller) openRequest.current = null; }
    }, { message: '填写地址后加载，默认地址指向预览服务器上的两页示例 PDF。' });

    const [ocrMessage, recognize, recognizing] = useActionState(async (_previous: string, mode: 'page' | 'select') => {
        const target = editor.current;
        if (!target?.getState().document) return '请先加载 PDF';
        const controller = new AbortController(); ocrRequest.current = controller;
        const { signal } = controller;
        setOcrResult(undefined); setOcrStep(mode === 'select' ? '在 PDF 上拖拽选择区域；Esc 或“取消 OCR”可退出。' : '正在截取当前页面…');
        try {
            const pageIndex = target.getState().document!.currentPageIndex;
            const page = target.getPages()[pageIndex];
            const selection = mode === 'select' ? await target.selectRegion({ signal }) : target.createRegionSelection([
                { pageIndex, x: 0, y: 0, width: page.width, height: page.height },
            ]);
            const image = await target.captureRegion(selection, { signal, scale: 1 });
            signal.throwIfAborted(); startTransition(() => setOcrStep('截图完成，正在模拟 OCR 响应…'));
            const text = await simulateOcr(image, signal);
            signal.throwIfAborted(); setOcrResult({ image, text });
            return '模拟 OCR 完成';
        } catch (error) {
            return signal.aborted || (error instanceof Error && (error.name === 'AbortError' || ('code' in error && error.code === 'cancelled')))
                ? 'OCR 已取消；文档切换或修改也会取消任务。' : `OCR 未完成：${errorMessage(error)}`;
        } finally { if (ocrRequest.current === controller) ocrRequest.current = null; }
    }, '加载 PDF 后，识别当前页，或自行框选区域。');

    useEffect(() => {
        if (editor.current) editor.current.toolbar = {
            visibility: { ...(fixed ? fixedVisibility : {}), ...serverOnlyVisibility },
            extraActions: [{
                id: 'demo.region-ocr', label: '框选并模拟 OCR', placement: 'tools', icon: regionIcon,
                disabled: snapshot => !snapshot.document || loading || recognizing,
                onSelect: () => startTransition(() => recognize('select')),
            }],
        };
    }, [fixed, loading, recognizing, recognize]);

    const busy = loading || state.pendingOperations.length > 0;
    const ready = state.status === 'ready';
    return <ConfigProvider theme={dark ? 'dark' : 'light'} className={pageStyle}>
        <main className={stackStyle}>
            <header className={stackStyle}>
                <h1 className={titleStyle}>PDF Web Component 控制演示</h1>
                <p className={hintStyle}>配置显示的工具、从服务器加载文档，再用真实截图体验模拟 OCR。</p>
            </header>
            <div className={gridStyle}>
                <section className={cardStyle} aria-labelledby={layoutId}>
                    <h2 id={layoutId} className={headingStyle}>1. 组件与显示</h2>
                    <Checkbox checked={fixed} onChange={setFixed}>仅显示固定工具</Checkbox>
                    <p className={hintStyle}>固定工具：保存、抓手、页面面板、适应页面与框选 OCR。取消勾选可显示其他编辑工具。</p>
                    <div className={rowStyle}>
                        <Checkbox checked={readOnly} onChange={setReadOnly}>只读模式</Checkbox>
                        <Checkbox checked={dark} onChange={setDark}>深色主题</Checkbox>
                    </div>
                    <p className={hintStyle}>PDF 仅从服务器加载，不提供本地 PDF 打开或合并入口。编辑器保持固定高度。</p>
                </section>
                <section className={cardStyle} aria-labelledby={sourceId}>
                    <h2 id={sourceId} className={headingStyle}>2. 加载服务器 PDF</h2>
                    <form action={load} className={stackStyle}>
                        <LineEdit label="PDF 地址" value={url} onChange={event => setUrl(event.target.value)} required
                            errorText={loading ? undefined : loadResult.error}
                            supportingText="支持相对路径与 HTTP(S) 地址；跨域服务器需允许 CORS。" />
                        <div className={rowStyle}>
                            <Button type="submit" appearance="primary" disabled={!ready || busy} loading={loading}>加载服务器 PDF</Button>
                            {loading && <Button type="button" onClick={() => openRequest.current?.abort()}>取消加载</Button>}
                        </div>
                    </form>
                    <p className={hintStyle} role="status">{loading ? '正在请求服务器 PDF…' : loadResult.message}</p>
                </section>
                <section className={cardStyle} aria-labelledby={ocrId}>
                    <h2 id={ocrId} className={headingStyle}>3. 模拟 OCR</h2>
                    <p className={hintStyle}>点击编辑器绘图工具栏中的“框选并模拟 OCR”选择区域。真实截图后在本地返回固定示例文本，不执行文字识别。</p>
                    <div className={rowStyle}>
                        <Button appearance="tonal" disabled={!state.document || busy || recognizing} onClick={() => startTransition(() => recognize('page'))}>模拟识别当前页</Button>
                        {recognizing && <Button onClick={() => ocrRequest.current?.abort()}>取消 OCR</Button>}
                    </div>
                    <p className={hintStyle} role="status">{recognizing ? ocrStep : ocrMessage}</p>
                    {ocrResult && !recognizing && <Button appearance="text" href={`#${resultId}`}>查看截图和模拟结果</Button>}
                </section>
            </div>
            {runtimeError && <p className={errorStyle} role="alert">{runtimeError}</p>}
            <section className={stackStyle} aria-labelledby={editorId}>
                <div className={rowStyle}>
                    <h2 id={editorId} className={headingStyle}>编辑器预览</h2>
                    <p className={hintStyle} data-demo-document="">{state.document
                        ? `${state.document.fileName} · ${state.document.pageCount} 页 · 当前第 ${state.document.currentPageIndex + 1} 页${state.document.dirty ? ' · 未保存' : ''}`
                        : ready ? '运行时已就绪 · 等待加载 PDF' : '正在初始化运行时…'}</p>
                </div>
                {createElement('crab-pdf-editor', { ref: attachEditor, className: editorStyle, 'aria-label': 'PDF 编辑器' })}
            </section>
            {ocrResult && !recognizing && <section id={resultId} className={cardStyle} aria-label="模拟 OCR 结果">
                <h2 className={headingStyle}>模拟 OCR 结果（固定示例文本）</h2>
                <div className={gridStyle}>
                    <CapturePreview image={ocrResult.image} />
                    <pre className={codeStyle}>{ocrResult.text}</pre>
                </div>
            </section>}
            <details className={cardStyle}>
                <summary>查看 Web Component 接入方式</summary>
                <p className={hintStyle}>业务页面只需引入 pdf-editor.js。控制面板属于演示页面，通过 DOM properties、事件和方法操作组件。</p>
                <pre className={codeStyle}>{`<script src="./pdf-editor.js" defer></script>
<crab-pdf-editor id="editor"></crab-pdf-editor>
<script type="module">
    await customElements.whenDefined('crab-pdf-editor');
    const editor = document.getElementById('editor');
    editor.toolbar = {
        visibility: { open: false, merge: false },
        extraActions: [{
            id: 'region-ocr', label: '框选区域', placement: 'tools',
            icon: { path: '${regionIcon.path}' },
            disabled: state => !state.document,
            async onSelect(editor) {
                const selection = await editor.selectRegion();
                const image = await editor.captureRegion(selection);
                // 将 image.blob 传给你自己的 OCR 适配器。
            },
        }],
    };
    await editor.open({ id: 'server', source: './samples/server-demo.pdf' });
</script>`}</pre>
            </details>
        </main>
    </ConfigProvider>;
}

void globalThis.customElements.whenDefined('crab-pdf-editor').then(() => {
    const container = document.getElementById('demo');
    if (container) createRoot(container).render(<Demo />);
});
