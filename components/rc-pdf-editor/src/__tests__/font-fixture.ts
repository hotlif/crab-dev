/** 自有测试字体：每个 Unicode 对应独立矩形字形，验证 cmap 和 PDF 嵌入，不用于界面。 */
export function fontFixture(): Uint8Array<ArrayBuffer> {
    const characters = [...' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789中文世界'];
    const points = [...new Set(characters.map(c => c.codePointAt(0)!))].sort((a, b) => a - b);
    const count = points.length + 1;
    const tables = new Map<string, Uint8Array<ArrayBuffer>>();
    const table = (name: string, size: number) => {
        const bytes = new Uint8Array(size); tables.set(name, bytes); return new DataView(bytes.buffer);
    };
    const head = table('head', 54);
    head.setUint32(0, 0x00010000); head.setUint32(4, 0x00010000); head.setUint32(12, 0x5f0f3cf5);
    head.setUint16(18, 1000); head.setInt16(40, 500); head.setInt16(42, 700); head.setUint16(46, 8);
    head.setInt16(48, 2); head.setInt16(50, 1);
    const hhea = table('hhea', 36);
    hhea.setUint32(0, 0x00010000); hhea.setInt16(4, 800); hhea.setInt16(6, -200); hhea.setUint16(10, 600);
    hhea.setInt16(16, 500); hhea.setInt16(18, 1); hhea.setUint16(34, count);
    const maxp = table('maxp', 32);
    maxp.setUint32(0, 0x00010000); maxp.setUint16(4, count); maxp.setUint16(6, 4); maxp.setUint16(8, 1); maxp.setUint16(14, 2);
    const metrics = table('hmtx', count * 4);
    const loca = table('loca', (count + 1) * 4);
    const glyphs = table('glyf', count * 36);
    for (let i = 0; i < count; i++) {
        metrics.setUint16(i * 4, 600); metrics.setInt16(i * 4 + 2, 100); loca.setUint32(i * 4, i * 36);
        const offset = i * 36;
        glyphs.setInt16(offset, 1); glyphs.setInt16(offset + 2, 100); glyphs.setInt16(offset + 6, 500); glyphs.setInt16(offset + 8, 700);
        glyphs.setUint16(offset + 10, 3);
        for (let j = 0; j < 4; j++) glyphs.setUint8(offset + 14 + j, 1);
        [100, 400, 0, -400, 0, 0, 700, 0].forEach((value, j) => glyphs.setInt16(offset + 18 + j * 2, value));
    }
    loca.setUint32(count * 4, count * 36);
    const cmap = table('cmap', 28 + points.length * 12);
    cmap.setUint16(2, 1); cmap.setUint16(4, 3); cmap.setUint16(6, 10); cmap.setUint32(8, 12);
    cmap.setUint16(12, 12); cmap.setUint32(16, 16 + points.length * 12); cmap.setUint32(24, points.length);
    points.forEach((code, i) => { cmap.setUint32(28 + i * 12, code); cmap.setUint32(32 + i * 12, code); cmap.setUint32(36 + i * 12, i + 1); });
    const names = [[1, 'Crab PDF Test'], [2, 'Regular'], [4, 'Crab PDF Test Regular'], [6, 'CrabPDFTest-Regular']] as const;
    const strings = names.map(([, name]) => Uint8Array.from([...name].flatMap(c => [0, c.charCodeAt(0)])));
    const stringOffset = 6 + names.length * 12;
    const name = table('name', stringOffset + strings.reduce((sum, bytes) => sum + bytes.length, 0));
    name.setUint16(2, names.length); name.setUint16(4, stringOffset);
    let offset = 0;
    names.forEach(([id], i) => {
        const start = 6 + i * 12;
        [3, 1, 0x409, id, strings[i].length, offset].forEach((value, j) => name.setUint16(start + j * 2, value));
        new Uint8Array(name.buffer).set(strings[i], stringOffset + offset); offset += strings[i].length;
    });
    table('post', 32).setUint32(0, 0x00030000);
    const os2 = table('OS/2', 96);
    os2.setUint16(0, 4); os2.setInt16(2, 600); os2.setUint16(4, 400); os2.setUint16(6, 5);
    os2.setUint16(64, points[0]); os2.setUint16(66, points.at(-1)!);
    os2.setInt16(68, 800); os2.setInt16(70, -200); os2.setUint16(74, 800); os2.setUint16(76, 200);
    os2.setInt16(86, 500); os2.setInt16(88, 700); os2.setUint16(92, 32);
    const align = (value: number) => (value + 3) & ~3;
    const checksum = (bytes: Uint8Array) => {
        let sum = 0;
        for (let i = 0; i < bytes.length; i += 4) sum = (sum + (((bytes[i] ?? 0) << 24) | ((bytes[i + 1] ?? 0) << 16) | ((bytes[i + 2] ?? 0) << 8) | (bytes[i + 3] ?? 0))) >>> 0;
        return sum;
    };
    const output = new Uint8Array(12 + tables.size * 16 + [...tables.values()].reduce((sum, bytes) => sum + align(bytes.length), 0));
    const view = new DataView(output.buffer);
    view.setUint32(0, 0x00010000); view.setUint16(4, tables.size);
    const power = Math.floor(Math.log2(tables.size));
    view.setUint16(6, 2 ** power * 16); view.setUint16(8, power); view.setUint16(10, tables.size * 16 - 2 ** power * 16);
    offset = 12 + tables.size * 16;
    let headOffset = 0;
    [...tables].sort(([a], [b]) => a.localeCompare(b)).forEach(([tag, bytes], i) => {
        const record = 12 + i * 16;
        output.set(new TextEncoder().encode(tag), record); view.setUint32(record + 4, checksum(bytes));
        view.setUint32(record + 8, offset); view.setUint32(record + 12, bytes.length); output.set(bytes, offset);
        if (tag === 'head') headOffset = offset;
        offset += align(bytes.length);
    });
    view.setUint32(headOffset + 8, (0xb1b0afba - checksum(output)) >>> 0);
    return output;
}
