import { init, type WrappedPdfiumModule } from '@embedpdf/pdfium';
import { PdfEditorError } from './types.js';
import type { PdfRegionBounds } from './types.js';
import { regionRaster, validateRegions } from './regions.js';
import type { DocumentInfo, Drawing, EditCommand, ObjectPatch, PageInfo, PageTarget, PdfObject, Pixels, Rgba, ShapeKind, ShapeStyle } from './protocol.js';
import { inverse, multiply, objectDelta, pageMatrix, transformBounds, type Matrix } from './geometry.js';
import { validateFont } from './font.js';
import { arrowWings, canFill, drawable, drawingBounds, isShapeKind } from './drawing.js';

const SHAPE_MARK = 'CrabPdfEditor.v1.';

interface DocumentHandle { handle: number; buffer: number; fonts: { handle: number; buffer: number }[] }
interface PageVersion { id: number; contentRevision: number }
interface Snapshot { bytes: Uint8Array<ArrayBuffer>; password: string; revision: number; pages: PageVersion[] }

function check(value: unknown, message: string): asserts value {
    if (!value) throw new PdfEditorError('operation', message);
}

/** 仅在 Worker 或测试中实例化。所有 PDF 指针都由该实例持有。 */
export class PdfEngine {
    private doc: DocumentHandle | undefined;
    private current: Snapshot | undefined;
    private past: Snapshot[] = [];
    private future: Snapshot[] = [];
    private nextRevision: number = 0;
    private nextPageId: number = 0;
    private savedRevision: number = 0;
    private readonly fonts: Map<string, Uint8Array<ArrayBuffer>> = new Map();

    private constructor(private readonly pdf: WrappedPdfiumModule) {}

    static async create(wasmBinary: ArrayBuffer): Promise<PdfEngine> {
        // 始终提供二进制；覆盖 Emscripten 的 import.meta.url 回退，兼容打包与 Blob Worker。
        const pdf = await init({ wasmBinary, locateFile: (path: string) => path });
        pdf.PDFiumExt_Init();
        return new PdfEngine(pdf);
    }

    private alloc(bytes: Uint8Array): number {
        const ptr = this.pdf.pdfium.wasmExports.malloc(Math.max(1, bytes.byteLength));
        check(ptr, 'PDF 引擎内存不足');
        this.heap().set(bytes, ptr);
        return ptr;
    }

    private free(ptr: number): void { this.pdf.pdfium.wasmExports.free(ptr); }

    // PDFium 2.15.1 运行时提供 HEAPU8，但其声明遗漏该成员；在边界验证并收窄。
    private heap(): Uint8Array {
        const module = this.pdf.pdfium;
        if (!('HEAPU8' in module) || !(module.HEAPU8 instanceof Uint8Array)) throw new PdfEditorError('runtime', 'PDFium 未提供有效的内存视图');
        return module.HEAPU8;
    }

    private view(): DataView { return new DataView(this.heap().buffer); }

    private load(bytes: Uint8Array, password: string): DocumentHandle {
        const buffer = this.alloc(bytes);
        const handle = this.pdf.FPDF_LoadMemDocument(buffer, bytes.byteLength, password);
        if (!handle) {
            this.free(buffer);
            const code = this.pdf.FPDF_GetLastError();
            throw new PdfEditorError(code === 4 ? 'password' : 'document', code === 4 ? '请输入正确的 PDF 密码' : '无法打开 PDF，文件可能已损坏或格式不受支持');
        }
        if (this.pdf.FPDF_GetPageCount(handle) < 1) {
            this.pdf.FPDF_CloseDocument(handle);
            this.free(buffer);
            throw new PdfEditorError('document', 'PDF 至少需要一页');
        }
        return { handle, buffer, fonts: [] };
    }

    private close(doc: DocumentHandle): void {
        for (const font of doc.fonts) this.pdf.FPDFFont_Close(font.handle);
        this.pdf.FPDF_CloseDocument(doc.handle);
        for (const font of doc.fonts) this.free(font.buffer);
        this.free(doc.buffer);
    }

    closeDocument(): void {
        if (this.doc) this.close(this.doc);
        this.doc = undefined;
        this.current = undefined;
        this.past = [];
        this.future = [];
    }

    dispose(): void {
        this.closeDocument();
        this.fonts.clear();
        this.pdf.FPDF_DestroyLibrary();
    }

    open(bytes: Uint8Array<ArrayBuffer>, password = ''): DocumentInfo {
        const copy = bytes.slice();
        const next = this.load(copy, password);
        if (this.doc) this.close(this.doc);
        this.doc = next;
        const revision = ++this.nextRevision;
        this.current = { bytes: copy, password, revision, pages: Array.from({ length: this.pdf.FPDF_GetPageCount(next.handle) }, () => ({ id: ++this.nextPageId, contentRevision: revision })) };
        this.savedRevision = this.current.revision;
        this.past = [];
        this.future = [];
        return this.info();
    }

    registerFonts(fonts: { id: string; data: Uint8Array<ArrayBuffer> }[]): void {
        const next = new Map<string, Uint8Array<ArrayBuffer>>();
        for (const font of fonts) {
            if (!font.id || next.has(font.id)) throw new PdfEditorError('font', '字体 id 必须非空且唯一');
            validateFont(font.data);
            next.set(font.id, font.data.slice());
        }
        this.fonts.clear();
        for (const [id, data] of next) this.fonts.set(id, data);
    }

