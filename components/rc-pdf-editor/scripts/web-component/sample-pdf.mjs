// 演示服务器提供的自有 ASCII PDF；构建时生成，xref 按实际字节偏移计算。
export function serverSamplePdf() {
    const streams = [
        'BT /F1 26 Tf 48 350 Td (CRAB / Sample order) Tj /F1 16 Tf 0 -58 Td (Order: CRAB-2026-001) Tj 0 -36 Td (Customer: Example Company) Tj 0 -36 Td (Amount: CNY 1,280.00) Tj 0 -72 Td /F1 12 Tf (Server PDF - page 1 of 2) Tj ET',
        'BT /F1 26 Tf 48 350 Td (Delivery details) Tj /F1 16 Tf 0 -58 Td (Reference: CRAB-2026-001) Tj 0 -36 Td (Status: Ready for review) Tj 0 -36 Td (This PDF is a local demo fixture.) Tj 0 -72 Td /F1 12 Tf (Server PDF - page 2 of 2) Tj ET',
    ];
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>',
    ];
    streams.forEach((stream, index) => objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 420] /Resources << /Font << /F1 7 0 R >> >> /Contents ${4 + index * 2} 0 R >>`,
        `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ));
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    let pdf = '%PDF-1.4\n';
    const offsets = objects.map((object, index) => {
        const offset = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; return offset;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return new TextEncoder().encode(pdf);
}
