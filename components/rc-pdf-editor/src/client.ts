import { PdfEditorError, type PdfEditorRuntime, type PdfSource } from './types.js';
import type { PageInfo, PageTarget, Pixels, Request, RequestMap, Response, ResponseMap } from './protocol.js';

export interface RequestOptions { signal?: AbortSignal; priority?: number }
type PageRaster = Extract<ResponseMap['frame'], { image: Pixels }>;
interface PageJob { abort: AbortController; result: Promise<PageRaster>; users: number; settled: boolean; options: RequestOptions }
export function pageTarget(page: PageInfo, revision: number): PageTarget { return { page: page.index, revision, pageId: page.id, contentRevision: page.contentRevision }; }

export async function sourceBytes(source: PdfSource, signal?: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
    if (signal?.aborted) throw new PdfEditorError('cancelled', '操作已取消');
    if (source instanceof Uint8Array) return Uint8Array.from(source);
    if (source instanceof ArrayBuffer) return new Uint8Array(source.slice(0));
    if (source instanceof Blob) return new Uint8Array(await source.arrayBuffer());
    const request = typeof source === 'object' && 'url' in source ? source : { url: source, headers: undefined, credentials: undefined };
    try {
        const response = await fetch(request.url, { headers: request.headers, credentials: request.credentials, signal });
        if (!response.ok) throw new PdfEditorError('source', `无法加载文件（${response.status}）`);
        return new Uint8Array(await response.arrayBuffer());
    }
    catch (error) {
        if (signal?.aborted) throw new PdfEditorError('cancelled', '操作已取消', { cause: error });
        if (error instanceof PdfEditorError) throw error;
        throw new PdfEditorError('source', '无法加载文件', { cause: error });
    }
}

export function asError(error: unknown): PdfEditorError {
    if (error instanceof PdfEditorError) return error;
    if (error instanceof Error && error.name === 'AbortError') return new PdfEditorError('cancelled', '操作已取消');
    return new PdfEditorError('operation', error instanceof Error ? error.message : '操作失败', { cause: error });
}

/** 每个编辑器独占 Worker；结束实例立即拒绝请求并释放整个 WASM 堆。 */
export class PdfClient {
    private readonly worker: Worker;
    private readonly abort: AbortController = new AbortController();
    private nextId: number = 0;
    private closed: boolean = false;
    private activeId: number | undefined;
    private readonly queue: { id: number; priority: number; signal?: AbortSignal; send: () => void }[] = [];
    private readonly thumbnails: Map<string, Pixels> = new Map();
    private thumbnailBytes: number = 0;
    private readonly pages: Map<string, PageRaster> = new Map();
    private readonly pageJobs: Map<string, PageJob> = new Map();
    private pageBytes: number = 0;
    private documentEpoch: number = 0;
    private readonly pending: Map<number, {
        resolve: (value: ResponseMap[keyof ResponseMap]) => void;
        reject: (error: PdfEditorError) => void;
        cleanup: () => void;
    }> = new Map();
    readonly ready: Promise<void>;

    constructor(runtime: PdfEditorRuntime, private readonly onFailure?: (error: PdfEditorError) => void) {
        this.worker = new globalThis.Worker(runtime.workerUrl);
        this.worker.addEventListener('message', (event: MessageEvent<Response>) => {
            const response = event.data;
            const pending = this.pending.get(response.id);
            if (pending) {
                this.pending.delete(response.id); pending.cleanup();
                if (response.ok) pending.resolve(response.data);
                else pending.reject(new PdfEditorError(response.error.code, response.error.message));
            }
            if (this.activeId === response.id) this.activeId = undefined;
            // 让刚完成编辑的消费方先提交当前页任务，再处理低优先级缩略图。
            queueMicrotask(() => this.pump());
        });
        this.worker.addEventListener('error', event => {
            this.fail(new PdfEditorError('runtime', event.message || 'PDF Worker 加载失败'));
        });
        this.worker.addEventListener('messageerror', () => this.fail(new PdfEditorError('runtime', 'PDF Worker 消息解析失败')));
        this.ready = (async () => {
            const wasm = runtime.wasmBinary ? runtime.wasmBinary.slice(0) : (await sourceBytes(runtime.wasmUrl, this.abort.signal)).buffer;
            await this.send('init', { wasm });
        })();
        // 外部可能在资源请求结束前卸载；消费方仍可 await ready 获得原始错误。
        void this.ready.catch(error => this.fail(asError(error)));
    }

