import type { ViewportState } from './viewport.js';
import type { Pt, Rect } from './routing/index.js';

export interface FitBoundsOptions {
    /** 留白使用屏幕 CSS 像素，不随缩放变化。 */
    padding?: number | { top: number; right: number; bottom: number; left: number };
    minZoom?: number;
    maxZoom?: number;
}

/** 画布局部 CSS 坐标转为世界坐标。 */
export function screenToWorld(point: Pt, viewport: ViewportState): Pt {
    return { x: (point.x - viewport.panX) / viewport.zoom, y: (point.y - viewport.panY) / viewport.zoom };
}

/** 世界坐标转为画布局部 CSS 坐标。 */
export function worldToScreen(point: Pt, viewport: ViewportState): Pt {
    return { x: point.x * viewport.zoom + viewport.panX, y: point.y * viewport.zoom + viewport.panY };
}

/** 保持 pivot 对应的世界坐标不动；pivot 使用画布局部 CSS 坐标。 */
export function zoomViewport(viewport: ViewportState, zoom: number, pivot: Pt): ViewportState {
    if (!Number.isFinite(zoom) || zoom <= 0) return viewport;
    const point = screenToWorld(pivot, viewport);
    return { zoom, panX: pivot.x - point.x * zoom, panY: pivot.y - point.y * zoom };
}

/** 计算适合指定内容边界的视口；无有效空间时返回 null，不改变当前视口。 */
export function getViewportForBounds(bounds: Rect, size: { width: number; height: number }, options?: FitBoundsOptions): ViewportState | null {
    const { padding = 40, minZoom = 0.05, maxZoom = 20 } = options ?? {};
    const p = typeof padding === 'number' ? { top: padding, right: padding, bottom: padding, left: padding } : padding;
    if (![bounds.x, bounds.y, bounds.width, bounds.height, size.width, size.height, ...Object.values(p), minZoom, maxZoom].every(Number.isFinite)
        || bounds.width < 0 || bounds.height < 0 || minZoom <= 0 || maxZoom < minZoom || Object.values(p).some(value => value < 0)) return null;
    const width = size.width - p.left - p.right, height = size.height - p.top - p.bottom;
    if (width <= 0 || height <= 0) return null;
    const zoom = Math.max(minZoom, Math.min(maxZoom, width / Math.max(1, bounds.width), height / Math.max(1, bounds.height)));
    return {
        zoom,
        panX: p.left + width / 2 - (bounds.x + bounds.width / 2) * zoom,
        panY: p.top + height / 2 - (bounds.y + bounds.height / 2) * zoom,
    };
}
