import { PdfEngine } from './engine.js';
import { PdfEditorError } from './types.js';
import type { Request, Response, ResponseMap } from './protocol.js';

// Worker scope uses the shared DOM EventTarget types; no browser main-thread code runs here.
const scope = globalThis;
let engine: PdfEngine | undefined;
let queue = Promise.resolve();

async function dispatch(request: Request): Promise<ResponseMap[keyof ResponseMap]> {
    if (request.type === 'init') {
        engine?.dispose();
        engine = await PdfEngine.create(request.data.wasm);
        return;
    }
    if (!engine) throw new PdfEditorError('runtime', 'PDF 引擎尚未初始化');
    switch (request.type) {
        case 'open': return engine.open(request.data.bytes, request.data.password);
        case 'closeDocument': engine.closeDocument(); return;
        case 'fonts': engine.registerFonts(request.data.fonts); return;
        case 'page': return engine.page(engine.resolvePage(request.data));
        case 'render': return engine.render(engine.resolvePage(request.data), request.data.scale);
        case 'region': return engine.renderRegion(engine.resolvePage(request.data), request.data.bounds, request.data.scale);
        case 'layers': return engine.layers(engine.resolvePage(request.data), request.data.object, request.data.scale);
        case 'frame': {
            const index = engine.resolvePage(request.data), page = engine.page(index);
            const selected = page.objects.find(object => object.index === request.data.object);
            return selected && !selected.reason ? { ...page, layers: engine.layers(index, selected.index, request.data.scale) }
                : { ...page, image: engine.render(index, request.data.scale) };
        }
        case 'edit': engine.assertRevision(request.data.revision); return engine.edit(request.data.command);
        case 'undo': return engine.undo();
        case 'redo': return engine.redo();
        case 'export': return engine.export();
        case 'extract': return engine.extract(request.data.pages);
        case 'saved': return engine.markSaved(request.data.revision);
    }
}

scope.addEventListener('message', (event: MessageEvent<Request>) => {
    queue = queue.then(async () => {
        let response: Response;
        try { response = { id: event.data.id, ok: true, data: await dispatch(event.data) }; }
        catch (error) { response = { id: event.data.id, ok: false, error: { code: error instanceof PdfEditorError ? error.code : 'operation', message: error instanceof Error ? error.message : 'PDF 操作失败' } }; }
        // 渲染像素是独立分配的临时数组，转移所有权避免大页 RGBA 在主线程复制。
        // 文档与历史数据仍保留原有所有权，不参与 transfer。
        const transfer: ArrayBuffer[] = [];
        if (response.ok) {
            const data = response.data;
            if (data && 'rgba' in data) transfer.push(data.rgba.buffer);
            else if (data && 'below' in data) transfer.push(data.below.rgba.buffer, data.selected.rgba.buffer, data.above.rgba.buffer);
            else if (data && 'image' in data && data.image) transfer.push(data.image.rgba.buffer);
            else if (data && 'layers' in data && data.layers) transfer.push(data.layers.below.rgba.buffer, data.layers.selected.rgba.buffer, data.layers.above.rgba.buffer);
        }
        scope.postMessage(response, { transfer });
    });
});
