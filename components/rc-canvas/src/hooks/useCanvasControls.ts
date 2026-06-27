import { use } from 'react';
import { CanvasContext } from '../context/canvas-context.js';

export interface CanvasControls {
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
    return {
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
