import { PdfEditorError } from './types.js';

/** 仅解析 SFNT 的 cmap 4/12；确保输入字符存在，避免 PDFium 静默写入 .notdef。 */
export function validateFont(data: Uint8Array, text = ''): void {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const fail = () => { throw new PdfEditorError('font', '请提供含有所需字符的完整 TTF 字体'); };
    if (data.length < 12 || view.getUint32(0) !== 0x00010000) fail();
    let cmap = 0;
    for (let i = 0; i < view.getUint16(4); i++) {
        const at = 12 + i * 16;
        if (at + 16 > data.length) fail();
        if (view.getUint32(at) === 0x636d6170) cmap = view.getUint32(at + 8);
    }
    if (!cmap || cmap + 4 > data.length) fail();
    const tables: number[] = [];
    for (let i = 0; i < view.getUint16(cmap + 2); i++) {
        const at = cmap + 4 + i * 8;
        if (at + 8 > data.length) fail();
        const platform = view.getUint16(at), encoding = view.getUint16(at + 2);
        const sub = cmap + view.getUint32(at + 4);
        if (sub + 2 > data.length) fail();
        if (platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10))) tables.push(sub);
    }
    const has = (code: number, at: number): boolean => {
        const format = view.getUint16(at);
        if (format === 12) {
            for (let i = 0; i < view.getUint32(at + 12); i++) {
                const group = at + 16 + i * 12;
                if (code >= view.getUint32(group) && code <= view.getUint32(group + 4)) {
                    return view.getUint32(group + 8) + code - view.getUint32(group) !== 0;
                }
            }
        } else if (format === 4 && code <= 0xffff) {
            const count = view.getUint16(at + 6) / 2;
            for (let i = 0; i < count; i++) {
                const end = view.getUint16(at + 14 + i * 2);
                const start = view.getUint16(at + 16 + count * 2 + i * 2);
                if (code < start || code > end) continue;
                const delta = view.getInt16(at + 16 + count * 4 + i * 2);
                const ro = at + 16 + count * 6 + i * 2;
                const offset = view.getUint16(ro);
                const glyph = offset ? view.getUint16(ro + offset + (code - start) * 2) : code;
                return (offset && !glyph) ? false : ((glyph + delta) & 0xffff) !== 0;
            }
        }
        return false;
    };
    try {
        for (const character of text.replace(/[\r\n]/g, '')) {
            const code = character.codePointAt(0)!;
            if (!tables.some(at => has(code, at))) throw new PdfEditorError('font', `所选字体不包含字符“${character}”`);
        }
    } catch (error) {
        if (error instanceof PdfEditorError) throw error;
        fail();
    }
}