    private document(): DocumentHandle {
        if (!this.doc) throw new PdfEditorError('document', '请先打开 PDF');
        return this.doc;
    }

    assertRevision(revision: number): void {
        if (revision !== this.current?.revision) throw new PdfEditorError('cancelled', '文档已更新，请重试当前操作');
    }

    /** 排序后按稳定标识定位；只要该页内容未变，旧全局版本的只读任务仍然有效。 */
    resolvePage(target: PageTarget): number {
        if (target.pageId === undefined || target.contentRevision === undefined) { this.assertRevision(target.revision); return target.page; }
        const index = this.current?.pages.findIndex(page => page.id === target.pageId && page.contentRevision === target.contentRevision) ?? -1;
        if (index < 0) throw new PdfEditorError('cancelled', '页面已更新');
        return index;
    }

    private withPage<T>(doc: DocumentHandle, index: number, read: (page: number) => T): T {
        if (!Number.isInteger(index) || index < 0 || index >= this.pdf.FPDF_GetPageCount(doc.handle)) {
            throw new PdfEditorError('operation', '页码超出范围');
        }
        const page = this.pdf.FPDF_LoadPage(doc.handle, index);
        check(page, '无法加载页面');
        try { return read(page); } finally { this.pdf.FPDF_ClosePage(page); }
    }

    private pageInfo(page: number, index: number): PageInfo {
        return { ...this.current!.pages[index], index, width: this.pdf.FPDF_GetPageWidthF(page), height: this.pdf.FPDF_GetPageHeightF(page), rotation: this.pdf.FPDFPage_GetRotation(page) };
    }

    private editable(): boolean {
        const doc = this.document();
        return !this.pdf.EPDF_IsEncrypted(doc.handle) || this.pdf.EPDF_IsOwnerUnlocked(doc.handle) || (this.pdf.FPDF_GetDocPermissions(doc.handle) & 8) !== 0;
    }

    info(): DocumentInfo {
        const doc = this.document();
        const pages: PageInfo[] = [];
        for (let i = 0; i < this.pdf.FPDF_GetPageCount(doc.handle); i++) pages.push(this.withPage(doc, i, page => this.pageInfo(page, i)));
        return { pages, revision: this.current!.revision, dirty: this.current!.revision !== this.savedRevision,
            canUndo: this.past.length > 0, canRedo: this.future.length > 0, editable: this.editable() };
    }

    markSaved(revision: number): DocumentInfo { this.savedRevision = revision; return this.info(); }

    private matrix(page: number): Matrix {
        const ptr = this.alloc(new Uint8Array(32));
        try {
            check(this.pdf.FPDFPage_GetMediaBox(page, ptr, ptr + 4, ptr + 8, ptr + 12), '无法读取页面尺寸');
            const v = this.view();
            const box: [number, number, number, number] = [0, 4, 8, 12].map(n => v.getFloat32(ptr + n, true)) as [number, number, number, number];
            if (this.pdf.FPDFPage_GetCropBox(page, ptr + 16, ptr + 20, ptr + 24, ptr + 28)) {
                box[0] = Math.max(box[0], v.getFloat32(ptr + 16, true));
                box[1] = Math.max(box[1], v.getFloat32(ptr + 20, true));
                box[2] = Math.min(box[2], v.getFloat32(ptr + 24, true));
                box[3] = Math.min(box[3], v.getFloat32(ptr + 28, true));
            }
            return pageMatrix(box, this.pdf.FPDFPage_GetRotation(page));
        } finally { this.free(ptr); }
    }

