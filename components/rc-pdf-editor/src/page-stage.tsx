import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import Button from '@crab-dev/rc-button';
import Canvas, { CanvasImage, Group, Rect, Text, Transformer, Viewport, SEMANTIC_CANVAS_PALETTE } from '@crab-dev/rc-canvas';
import type { ViewportState } from '@crab-dev/rc-canvas';
import { bitmap, type PdfClient } from './client.js';
import type { Bounds, Drawing, PageInfo, PdfObject, ShapeStyle, Transform } from './protocol.js';
import token from './token.js';
import type { EditorTool } from './drawing.js';
import DrawingSurface from './drawing-surface.js';
import DrawingPreview from './drawing-preview.js';
import { useFrameBuffer, useFrameLease, type PreparedFrame } from './frame-buffer.js';
import { frameStyle, renderRetryStyle } from './styles.js';

export interface TextPreview { text: string; fontSize: number; family: string; color: string }
interface Presentation { transform?: Transform; preview?: TextPreview; viewport: ViewportState }
interface PageFrame { images: ImageBitmap[]; page: PageInfo; objects: PdfObject[]; selected?: PdfObject; bounds?: Bounds; initial: Presentation }
interface SubmittedTransform extends Presentation { owner: PdfClient; page: number; version: number; object: number }
export interface StageProps {
    client: PdfClient; page: PageInfo; revision: number;
    selected: PdfObject | undefined; transform: Transform | undefined; preview?: TextPreview;
    viewport: ViewportState; width: number; height: number; disabled: boolean;
    /** 连续预览按页面稳定标识计算位置，旧帧在滚动时也跟随页面移动。 */
    pageViewport?: (page: PageInfo) => ViewportState;
    wheelZoom?: boolean;
    tool: EditorTool; drawingStyle: ShapeStyle;
    onDraw: (drawing: Drawing) => Promise<boolean>;
    onSelect: (object?: PdfObject) => void; onTransform: (value: Transform) => void; onCommit: (value: Transform) => Promise<boolean>;
    onViewport: (value: ViewportState) => void; onError: (error: unknown) => void;
    onPending: (pending: boolean) => void; onPresented: (page: PageInfo, objects: PdfObject[]) => void;
}

