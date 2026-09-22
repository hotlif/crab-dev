/** 小型、可审计的真实 PDF，测试不依赖网络或其他 PDF 库。 */
export function fixture(pageCount = 2, rotation = 0): Uint8Array<ArrayBuffer> {
    const objects: string[] = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        `<< /Type /Pages /Count ${pageCount} /Kids [${Array.from({ length: pageCount }, (_, i) => `${4 + i * 2} 0 R`).join(' ')}] >>`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ];
    for (let i = 0; i < pageCount; i++) {
        const stream = `BT /F1 20 Tf 30 130 Td (Page ${i + 1}) Tj ET\n0 0 1 rg 35 133 12 12 re f\n`;
        objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 240 180] /CropBox [10 10 230 170] /Rotate ${rotation} /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + i * 2} 0 R >>`);
        objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
    }
    let pdf = '%PDF-1.7\n';
    const offsets = [0];
    objects.forEach((obj, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`; });
    const start = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
    return new TextEncoder().encode(pdf);
}
