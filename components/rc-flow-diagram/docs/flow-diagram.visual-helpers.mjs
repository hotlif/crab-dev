import { expect } from '../../../test/visual/component-fixture.mjs';

export async function sampleFlowFrames(canvas, duration) {
    return canvas.evaluate((node, duration) => new Promise(resolve => {
        const start = performance.now(), frames = [];
        function sample(time) {
            frames.push({ time, png: node.toDataURL('image/png') });
            if (time - start < duration) requestAnimationFrame(sample);
            else resolve(frames);
        }
        requestAnimationFrame(sample);
    }), duration);
}

export async function readFlowLabelBands(scene) {
    return scene.locator('canvas').first().evaluate(node => {
        const status = node.closest('[aria-label="FlowDiagram visual matrix"]').querySelector('[data-node-rects]');
        const rect = JSON.parse(status.dataset.nodeRects).request, ratio = globalThis.devicePixelRatio;
        const gl = node.getContext('webgl2');
        const y = Math.round(node.height - (rect.y + rect.height) * ratio), height = Math.round(rect.height * ratio);
        const bands = [[Math.max(0, Math.round((rect.x - 12) * ratio)), Math.round((rect.x - 1) * ratio)], [Math.round((rect.x + rect.width + 1) * ratio), Math.min(node.width, Math.round((rect.x + rect.width + 12) * ratio))]];
        const outside = bands.map(([start, end]) => {
            if (end <= start) return [];
            const pixels = new Uint8Array((end - start) * height * 4);
            gl.readPixels(start, y, end - start, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            return Array.from(pixels);
        });
        return { outside, error: gl.getError() };
    });
}

export async function expectFlowLabelContainment(scene, baseline) {
    // Compare the same actual GPU bands before/after changing only the label.
    // This preserves grid/connector pixels and avoids mistaking a branded dark
    // grid dot for a dark label or assuming Canvas2D's gamut conversion.
    const measurement = await readFlowLabelBands(scene);
    expect(measurement.error).toBe(0);
    expect(measurement.outside).toEqual(baseline.outside);
}

export async function waitForFlowPresentation(scene, { labels = false } = {}) {
    const canvas = scene.locator('canvas').first();
    await expect(canvas).toBeVisible();
    const frames = await canvas.evaluate(node => new Promise(resolve => requestAnimationFrame(first => requestAnimationFrame(second => resolve({ first, second, connected: node.isConnected })))));
    expect(frames.connected).toBe(true); expect(frames.second).toBeGreaterThan(frames.first);
    await expect.poll(() => canvas.evaluate((node, labels) => {
        const gl = node.getContext('webgl2'), box = node.getBoundingClientRect(), ratio = globalThis.devicePixelRatio;
        if (!gl || gl.isContextLost() || box.width <= 1 || box.height <= 1 || node.width !== Math.round(box.width * ratio) || node.height !== Math.round(box.height * ratio) || gl.drawingBufferWidth !== node.width || gl.drawingBufferHeight !== node.height) return false;
        if (!labels) return true;
        const scene = node.closest('[aria-label="FlowDiagram visual matrix"]');
        const status = scene.querySelector('[data-node-rects]'), rects = JSON.parse(status.dataset.nodeRects);
        const rect = rects.request;
        if (!rect || Number(status.dataset.zoom) !== 1) return false;
        // At the initial public viewport, the inside of the real first node has
        // opaque label pixels. A ready DOM status or a transparent/grid-only
        // buffer cannot satisfy this condition before the node text is painted.
        const x = Math.round((rect.x + 8) * ratio), y = Math.round((rect.y + 8) * ratio);
        const width = Math.max(1, Math.round((rect.width - 16) * ratio)), height = Math.max(1, Math.round((rect.height - 16) * ratio));
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(x, node.height - y - height, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        const colors = new Map();
        // SDF glyph edges retain coverage alpha in the real WebGL buffer. In
        // forced colors, thin dark strokes need not contain fully opaque texels.
        for (let index = 0; index < pixels.length; index += 4) if (pixels[index + 3] > 0) {
            const color = Array.from(pixels.slice(index, index + 3)), key = color.join(',');
            const entry = colors.get(key) ?? { color, count: 0 }; entry.count++; colors.set(key, entry);
        }
        const fill = [...colors.values()].sort((a, b) => b.count - a.count)[0];
        if (!fill || fill.count < 20) return false;
        const luminance = color => color.map(value => { const channel = value / 255; return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        const background = luminance(fill.color);
        let ink = 0;
        for (const entry of colors.values()) {
            const foreground = luminance(entry.color), contrast = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
            if (contrast >= 3) ink += entry.count;
        }
        return ink > 12 && gl.getError() === gl.NO_ERROR;
    }, labels), { timeout: 20000, message: labels ? 'Real ELK nodes and their label pixels must be present in the initial GPU frame' : 'The actual Flow canvas must present a live correctly sized drawing buffer' }).toBe(true);
}
