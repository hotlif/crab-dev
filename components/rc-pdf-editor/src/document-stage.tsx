import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Canvas, { CanvasImage, Group, Rect, SEMANTIC_CANVAS_PALETTE } from '@crab-dev/rc-canvas';
import Virtual, { type VirtualHandle } from '@crab-dev/rc-virtual';
import { bitmap, type PdfClient } from './client.js';
import type { PageInfo } from './protocol.js';
import PageStage, { type StageProps } from './page-stage.js';
import { useFrameBuffer, useFrameLease, type PreparedFrame } from './frame-buffer.js';
import { anchorPosition, documentAnchor, layoutDocument, pageAtPosition, type DocumentAnchor, type DocumentLayout, type PageLayout } from './document-layout.js';
import { documentContentStyle, documentRootStyle, documentSurfaceStyle, frameStyle } from './styles.js';
import token from './token.js';
import RegionSelector from './region-selector.js';
import type { PdfPageRegion } from './types.js';

interface PreviewFrame { images: ImageBitmap[] }
type PaintListeners = Set<() => void>;
export interface PageNavigation { index: number; sequence: number }
interface DocumentStageProps extends Omit<StageProps, 'pageViewport' | 'wheelZoom'> {
    pages: PageInfo[]; navigation: PageNavigation; onCurrentPage: (index: number) => void;
    regionSelection?: { onComplete: (regions: readonly PdfPageRegion[]) => void; onCancel: () => void };
}

function PreviewImage({ frame, visible, page, onLoad, onError }: {
    frame: PreparedFrame<PreviewFrame>; visible: boolean; page: PageInfo; onLoad: () => void; onError: (error: Error) => void;
}) {
    useFrameLease(frame);
    return <CanvasImage src={frame.data.images[0]} x={0} y={0} width={page.width} height={page.height}
        opacity={visible ? 1 : 0} zIndex={1} onLoad={onLoad} onError={onError} />;
}

/** 可见页共用一张背景 Canvas，每页独立准备位图，不创建额外 WebGL 上下文。 */
function PagePreview({ client, item, revision, zoom, paint, onError }: {
    client: PdfClient; item: PageLayout; revision: number; zoom: number; paint: PaintListeners; onError: (error: unknown) => void;
}) {
    const page = item.page, scale = Math.max(0.25, Math.ceil(zoom * Math.min(globalThis.devicePixelRatio || 1, 2)));
    const buffer = useFrameBuffer(client, `${page.id}:${page.contentRevision}:${scale}`, async signal => ({
        images: [await bitmap((await client.preview(page, revision, scale, signal)).image)],
    }), onError);
    // 可变实例状态：纹理上传后等共享 Canvas 完整绘制，再交接这页的前后帧。
    const uploaded = useRef<number | undefined>(undefined);
    const afterPaint = useEffectEvent(() => { if (buffer.back && uploaded.current === buffer.back.id) buffer.present(buffer.back); });
    useEffect(() => { const notify = () => afterPaint(); paint.add(notify); return () => { paint.delete(notify); }; }, [paint]);
    return <Group x={item.x} y={item.y} scaleX={zoom} scaleY={zoom}>
        <Rect x={0} y={0} width={page.width} height={page.height} fill={token.canvas.paper['background-color']} />
        {buffer.slots.map(frame => frame && <PreviewImage key={frame.id} frame={frame} page={page} visible={frame === buffer.front}
            onLoad={() => { uploaded.current = frame.id; }} onError={error => buffer.reject(frame, error)} />)}
    </Group>;
}

function ScrollSurface({ layout, range, width, height, children }: {
    layout: DocumentLayout; range: [number, number]; width: number; height: number; children: ReactNode;
}) {
    const root = useRef<HTMLDivElement>(null);
    const span = layout.rows.slice(range[0], range[1] + 1).reduce((sum, value) => sum + value, 0);
    useLayoutEffect(() => {
        const node = root.current;
        if (!node) return;
        // PDF 尺寸与可视区域属于运行时几何数据，静态样式通过变量读取。
        node.style.setProperty('--pdf-document-width', `${layout.width}px`);
        node.style.setProperty('--pdf-document-span', `${span + layout.gap}px`);
        node.style.setProperty('--pdf-preview-width', `${Math.max(1, width)}px`);
        node.style.setProperty('--pdf-preview-height', `${Math.max(1, height)}px`);
    }, [layout.width, layout.gap, span, width, height]);
    return <div className={documentContentStyle} ref={root}><div className={documentSurfaceStyle}>{children}</div></div>;
}

