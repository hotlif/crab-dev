/** Pixel assertions consume the actual Chrome screenshot, never DOM-rendered text. */
export async function screenshotPixels(base64) {
    const image = new globalThis.Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    if (image.naturalWidth !== 1280 || image.naturalHeight !== 720) throw new Error('Unexpected forced-color screenshot geometry');
    const canvas = globalThis.document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Missing screenshot pixel reader');
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

export function colorChannels(color) {
    const canvas = globalThis.document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Missing CSS color resolver');
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data];
}

export function matchingPixels(image, rect, color, tolerance = 2) {
    const expected = colorChannels(color);
    let matched = 0, total = 0;
    for (let y = Math.max(0, Math.ceil(rect.y)); y < Math.min(image.height, Math.floor(rect.y + rect.height)); y++) {
        for (let x = Math.max(0, Math.ceil(rect.x)); x < Math.min(image.width, Math.floor(rect.x + rect.width)); x++) {
            const offset = (y * image.width + x) * 4;
            total++;
            if ([0, 1, 2].every(channel => Math.abs(image.data[offset + channel] - expected[channel]) <= tolerance)) matched++;
        }
    }
    if (!total) throw new Error('Pixel subject is outside the actual screenshot');
    return { matched, total, ratio: matched / total, expected, tolerance };
}
