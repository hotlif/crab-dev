import { PdfEditorError, type PdfEditorPlugin, type PdfRegionOcrPluginOptions } from '../types.js';

/** OCR 只是区域服务的一个客户端；识别引擎及结果类型由宿主提供。 */
export function createRegionOcrPlugin<Result>({ id, label = '区域 OCR', scale = 2, recognize, onResult }: PdfRegionOcrPluginOptions<Result>): PdfEditorPlugin {
    return {
        id,
        actions: [{
            id: 'recognize-region', label, placement: 'tools',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 0h2v6h-6v-2h4v-4zM7 8h10v2h-4v7h-2v-7H7V8z" /></svg>,
            async onSelect({ getEditor, signal }) {
                const check = () => { if (signal.aborted) throw new PdfEditorError('cancelled', '区域识别已取消'); };
                const selection = await getEditor().selectRegion({ signal });
                check();
                const image = await getEditor().captureRegion(selection, { scale, signal });
                check();
                const result = await recognize(image, { signal });
                check(); await onResult(result, image, { signal });
            },
        }],
    };
}
