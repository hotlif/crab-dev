import { pageTarget, type PdfClient } from './client.js';
import type { PageInfo } from './protocol.js';
import { MAX_CAPTURE_EDGE, MAX_CAPTURE_PIXELS, regionRaster } from './regions.js';
import { PdfEditorError, type PdfRegionImage, type PdfRegionSelection } from './types.js';

export async function captureRegionImage(client: PdfClient, selection: PdfRegionSelection, pages: PageInfo[], scale: number, signal: AbortSignal): Promise<PdfRegionImage> {
    const check = () => { if (signal.aborted) throw new PdfEditorError('cancelled', '区域采集已取消'); };
    check();
    const pageWidth = Math.max(...pages.map(page => page.width));
    const plans = selection.regions.map(region => {
        const page = pages[region.pageIndex], raster = regionRaster(page, region, scale);
        return { region, page, raster, left: (pageWidth - page.width) / 2 + raster.sourceBounds.x };
    });
    const origin = Math.min(...plans.map(plan => plan.left));
    let height = 0, width = 0;
    const parts = plans.map(plan => {
        const x = Math.round((plan.left - origin) * scale), y = height;
        height += plan.raster.height; width = Math.max(width, x + plan.raster.width);
        return Object.freeze({ pageIndex: plan.region.pageIndex, sourceBounds: plan.raster.sourceBounds,
            imageBounds: Object.freeze({ x, y, width: plan.raster.width, height: plan.raster.height }) });
    });
    if (width > MAX_CAPTURE_EDGE || height > MAX_CAPTURE_EDGE || width * height > MAX_CAPTURE_PIXELS) throw new PdfEditorError('operation', '拼接图像过大，请缩小选区或采样倍率');
    const canvas = new OffscreenCanvas(width, height), context = canvas.getContext('2d');
    if (!context) throw new PdfEditorError('unsupported', '浏览器不支持区域图像导出');
    // OCR 输入保留白色纸张背景；宽度不同的页面按连续视图居中关系对齐。
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, width, height);
    for (let index = 0; index < plans.length; index++) {
        check();
        const { page, region } = plans[index];
        const pixels = await client.request('region', { ...pageTarget(page, selection.revision), bounds: region, scale }, { signal });
        check();
        context.putImageData(new globalThis.ImageData(pixels.rgba, pixels.width, pixels.height), parts[index].imageBounds.x, parts[index].imageBounds.y);
    }
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    check();
    return Object.freeze({ selection, blob, width, height, parts: Object.freeze(parts) });
}
