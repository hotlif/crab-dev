import type { PdfDocumentInput } from '../../src/types.js';

// 自包含 ASCII PDF，避免演示依赖远程文件；xref 偏移以实际输出长度计算。
function samplePdf(streams: string[], width: number, height: number) {
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        `<< /Type /Pages /Kids [${streams.map((_, index) => `${3 + index * 2} 0 R`).join(' ')}] /Count ${streams.length} >>`,
    ];
    streams.forEach((stream, index) => objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 ${3 + streams.length * 2} 0 R >> >> /Contents ${4 + index * 2} 0 R >>`,
        `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ));
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    let pdf = '%PDF-1.4\n';
    const offsets = objects.map((object, index) => {
        const offset = pdf.length;
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
        return offset;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return new TextEncoder().encode(pdf);
}

export const sampleDocument: PdfDocumentInput = { id: 'toolbar-demo', fileName: 'toolbar-demo.pdf', source: samplePdf([
    'BT /F1 24 Tf 48 720 Td (Toolbar visibility demo) Tj 0 -40 Td /F1 14 Tf (Toggle the controls above to customize this editor.) Tj ET',
], 595, 842) };

export const regionDocument: PdfDocumentInput = { id: 'region-demo', fileName: 'cross-page-region.pdf', source: samplePdf([
    'BT /F1 22 Tf 32 250 Td (Cross-page document / Page 1) Tj 0 -206 Td /F1 18 Tf (Order CRAB-2026 / Continued on next page) Tj ET',
    'BT /F1 18 Tf 32 264 Td (Amount: 1280.00 / Reference: CRAB-2026) Tj 0 -100 Td /F1 22 Tf (Cross-page document / Page 2) Tj ET',
], 600, 300) };
