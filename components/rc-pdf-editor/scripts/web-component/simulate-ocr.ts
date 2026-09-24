import type { PdfRegionImage } from '../../src/types.js';

/** 演示替身：只模拟请求延迟与取消，不上传图片，不声称识别了输入内容。 */
export async function simulateOcr(image: PdfRegionImage, signal: AbortSignal): Promise<string> {
    signal.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
        const cancel = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => { signal.removeEventListener('abort', cancel); resolve(); }, 900);
        signal.addEventListener('abort', cancel, { once: true });
    });
    signal.throwIfAborted();
    return [
        '【模拟数据 · 非真实识别结果】',
        '订单号：CRAB-2026-001',
        '客户：Example Company',
        '金额：CNY 1,280.00',
        '',
        `输入图像：${image.width} × ${image.height} px`,
        `截图页码：${image.parts.map(part => part.pageIndex + 1).join('、')}`,
        '以上字段为固定测试数据，与所加载 PDF 或框选内容无关。',
    ].join('\n');
}
