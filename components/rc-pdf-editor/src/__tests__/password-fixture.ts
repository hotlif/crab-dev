import { init } from '@embedpdf/pdfium';
import { fixture } from './fixture.js';

/** 用同一 PDFium 版本生成测试密码文件；没有第三方 PDF 生成器。 */
export async function passwordFixture(wasmBinary: ArrayBuffer): Promise<Uint8Array<ArrayBuffer>> {
    const pdf = await init({ wasmBinary, locateFile: (path: string) => path });
    pdf.PDFiumExt_Init();
    const module = pdf.pdfium;
    const heap = () => {
        if (!('HEAPU8' in module) || !(module.HEAPU8 instanceof Uint8Array)) throw new Error('没有 WASM 内存');
        return module.HEAPU8;
    };
    const data = fixture(1);
    const input = module.wasmExports.malloc(data.length);
    heap().set(data, input);
    const doc = pdf.FPDF_LoadMemDocument(input, data.length, '');
    const writer = pdf.PDFiumExt_OpenFileWriter();
    try {
        if (!pdf.EPDF_SetEncryption(doc, 'reader', 'owner', 4) || !pdf.PDFiumExt_SaveAsCopy(doc, writer)) throw new Error('测试密码文件生成失败');
        const size = pdf.PDFiumExt_GetFileWriterSize(writer);
        const output = module.wasmExports.malloc(size);
        try { pdf.PDFiumExt_GetFileWriterData(writer, output, size); return heap().slice(output, output + size); }
        finally { module.wasmExports.free(output); }
    } finally {
        pdf.PDFiumExt_CloseFileWriter(writer); pdf.FPDF_CloseDocument(doc);
        module.wasmExports.free(input); pdf.FPDF_DestroyLibrary();
    }
}
