import { use } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import type { ViewportState } from '../viewport.js';
import type { Pt, Rect } from '../routing/index.js';
import type { FitBoundsOptions } from '../viewport-utils.js';

export interface CanvasControls {
    /** 读取当前实际视口。 */
    getViewport: () => ViewportState;
    /** 设置视口；缩放遵循 Viewport 的 minZoom / maxZoom。 */
    setViewport: (viewport: ViewportState) => void;
    /** 缩放到指定倍率，默认以画布中心为支点。 */
    zoomTo: (zoom: number, pivot?: Pt) => void;
    /** 显示指定世界坐标边界，padding 使用屏幕 CSS 像素。 */
    fitBounds: (bounds: Rect, options?: FitBoundsOptions) => void;
    /** 将指定世界坐标移到视口中心，保留缩放。 */
    centerOn: (point: Pt) => void;
    /** 将视口调整为恰好显示所有图元的最佳状态，padding 为边缘留白（world px，默认 40） */
    fitView: (padding?: number) => void;
    /** 将当前帧导出为 PNG DataURL（base64） */
    exportPNG: () => string;
    /** 以 canvas 中心为缩放点，放大约 10% */
    zoomIn: () => void;
    /** 以 canvas 中心为缩放点，缩小约 10% */
    zoomOut: () => void;
}

/**
 * 在 Canvas 子树内调用，获取视口控制方法。
 * 必须在 <Canvas> 组件内使用；通常与 <Viewport> 搭配（fitView / zoomIn / zoomOut 依赖 Viewport 注入的回调）。
 */
export function useCanvasControls(): CanvasControls {
    const ctx = use(CanvasContext);
    const getViewport = (): ViewportState => ctx.viewportControlsRef.current?.getViewport() ?? { zoom: 1, panX: 0, panY: 0 };
    return {
        getViewport,
        setViewport(viewport) {
            ctx.viewportControlsRef.current?.setViewport(viewport);
        },
        zoomTo(zoom, pivot) {
            const { width, height } = ctx.canvasSizeRef.current;
            ctx.viewportControlsRef.current?.zoomTo(zoom, pivot ?? { x: width / 2, y: height / 2 });
        },
        fitBounds(bounds, options) {
            ctx.viewportControlsRef.current?.fitBounds(bounds, options);
        },
        centerOn(point) {
            const { width, height } = ctx.canvasSizeRef.current;
            const viewport = getViewport();
            ctx.viewportControlsRef.current?.setViewport({ ...viewport, panX: width / 2 - point.x * viewport.zoom, panY: height / 2 - point.y * viewport.zoom });
        },
        fitView(padding?: number) {
            ctx.fitViewRef.current?.(padding);
        },
        exportPNG() {
            return ctx.exportPNG();
        },
        zoomIn() {
            const { width, height } = ctx.canvasSizeRef.current;
            // deltaY = -100 对应 Viewport 内 wheel 的一格向上滚动 → 放大
            ctx.applyZoomRef.current?.(-100, width / 2, height / 2);
        },
        zoomOut() {
            const { width, height } = ctx.canvasSizeRef.current;
            // deltaY = 100 对应 Viewport 内 wheel 的一格向下滚动 → 缩小
            ctx.applyZoomRef.current?.(100, width / 2, height / 2);
        },
    };
}
