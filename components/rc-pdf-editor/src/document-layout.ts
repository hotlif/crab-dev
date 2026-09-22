import type { PageInfo } from './protocol.js';

export interface PageLayout { page: PageInfo; x: number; y: number; width: number; height: number }
export interface DocumentLayout { pages: PageLayout[]; rows: number[]; width: number; height: number; zoom: number; gap: number }
export interface DocumentAnchor { pageId: number; x: number; y: number; viewportX: number; viewportY: number }

/** 记录鼠标下的 PDF 坐标，避免缩放时将固定页间距也按倍率缩放。 */
export function documentAnchor(layout: DocumentLayout, left: number, top: number, viewportX: number, viewportY: number): DocumentAnchor | undefined {
    const item = layout.pages[pageAtPosition(layout, top + viewportY, 0)];
    return item ? { pageId: item.page.id, x: (left + viewportX - item.x) / layout.zoom,
        y: (top + viewportY - item.y) / layout.zoom, viewportX, viewportY } : undefined;
}

export function anchorPosition(layout: DocumentLayout, anchor: DocumentAnchor): { left: number; top: number } | undefined {
    const item = layout.pages.find(value => value.page.id === anchor.pageId);
    return item ? { left: item.x + anchor.x * layout.zoom - anchor.viewportX,
        top: item.y + anchor.y * layout.zoom - anchor.viewportY } : undefined;
}

/** 连续文档的逻辑像素坐标；与 Virtual 的逻辑滚动位置保持一致。 */
export function layoutDocument(pages: PageInfo[], zoom: number, viewportWidth: number, gap: number): DocumentLayout {
    const width = pages.reduce((maximum, page) => Math.max(maximum, page.width * zoom + gap * 2), viewportWidth);
    let y = gap;
    const result = pages.map(page => {
        const width = page.width * zoom, height = page.height * zoom;
        const item = { page, x: 0, y, width, height };
        y += height + gap;
        return item;
    });
    result.forEach(item => { item.x = (width - item.width) / 2; });
    return { pages: result, rows: result.map(item => item.height + gap), width, height: y, zoom, gap };
}

/** 取视口中点所在的页；间隙归到最近的一页，长页滚动时仍保持当前页。 */
export function pageAtPosition(layout: DocumentLayout, top: number, viewportHeight: number): number {
    const middle = top + viewportHeight / 2;
    let low = 0, high = layout.pages.length - 1;
    while (low < high) {
        const index = Math.floor((low + high) / 2), item = layout.pages[index];
        if (middle > item.y + item.height + layout.gap / 2) low = index + 1;
        else high = index;
    }
    return low;
}
