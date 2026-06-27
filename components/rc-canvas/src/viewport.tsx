import { type ReactNode, use, useEffect, useRef } from 'react';
import { CanvasContext } from './context/canvas-context.js';
import { identityMat3, invertMat3, applyMat3 } from './math/matrix.js';

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
    /**
     * 交互模式（默认 'pan'）：
     * - 'pan'：拖拽背景平移视口；
     * - 'select'：拖拽背景绘制矩形选择框，松手后调用 onSelect。
     */
    mode?: 'pan' | 'select';
    /** 框选结束时触发，参数为选中的图元 id 列表（与 DrawCommand id 一致） */
    onSelect?: (ids: number[]) => void;
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
    mode = 'pan',
    onSelect,
}: ViewportProps) {
    const ctx = use(CanvasContext);

    // 可变实例状态 ref（非受控内部状态）
    const panXRef = useRef(controlledPanX ?? 0);
    const panYRef = useRef(controlledPanY ?? 0);
    const zoomRef = useRef(controlledZoom ?? 1);

    // latest-ref：供 HitEntry 闭包读取最新 mode / onSelect，避免重新注册 HitEntry
    // 注：渲染期写 ref 违反 Rules of React，使编译器降级——是 latest-ref 的有意取舍
    const modeRef = useRef(mode);
    modeRef.current = mode;
    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;

    // 可变实例状态 ref：框选覆盖层 div（imperatively created）
    const selectionOverlayRef = useRef<HTMLDivElement | null>(null);
    // 可变实例状态 ref：框选拖拽起点（canvas 坐标）
    const selectionStartRef = useRef<{ x: number; y: number } | null>(null);

    const applyViewport = (newPanX: number, newPanY: number, newZoom: number) => {
        panXRef.current = newPanX;
        panYRef.current = newPanY;
        zoomRef.current = newZoom;
        ctx.setViewMatrix(buildViewMatrix(newPanX, newPanY, newZoom));
        onViewportChange?.({ zoom: newZoom, panX: newPanX, panY: newPanY });
    };

    // 向 context 注册 seekPan / applyZoom / fitView 回调
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
        ctx.fitViewRef.current = (padding = 40) => {
            const commands = ctx.commandMapRef.current;
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const cmd of commands.values()) {
                const aabb = cmd.aabb;
                if (!aabb) continue;
                minX = Math.min(minX, aabb.minX);
                minY = Math.min(minY, aabb.minY);
                maxX = Math.max(maxX, aabb.maxX);
                maxY = Math.max(maxY, aabb.maxY);
            }
            if (!isFinite(minX)) return;
            const { width: canvasW, height: canvasH } = ctx.canvasSizeRef.current;
            const contentW = maxX - minX + 2 * padding;
            const contentH = maxY - minY + 2 * padding;
            if (contentW <= 0 || contentH <= 0) return;
            const newZoom = clamp(
                Math.min(canvasW / contentW, canvasH / contentH),
                minZoom,
                maxZoom,
            );
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            applyViewport(canvasW / 2 - newZoom * cx, canvasH / 2 - newZoom * cy, newZoom);
        };
        return () => {
            ctx.seekPanRef.current = null;
            ctx.applyZoomRef.current = null;
            ctx.fitViewRef.current = null;
        };
    }, [zoomSpeed, minZoom, maxZoom]);

    // 受控模式同步 + 初始 viewMatrix 写入
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
            const pivotX = (e as MouseEvent).offsetX;
            const pivotY = (e as MouseEvent).offsetY;
            const factor = newZoom / oldZoom;
            applyViewport(
                pivotX - factor * (pivotX - panXRef.current),
                pivotY - factor * (pivotY - panYRef.current),
                newZoom,
            );
        });
    }, [zoomable, zoomSpeed, minZoom, maxZoom]);

    // 框选覆盖层 div：imperatively created/destroyed，避免 portal 首次渲染时机问题
    useEffect(() => {
        if (mode !== 'select') return;
        const container = ctx.containerRef.current;
        if (!container) return;
        const div = document.createElement('div');
        div.style.cssText = [
            'display:none',
            'position:absolute',
            'border:1.5px dashed #4a9eff',
            'background:rgba(74,158,255,0.08)',
            'pointer-events:none',
            'box-sizing:border-box',
        ].join(';');
        container.appendChild(div);
        selectionOverlayRef.current = div;
        return () => {
            if (container.contains(div)) container.removeChild(div);
            selectionOverlayRef.current = null;
        };
    }, [mode]);

    // 兜底 HitEntry：平移（pan）或框选（select）
    useEffect(() => {
        if (!pannable && mode !== 'select') return;
        const id = ctx.nextId();
        ctx.registerHit(id, {
            zIndexPath: [Number.MIN_SAFE_INTEGER],
            parentMatrix: identityMat3(),
            containsPoint: () => true,
            cursor: mode === 'select' ? 'crosshair' : 'grab',
            onDragStart: ({ canvasX, canvasY }) => {
                if (modeRef.current !== 'select') return;
                selectionStartRef.current = { x: canvasX, y: canvasY };
                const div = selectionOverlayRef.current;
                if (!div) return;
                div.style.display = 'block';
                div.style.left = `${canvasX}px`;
                div.style.top = `${canvasY}px`;
                div.style.width = '0';
                div.style.height = '0';
            },
            onDrag: ({ canvasX, canvasY, canvasFrameDx, canvasFrameDy }) => {
                if (modeRef.current === 'select') {
                    const start = selectionStartRef.current;
                    const div = selectionOverlayRef.current;
                    if (!start || !div) return;
                    const x = Math.min(canvasX, start.x);
                    const y = Math.min(canvasY, start.y);
                    div.style.left = `${x}px`;
                    div.style.top = `${y}px`;
                    div.style.width = `${Math.abs(canvasX - start.x)}px`;
                    div.style.height = `${Math.abs(canvasY - start.y)}px`;
                } else if (pannable) {
                    applyViewport(
                        panXRef.current + canvasFrameDx,
                        panYRef.current + canvasFrameDy,
                        zoomRef.current,
                    );
                }
            },
            onDragEnd: ({ canvasX, canvasY }) => {
                if (modeRef.current !== 'select') return;
                const start = selectionStartRef.current;
                const div = selectionOverlayRef.current;
                if (div) div.style.display = 'none';
                selectionStartRef.current = null;
                if (!start || !onSelectRef.current) return;
                const invView = invertMat3(ctx.viewMatrixRef.current);
                if (!invView) return;
                const rx1 = Math.min(canvasX, start.x), ry1 = Math.min(canvasY, start.y);
                const rx2 = Math.max(canvasX, start.x), ry2 = Math.max(canvasY, start.y);
                const [wx1, wy1] = applyMat3(invView, rx1, ry1);
                const [wx2, wy2] = applyMat3(invView, rx2, ry2);
                const selected: number[] = [];
                for (const cmd of ctx.commandMapRef.current.values()) {
                    if (!cmd.aabb) continue;
                    if (cmd.aabb.maxX >= wx1 && cmd.aabb.minX <= wx2 &&
                        cmd.aabb.maxY >= wy1 && cmd.aabb.minY <= wy2) {
                        selected.push(cmd.id);
                    }
                }
                onSelectRef.current(selected);
            },
        });
        return () => ctx.unregisterHit(id);
    }, [pannable, mode]);

    return (
        <CanvasContext value={ctx}>
            {children}
        </CanvasContext>
    );
}

export default Viewport;
