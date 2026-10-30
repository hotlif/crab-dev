import { useEffect, useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import PdfEditor, { PDF_EDITOR_ACTIONS, createRegionOcrPlugin, type PdfEditorRef, type PdfEditorState, type PdfEditorPlugin, type PdfRegionImage, type PdfExportResult, type PdfFont } from '@crab-dev/rc-pdf-editor';
import Button from '@crab-dev/rc-button';
import Checkbox from '@crab-dev/rc-checkbox';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '真实资源、编辑与专业动作', description: '同源PDF、完整Liberation TTF及PNG夹具；使用公开文字/图片编辑、历史、保存、工具栏与区域插件，不上传文档。复制时部署public/fixtures及runtime资源。' };
const runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };
const document = { id: 'professional-rich', fileName: 'professional-rich.pdf', source: { url: './fixtures/visual-document.pdf', headers: { 'x-crab-visual': 'local-fixture' }, credentials: 'same-origin' as const } };
const fonts: readonly PdfFont[] = [{ id: 'liberation', family: 'Liberation Sans', source: './fixtures/LiberationSans-Regular.ttf' }];
const row = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;
const sceneStyle = css`padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; max-inline-size: 100%;`;
const imageStyle = css`display: block; max-inline-size: 100%; block-size: auto; border: 1px solid ${token.color.border.default};`;
const icon = <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M4 3h16v18H4V3zm2 2v14h12V5H6zm2 3h8v2H8V8zm0 4h8v2H8v-2z" /></svg>;