export default function DocumentStage(props: DocumentStageProps) {
    const { client, pages, page, navigation, width, height, viewport } = props;
    const root = useRef<HTMLDivElement>(null), grid = useRef<VirtualHandle>(null);
    const [gap, setGap] = useState(24);
    const [scroll, setScroll] = useState({ left: 0, top: 0 });
    const [paint] = useState<PaintListeners>(() => new Set());
    const layout = layoutDocument(pages, viewport.zoom, width, gap);
    // 可变实例状态：保存上次几何和滚动锚点；导航编号区分点击定位与滚动产生的当前页变化。
    const previous = useRef<DocumentLayout | undefined>(undefined);
    const position = useRef(scroll);
    const appliedNavigation = useRef(-1);
    const appliedLayout = useRef('');
    const zoomAnchor = useRef<DocumentAnchor | undefined>(undefined);
    const silentPosition = useRef<{ left: number; top: number } | undefined>(undefined);
    useLayoutEffect(() => { if (root.current) setGap(Number.parseFloat(getComputedStyle(root.current).rowGap) || 24); }, [width]);

    const seek = (left: number, top: number, silent = false) => {
        const next = { left: Math.max(0, Math.min(left, layout.width - width)), top: Math.max(0, Math.min(top, layout.height - height)) };
        silentPosition.current = silent ? next : undefined;
        position.current = next; setScroll(next); grid.current?.scrollTo(next);
    };
    // 例外 3：按页面身份及尺寸值稳定依赖，避免对象编辑或选择变化使滚动重新定位。
    const layoutKey = `${viewport.zoom}:${width}:${height}:${gap}:${pages.map(item => `${item.id},${item.width},${item.height}`).join(';')}`;
    const syncLayout = useEffectEvent(() => {
        const old = previous.current;
        appliedLayout.current = layoutKey;
        if (appliedNavigation.current !== navigation.sequence) {
            appliedNavigation.current = navigation.sequence;
            const target = layout.pages[navigation.index];
            if (target) seek((layout.width - width) / 2, target.y - gap, true);
        } else if (old) {
            const scaling = old.zoom !== layout.zoom;
            const anchor = zoomAnchor.current ?? documentAnchor(old, position.current.left, position.current.top, scaling ? width / 2 : 0, scaling ? height / 2 : 0);
            const next = anchor && anchorPosition(layout, anchor);
            if (next) seek(next.left, next.top, true);
        }
        zoomAnchor.current = undefined;
        previous.current = layout;
    });
    useLayoutEffect(() => { syncLayout(); }, [layoutKey, navigation.sequence]);

    const wheelZoom = useEffectEvent((delta: number, clientX: number, clientY: number) => {
        const box = root.current?.getBoundingClientRect();
        if (!box || width < 1 || height < 1) return;
        const zoom = Math.max(0.1, Math.min(8, viewport.zoom * Math.exp(-delta * 0.002)));
        if (zoom === viewport.zoom) return;
        const x = Math.max(0, Math.min(width, (clientX - box.left) * width / Math.max(1, box.width)));
        const y = Math.max(0, Math.min(height, (clientY - box.top) * height / Math.max(1, box.height)));
        zoomAnchor.current = documentAnchor(layout, position.current.left, position.current.top, x, y);
        props.onViewport({ ...viewport, zoom });
    });
    const regionWheel = useEffectEvent((event: WheelEvent) => {
        if (!props.regionSelection) return false;
        event.preventDefault(); event.stopPropagation();
        if (!event.ctrlKey && !event.metaKey) {
            const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
            seek(position.current.left + event.deltaX * factor, position.current.top + event.deltaY * factor);
        }
        return true;
    });
    useEffect(() => {
        const node = root.current;
        if (!node) return;
        // 事件资源：合并同一帧的触控板/滚轮增量，卸载取消尚未提交的缩放。
        let frame: number | undefined, delta = 0, x = 0, y = 0;
        const wheel = (event: WheelEvent) => {
            if (regionWheel(event)) return;
            if (!event.ctrlKey && !event.metaKey) return;
            // 捕获阶段先于 Virtual 与 Canvas；非 passive 监听阻止浏览器整页缩放。
            event.preventDefault(); event.stopPropagation();
            if (event.buttons || !Number.isFinite(event.deltaY)) return;
            delta += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.getBoundingClientRect().height : 1);
            x = event.clientX; y = event.clientY;
            if (frame === undefined) frame = requestAnimationFrame(() => {
                frame = undefined;
                const amount = delta; delta = 0;
                wheelZoom(amount, x, y);
            });
        };
        node.addEventListener('wheel', wheel, { capture: true, passive: false });
        return () => { node.removeEventListener('wheel', wheel, true); if (frame !== undefined) cancelAnimationFrame(frame); };
    }, []);

    function pageViewport(value: PageInfo) {
        const item = layout.pages.find(entry => entry.page.id === value.id);
        return { zoom: viewport.zoom, panX: (item?.x ?? 0) - scroll.left, panY: item ? item.y - scroll.top : -value.height * viewport.zoom - height };
    }
    const currentViewport = pageViewport(page);
    return <div ref={root} className={documentRootStyle} onKeyDown={event => {
        if (event.defaultPrevented || event.nativeEvent.isComposing) return;
        const step = Math.max(1, height - gap);
        const next = event.key === 'PageDown' ? scroll.top + step : event.key === 'PageUp' ? scroll.top - step
            : event.key === 'Home' ? 0 : event.key === 'End' ? layout.height : undefined;
        if (next !== undefined) { event.preventDefault(); event.stopPropagation(); seek(scroll.left, next); }
    }}>
        <Virtual gridRef={grid} aria-label="PDF 连续页面预览" aria-description="Ctrl 或 Command 加滚轮缩放，普通滚轮上下浏览页面" tabIndex={0} viewportWidth={width} viewportHeight={height}
            gridTemplateColumns={[layout.width]} gridTemplateRows={layout.rows} reservedTopHeight={gap} overscanRowCount={1}
            onScrollPositionChange={value => {
                // 尺寸变化时 Virtual 会先收缩滚动边界；保留旧锚点，等父级完成几何同步。
                if (appliedLayout.current !== layoutKey) return;
                position.current = value; setScroll(value);
                const silent = silentPosition.current;
                silentPosition.current = undefined;
                if (silent && Math.abs(silent.top - value.top) < 1 && Math.abs(silent.left - value.left) < 1) return;
                if (appliedNavigation.current === navigation.sequence && height > 0) {
                    const index = pageAtPosition(layout, value.top, height);
                    if (index !== page.index) props.onCurrentPage(index);
                }
            }}
            renderRows={range => <ScrollSurface layout={layout} range={range} width={width} height={height}>
                <div className={frameStyle} aria-hidden="true"><Canvas width={Math.max(1, width)} height={Math.max(1, height)} palette={SEMANTIC_CANVAS_PALETTE} tabIndex={-1}
                    onRender={() => { paint.forEach(notify => notify()); }}>
                    <Group x={-scroll.left} y={-scroll.top}>
                        {layout.pages.slice(range[0], range[1] + 1).map(item => <PagePreview key={item.page.id} client={client} item={item} revision={props.revision} zoom={viewport.zoom} paint={paint} onError={props.onError} />)}
                    </Group>
                </Canvas></div>
                <div className={frameStyle} onPointerDownCapture={event => {
                    if (props.disabled || event.button !== 0) return;
                    const box = event.currentTarget.getBoundingClientRect(), x = event.clientX - box.left + scroll.left, y = event.clientY - box.top + scroll.top;
                    const hit = layout.pages.find(item => x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height);
                    if (hit && hit.page.index !== page.index) { event.preventDefault(); event.stopPropagation(); props.onCurrentPage(hit.page.index); }
                }}>
                    <PageStage {...props} viewport={currentViewport} pageViewport={pageViewport} wheelZoom={false}
                        onViewport={value => seek(scroll.left + currentViewport.panX - value.panX, scroll.top + currentViewport.panY - value.panY)} />
                </div>
            </ScrollSurface>} />
        {props.regionSelection && <RegionSelector layout={layout} scroll={scroll} width={width} height={height} {...props.regionSelection}
            onReveal={point => seek(point.x < scroll.left ? point.x : point.x > scroll.left + width ? point.x - width : scroll.left,
                point.y < scroll.top ? point.y : point.y > scroll.top + height ? point.y - height : scroll.top)} />}
    </div>;
}
