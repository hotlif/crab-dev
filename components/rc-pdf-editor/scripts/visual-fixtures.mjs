import { deflateSync } from 'node:zlib';

// Authored deterministic RGB fixture, not a screenshot or a visual baseline.
export function visualImage(replacement = false) {
    const width = 96, height = 64;
    const crc32 = bytes => {
        let crc = 0xffffffff;
        for (const byte of bytes) {
            crc ^= byte;
            for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
        }
        return (crc ^ 0xffffffff) >>> 0;
    };
    const chunk = (type, data) => {
        const payload = Buffer.concat([Buffer.from(type), data]), size = Buffer.alloc(4), checksum = Buffer.alloc(4);
        size.writeUInt32BE(data.length); checksum.writeUInt32BE(crc32(payload));
        return Buffer.concat([size, payload, checksum]);
    };
    const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
    const pixels = Buffer.alloc((width * 3 + 1) * height);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const color = replacement ? (x < width / 2 ? [25, 128, 72] : [235, 177, 28]) : (y < height / 2 ? [37, 99, 205] : [215, 65, 65]);
        const offset = y * (width * 3 + 1) + 1 + x * 3;
        pixels.set(color, offset);
    }
    return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
}