    private fail(error: PdfEditorError): void {
        if (this.closed) return;
        this.closed = true;
        this.abort.abort();
        this.worker.terminate();
        for (const pending of this.pending.values()) { pending.cleanup(); pending.reject(error); }
        this.pending.clear(); this.queue.length = 0; this.clearPages();
        this.onFailure?.(error);
    }

    private clearPages(): void {
        this.documentEpoch++;
        this.thumbnails.clear(); this.thumbnailBytes = 0;
        this.pages.clear(); this.pageBytes = 0;
        for (const job of this.pageJobs.values()) job.abort.abort();
        this.pageJobs.clear();
    }

    close(): void { this.fail(new PdfEditorError('cancelled', '编辑器已关闭')); }

    private pump(): void {
        if (this.closed || this.activeId !== undefined) return;
        this.queue.sort((a, b) => a.priority - b.priority || a.id - b.id);
        const next = this.queue.shift();
        if (next) { this.activeId = next.id; next.send(); }
    }

    private send<K extends keyof RequestMap>(type: K, data: RequestMap[K], { signal, priority = 0 }: RequestOptions = {}): Promise<ResponseMap[K]> {
        if (this.closed) return Promise.reject(new PdfEditorError('cancelled', '编辑器已关闭'));
        if (signal?.aborted) return Promise.reject(new PdfEditorError('cancelled', '渲染已取消'));
        const id = ++this.nextId;
        return new Promise<ResponseMap[K]>((resolve, reject) => {
            const cancel = () => {
                this.pending.delete(id);
                const index = this.queue.findIndex(item => item.id === id);
                if (index >= 0) this.queue.splice(index, 1);
                signal?.removeEventListener('abort', cancel);
                reject(new PdfEditorError('cancelled', '渲染已取消'));
            };
            signal?.addEventListener('abort', cancel, { once: true });
            this.pending.set(id, { resolve: value => resolve(value as ResponseMap[K]), reject, cleanup: () => signal?.removeEventListener('abort', cancel) });
            this.queue.push({ id, priority, signal, send: () => {
                try { this.worker.postMessage({ id, type, data } satisfies { id: number; type: Request['type']; data: RequestMap[K] }); }
                catch (error) {
                    this.activeId = undefined; this.pending.get(id)?.cleanup(); this.pending.delete(id);
                    reject(asError(error)); queueMicrotask(() => this.pump());
                }
            } });
            queueMicrotask(() => this.pump());
        });
    }

    async request<K extends keyof RequestMap>(type: K, data: RequestMap[K], options?: RequestOptions): Promise<ResponseMap[K]> {
        await this.ready;
        const result = await this.send(type, data, options);
        if (type === 'open' || type === 'closeDocument') this.clearPages();
        return result;
    }

    async thumbnail(page: PageInfo, revision: number, scale: number, signal: AbortSignal): Promise<Pixels> {
        if (this.closed) throw new PdfEditorError('cancelled', '编辑器已关闭');
        if (signal.aborted) throw new PdfEditorError('cancelled', '渲染已取消');
        const epoch = this.documentEpoch;
        const key = `${page.id}:${page.contentRevision}:${scale}`;
        const cached = this.thumbnails.get(key);
        if (cached) { this.thumbnails.delete(key); this.thumbnails.set(key, cached); return cached; }
        const pixels = await this.request('render', { ...pageTarget(page, revision), scale }, { priority: 2, signal });
        if (!this.closed && !signal.aborted && epoch === this.documentEpoch) {
            const previous = this.thumbnails.get(key);
            this.thumbnailBytes += pixels.rgba.byteLength - (previous?.rgba.byteLength ?? 0);
            this.thumbnails.set(key, pixels);
            while (this.thumbnailBytes > 16 * 1024 * 1024) {
                const first = this.thumbnails.keys().next().value;
                if (first === undefined) break;
                this.thumbnailBytes -= this.thumbnails.get(first)!.rgba.byteLength; this.thumbnails.delete(first);
            }
        }
        return pixels;
    }

