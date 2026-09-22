import { useEffect, useEffectEvent, useId, useImperativeHandle, useLayoutEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { cx } from '@crab-dev/css';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import Button from '@crab-dev/rc-button';
import Dialog from '@crab-dev/rc-dialog';
import LineEdit from '@crab-dev/rc-line-edit';
import NumberEdit from '@crab-dev/rc-number-edit';
import Select from '@crab-dev/rc-select';
import Spin from '@crab-dev/rc-spin';
import TextEdit from '@crab-dev/rc-text-edit';
import Tooltip from '@crab-dev/rc-tooltip';
import type { ViewportState } from '@crab-dev/rc-canvas';
import { PdfClient, asError, decodeImage, downloadPdf, sourceBytes } from './client.js';
import { validateFont } from './font.js';
import { colorCss } from './color.js';
import { PdfEditorError, type PdfEditorProps, type PdfEditorRef, type PdfEditorToolbarAction, type PdfDocumentInput, type PdfOperationOptions, type PdfSource } from './types.js';
import type { PdfEditorActionId } from './actions.js';
import ActionButton, { ActionVisibilityContext } from './action-button.js';
import { PdfSession } from './session.js';
import { RegionSelection } from './region-selection.js';
import { PdfPluginHost } from './plugin-host.js';
import type { DocumentInfo, Drawing, EditCommand, ObjectPatch, PdfObject, ShapeKind, ShapeStyle, Transform } from './protocol.js';
import DocumentStage, { type PageNavigation } from './document-stage.js';
import PagesPanel from './pages-panel.js';
import { pageMoveOrder, togglePageSelection } from './page-selection.js';
import PropertiesPanel, { draftFor, type LoadedFont, type ObjectDraft } from './properties-panel.js';
import ObjectTree from './object-tree.js';
import BusyRegion from './busy-region.js';
import ToolbarButton from './toolbar-button.js';
import PanelHeader from './panel-header.js';
import ShapeStyleFields from './shape-style-fields.js';
import { DEFAULT_SHAPE_STYLE, isShapeTool, SHAPE_LABELS, type EditorTool } from './drawing.js';
import { bodyStyle, centerStyle, drawToolbarStyle, errorStyle, headingStyle, hintStyle, nameStyle, objectHeadingStyle, objectSectionStyle, panelTogglesStyle, progressSlotStyle, propertiesContentStyle, propertiesScrollStyle, rootStyle, sectionStyle, sidebarStyle, statusStyle, toolbarNameStyle, toolbarStyle, toolDividerStyle, viewStyle, zoomStyle } from './styles.js';

const NO_FONTS: NonNullable<PdfEditorProps['fonts']> = [];
const NO_PLUGINS: NonNullable<PdfEditorProps['plugins']> = [];
const INITIAL_VIEW: ViewportState = { zoom: 1, panX: 24, panY: 24 };
const SHAPE_TOOLS: ShapeKind[] = ['rectangle', 'ellipse', 'line', 'arrow', 'freehand'];

/** 使用自有控件和画布，在浏览器本地编辑 PDF 文字、图片与页面。 */
export default function PdfEditor({ initialDocument, runtime, fonts = NO_FONTS, readOnly = false, toolbar, plugins = NO_PLUGINS, ref, onDocumentLoad, onStateChange, beforeDocumentChange, onSave, onSaved, onError, className, onKeyDown, ...rest }: PdfEditorProps) {
    const [session] = useState(() => new PdfSession(readOnly));
    const [regionSelection] = useState(() => new RegionSelection(session));
    const [pluginHost] = useState(() => new PdfPluginHost());
    const selectionRequest = useSyncExternalStore(regionSelection.subscribe, regionSelection.getSnapshot, regionSelection.getSnapshot);
    const pluginState = useSyncExternalStore(pluginHost.subscribe, pluginHost.getSnapshot, pluginHost.getSnapshot);
    const [startup] = useState(() => ({ runtime, initialDocument }));
    const { client, info, state } = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
    const page = state.document?.currentPageIndex ?? 0;
    const setPage = (index: number) => session.setPage(index);
    const [navigation, setNavigation] = useState<PageNavigation>({ index: 0, sequence: 0 });
    const [documentId, setDocumentId] = useState(0);
    const [objects, setObjects] = useState<PdfObject[]>([]);
    const [objectsPage, setObjectsPage] = useState<{ client: PdfClient; id: number; version: number }>();
    const [selected, setSelected] = useState<PdfObject>();
    const [draft, setDraft] = useState<ObjectDraft>();
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [viewport, setViewport] = useState(INITIAL_VIEW);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [loadedFonts, setLoadedFonts] = useState<LoadedFont[]>([]);
    const [error, setError] = useState<PdfEditorError>();
    const [transitionPending, startTransition] = useTransition();
    const pending = transitionPending || state.pendingOperations.length > 0 || !!selectionRequest || !!pluginState.task;
    const [rendering, setRendering] = useState(false);
    const [showPages, setShowPages] = useState(true);
    const [showProperties, setShowProperties] = useState(true);
    const [newText, setNewText] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [newFont, setNewFont] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRequest, setPasswordRequest] = useState<{ document: PdfDocumentInput; mode: 'open' | 'merge' }>();
    const [deletePages, setDeletePages] = useState(false);
    const [tool, setTool] = useState<EditorTool>('select');
    const [drawingStyle, setDrawingStyle] = useState<ShapeStyle>(DEFAULT_SHAPE_STYLE);
    const pagesId = useId(), propertiesId = useId();
    // 可变实例状态：文件选择器和图片替换意图不参与渲染。
    const fileRef = useRef<HTMLInputElement>(null);
    const mergeRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const replaceRef = useRef(false);
    // 可变实例状态：每个成功打开的文档仅自动适应一次，尺寸变化不得覆盖用户缩放。
    const fittedDocument = useRef(-1);
    const currentInfo = info?.pages[page];
    const pageDataReady = objectsPage?.client === client && objectsPage?.id === currentInfo?.id && objectsPage?.version === currentInfo?.contentRevision;
    const locked = readOnly || !info?.editable;
    // 文档操作和工具选择不依赖页面像素；跨页准备不能反复切换整组按钮的禁用外观。
    const objectBusy = pending || !pageDataReady;
    const objectDisabled = locked || objectBusy;
    const processing = (!selectionRequest && pending) || rendering;
    const targets = selectedPages;
    const pagesDisabled = locked || targets.length === 0;
    const visibility = toolbar?.visibility ?? {};
    const visible = (action: PdfEditorActionId) => visibility[action] !== false;
    const anyVisible = (...actions: PdfEditorActionId[]) => actions.some(visible);
    // 配置移除当前工具时立即退出；恢复按钮不会意外重新进入绘图/平移。
    if (tool !== 'select' && !visible(tool)) setTool('select');
    const activeTool = !visible(tool) || (locked && isShapeTool(tool)) ? 'select' : tool;
    const extraActions = [
        ...(toolbar?.extraActions ?? []).map(action => ({ ...action, id: `toolbar:${action.id}` })),
        ...pluginState.actions.map(action => ({ ...action, id: `plugin:${action.id}` })),
    ].filter(action => action.visible !== false);
    const showToolActions = anyVisible('select', 'pan', ...SHAPE_TOOLS, 'togglePages', 'toggleProperties') || extraActions.some(action => action.placement === 'tools');

    useLayoutEffect(() => { session.setReadOnly(readOnly); }, [session, readOnly]);

    useEffect(() => {
        const media = window.matchMedia('(max-width: 1000px)');
        const update = () => { setShowPages(!media.matches); setShowProperties(!media.matches); };
        update(); media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    function togglePanel(panel: 'pages' | 'properties') {
        const compact = window.matchMedia('(max-width: 1000px)').matches;
        if (panel === 'pages') { setShowPages(!showPages); if (compact) setShowProperties(false); }
        else { setShowProperties(!showProperties); if (compact) setShowPages(false); }
    }
    function closePanel(panel: 'pages' | 'properties') {
        if (panel === 'pages') setShowPages(false); else setShowProperties(false);
        const toggle = document.getElementById(`${panel === 'pages' ? pagesId : propertiesId}-toggle`);
        // 显隐配置可能移除原来的返回焦点入口。
        if (toggle) toggle.focus(); else document.getElementById(`${pagesId}-canvas`)?.focus();
    }

    function report(value: unknown) {
        const next = asError(value);
        if (next.code === 'cancelled') return;
        setError(next);
        onError?.(next);
    }
    const reportEffect = useEffectEvent(report);
    function perform(task: () => Promise<unknown>) {
        void performResult(task);
    }
    function performResult(task: () => Promise<unknown>): Promise<boolean> {
        return new Promise(resolve => startTransition(async () => {
            try { setError(undefined); await task(); resolve(true); } catch (failure) { report(failure); resolve(false); }
        }));
    }
    function accept(next: DocumentInfo, nextPage = page, object?: PdfObject) {
        const current = Math.max(0, Math.min(nextPage, next.pages.length - 1));
        if (next.pages[current].id !== currentInfo?.id || current !== page) requestPage(current);
        setPage(current);
        setSelected(object); setDraft(object ? draftFor(object) : undefined); setSelectedPages([current]);
    }

    useEffect(() => {
        void session.start(startup.runtime).catch(reportEffect);
        const initial = startup.initialDocument;
        if (initial) startTransition(async () => {
            try { await openInitial(initial); } catch (failure) { reportEffect(failure); }
        });
        return () => session.dispose();
    }, [session, startup]);

    useEffect(() => {
        if (!client) return;
        let cancelled = false;
        const abort = new AbortController();
        const faces: FontFace[] = [];
        setLoadedFonts([]);
        startTransition(async () => {
            try {
                const bytes: { id: string; data: Uint8Array<ArrayBuffer> }[] = [];
                const loaded: LoadedFont[] = [];
                for (const font of fonts) {
                    const data = await sourceBytes(font.source, abort.signal);
                    validateFont(data);
                    const family = `CrabPdf_${crypto.randomUUID().replaceAll('-', '')}`;
                    const face = new globalThis.FontFace(family, data.buffer);
                    await face.load();
                    if (cancelled) return;
                    faces.push(face); document.fonts.add(face);
                    bytes.push({ id: font.id, data }); loaded.push({ id: font.id, label: font.family, family });
                }
                if (cancelled) return;
                await client.request('fonts', { fonts: bytes });
                if (!cancelled) { setLoadedFonts(loaded); setNewFont(loaded[0]?.id ?? ''); }
            } catch (failure) { faces.forEach(face => document.fonts.delete(face)); if (!cancelled) reportEffect(failure); }
        });
        return () => { cancelled = true; abort.abort(); faces.forEach(face => document.fonts.delete(face)); };
    }, [client, fonts]);

    async function open(document: PdfDocumentInput, options?: PdfOperationOptions, interactive = false) {
        try {
            const result = await session.open(document, options, beforeDocumentChange);
            if (session.getState().document?.sessionId === result.sessionId) {
                setDocumentId(value => value + 1);
                accept(session.getSnapshot().info!, 0); setObjects([]); setObjectsPage(undefined);
                setTool('select'); setError(undefined); setPasswordRequest(undefined); setPassword('');
                setNewText(false); setDeletePages(false);
            }
            onDocumentLoad?.(result);
            return result;
        } catch (failure) {
            if (interactive && asError(failure).code === 'password') setPasswordRequest({ document, mode: 'open' });
            throw failure;
        }
    }
    const openInitial = useEffectEvent((document: PdfDocumentInput) => open(document, undefined, true));

    async function close(options?: PdfOperationOptions) {
        await session.close(options, beforeDocumentChange);
        setObjects([]); setObjectsPage(undefined); setSelected(undefined); setDraft(undefined); setSelectedPages([]);
        setTool('select'); setPasswordRequest(undefined); setPassword(''); setNewText(false); setDeletePages(false); setError(undefined);
    }

    const changed = useEffectEvent(() => onStateChange?.(state));
    useEffect(() => { changed(); }, [state]);

    function fitToPage() {
        const snapshot = session.getSnapshot(), index = snapshot.state.document?.currentPageIndex ?? 0;
        const current = snapshot.info?.pages[index];
        if (!current) throw new PdfEditorError('document', '请先打开 PDF');
        if (size.width < 1 || size.height < 1) return false;
        const zoom = Math.max(0.1, Math.min(8, (size.width - 48) / current.width, (size.height - 48) / current.height));
        setViewport({ zoom, panX: (size.width - current.width * zoom) / 2, panY: (size.height - current.height * zoom) / 2 });
        requestPage(index);
        return true;
    }
    const fitEffect = useEffectEvent(() => {
        if (fittedDocument.current === documentId || !currentInfo || size.width < 1 || size.height < 1) return;
        fittedDocument.current = documentId;
        fitToPage();
    });
    useEffect(() => { fitEffect(); }, [documentId, size.width, size.height]);

    function requestPage(index: number) { setNavigation(previous => ({ index, sequence: previous.sequence + 1 })); }
    function currentPage(index: number) {
        if (index === page) return;
        setPage(index); setSelectedPages([index]); setSelected(undefined); setDraft(undefined);
    }

    function goToPage(index: number) {
        session.setPage(index);
        requestPage(index);
        setSelectedPages([index]); setSelected(undefined); setDraft(undefined);
    }
    function selectPage(index: number, toggle: boolean) {
        const next = togglePageSelection(selectedPages, index, toggle);
        setSelectedPages(next);
        if (next.includes(index)) { setPage(index); requestPage(index); }
        else if (index === page && next.length) { setPage(next[next.length - 1]); requestPage(next[next.length - 1]); }
        selectObject();
    }
    async function movePages(indices: number[], to: number) {
        if (!info) return;
        const order = pageMoveOrder(info.pages.length, indices, to);
        if (!order) return;
        const moving = [...new Set(indices)].sort((a, b) => a - b);
        const selection = moving.map((_, offset) => to + offset);
        await edit({ kind: 'movePages', pages: moving, to }, order.indexOf(page), false, selection);
    }
    async function edit(command: EditCommand, nextPage = page, preserveSelection = false, nextSelection?: number[]) {
        if (!client || !info) throw new PdfEditorError('document', '请先打开 PDF');
        if (locked) throw new PdfEditorError('permission', '当前文档为只读');
        const next = await session.edit(command, info.revision);
        if (session.getSnapshot().info === next) {
            let object: PdfObject | undefined;
            if (preserveSelection && selected) {
                const result = await client.request('page', { page: nextPage, revision: next.revision });
                object = result.objects.find(value => value.index === selected.index);
            }
            if (session.getSnapshot().info !== next) return;
            accept(next, nextPage, object);
            if (nextSelection) setSelectedPages(nextSelection);
        }
    }
    async function history(direction: 'undo' | 'redo', options?: PdfOperationOptions) {
        const result = await session.history(direction, options);
        if (session.getState().document?.sessionId === result.sessionId) accept(session.getSnapshot().info!);
        return result;
    }
    async function save(options?: PdfOperationOptions) {
        const result = await session.save(onSave, options);
        onSaved?.(result);
        return result;
    }
    const editorApi: PdfEditorRef = {
        ready: session.ready, getState: session.getState, open, close,
        subscribe: session.subscribe, getPages: session.getPages, createRegionSelection: session.createRegionSelection, captureRegion: session.captureRegion,
        selectRegion: options => {
            const result = regionSelection.start(options);
            if (regionSelection.getSnapshot()) { setTool('select'); selectObject(); }
            return result;
        },
        exportPdf: options => session.exportPdf(options), extractPages: (pages, options) => session.exportPdf(options, pages),
        save, undo: options => history('undo', options), redo: options => history('redo', options), goToPage, fitToPage,
    };
    useImperativeHandle(ref, () => editorApi);
    useLayoutEffect(() => { pluginHost.setEditor(editorApi); });
    useEffect(() => { pluginHost.reconcile(plugins, reportEffect); }, [plugins, pluginHost]);
    useEffect(() => () => { regionSelection.cancel(); pluginHost.dispose(); }, [regionSelection, pluginHost]);

    function actionDisabled(action: PdfEditorToolbarAction, current = state) {
        return pending || current.status !== 'ready' || current.pendingOperations.length > 0 ||
            (typeof action.disabled === 'function' ? action.disabled(current) : action.disabled === true);
    }
    function renderExtraActions(placement: PdfEditorToolbarAction['placement']) {
        return extraActions.filter(action => action.placement === placement).map(action =>
            <ToolbarButton key={action.id} label={action.label} icon={action.icon} disabled={actionDisabled(action)}
                tooltipPlacement={placement === 'status' ? 'top' : 'bottom'} onClick={() => {
                    if (!actionDisabled(action, session.getState())) perform(async () => { await action.onSelect(editorApi); });
                }} />);
    }

    function selectObject(object?: PdfObject) { setSelected(object); setDraft(object ? draftFor(object) : undefined); }
    function chooseTool(next: EditorTool) {
        setTool(next);
        if (isShapeTool(next)) {
            selectObject();
            if (window.matchMedia('(min-width: 1001px)').matches) setShowProperties(true);
        }
    }
    async function draw(drawing: Drawing) {
        await edit({ kind: 'shape', page, drawing });
    }
    async function applyDraft(value = draft) {
        if (!value || !selected) return;
        const patch: ObjectPatch = { transform: value.transform };
        if (selected.kind === 'text') {
            if (value.text !== selected.text) patch.text = value.text;
            if (value.fontId) patch.fontId = value.fontId;
            if (value.fontSize !== selected.fontSize) patch.fontSize = value.fontSize;
            patch.color = value.color;
        }
        if (selected.kind === 'shape') patch.shapeStyle = value.shapeStyle;
        await edit({ kind: 'update', page, object: selected.index, patch }, page, true);
    }
    function commitTransform(transform: Transform): Promise<boolean> {
        if (!draft || !selected) return Promise.resolve(false);
        const value = { ...draft, transform };
        // 松手值先同步给属性与画布，再启动异步提交，避免等待最后一次 move 的状态同步。
        setDraft(value);
        return performResult(() => applyDraft(value));
    }
    async function removeObject() { if (selected) await edit({ kind: 'remove', page, object: selected.index }); }
    async function merge(value: PdfSource, suppliedPassword = '') {
        try {
            await edit({ kind: 'merge', bytes: await sourceBytes(value), password: suppliedPassword, at: page + 1 }, page + 1);
            setPasswordRequest(undefined); setPassword('');
        } catch (failure) { if (asError(failure).code === 'password') setPasswordRequest({ document: { id: 'merge', source: value }, mode: 'merge' }); throw failure; }
    }
    async function insertImage(file: File) {
        if (!currentInfo) return;
        const pixels = await decodeImage(file);
        const factor = Math.min(1, (currentInfo.width - 48) / pixels.width, (currentInfo.height - 48) / pixels.height);
        await edit({ kind: 'image', page, image: pixels, bounds: { x: 24, y: 24, width: pixels.width * factor, height: pixels.height * factor }, replace: replaceRef.current ? selected?.index : undefined });
    }
    function guardToolbarAction(event: MouseEvent<HTMLDivElement>) {
        // 自动提交只锁定操作，不切换整组图标的禁用外观，也不丢失键盘焦点。
        if (pending) { event.preventDefault(); event.stopPropagation(); }
    }
    function keyDown(event: KeyboardEvent<HTMLDivElement>) {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.nativeEvent.isComposing) return;
        const target = event.target;
        if (target instanceof HTMLElement && (target.closest('input, textarea, select, [contenteditable="true"], [role="combobox"], [role="navigation"], dialog'))) return;
        if (target instanceof HTMLElement && target.closest('[role="toolbar"]')) {
            const toolbar = target.closest('[role="toolbar"]')!;
            const items = [...toolbar.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')].filter(item => item.getClientRects().length);
            const index = items.indexOf(target.closest('button')!);
            const next = event.key === 'ArrowRight' ? (index + 1) % items.length : event.key === 'ArrowLeft' ? (index - 1 + items.length) % items.length : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : undefined;
            if (next !== undefined) { event.preventDefault(); items[next]?.focus(); return; }
        }
        if (event.key === 'Escape') { setTool('select'); selectObject(); return; }
        if (pending || locked) return;
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
            event.preventDefault(); perform(() => history(event.shiftKey ? 'redo' : 'undo'));
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
            event.preventDefault(); perform(() => history('redo'));
        } else if (activeTool === 'select' && selected && !selected.reason && draft) {
            if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); perform(removeObject); }
            const moves: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
            const move = moves[event.key];
            if (move) {
                event.preventDefault();
                const step = event.shiftKey ? 10 : 1;
                perform(() => applyDraft({ ...draft, transform: { ...draft.transform, x: draft.transform.x + move[0] * step, y: draft.transform.y + move[1] * step } }));
            }
        }
    }

    const previewFont = loadedFonts.find(font => font.id === draft?.fontId);
    const preview = draft && selected?.kind === 'text' && previewFont ? {
        text: draft.text, fontSize: draft.fontSize, family: previewFont.family,
        color: colorCss(draft.color),
    } : undefined;

    return <ActionVisibilityContext value={visibility}><div {...rest} className={cx(rootStyle, className)} onKeyDown={keyDown} aria-busy={processing}>
        <input ref={fileRef} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) perform(async () => { await open({ id: crypto.randomUUID(), source: file }, undefined, true); }); }} />
        <input ref={mergeRef} type="file" accept="application/pdf,.pdf" hidden onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) perform(() => merge(file)); }} />
        <input ref={imageRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) perform(() => insertImage(file)); }} />
        <div className={toolbarStyle} role="toolbar" aria-label="PDF 编辑工具栏" aria-busy={pending} onClickCapture={guardToolbarAction}>
            <ActionButton action="open" disabled={!client} onClick={() => fileRef.current?.click()} />
            <span className={cx(nameStyle, toolbarNameStyle)}>{state.document?.fileName ?? 'PDF 编辑器'}{info?.dirty ? ' · 未保存' : ''}</span>
            <ActionButton action="undo" disabled={locked || !info?.canUndo} onClick={() => perform(() => history('undo'))} />
            <ActionButton action="redo" disabled={locked || !info?.canRedo} onClick={() => perform(() => history('redo'))} />
            <ActionButton action="addText" disabled={locked || !loadedFonts.length} onClick={() => setNewText(true)} />
            <ActionButton action="addImage" disabled={locked} onClick={() => { replaceRef.current = false; imageRef.current?.click(); }} />
            {anyVisible('open', 'undo', 'redo', 'addText', 'addImage') && anyVisible('insertPage', 'merge', 'rotatePage', 'deletePage', 'pageUp', 'pageDown', 'extract', 'save') && <span className={toolDividerStyle} aria-hidden="true" data-action-divider />}
            <ActionButton action="insertPage" disabled={locked} onClick={() => perform(() => edit({ kind: 'insert', at: page + 1 }, page + 1))} />
            <ActionButton action="merge" disabled={locked} onClick={() => mergeRef.current?.click()} />
            <ActionButton action="rotatePage" disabled={pagesDisabled} onClick={() => perform(() => edit({ kind: 'rotatePages', pages: targets, turns: 1 }, page, false, targets))} />
            <ActionButton action="deletePage" danger disabled={pagesDisabled || !info || targets.length === info.pages.length} onClick={() => setDeletePages(true)} />
            <ActionButton action="pageUp" disabled={pagesDisabled || Math.min(...targets) === 0} onClick={() => perform(() => movePages(targets, Math.max(0, Math.min(...targets) - 1)))} />
            <ActionButton action="pageDown" disabled={pagesDisabled || !info || Math.max(...targets) >= info.pages.length - 1} onClick={() => perform(() => movePages(targets, Math.min(info!.pages.length - targets.length, Math.min(...targets) + 1)))} />
            <ActionButton action="extract" disabled={!info || !targets.length} onClick={() => perform(async () => { const result = await session.exportPdf(undefined, targets); downloadPdf(result.blob, result.fileName); })} />
            <ActionButton action="save" appearance="primary" disabled={!info} onClick={() => perform(async () => { await save(); })} />
            {renderExtraActions('main')}
        </div>
        {showToolActions && <div className={drawToolbarStyle} role="toolbar" aria-label="绘图工具栏" aria-busy={pending} onClickCapture={guardToolbarAction}>
            <ActionButton action="select" selected={activeTool === 'select'} disabled={!info} onClick={() => chooseTool('select')} />
            <ActionButton action="pan" selected={activeTool === 'pan'} disabled={!info} onClick={() => chooseTool('pan')} />
            {anyVisible('select', 'pan') && SHAPE_TOOLS.some(visible) && <span className={toolDividerStyle} aria-hidden="true" data-action-divider />}
            {SHAPE_TOOLS.map(shape => <ActionButton key={shape} action={shape} selected={activeTool === shape} disabled={locked}
                onClick={() => chooseTool(shape)} />)}
            <span className={hintStyle}>{isShapeTool(activeTool) ? `${SHAPE_LABELS[activeTool]} · 拖动绘制，Esc 退出${activeTool === 'freehand' ? '' : '，Shift 约束形状'}` : activeTool === 'pan' ? '拖动页面平移' : '选择对象后可移动、缩放或旋转'}</span>
            {renderExtraActions('tools')}
            {anyVisible('togglePages', 'toggleProperties') && <div className={panelTogglesStyle} role="group" aria-label="侧栏显示">
                <ActionButton action="togglePages" id={`${pagesId}-toggle`} tooltip={showPages ? '收起页面面板' : '展开页面面板'}
                    selectedIcon="panelLeftFilled" appearance="tonal" selected={showPages} disabled={!info}
                    aria-expanded={showPages} aria-controls={info ? pagesId : undefined} onClick={() => togglePanel('pages')} />
                <ActionButton action="toggleProperties" id={`${propertiesId}-toggle`} tooltip={showProperties ? '收起属性面板' : '展开属性面板'}
                    selectedIcon="panelRightFilled" appearance="tonal" selected={showProperties} disabled={!info}
                    aria-expanded={showProperties} aria-controls={info ? propertiesId : undefined} onClick={() => togglePanel('properties')} />
            </div>}
        </div>}
        {(selectionRequest || pluginState.task) && <div className={toolbarStyle}>
            <span className={nameStyle} role="status">{selectionRequest ? '区域选择：拖动框选，可跨页；滚轮翻页，Shift + 方向键扩选，Enter 完成，Esc 取消。' : `${pluginState.task!.label}处理中…`}</span>
            <Button appearance="text" onClick={() => { regionSelection.cancel(); pluginHost.cancel(); document.getElementById(`${pagesId}-canvas`)?.focus(); }}>取消{selectionRequest ? '区域选择' : '插件任务'}</Button>
        </div>}
        {error && <div className={errorStyle} role="alert">{error.message}</div>}
        <div className={bodyStyle}>
            {info && client && <aside id={pagesId} className={sidebarStyle} hidden={!showPages} aria-label="页面管理">
                <PanelHeader panel="pages" onClose={() => closePanel('pages')} title={<>页面 <span className={hintStyle}>{info.pages.length}</span></>} />
                <p className={hintStyle}>点击选页，Ctrl / ⌘ 点击多选；拖拽调整顺序。</p>
                <PagesPanel client={client} pages={info.pages} revision={info.revision} current={page} selected={selectedPages} disabled={pending} readOnly={locked}
                    onSelect={selectPage} onSelectAll={() => { setSelectedPages(info.pages.map(value => value.index)); selectObject(); }}
                    onMove={(indices, to) => perform(() => movePages(indices, to))} onError={report} />
            </aside>}
            <main id={`${pagesId}-canvas`} className={viewStyle} tabIndex={0} aria-label="PDF 页面画布">
                {client && info && currentInfo ? <AutoSizer onResize={setSize}>{({ width, height }) => <DocumentStage
                    pages={info.pages} navigation={navigation} onCurrentPage={currentPage}
                    regionSelection={selectionRequest ? {
                        onComplete: regions => { regionSelection.complete(regions); document.getElementById(`${pagesId}-canvas`)?.focus(); },
                        onCancel: () => { regionSelection.cancel(); document.getElementById(`${pagesId}-canvas`)?.focus(); },
                    } : undefined}
                    client={client} page={currentInfo} revision={info.revision} selected={selected}
                    transform={draft?.transform} preview={preview} width={width} height={height} disabled={objectDisabled} viewport={viewport}
                    tool={activeTool} drawingStyle={drawingStyle} onDraw={drawing => performResult(() => draw(drawing))}
                    onPending={setRendering} onPresented={(shownPage, nextObjects) => {
                        if (shownPage.id === currentInfo.id && shownPage.contentRevision === currentInfo.contentRevision) {
                            setObjects(nextObjects); setObjectsPage({ client, id: shownPage.id, version: shownPage.contentRevision });
                        }
                    }}
                    onViewport={setViewport} onSelect={selectObject} onError={report}
                    onTransform={(transform: Transform) => setDraft(previous => previous ? { ...previous, transform } : undefined)}
                    onCommit={commitTransform}
                />}</AutoSizer> : <div className={centerStyle}>
                    <h2 className={headingStyle}>在本地编辑 PDF</h2>
                    <p className={hintStyle}>修改文字、调整图片，或整理文档页面。</p>
                    {visible('open') && <Button appearance="primary" disabled={pending || !client} onClick={() => fileRef.current?.click()}>选择 PDF 文件</Button>}
                </div>}
            </main>
            {info && <aside id={propertiesId} className={sidebarStyle} data-panel="properties" hidden={!showProperties} aria-label="对象属性">
                <div className={propertiesContentStyle}>{isShapeTool(activeTool) ? <BusyRegion className={cx(sectionStyle, propertiesScrollStyle)} busy={pending}>
                    <PanelHeader panel="properties" onClose={() => closePanel('properties')} title={`${SHAPE_LABELS[activeTool]}设置`} />
                    <ShapeStyleFields shape={activeTool} value={drawingStyle} disabled={locked} onChange={value => { if (!pending && !locked) setDrawingStyle(value); }} />
                    <p className={hintStyle}>在页面内按下并拖动鼠标，松开完成一笔。绘制完成后，可从对象树选择图形继续编辑。</p>
                </BusyRegion> : selected && draft ? <PropertiesPanel object={selected} draft={draft} fonts={loadedFonts} disabled={locked} busy={objectBusy} onClose={() => closePanel('properties')} onDraft={setDraft} onApply={() => perform(() => applyDraft())} onRemove={() => perform(removeObject)} onReplace={() => { replaceRef.current = true; imageRef.current?.click(); }} /> : <div className={cx(sectionStyle, propertiesScrollStyle)}>
                    <PanelHeader panel="properties" onClose={() => closePanel('properties')} title="对象属性" />
                    <p className={hintStyle}>点击画布中的文字、图片或图形，或从下方对象树选择。</p>
                </div>}</div>
                <div className={objectSectionStyle}>
                    <h2 className={cx(headingStyle, objectHeadingStyle)}>页面对象</h2>
                    <ObjectTree objects={objects} selected={selected} busy={objectBusy} onSelect={object => { setTool('select'); selectObject(object); }} />
                </div>
            </aside>}
        </div>
        <div className={statusStyle}>
            <span role="status" className={nameStyle}>{info ? `第 ${page + 1} / ${info.pages.length} 页${selectedPages.length > 1 ? ` · 已选择 ${selectedPages.length} 页` : selectedPages.length === 0 ? ' · 未选择页面' : ''}${locked ? ' · 只读' : ''}` : pending ? '正在处理…' : '请选择 PDF 文件'}</span>
            <span className={progressSlotStyle}><Spin spinning={processing} delay={150} size="small" label="正在处理 PDF" /></span>
            <Tooltip title="Ctrl / ⌘ + 滚轮缩放；普通滚轮滚动页面" placement="top" arrow={false}>
                <NumberEdit className={zoomStyle} size="small" aria-label="缩放百分比" controls={false} suffix="%" value={Math.round(viewport.zoom * 75)} min={8} max={600} disabled={!info || !!selectionRequest} onChange={value => { if (value !== null) setViewport(previous => ({ ...previous, zoom: value / 75 })); }} />
            </Tooltip>
            <ActionButton action="fitPage" tooltipPlacement="top" disabled={!info || !!selectionRequest} onClick={() => { fitToPage(); }} />
            {renderExtraActions('status')}
        </div>
        <Dialog open={newText} onOpenChange={setNewText} title="添加文字" onConfirm={async () => {
            try { await edit({ kind: 'text', page, text: newContent, fontId: newFont, fontSize: 16, color: [0, 0, 0, 255], x: 24, y: 24 }); setNewContent(''); }
            catch (failure) { report(failure); return false; }
        }}>
            <div className={sectionStyle}>
                {error && <p className={errorStyle} role="alert">{error.message}</p>}
                <TextEdit label="文字内容" value={newContent} rows={4} onChange={event => setNewContent(event.target.value)} />
                <Select label="字体" value={newFont} options={loadedFonts.map(font => ({ value: font.id, label: font.label }))} onChange={value => setNewFont(value ?? '')} />
            </div>
        </Dialog>
        <Dialog open={!!passwordRequest} onOpenChange={value => { if (!value) { setPasswordRequest(undefined); setPassword(''); } }} title="PDF 密码" onConfirm={async () => {
            if (!passwordRequest) return false;
            try { if (passwordRequest.mode === 'open') await open({ ...passwordRequest.document, password }, undefined, true); else await merge(passwordRequest.document.source, password); }
            catch (failure) { report(failure); return false; }
        }}>
            {error && <p className={errorStyle} role="alert">{error.message}</p>}
            <LineEdit type="password" label="密码" value={password} autoComplete="off" onChange={event => setPassword(event.target.value)} />
        </Dialog>
        <Dialog open={deletePages} onOpenChange={setDeletePages} title="删除页面" onConfirm={async () => {
            try { await edit({ kind: 'deletePages', pages: targets }); } catch (failure) { report(failure); return false; }
        }}><p>删除 {targets.length} 页？删除后可以撤销。</p></Dialog>
    </div></ActionVisibilityContext>;
}
