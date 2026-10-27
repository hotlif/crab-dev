import type { PdfPageDescriptor, PdfPageRegion, PdfRegionBounds } from './types.js';
import { pdfError } from './pdf-messages.js';
import type { DocumentLayout } from './document-layout.js';

export const MAX_CAPTURE_PIXELS = 16_777_216;
export const MAX_CAPTURE_EDGE = 8192;

export function validateRegions(regions: readonly PdfPageRegion[], pages: readonly PdfPageDescriptor[]): readonly PdfPageRegion[] {
    if (!Array.isArray(regions) || !regions.length || regions.length > 32) throw pdfError('operation', 'region.count');
    const seen = new Set<number>();
    const result = regions.map(region => {
        const page = pages[region.pageIndex];
        if (!Number.isInteger(region.pageIndex) || !page || seen.has(region.pageIndex)) throw pdfError('operation', 'region.page');
        seen.add(region.pageIndex);
        if (![region.x, region.y, region.width, region.height].every(Number.isFinite) || region.x < 0 || region.y < 0 || region.x >= page.width || region.y >= page.height ||
            region.width <= 0 || region.height <= 0 || region.x + region.width > page.width + 1e-7 || region.y + region.height > page.height + 1e-7) {
            throw pdfError('operation', 'region.bounds');
        }
        return Object.freeze({ pageIndex: region.pageIndex, x: region.x, y: region.y,
            width: Math.min(region.width, page.width - region.x), height: Math.min(region.height, page.height - region.y) });
    });
    return Object.freeze(result.sort((a, b) => a.pageIndex - b.pageIndex));
}

/** 连续视图坐标转为逐页 pt 坐标；间隙不产生区域，支持反向拖动。 */
export function regionsInRectangle(layout: DocumentLayout, start: { x: number; y: number }, end: { x: number; y: number }): PdfPageRegion[] {
    const left = Math.min(start.x, end.x), top = Math.min(start.y, end.y), right = Math.max(start.x, end.x), bottom = Math.max(start.y, end.y);
    return layout.pages.flatMap(item => {
        const x = Math.max(left, item.x), y = Math.max(top, item.y), r = Math.min(right, item.x + item.width), b = Math.min(bottom, item.y + item.height);
        return r > x && b > y ? [{ pageIndex: item.page.index, x: (x - item.x) / layout.zoom, y: (y - item.y) / layout.zoom,
            width: (r - x) / layout.zoom, height: (b - y) / layout.zoom }] : [];
    });
}

/** 与 PDFium 的整数目标尺寸一致，返回用于坐标回映的实际页面边界。 */
export function regionRaster(page: Pick<PdfPageDescriptor, 'width' | 'height'>, bounds: PdfRegionBounds, scale: number) {
    if (!Number.isFinite(scale) || scale < 0.25 || scale > 8) throw pdfError('operation', 'region.scale');
    const pageWidth = Math.ceil(page.width * scale), pageHeight = Math.ceil(page.height * scale);
    if (!Number.isSafeInteger(pageWidth) || !Number.isSafeInteger(pageHeight) || Math.max(pageWidth, pageHeight) > 2147483647) throw pdfError('operation', 'region.page-size');
    const scaleX = pageWidth / page.width, scaleY = pageHeight / page.height;
    const left = Math.floor(bounds.x * scaleX), top = Math.floor(bounds.y * scaleY);
    const width = Math.min(pageWidth, Math.ceil((bounds.x + bounds.width) * scaleX)) - left;
    const height = Math.min(pageHeight, Math.ceil((bounds.y + bounds.height) * scaleY)) - top;
    if (width < 1 || height < 1 || width > MAX_CAPTURE_EDGE || height > MAX_CAPTURE_EDGE || width * height > MAX_CAPTURE_PIXELS) {
        throw pdfError('operation', 'region.image-budget');
    }
    return { pageWidth, pageHeight, left, top, width, height,
        sourceBounds: Object.freeze({ x: left / scaleX, y: top / scaleY, width: width / scaleX, height: height / scaleY }) };
}