function FrameCanvas({ frame, visible, live, stage, drawing, submittedTransform, onPresent, onError }: {
    frame: PreparedFrame<PageFrame> | undefined; visible: boolean; live: boolean; stage: StageProps; drawing?: Drawing;
    submittedTransform?: SubmittedTransform;
    onPresent: () => void; onError: (error: Error) => void;
}) {
    useFrameLease(frame);
    // 可变实例状态：确认所有纹理已上传，且只在第一张完整帧绘制后通知交接。
    const loaded = useRef(0), presented = useRef(false);
    useLayoutEffect(() => { loaded.current = 0; presented.current = false; }, [frame]);
    const { transform, preview, viewport } = stage;
    // 连续文档的位置由 pageViewport 实时提供，滚动不需要另存一份画布状态。
    const savedViewport = stage.pageViewport ? frame?.data.initial.viewport : viewport;
    const [last, setLast] = useState<Presentation>(frame?.data.initial ?? { viewport });
    useEffect(() => { if (live && savedViewport) setLast({ transform, preview, viewport: savedViewport }); }, [live, transform, preview, savedViewport]);
    if (!frame) return <div className={frameStyle} data-visible="false"><Canvas palette={SEMANTIC_CANVAS_PALETTE} width={Math.max(1, stage.width)} height={Math.max(1, stage.height)} tabIndex={-1} /></div>;
    const { page, images, selected, bounds } = frame.data;
    // 最终变换只覆盖提交前的对象图层；新版本已包含变换，不能再套用一次（尤其是旋转）。
    const held = submittedTransform?.owner === frame.owner && submittedTransform.page === page.id
        && submittedTransform.version === page.contentRevision && submittedTransform.object === selected?.index;
    const presentation = held ? submittedTransform : live ? { transform, preview, viewport } : last;
    const shown = { ...presentation, viewport: stage.pageViewport?.(page) ?? presentation.viewport };
    const position = shown.transform ?? (selected ? { ...selected.bounds, rotation: 0 } : undefined);
    const editing = !!(selected && position && bounds);
    const interactive = live && visible && !stage.disabled;
    const selecting = stage.tool === 'select';
    const upload = () => { loaded.current++; };
    // 提交期间只锁定交互，保留选区；待显示帧也预先绘制控制柄，避免交接后再补一帧。
    return <div className={frameStyle} data-visible={visible} data-page-frame={page.contentRevision} inert={!interactive}
        onPointerDownCapture={event => { if (!interactive) { event.preventDefault(); event.stopPropagation(); } }}>
        <Canvas palette={SEMANTIC_CANVAS_PALETTE} width={Math.max(1, stage.width)} height={Math.max(1, stage.height)} tabIndex={-1}
            onRender={() => { if (loaded.current >= images.length && !presented.current) { presented.current = true; onPresent(); } }}
            onEmptyClick={() => { if (interactive && selecting) stage.onSelect(); }}>
            <Viewport key={frame.id} {...shown.viewport} onViewportChange={stage.onViewport} minZoom={0.1} maxZoom={8} pannable={interactive && (stage.tool === 'pan' || selecting)} zoomable={interactive && !drawing && (stage.wheelZoom ?? true)}>
                <Rect x={0} y={0} width={page.width} height={page.height} fill={token.canvas.paper['background-color']} />
                {!editing && <CanvasImage src={images[0]} x={0} y={0} width={page.width} height={page.height} zIndex={1} onLoad={upload} onError={onError} />}
                {editing && <>
                    <CanvasImage src={images[0]} x={0} y={0} width={page.width} height={page.height} zIndex={1} onLoad={upload} onError={onError} />
                    <Group x={position.x + position.width / 2} y={position.y + position.height / 2} rotation={position.rotation} zIndex={2}>
                        <CanvasImage src={images[1]} x={-position.width / 2 + (bounds.x - selected.bounds.x) * position.width / selected.bounds.width}
                            y={-position.height / 2 + (bounds.y - selected.bounds.y) * position.height / selected.bounds.height}
                            width={bounds.width * position.width / selected.bounds.width} height={bounds.height * position.height / selected.bounds.height}
                            opacity={shown.preview ? 0 : 1} onLoad={upload} onError={onError} />
                        {shown.preview && <Text x={-position.width / 2} y={-position.height / 2} fontFamily={shown.preview.family} fontSize={shown.preview.fontSize} fill={shown.preview.color}>{shown.preview.text}</Text>}
                    </Group>
                    <CanvasImage src={images[2]} x={0} y={0} width={page.width} height={page.height} zIndex={3} onLoad={upload} onError={onError} />
                </>}
                {interactive && selecting && frame.data.objects.filter(object => !object.reason).map(object => <Rect key={object.index} {...object.bounds} zIndex={10 + object.index} fill="transparent" cursor="pointer" onClick={() => stage.onSelect(object)} />)}
                {selecting && editing && <Transformer {...position} minWidth={1} minHeight={1} handleSize={10 / shown.viewport.zoom} selectionStrokeWidth={1.5 / shown.viewport.zoom} zIndex={1000000}
                    onChange={value => { if (interactive) stage.onTransform(value); }} onChangeEnd={value => { if (interactive) stage.onCommit(value); }} />}
                {drawing && <DrawingPreview drawing={drawing} />}
            </Viewport>
        </Canvas>
    </div>;
}