    private readObject(page: number, index: number, textPage: number): PdfObject {
        const obj = this.pdf.FPDFPage_GetObject(page, index);
        const ptr = this.alloc(new Uint8Array(32));
        try {
            const type = this.pdf.FPDFPageObj_GetType(obj);
            const bounded = this.pdf.FPDFPageObj_GetBounds(obj, ptr, ptr + 4, ptr + 8, ptr + 12);
            const v = this.view();
            const bounds = bounded ? transformBounds(this.matrix(page), v.getFloat32(ptr, true), v.getFloat32(ptr + 4, true), v.getFloat32(ptr + 8, true), v.getFloat32(ptr + 12, true)) : { x: 0, y: 0, width: 0, height: 0 };
            const result: PdfObject = { index, kind: type === 1 ? 'text' : type === 3 ? 'image' : 'unsupported', bounds };
            if (type === 2) {
                const shape = this.shapeKind(obj);
                if (shape) {
                    result.kind = 'shape'; result.shape = shape;
                    check(this.pdf.FPDFPageObj_GetStrokeWidth(obj, ptr), '无法读取图形线宽');
                    const strokeWidth = this.view().getFloat32(ptr, true);
                    check(this.pdf.FPDFPath_GetDrawMode(obj, ptr, ptr + 4), '无法读取图形样式');
                    const filled = this.view().getInt32(ptr, true) !== 0;
                    check(this.pdf.FPDFPageObj_GetStrokeColor(obj, ptr, ptr + 4, ptr + 8, ptr + 12), '无法读取描边颜色');
                    const stroke = [0, 4, 8, 12].map(n => this.view().getUint32(ptr + n, true)) as Rgba;
                    let fill: Rgba | null = null;
                    if (filled) {
                        check(this.pdf.FPDFPageObj_GetFillColor(obj, ptr, ptr + 4, ptr + 8, ptr + 12), '无法读取填充颜色');
                        fill = [0, 4, 8, 12].map(n => this.view().getUint32(ptr + n, true)) as Rgba;
                    }
                    result.shapeStyle = { stroke, strokeWidth, fill, dashed: this.pdf.FPDFPageObj_GetDashCount(obj) > 0 };
                }
            }
            if (result.kind === 'unsupported') result.reason = type === 5 ? '嵌套组合对象，保留原始显示' : '矢量、转曲文字或其他非文字图片对象';
            const clip = this.pdf.FPDFPageObj_GetClipPath(obj);
            if (clip && this.pdf.FPDFClipPath_CountPaths(clip) > 0) result.reason = '对象含裁剪路径，保留原始显示';
            if (bounds.width <= 0 || bounds.height <= 0) result.reason = '对象没有可编辑的可见范围';
            if (type === 1) {
                const length = this.pdf.FPDFTextObj_GetText(obj, textPage, 0, 0);
                const text = this.alloc(new Uint8Array(length + 2));
                try {
                    this.pdf.FPDFTextObj_GetText(obj, textPage, text, length);
                    result.text = this.pdf.pdfium.UTF16ToString(text);
                } finally { this.free(text); }
                this.pdf.FPDFTextObj_GetFontSize(obj, ptr + 16);
                result.fontSize = this.view().getFloat32(ptr + 16, true);
                const font = this.pdf.FPDFTextObj_GetFont(obj);
                const size = this.pdf.FPDFFont_GetFamilyName(font, 0, 0);
                const name = this.alloc(new Uint8Array(size + 1));
                try {
                    this.pdf.FPDFFont_GetFamilyName(font, name, size);
                    result.fontFamily = this.pdf.pdfium.UTF8ToString(name);
                } finally { this.free(name); }
                if (this.pdf.FPDFPageObj_GetFillColor(obj, ptr, ptr + 4, ptr + 8, ptr + 12)) {
                    const colors = this.view();
                    result.color = [0, 4, 8, 12].map(n => colors.getUint32(ptr + n, true)) as Rgba;
                }
                if (!result.text) result.reason = '无法识别此文字的 Unicode 内容';
                if (this.pdf.FPDFTextObj_GetTextRenderMode(obj) !== 0) result.reason = '描边或裁剪文字，保留原始显示';
            }
            return result;
        } finally { this.free(ptr); }
    }

    private shapeKind(object: number): ShapeKind | undefined {
        const buffer = this.alloc(new Uint8Array(260));
        try {
            for (let index = 0; index < this.pdf.FPDFPageObj_CountMarks(object); index++) {
                const mark = this.pdf.FPDFPageObj_GetMark(object, index);
                if (!this.pdf.FPDFPageObjMark_GetName(mark, buffer, 256, buffer + 256) || this.view().getUint32(buffer + 256, true) > 256) continue;
                const name = this.pdf.pdfium.UTF16ToString(buffer);
                const kind = name.slice(SHAPE_MARK.length);
                if (name.startsWith(SHAPE_MARK) && isShapeKind(kind)) return kind;
            }
        } finally { this.free(buffer); }
    }

    page(index: number): { info: PageInfo; objects: PdfObject[] } {
        return this.withPage(this.document(), index, page => {
            const text = this.pdf.FPDFText_LoadPage(page);
            try {
                const objects: PdfObject[] = [];
                for (let i = 0; i < this.pdf.FPDFPage_CountObjects(page); i++) objects.push(this.readObject(page, i, text));
                return { info: this.pageInfo(page, index), objects };
            } finally { if (text) this.pdf.FPDFText_ClosePage(text); }
        });
    }

    private renderPage(page: number, scale: number, transparent = false, annotations = true): Pixels {
        const w = this.pdf.FPDF_GetPageWidthF(page), h = this.pdf.FPDF_GetPageHeightF(page);
        if (!(w > 0 && h > 0 && Number.isFinite(scale))) throw new PdfEditorError('document', '页面尺寸无效');
        const ratio = Math.min(Math.max(0.05, scale), 4096 / Math.max(w, h));
        const width = Math.max(1, Math.ceil(w * ratio)), height = Math.max(1, Math.ceil(h * ratio));
        return this.paintPage(page, width, height, 0, 0, width, height, transparent, annotations);
    }