    /** 背景预览与当前页共用完整帧；64 MiB / 24 页 LRU 限制长文档内存。 */
    async preview(page: PageInfo, revision: number, scale: number, signal: AbortSignal, priority = 2): Promise<PageRaster> {
        if (this.closed) throw new PdfEditorError('cancelled', '编辑器已关闭');
        if (signal.aborted) throw new PdfEditorError('cancelled', '渲染已取消');
        const key = `${page.id}:${page.contentRevision}:${scale}`;
        const cached = this.pages.get(key);
        if (cached) {
            this.pages.delete(key); this.pages.set(key, cached);
            return { ...cached, info: page };
        }
        let job = this.pageJobs.get(key);
        if (!job) {
            const abort = new AbortController(), epoch = this.documentEpoch;
            const options = { signal: abort.signal, priority };
            const result = this.request('frame', { ...pageTarget(page, revision), scale }, options).then(frame => {
                if (!frame.image) throw new PdfEditorError('runtime', '页面预览数据无效');
                if (!this.closed && !abort.signal.aborted && epoch === this.documentEpoch) {
                    this.pages.set(key, frame); this.pageBytes += frame.image.rgba.byteLength;
                    while (this.pageBytes > 64 * 1024 * 1024 || this.pages.size > 24) {
                        const first = this.pages.keys().next().value!;
                        this.pageBytes -= this.pages.get(first)!.image.rgba.byteLength; this.pages.delete(first);
                    }
                }
                return frame;
            });
            const created: PageJob = { abort, result, options, users: 0, settled: false };
            job = created; this.pageJobs.set(key, created);
            const finish = () => { created.settled = true; if (this.pageJobs.get(key) === created) this.pageJobs.delete(key); };
            void result.then(finish, finish);
        }
        // 预加载进入当前页后提升排队优先级；每位消费方拥有独立取消权。
        job.options.priority = Math.min(job.options.priority ?? priority, priority);
        const queued = this.queue.find(item => item.signal === job.abort.signal);
        if (queued) queued.priority = job.options.priority;
        const shared = job;
        shared.users++;
        return new Promise<PageRaster>((resolve, reject) => {
            let released = false;
            const release = () => {
                if (released) return;
                released = true; signal.removeEventListener('abort', cancel); shared.users--;
                if (!shared.users && !shared.settled) {
                    shared.abort.abort();
                    if (this.pageJobs.get(key) === shared) this.pageJobs.delete(key);
                }
            };
            const cancel = () => { release(); reject(new PdfEditorError('cancelled', '渲染已取消')); };
            signal.addEventListener('abort', cancel, { once: true });
            void shared.result.then(frame => { release(); resolve({ ...frame, info: page }); }, error => { release(); reject(error); });
        });
    }

    frame(page: PageInfo, revision: number, scale: number, object: number | undefined, signal: AbortSignal): Promise<ResponseMap['frame']> {
        if (object === undefined) return this.preview(page, revision, scale, signal, 1);
        return this.request('frame', { ...pageTarget(page, revision), scale, object }, { priority: 1, signal });
    }
}

export function bitmap(pixels: Pixels): Promise<ImageBitmap> {
    // Canvas 的纹理混合使用非预乘颜色；ImageBitmap 上传会忽略 WebGL 的像素解包设置。
    return globalThis.createImageBitmap(new globalThis.ImageData(pixels.rgba, pixels.width, pixels.height), { premultiplyAlpha: 'none' });
}

export async function decodeImage(file: Blob): Promise<Pixels> {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new PdfEditorError('source', '请选择 PNG、JPEG 或 WebP 图片');
    const image = await globalThis.createImageBitmap(file);
    try {
        if (image.width * image.height > 16 * 1024 * 1024) throw new PdfEditorError('source', '图片不能超过 1600 万像素');
        // 只将浏览器解码结果转成 PDFium 所需像素；编辑、缩放与预览由 rc-canvas 完成。
        const canvas = new OffscreenCanvas(image.width, image.height);
        const context = canvas.getContext('2d');
        if (!context) throw new PdfEditorError('runtime', '浏览器无法解码图片');
        context.drawImage(image, 0, 0);
        return { width: image.width, height: image.height, rgba: context.getImageData(0, 0, image.width, image.height).data };
    } finally { image.close(); }
}

export function downloadPdf(blob: Blob, name: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = name; link.click();
    // 下载导航在当前任务结束后读取 URL。
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