export default function PageStage(props: StageProps) {
    const { client, page, revision, selected, viewport } = props;
    const [submitted, setSubmitted] = useState<{ drawing: Drawing; owner: PdfClient; page: number; version: number }>();
    const [submittedTransform, setSubmittedTransform] = useState<SubmittedTransform>();
    const scale = Math.max(1, Math.ceil(viewport.zoom * Math.min(globalThis.devicePixelRatio || 1, 2)));
    const objectIndex = selected && !selected.reason ? selected.index : undefined;
    const key = `${page.id}:${page.contentRevision}:${scale}:${objectIndex ?? 'page'}`;
    const buffer = useFrameBuffer(client, key, async signal => {
        const result = await client.frame(page, revision, scale, objectIndex, signal);
        const images: ImageBitmap[] = [];
        try {
            for (const pixels of result.layers ? [result.layers.below, result.layers.selected, result.layers.above] : [result.image]) images.push(await bitmap(pixels));
            return { images, page: result.info, objects: result.objects, selected: result.layers ? result.objects.find(object => object.index === objectIndex) : undefined,
                bounds: result.layers?.bounds, initial: { transform: props.transform, preview: props.preview, viewport } };
        } catch (error) { images.forEach(image => image.close()); throw error; }
    }, props.onError);
    const pending = useEffectEvent(props.onPending), presented = useEffectEvent(props.onPresented);
    useEffect(() => {
        if (buffer.ready || buffer.failed) { pending(false); return; }
        // 缓存帧通常下一次绘制即就绪；只有持续等待才显示加载反馈。
        const timer = setTimeout(() => pending(true), 150);
        return () => { clearTimeout(timer); pending(false); };
    }, [key, buffer.ready, buffer.failed]);
    useEffect(() => {
        if (buffer.ready && buffer.front) {
            presented(buffer.front.data.page, buffer.front.data.objects);
            setSubmitted(previous => previous && (previous.owner !== buffer.front!.owner || previous.page !== buffer.front!.data.page.id || previous.version !== buffer.front!.data.page.contentRevision) ? undefined : previous);
            setSubmittedTransform(previous => previous && (previous.owner !== buffer.front!.owner || previous.page !== buffer.front!.data.page.id
                || previous.version !== buffer.front!.data.page.contentRevision || previous.object !== buffer.front!.data.selected?.index) ? undefined : previous);
        }
    }, [buffer.front, buffer.ready]);
    async function commitTransform(transform: Transform): Promise<boolean> {
        if (objectIndex === undefined) return false;
        // 在松手事件中记录最终尺寸，不依赖上层草稿或被动 effect 的同步时机。
        const value: SubmittedTransform = { owner: client, page: page.id, version: page.contentRevision, object: objectIndex,
            transform, preview: props.preview, viewport };
        setSubmittedTransform(value);
        try {
            const success = await props.onCommit(transform);
            if (!success) setSubmittedTransform(previous => previous === value ? undefined : previous);
            return success;
        } catch (error) {
            setSubmittedTransform(previous => previous === value ? undefined : previous);
            props.onError(error); return false;
        }
    }
    return <DrawingSurface tool={props.tool} style={props.drawingStyle} disabled={props.disabled || !buffer.ready || !!submitted || !!submittedTransform}
        page={page} revision={revision} viewport={viewport} width={props.width} height={props.height}
        onDraw={drawing => {
            const value = { drawing, owner: client, page: page.id, version: page.contentRevision };
            setSubmitted(value);
            void props.onDraw(drawing).then(success => { if (!success) setSubmitted(previous => previous === value ? undefined : previous); });
        }}>
        {drawing => <>
            {buffer.slots.map((frame, slot) => <FrameCanvas key={slot} frame={frame} visible={!!frame && frame === buffer.front}
                live={!!frame && (frame === buffer.back || buffer.ready && frame === buffer.front)}
                stage={{ ...props, disabled: props.disabled || !!submittedTransform, onCommit: commitTransform }} submittedTransform={submittedTransform}
                drawing={frame && frame === buffer.front ? drawing ?? (submitted?.owner === frame.owner && submitted.page === frame.data.page.id && submitted.version === frame.data.page.contentRevision ? submitted.drawing : undefined) : undefined}
                onPresent={() => { if (frame) buffer.present(frame); }} onError={error => { if (frame) buffer.reject(frame, error); }} />)}
            {buffer.failed && <Button className={renderRetryStyle} onClick={buffer.retry}>重试页面渲染</Button>}
        </>}
    </DrawingSurface>;
}