    private paintPage(page: number, width: number, height: number, left: number, top: number, pageWidth: number, pageHeight: number, transparent = false, annotations = true): Pixels {
        const bitmap = this.pdf.FPDFBitmap_Create(width, height, 1);
        check(bitmap, '无法分配页面位图');
        try {
            this.pdf.FPDFBitmap_FillRect(bitmap, 0, 0, width, height, transparent ? 0 : 0xffffffff);
            this.pdf.FPDF_RenderPageBitmap(bitmap, page, -left, -top, pageWidth, pageHeight, 0, annotations ? 1 : 0);
            const buffer = this.pdf.FPDFBitmap_GetBuffer(bitmap), stride = this.pdf.FPDFBitmap_GetStride(bitmap);
            const heap = this.heap();
            const rgba = new Uint8ClampedArray(width * height * 4);
            for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
                const from = buffer + y * stride + x * 4, to = (y * width + x) * 4;
                rgba[to] = heap[from + 2]; rgba[to + 1] = heap[from + 1]; rgba[to + 2] = heap[from]; rgba[to + 3] = heap[from + 3];
            }
            return { width, height, rgba };
        } finally { this.pdf.FPDFBitmap_Destroy(bitmap); }
    }

    render(index: number, scale: number): Pixels { return this.withPage(this.document(), index, page => this.renderPage(page, scale)); }

    renderRegion(index: number, bounds: PdfRegionBounds, scale: number): Pixels {
        return this.withPage(this.document(), index, page => {
            const info = this.pageInfo(page, index);
            validateRegions([{ ...bounds, pageIndex: 0 }], [{ ...info, index: 0 }]);
            const raster = regionRaster(info, bounds, scale);
            // 只分配选区大小的位图，通过负偏移裁切；不受整页预览 4096px 上限影响。
            return this.paintPage(page, raster.width, raster.height, raster.left, raster.top, raster.pageWidth, raster.pageHeight);
        });
    }

    layers(index: number, object: number, scale: number) {
        return this.withPage(this.document(), index, page => {
            const count = this.pdf.FPDFPage_CountObjects(page);
            if (!Number.isInteger(object) || object < 0 || object >= count) throw new PdfEditorError('operation', '对象不存在');
            const ptr = this.alloc(new Uint8Array(4));
            const states: { handle: number; active: boolean }[] = [];
            const textPage = this.pdf.FPDFText_LoadPage(page);
            try {
                const selectedObject = this.readObject(page, object, textPage);
                if (selectedObject.reason) throw new PdfEditorError('unsupported', selectedObject.reason);
                for (let i = 0; i < count; i++) {
                    const handle = this.pdf.FPDFPage_GetObject(page, i);
                    check(this.pdf.FPDFPageObj_GetIsActive(handle, ptr), '无法读取对象显示状态');
                    states.push({ handle, active: this.view().getInt32(ptr, true) !== 0 });
                }
                const layer = (filter: (i: number) => boolean, annotations: boolean) => {
                    states.forEach((s, i) => check(this.pdf.FPDFPageObj_SetIsActive(s.handle, s.active && filter(i)), '无法分离对象图层'));
                    return this.renderPage(page, scale, true, annotations);
                };
                const below = layer(i => i < object, false);
                const selected = layer(i => i === object, false);
                const above = layer(i => i > object, true);
                const sx = selected.width / this.pdf.FPDF_GetPageWidthF(page), sy = selected.height / this.pdf.FPDF_GetPageHeightF(page);
                const b = selectedObject.bounds;
                const left = Math.min(selected.width - 1, Math.max(0, Math.floor(b.x * sx))), top = Math.min(selected.height - 1, Math.max(0, Math.floor(b.y * sy)));
                const width = Math.max(1, Math.min(selected.width, Math.ceil((b.x + b.width) * sx)) - left);
                const height = Math.max(1, Math.min(selected.height, Math.ceil((b.y + b.height) * sy)) - top);
                const rgba = new Uint8ClampedArray(width * height * 4);
                for (let y = 0; y < height; y++) rgba.set(selected.rgba.subarray(((top + y) * selected.width + left) * 4, ((top + y) * selected.width + left + width) * 4), y * width * 4);
                return { below, above, selected: { width, height, rgba }, bounds: { x: left / sx, y: top / sy, width: width / sx, height: height / sy } };
            } finally {
                for (const s of states) this.pdf.FPDFPageObj_SetIsActive(s.handle, s.active);
                if (textPage) this.pdf.FPDFText_ClosePage(textPage);
                this.free(ptr);
            }
        });
    }

    private serialize(doc: DocumentHandle): Uint8Array<ArrayBuffer> {
        const writer = this.pdf.PDFiumExt_OpenFileWriter();
        check(writer, '保存 PDF 失败');
        try {
            check(this.pdf.PDFiumExt_SaveAsCopy(doc.handle, writer), '保存 PDF 失败');
            const size = this.pdf.PDFiumExt_GetFileWriterSize(writer);
            check(size > 0, '保存 PDF 返回空数据');
            const ptr = this.alloc(new Uint8Array(size));
            try {
                check(this.pdf.PDFiumExt_GetFileWriterData(writer, ptr, size), '读取 PDF 输出失败');
                return this.heap().slice(ptr, ptr + size);
            } finally { this.free(ptr); }
        } finally { this.pdf.PDFiumExt_CloseFileWriter(writer); }
    }

    export(): Uint8Array<ArrayBuffer> { return this.serialize(this.document()); }

    private trimHistory(): void {
        const bytes = () => [...this.past, ...this.future].reduce((sum, s) => sum + s.bytes.byteLength, 0);
        while (this.past.length + this.future.length > 50 || bytes() > 128 * 1024 * 1024) {
            if (this.past.length) this.past.shift(); else this.future.shift();
        }
    }

    private restore(target: Snapshot): void {
        const next = this.load(target.bytes, target.password);
        this.close(this.document());
        this.doc = next;
        this.current = target;
    }

    undo(): DocumentInfo {
        if (this.past.length) {
            const target = this.past[this.past.length - 1], previous = this.current!;
            this.restore(target);
            this.past.pop(); this.future.push(previous); this.trimHistory();
        }
        return this.info();
    }

    redo(): DocumentInfo {
        if (this.future.length) {
            const target = this.future[this.future.length - 1], previous = this.current!;
            this.restore(target);
            this.future.pop(); this.past.push(previous); this.trimHistory();
        }
        return this.info();
    }

    edit(command: EditCommand): DocumentInfo {
        if (!this.editable()) throw new PdfEditorError('permission', '此 PDF 未授予修改权限');
        const before = this.current!;
        const candidate = this.load(before.bytes, before.password);
        try {
            this.apply(candidate, command);
            const bytes = this.serialize(candidate);
            const revision = ++this.nextRevision;
            const pages = this.updatedPages(before.pages, command, this.pdf.FPDF_GetPageCount(candidate.handle), revision);
            const next = { bytes, password: before.password, revision, pages };
            this.restore(next);
            this.past.push(before); this.future = []; this.trimHistory();
        } finally { this.close(candidate); }
        return this.info();
    }

    private updatedPages(previous: PageVersion[], command: EditCommand, count: number, revision: number): PageVersion[] {
        const pages = [...previous];
        if (command.kind === 'insert' || command.kind === 'merge') {
            pages.splice(command.at, 0, ...Array.from({ length: count - pages.length }, () => ({ id: ++this.nextPageId, contentRevision: revision })));
        } else if (command.kind === 'deletePages') return pages.filter((_, index) => !command.pages.includes(index));
        else if (command.kind === 'movePages') {
            const selected = new Set(command.pages), moving = pages.filter((_, index) => selected.has(index));
            const remaining = pages.filter((_, index) => !selected.has(index));
            remaining.splice(command.to, 0, ...moving); return remaining;
        } else {
            const changed = command.kind === 'rotatePages' ? command.pages : [command.page];
            for (const index of changed) pages[index] = { ...pages[index], contentRevision: revision };
        }
        return pages;
    }

    private indices(doc: DocumentHandle, pages: number[]): number[] {
        const result = [...new Set(pages)].sort((a, b) => a - b);
        const count = this.pdf.FPDF_GetPageCount(doc.handle);
        if (!result.length || result.some(i => !Number.isInteger(i) || i < 0 || i >= count)) throw new PdfEditorError('operation', '请选择有效页面');
        return result;
    }

    private importPages(destination: number, source: number, pages: number[], at: number): void {
        const values = new Int32Array(pages);
        const ptr = this.alloc(new Uint8Array(values.buffer));
        try { check(this.pdf.FPDF_ImportPagesByIndex(destination, source, ptr, pages.length, at), '导入 PDF 页面失败'); }
        finally { this.free(ptr); }
    }

    extract(pages: number[]): Uint8Array<ArrayBuffer> {
        const source = this.document(), indices = this.indices(source, pages);
        const handle = this.pdf.FPDF_CreateNewDocument();
        check(handle, '无法创建 PDF');
        const doc = { handle, buffer: 0, fonts: [] };
        try { this.importPages(handle, source.handle, indices, 0); return this.serialize(doc); }
        finally { this.pdf.FPDF_CloseDocument(handle); }
    }

    private apply(doc: DocumentHandle, command: EditCommand): void {
        if (command.kind === 'insert' || command.kind === 'merge') {
            const count = this.pdf.FPDF_GetPageCount(doc.handle);
            if (!Number.isInteger(command.at) || command.at < 0 || command.at > count) throw new PdfEditorError('operation', '插入位置无效');
            if (command.kind === 'insert') {
                const page = this.pdf.FPDFPage_New(doc.handle, command.at, 595.276, 841.89);
                check(page, '插入空白页失败');
                try { check(this.pdf.FPDFPage_GenerateContent(page), '生成页面失败'); } finally { this.pdf.FPDF_ClosePage(page); }
            } else {
                const source = this.load(command.bytes, command.password);
                try { this.importPages(doc.handle, source.handle, Array.from({ length: this.pdf.FPDF_GetPageCount(source.handle) }, (_, i) => i), command.at); }
                finally { this.close(source); }
            }
            return;
        }
        if (command.kind === 'deletePages' || command.kind === 'rotatePages' || command.kind === 'movePages') {
            const pages = this.indices(doc, command.pages);
            if (command.kind === 'deletePages') {
                if (pages.length === this.pdf.FPDF_GetPageCount(doc.handle)) throw new PdfEditorError('operation', '至少保留一页');
                for (const index of pages.reverse()) this.pdf.FPDFPage_Delete(doc.handle, index);
            } else if (command.kind === 'rotatePages') {
                if (!Number.isInteger(command.turns)) throw new PdfEditorError('operation', '旋转必须为 90 度的倍数');
                for (const index of pages) this.withPage(doc, index, page => this.pdf.FPDFPage_SetRotation(page, ((this.pdf.FPDFPage_GetRotation(page) + command.turns) % 4 + 4) % 4));
            } else {
                const count = this.pdf.FPDF_GetPageCount(doc.handle);
                if (!Number.isInteger(command.to) || command.to < 0 || command.to > count - pages.length) throw new PdfEditorError('operation', '移动位置无效');
                const ptr = this.alloc(new Uint8Array(new Int32Array(pages).buffer));
                try { check(this.pdf.FPDF_MovePages(doc.handle, ptr, pages.length, command.to), '移动页面失败'); } finally { this.free(ptr); }
            }
            return;
        }
        this.withPage(doc, command.page, page => {
            if (command.kind === 'remove' || command.kind === 'update') {
                const { handle, object } = this.editableObject(page, command.object);
                if (command.kind === 'remove') {
                    check(this.pdf.FPDFPage_RemoveObject(page, handle), '删除对象失败'); this.pdf.FPDFPageObj_Destroy(handle);
                } else this.updateObject(doc, page, handle, object, command.patch);
            } else if (command.kind === 'text') {
                const font = this.loadFont(doc, command.fontId, command.text);
                this.addText(doc, page, command.text, font, command.fontSize, command.color,
                    multiply(inverse(this.matrix(page)), [1, 0, 0, -1, command.x, command.y + command.fontSize]));
            } else if (command.kind === 'image') this.addImage(doc, page, command);
            else if (command.kind === 'shape') this.addShape(page, command.drawing);
            check(this.pdf.FPDFPage_GenerateContent(page), '生成页面内容失败');
        });
    }

    private editableObject(page: number, index: number): { handle: number; object: PdfObject } {
        if (!Number.isInteger(index) || index < 0 || index >= this.pdf.FPDFPage_CountObjects(page)) throw new PdfEditorError('operation', '对象不存在');
        const text = this.pdf.FPDFText_LoadPage(page);
        try {
            const object = this.readObject(page, index, text);
            if (object.reason) throw new PdfEditorError('unsupported', object.reason);
            return { handle: this.pdf.FPDFPage_GetObject(page, index), object };
        } finally { if (text) this.pdf.FPDFText_ClosePage(text); }
    }

    private loadFont(doc: DocumentHandle, id: string, text: string): number {
        const data = this.fonts.get(id);
        if (!data) throw new PdfEditorError('font', '请先配置并选择 TTF 字体');
        validateFont(data, text);
        const buffer = this.alloc(data);
        const handle = this.pdf.FPDFText_LoadFont(doc.handle, buffer, data.length, 2, true);
        if (!handle) { this.free(buffer); throw new PdfEditorError('font', '无法嵌入所选 TTF 字体'); }
        doc.fonts.push({ handle, buffer });
        return handle;
    }

    private getMatrix(obj: number): Matrix {
        const ptr = this.alloc(new Uint8Array(24));
        try { check(this.pdf.FPDFPageObj_GetMatrix(obj, ptr), '无法读取对象矩阵'); return [0, 4, 8, 12, 16, 20].map(n => this.view().getFloat32(ptr + n, true)) as Matrix; }
        finally { this.free(ptr); }
    }

    private setMatrix(obj: number, matrix: Matrix): void {
        const ptr = this.alloc(new Uint8Array(new Float32Array(matrix).buffer));
        try { check(this.pdf.FPDFPageObj_SetMatrix(obj, ptr), '设置对象矩阵失败'); } finally { this.free(ptr); }
    }

    private color(obj: number, color: Rgba): void {
        if (color.length !== 4 || color.some(x => !Number.isFinite(x) || x < 0 || x > 255)) throw new PdfEditorError('operation', '颜色无效');
        check(this.pdf.FPDFPageObj_SetFillColor(obj, ...color.map(x => Math.round(x)) as Rgba), '设置颜色失败');
    }

    private addText(doc: DocumentHandle, page: number, text: string, font: number, size: number, color: Rgba, matrix: Matrix, at?: number): number[] {
        if (!text.trim() || !Number.isFinite(size) || size < 1 || size > 1000) throw new PdfEditorError('operation', '文字不能为空，字号须为 1–1000 pt');
        const objects: number[] = [];
        for (const [line, content] of text.replace(/\r/g, '').split('\n').entries()) {
            if (!content) continue;
            const obj = this.pdf.FPDFPageObj_CreateTextObj(doc.handle, font, size);
            check(obj, '创建文字失败');
            let inserted = false;
            const utf = new Uint16Array(content.length + 1);
            for (let i = 0; i < content.length; i++) utf[i] = content.charCodeAt(i);
            const ptr = this.alloc(new Uint8Array(utf.buffer));
            try {
                check(this.pdf.FPDFText_SetText(obj, ptr), '写入文字失败');
                this.color(obj, color);
                this.setMatrix(obj, multiply(matrix, [1, 0, 0, 1, 0, -line * size * 1.4]));
                if (at === undefined) this.pdf.FPDFPage_InsertObject(page, obj);
                else check(this.pdf.FPDFPage_InsertObjectAtIndex(page, obj, at + objects.length), '插入文字失败');
                inserted = true; objects.push(obj);
            } finally { this.free(ptr); if (!inserted) this.pdf.FPDFPageObj_Destroy(obj); }
        }
        return objects;
    }

    private updateObject(doc: DocumentHandle, page: number, handle: number, object: PdfObject, patch: ObjectPatch): void {
        let handles = [handle];
        if (object.kind === 'text' && (patch.text !== undefined || patch.fontId || patch.fontSize !== undefined)) {
            const content = patch.text ?? object.text!;
            if (content !== object.text && !patch.fontId) throw new PdfEditorError('font', '修改文字内容前请选择已配置的字体');
            const font = patch.fontId ? this.loadFont(doc, patch.fontId, content) : this.pdf.FPDFTextObj_GetFont(handle);
            const matrix = this.getMatrix(handle);
            handles = this.addText(doc, page, content, font, patch.fontSize ?? object.fontSize!, patch.color ?? object.color ?? [0, 0, 0, 255], matrix, object.index);
            check(this.pdf.FPDFPage_RemoveObject(page, handle), '替换原文字失败');
            this.pdf.FPDFPageObj_Destroy(handle);
        } else if (patch.text !== undefined || patch.fontId) throw new PdfEditorError('operation', '仅文字对象支持文字属性');
        if (patch.color && object.kind === 'text') for (const obj of handles) this.color(obj, patch.color);
        if (patch.shapeStyle) {
            if (object.kind !== 'shape' || !object.shape) throw new PdfEditorError('operation', '仅绘制的图形支持描边和填充');
            handles = [this.replaceShape(page, handle, object.index, object.shape, patch.shapeStyle)];
        }
        if (patch.transform) {
            const to = patch.transform;
            if (Object.values(to).some(x => !Number.isFinite(x)) || to.width < 0.1 || to.height < 0.1) throw new PdfEditorError('operation', '对象尺寸或位置无效');
            const screen = this.matrix(page);
            const delta = multiply(inverse(screen), multiply(objectDelta(object.bounds, to), screen));
            for (const obj of handles) this.setMatrix(obj, multiply(delta, this.getMatrix(obj)));
        }
    }

    private styleShape(object: number, shape: ShapeKind, style: ShapeStyle): void {
        if (!Number.isFinite(style.strokeWidth) || style.strokeWidth < 0.25 || style.strokeWidth > 100) throw new PdfEditorError('operation', '线宽须为 0.25–100 pt');
        if (style.stroke.length !== 4 || style.stroke.some(x => !Number.isFinite(x) || x < 0 || x > 255)) throw new PdfEditorError('operation', '描边颜色无效');
        check(this.pdf.FPDFPageObj_SetStrokeColor(object, ...style.stroke.map(x => Math.round(x)) as Rgba), '设置描边失败');
        check(this.pdf.FPDFPageObj_SetStrokeWidth(object, style.strokeWidth), '设置线宽失败');
        check(this.pdf.FPDFPageObj_SetLineCap(object, 1), '设置线端失败');
        check(this.pdf.FPDFPageObj_SetLineJoin(object, 1), '设置连接样式失败');
        const fill = canFill(shape) ? style.fill : null;
        if (fill) this.color(object, fill);
        check(this.pdf.FPDFPath_SetDrawMode(object, fill ? 2 : 0, true), '设置图形填充失败');
        const array = style.dashed ? new Float32Array([style.strokeWidth * 4, style.strokeWidth * 2]) : new Float32Array();
        const ptr = this.alloc(new Uint8Array(array.buffer));
        try { check(this.pdf.FPDFPageObj_SetDashArray(object, ptr, array.length, 0), '设置虚线失败'); } finally { this.free(ptr); }
    }

    private replaceShape(page: number, original: number, at: number, shape: ShapeKind, style: ShapeStyle): number {
        // PDFium 2.15.1 重用已加载路径的图形资源时会保留旧透明度；
        // 仅重建编辑器自己的路径，保留原始曲线、矩阵和对象顺序，让样式生成新资源。
        const count = this.pdf.FPDFPath_CountSegments(original);
        check(count > 0 && count <= 16384, '图形路径无效');
        const buffer = this.alloc(new Uint8Array(8));
        const segments: { x: number; y: number; type: number; close: boolean }[] = [];
        try {
            for (let i = 0; i < count; i++) {
                const segment = this.pdf.FPDFPath_GetPathSegment(original, i);
                check(segment && this.pdf.FPDFPathSegment_GetPoint(segment, buffer, buffer + 4), '读取图形路径失败');
                segments.push({ x: this.view().getFloat32(buffer, true), y: this.view().getFloat32(buffer + 4, true),
                    type: this.pdf.FPDFPathSegment_GetType(segment), close: this.pdf.FPDFPathSegment_GetClose(segment) });
            }
        } finally { this.free(buffer); }
        check(segments[0].type === 2, '图形缺少起点');
        const object = this.pdf.FPDFPageObj_CreateNewPath(segments[0].x, segments[0].y);
        check(object, '创建图形失败');
        let inserted = false;
        try {
            for (let i = 1; i < segments.length; i++) {
                const point = segments[i];
                if (point.type === 2) check(this.pdf.FPDFPath_MoveTo(object, point.x, point.y), '复制图形起点失败');
                else if (point.type === 0) check(this.pdf.FPDFPath_LineTo(object, point.x, point.y), '复制图形线段失败');
                else if (point.type === 1) {
                    const second = segments[i + 1], end = segments[i + 2];
                    check(second?.type === 1 && end?.type === 1, '图形曲线无效');
                    check(this.pdf.FPDFPath_BezierTo(object, point.x, point.y, second.x, second.y, end.x, end.y), '复制图形曲线失败');
                    i += 2;
                } else throw new PdfEditorError('unsupported', '图形路径类型无法修改');
                if (segments[i].close) check(this.pdf.FPDFPath_Close(object), '闭合图形失败');
            }
            this.styleShape(object, shape, style);
            this.setMatrix(object, this.getMatrix(original));
            check(this.pdf.FPDFPageObj_AddMark(object, `${SHAPE_MARK}${shape}`), '记录图形类型失败');
            check(this.pdf.FPDFPage_InsertObjectAtIndex(page, object, at), '替换图形失败'); inserted = true;
            check(this.pdf.FPDFPage_RemoveObject(page, original), '移除原图形失败');
            this.pdf.FPDFPageObj_Destroy(original);
            return object;
        } finally { if (!inserted) this.pdf.FPDFPageObj_Destroy(object); }
    }

    private addShape(page: number, drawing: Drawing): void {
        const { shape, points, style } = drawing;
        if (!isShapeKind(shape) || points.length > 4096 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y) || Math.abs(p.x) > 1e6 || Math.abs(p.y) > 1e6)
            || (shape !== 'freehand' && points.length !== 2) || !drawable(drawing)) throw new PdfEditorError('operation', '请拖动鼠标绘制有效图形');
        const bounds = drawingBounds(points);
        const start = points[0], end = points[points.length - 1];
        const cx = bounds.x + bounds.width / 2, cy = bounds.y + bounds.height / 2;
        const rx = bounds.width / 2, ry = bounds.height / 2;
        const object = shape === 'rectangle' ? this.pdf.FPDFPageObj_CreateNewRect(bounds.x, bounds.y, bounds.width, bounds.height)
            : this.pdf.FPDFPageObj_CreateNewPath(shape === 'ellipse' ? cx + rx : start.x, shape === 'ellipse' ? cy : start.y);
        check(object, '创建图形失败');
        let inserted = false;
        try {
            if (shape === 'ellipse') {
                const k = 0.5522847498307936;
                check(this.pdf.FPDFPath_BezierTo(object, cx + rx, cy + k * ry, cx + k * rx, cy + ry, cx, cy + ry), '绘制圆弧失败');
                check(this.pdf.FPDFPath_BezierTo(object, cx - k * rx, cy + ry, cx - rx, cy + k * ry, cx - rx, cy), '绘制圆弧失败');
                check(this.pdf.FPDFPath_BezierTo(object, cx - rx, cy - k * ry, cx - k * rx, cy - ry, cx, cy - ry), '绘制圆弧失败');
                check(this.pdf.FPDFPath_BezierTo(object, cx + k * rx, cy - ry, cx + rx, cy - k * ry, cx + rx, cy), '绘制圆弧失败');
                check(this.pdf.FPDFPath_Close(object), '闭合圆形失败');
            } else if (shape !== 'rectangle') {
                for (const point of points.slice(1)) check(this.pdf.FPDFPath_LineTo(object, point.x, point.y), '绘制线条失败');
                if (shape === 'arrow') for (const wing of arrowWings(start, end, style.strokeWidth)) {
                    check(this.pdf.FPDFPath_MoveTo(object, end.x, end.y), '绘制箭头失败');
                    check(this.pdf.FPDFPath_LineTo(object, wing.x, wing.y), '绘制箭头失败');
                }
            }
            this.styleShape(object, shape, style);
            this.setMatrix(object, inverse(this.matrix(page)));
            check(this.pdf.FPDFPageObj_AddMark(object, `${SHAPE_MARK}${shape}`), '记录图形类型失败');
            this.pdf.FPDFPage_InsertObject(page, object); inserted = true;
        } finally { if (!inserted) this.pdf.FPDFPageObj_Destroy(object); }
    }

    private addImage(doc: DocumentHandle, page: number, command: Extract<EditCommand, { kind: 'image' }>): void {
        const { image, bounds } = command;
        if (!Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width < 1 || image.height < 1 || image.rgba.length !== image.width * image.height * 4 || image.rgba.length > 64 * 1024 * 1024) throw new PdfEditorError('operation', '图片无效或超过 1600 万像素');
        if (Object.values(bounds).some(x => !Number.isFinite(x)) || bounds.width <= 0 || bounds.height <= 0) throw new PdfEditorError('operation', '图片尺寸无效');
        const old = command.replace === undefined ? undefined : this.editableObject(page, command.replace);
        if (old && old.object.kind !== 'image') throw new PdfEditorError('operation', '只能替换图片对象');
        const obj = this.pdf.FPDFPageObj_NewImageObj(doc.handle);
        check(obj, '创建图片失败');
        const bitmap = this.pdf.FPDFBitmap_Create(image.width, image.height, 1);
        let inserted = false;
        try {
            check(bitmap, '创建图片位图失败');
            const buffer = this.pdf.FPDFBitmap_GetBuffer(bitmap), stride = this.pdf.FPDFBitmap_GetStride(bitmap);
            const heap = this.heap();
            for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
                const from = (y * image.width + x) * 4, to = buffer + y * stride + x * 4;
                heap[to] = image.rgba[from + 2]; heap[to + 1] = image.rgba[from + 1]; heap[to + 2] = image.rgba[from]; heap[to + 3] = image.rgba[from + 3];
            }
            check(this.pdf.FPDFImageObj_SetBitmap(0, 0, obj, bitmap), '写入图片失败');
            this.setMatrix(obj, old ? this.getMatrix(old.handle) : multiply(inverse(this.matrix(page)), [bounds.width, 0, 0, -bounds.height, bounds.x, bounds.y + bounds.height]));
            if (old) {
                check(this.pdf.FPDFPage_InsertObjectAtIndex(page, obj, old.object.index), '替换图片失败');
                inserted = true;
                check(this.pdf.FPDFPage_RemoveObject(page, old.handle), '移除原图片失败'); this.pdf.FPDFPageObj_Destroy(old.handle);
            } else { this.pdf.FPDFPage_InsertObject(page, obj); inserted = true; }
        } finally { if (bitmap) this.pdf.FPDFBitmap_Destroy(bitmap); if (!inserted) this.pdf.FPDFPageObj_Destroy(obj); }
    }
}