export default function ProfessionalActionsDemo() {
    const editor = useRef<PdfEditorRef>(null);
    const [state, setState] = useState<PdfEditorState>();
    const [showDrawing, setShowDrawing] = useState(true), [pluginEnabled, setPluginEnabled] = useState(true);
    const [summary, setSummary] = useState(''), [failure, setFailure] = useState('');
    const [pluginLife, setPluginLife] = useState({ installs: 0, cleanups: 0, aborts: 0 });
    const [saved, setSaved] = useState<{ name: string; bytes: number; valid: boolean }>();
    const [exported, setExported] = useState<PdfExportResult>(), [exportUrl, setExportUrl] = useState('');
    const [region, setRegion] = useState<PdfRegionImage>(), [regionUrl, setRegionUrl] = useState('');
    const [regionPlugin] = useState<PdfEditorPlugin>(() => {
        const interactive = createRegionOcrPlugin({ id: 'professional-region', label: '交互区域捕获', scale: 1,
            recognize: async (image, { signal }) => { signal.throwIfAborted(); return { pixels: image.width * image.height }; },
            onResult: (_result, image) => setRegion(image),
        });
        return { ...interactive, setup({ signal }) {
            setPluginLife(value => ({ ...value, installs: value.installs + 1 }));
            signal.addEventListener('abort', () => setPluginLife(value => ({ ...value, aborts: value.aborts + 1 })), { once: true });
            return () => setPluginLife(value => ({ ...value, cleanups: value.cleanups + 1 }));
        }, actions: [...interactive.actions!, { id: 'cross-page', label: '跨页区域捕获', icon, placement: 'tools',
            async onSelect({ getEditor, signal }) {
                const instance = getEditor(), pages = instance.getPages();
                const selection = instance.createRegionSelection([
                    { pageIndex: 0, x: 0, y: pages[0].height - 80, width: pages[0].width, height: 80 },
                    { pageIndex: 1, x: 0, y: 0, width: pages[1].width, height: 80 },
                ]);
                setRegion(await instance.captureRegion(selection, { scale: 1, signal }));
            },
        }] };
    });
    useEffect(() => { if (!region) return; const url = URL.createObjectURL(region.blob); setRegionUrl(url); return () => URL.revokeObjectURL(url); }, [region]);
    useEffect(() => { if (!exported) return; const url = URL.createObjectURL(exported.blob); setExportUrl(url); return () => URL.revokeObjectURL(url); }, [exported]);
    async function run(command: (instance: PdfEditorRef) => Promise<void>) {
        if (!editor.current) return;
        try { setFailure(''); await command(editor.current); } catch (error) { setFailure(error instanceof Error ? error.message : String(error)); }
    }
    async function savedDocument(result: PdfExportResult) {
        setSaved({ name: result.fileName, bytes: result.blob.size, valid: (await result.blob.slice(0, 4).text()) === '%PDF' });
    }
    const visibility = Object.fromEntries(PDF_EDITOR_ACTIONS.filter(action => action.group === 'drawing').map(action => [action.id, showDrawing]));
    return <section aria-label="PdfEditor visual matrix" className={sceneStyle} data-status={state?.status ?? 'initializing'} data-document={state?.document?.id ?? ''} data-page-count={state?.document?.pageCount ?? 0} data-revision={state?.document?.revision ?? 0} data-dirty={String(state?.document?.dirty ?? false)}>
        <div className={row}>
            <Checkbox checked={showDrawing} onCheckedChange={setShowDrawing}>显示绘图工具</Checkbox>
            <Checkbox checked={pluginEnabled} onCheckedChange={setPluginEnabled}>启用区域插件</Checkbox>
            <Button appearance="outlined" onClick={() => { void run(async instance => setExported(await instance.exportPdf())); }}>导出当前 PDF</Button>
            <Button appearance="outlined" onClick={() => { void run(async instance => setExported(await instance.extractPages([0]))); }}>提取第一页</Button>
            <Button appearance="outlined" disabled={!exported} onClick={() => { void run(async instance => { if (exported) await instance.open({ id: 'professional-reopened', fileName: exported.fileName, source: exported.blob }); }); }}>重新打开导出 PDF</Button>
            <Button appearance="outlined" onClick={() => { void run(async instance => {
                const page = instance.getPages()[instance.getState().document!.currentPageIndex];
                setRegion(await instance.captureRegion(instance.createRegionSelection([{ pageIndex: page.index, x: 0, y: 0, width: page.width, height: page.height }]), { scale: 1 }));
            }); }}>捕获当前页</Button>
        </div>
        <p>图片夹具：<a href="./fixtures/visual-image.png" download>蓝红图片</a> · <a href="./fixtures/visual-image-replacement.png" download>绿黄替换图片</a>。文档与字体均来自当前站点。</p>
        {failure && <p role="alert">{failure}</p>}
        <PdfEditor ref={editor} runtime={runtime} initialDocument={document} fonts={fonts} onStateChange={setState} onSave={savedDocument}
            plugins={pluginEnabled ? [regionPlugin] : []} toolbar={{ visibility, extraActions: [{ id: 'professional-summary', label: '文档摘要', icon, placement: 'main', disabled: current => !current.document,
                onSelect(instance) { const current = instance.getState().document; setSummary(current ? `${current.fileName} · ${current.pageCount}页` : ''); },
            }] }} />
        <output aria-label="文档摘要结果">{summary}</output>
        <output aria-label="区域插件状态" data-installs={pluginLife.installs} data-cleanups={pluginLife.cleanups} data-aborts={pluginLife.aborts}>{pluginEnabled ? '区域插件已启用' : '区域插件已卸载'}</output>
        {saved && <p aria-label="保存结果" data-bytes={saved.bytes} data-valid-pdf={String(saved.valid)}>{saved.name} 已保存</p>}
        {exportUrl && <a href={exportUrl} download={exported!.fileName} aria-label="下载导出 PDF">下载 {exported!.fileName}</a>}
        {regionUrl && <figure data-region-parts={region!.parts.length} data-region-width={region!.width} data-region-height={region!.height}><img className={imageStyle} src={regionUrl} alt="实际 PDF 区域像素" /><figcaption>文档区域快照 · 版本 {region!.selection.revision}</figcaption></figure>}
    </section>;
}
