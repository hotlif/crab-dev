import { type ReactNode, use, useEffect, useRef } from 'react';
import { CanvasContext } from './context/canvas-context.js';
import { identityMat3, invertMat3 } from './math/matrix.js';

export interface ViewportProps {
    children?: ReactNode;
    /** 受控 zoom（缩放因子，1.0 = 100%）。不传则使用非受控模式。 */
    zoom?: number;
    /** 受控 panX（世界坐标原点在 canvas 中的 x 位置，px）。 */
    panX?: number;
    /** 受控 panY（世界坐标原点在 canvas 中的 y 位置，px）。 */
    panY?: number;
    /** 受控模式下视口变化时的回调。 */
    onViewportChange?: (viewport: { zoom: number; panX: number; panY: number }) => void;
    /** 最小缩放倍率，默认 0.05 */
    minZoom?: number;
    /** 最大缩放倍率，默认 20 */
    maxZoom?: number;
    /** 每单位 wheel deltaY 对应的缩放速率，默认 0.001 */
    zoomSpeed?: number;
    /** 是否允许拖拽空白区域平移，默认 true */
    pannable?: boolean;
    /** 是否允许滚轮缩放，默认 true */
    zoomable?: boolean;
}

/**
 * viewMatrix 将世界坐标映射到 canvas 坐标：
 *   canvasPos = zoom * worldPos + pan
 *
 * 列主序 mat3：
 *   [ zoom,  0,    0 ]
 *   [ 0,     zoom, 0 ]
 *   [ panX,  panY, 1 ]
 */
function buildViewMatrix(panX: number, panY: number, zoom: number): Float32Array {
    return new Float32Array([
        zoom, 0,    0,
        0,    zoom, 0,
        panX, panY, 1,
    ]);
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export interface ViewportState {
    zoom: number;
    panX: number;
    panY: number;
}

function Viewport({
    children,
    zoom: controlledZoom,
    panX: controlledPanX,
    panY: controlledPanY,
    onViewportChange,
    minZoom = 0.05,
    maxZoom = 20,
    zoomSpeed = 0.001,
    pannable = true,
    zoomable = true,
}: ViewportProps) {
    const ctx = use(CanvasContext);

    // 可变实例状态 ref（非受控内部状态）
    const panXRef = useRef(controlledPanX ?? 0);
    const panYRef = useRef(controlledPanY ?? 0);
    const zoomRef = useRef(controlledZoom ?? 1);

    const applyViewport = (newPanX: number, newPanY: number, newZoom: number) => {
        panXRef.current = newPanX;
        panYRef.current = newPanY;
        zoomRef.current = newZoom;
        ctx.setViewMatrix(buildViewMatrix(newPanX, newPanY, newZoom));
        onViewportChange?.({ zoom: newZoom, panX: newPanX, panY: newPanY });
    };

    // 向 context 注册 seekPan / applyZoom 回调，供 Minimap 驱动视口（保持内部 ref 同步）
    useEffect(() => {
        ctx.seekPanRef.current = (panX, panY) => applyViewport(panX, panY, zoomRef.current);
        ctx.applyZoomRef.current = (deltaY, pivotX, pivotY) => {
            const oldZoom = zoomRef.current;
            const newZoom = clamp(oldZoom * (1 + -deltaY * zoomSpeed), minZoom, maxZoom);
            const factor = newZoom / oldZoom;
            applyViewport(
                pivotX - factor * (pivotX - panXRef.current),
                pivotY - factor * (pivotY - panYRef.current),
                newZoom,
            );
        };
        return () => {
            ctx.seekPanRef.current = null;
            ctx.applyZoomRef.current = null;
        };
    }, [zoomSpeed, minZoom, maxZoom]);

    // 受控模式同步 + 初始 viewMatrix 写入。
    // React effect 先子后父执行，此 effect 必先于 Canvas 的 mount effect（rAF 启动）运行，
    // 因此首帧 rAF tick 读到的 viewMatrix 已经是正确值，无需在渲染期写 ref。
    useEffect(() => {
        if (controlledZoom !== undefined) zoomRef.current = clamp(controlledZoom, minZoom, maxZoom);
        if (controlledPanX !== undefined) panXRef.current = controlledPanX;
        if (controlledPanY !== undefined) panYRef.current = controlledPanY;
        ctx.setViewMatrix(buildViewMatrix(panXRef.current, panYRef.current, zoomRef.current));
    }, [controlledZoom, controlledPanX, controlledPanY, minZoom, maxZoom]);

    // 订阅 wheel 事件实现缩放
    useEffect(() => {
        if (!zoomable) return;
        return ctx.subscribeCanvasEvent('wheel', (e: WheelEvent) => {
            const oldZoom = zoomRef.current;
            const delta = -e.deltaY * zoomSpeed;
            const newZoom = clamp(oldZoom * (1 + delta), minZoom, maxZoom);

            // 以鼠标位置（canvas 逻辑坐标）为缩放中心
            // 缩放前后，鼠标下的世界点保持不变：
            //   canvasMouse = oldZoom * worldPivot + oldPan
            //   panNew = canvasMouse - newZoom * worldPivot
            //          = canvasMouse - (newZoom / oldZoom) * (canvasMouse - oldPan)
            const invView = invertMat3(ctx.viewMatrixRef.current);
            if (!invView) return;

            // e.offsetX/Y 在 canvas 上是相对 canvas 左上角的坐标（未缩放）
            // 但为了与 toLogical 一致，这里直接用 offsetX/Y（canvas 逻辑坐标）
            const pivotX = (e as MouseEvent).offsetX;
            const pivotY = (e as MouseEvent).offsetY;

            const factor = newZoom / oldZoom;
            const newPanX = pivotX - factor * (pivotX - panXRef.current);
            const newPanY = pivotY - factor * (pivotY - panYRef.current);

            applyViewport(newPanX, newPanY, newZoom);
        });
    }, [zoomable, zoomSpeed, minZoom, maxZoom]);

    // 注册兜底 HitEntry 实现空白区域平移
    // zIndexPath 使用 MIN_SAFE_INTEGER 确保始终在最底层
    useEffect(() => {
        if (!pannable) return;
        const id = ctx.nextId();
        ctx.registerHit(id, {
            zIndexPath: [Number.MIN_SAFE_INTEGER],
            parentMatrix: identityMat3(),
            containsPoint: () => true,
            cursor: 'grab',
            onDragStart: () => {},
            onDrag: ({ canvasFrameDx, canvasFrameDy }) => {
                // canvasFrameDx 是 canvas 坐标增量，pan 直接累加
                const newPanX = panXRef.current + canvasFrameDx;
                const newPanY = panYRef.current + canvasFrameDy;
                applyViewport(newPanX, newPanY, zoomRef.current);
            },
            onDragEnd: () => {},
        });
        return () => ctx.unregisterHit(id);
    }, [pannable]);

    return (
        <CanvasContext value={ctx}>
            {children}
        </CanvasContext>
    );
}

export default Viewport;
