import { expect } from '../../../test/visual/component-fixture.mjs';

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
        // Resolve the actual public palette label paint in its own CSS boundary;
        // a node may use a light on-brand label even in a light color mode.
        const probe = node.ownerDocument.createElement('span'); probe.hidden = true; probe.style.color = status.dataset.labelColor; scene.append(probe);
        const color = node.ownerDocument.defaultView.getComputedStyle(probe).color; probe.remove();
        const swatch = node.ownerDocument.createElement('canvas'); swatch.width = swatch.height = 1;
        const context = swatch.getContext('2d'); context.fillStyle = color; context.fillRect(0, 0, 1, 1);
        const labelColor = context.getImageData(0, 0, 1, 1).data;
        let ink = 0, surroundingPaint = 0;
        for (let index = 0; index < pixels.length; index += 4) if (pixels[index + 3] > 240) {
            if (Math.abs(pixels[index] - labelColor[0]) < 20 && Math.abs(pixels[index + 1] - labelColor[1]) < 20 && Math.abs(pixels[index + 2] - labelColor[2]) < 20) ink++;
            else surroundingPaint++;
        }
        return ink > 12 && surroundingPaint > 20 && gl.getError() === gl.NO_ERROR;
    }, labels), { timeout: 20000, message: labels ? 'Real ELK nodes and their label pixels must be present in the initial GPU frame' : 'The actual Flow canvas must present a live correctly sized drawing buffer' }).toBe(true);
}
