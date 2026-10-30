import { expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';

/** Wait for the real Worker result and the active page frame, not the shared preview canvas. */
export async function waitForPdfPresentation(scene, documentId = 'professional-visual') {
    const timeout = 20000;
    await expect(scene).toHaveAttribute('data-status', 'ready', { timeout });
    await expect(scene).toHaveAttribute('data-document', documentId);
    await expect(scene).toHaveAttribute('data-revision', /^[1-9]\d*$/);
    // Compact layouts retain their loaded object tree in the collapsed panel.
    // It must contain real document objects even when that panel is not visible.
    await expect(scene.getByRole('treeitem', { includeHidden: true }).first()).toBeAttached({ timeout });
    await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'false', { timeout });
    const main = scene.getByRole('main');
    const frame = main.locator('[data-page-frame][data-visible="true"]');
    await expect(frame).toHaveCount(1, { timeout });
    await expect(frame).toHaveAttribute('data-page-frame', /^[1-9]\d*$/);
    const canvas = frame.locator('canvas');
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toBeVisible();
    await settleFiniteAnimations(scene.page());
    // Frame promotion is a production onRender notification. Allow its DOM
    // visibility update and the browser compositor to cross real RAF boundaries.
    const presented = await canvas.evaluate(node => new Promise(resolve => requestAnimationFrame(first => requestAnimationFrame(second => resolve({ connected: node.isConnected, first, second })))));
    expect(presented.connected).toBe(true);
    expect(presented.second).toBeGreaterThan(presented.first);
    await expect.poll(() => canvas.evaluate(node => {
        const viewport = node.closest('main').getBoundingClientRect();
        const box = node.getBoundingClientRect();
        const ratio = globalThis.devicePixelRatio;
        const gl = node.getContext('webgl2');
        const glViewport = gl && [...gl.getParameter(gl.VIEWPORT)];
        return {
            measuredViewport: viewport.width > 1 && viewport.height > 1,
            cssMatchesViewport: Math.abs(box.width - viewport.width) < 1 && Math.abs(box.height - viewport.height) < 1,
            bitmapMatchesViewport: node.width === Math.round(box.width * ratio) && node.height === Math.round(box.height * ratio),
            drawingBufferMatchesBitmap: !!gl && !gl.isContextLost() && gl.drawingBufferWidth === node.width && gl.drawingBufferHeight === node.height,
            gpuViewportMatchesBitmap: !!glViewport && glViewport[0] === 0 && glViewport[1] === 0 && glViewport[2] === node.width && glViewport[3] === node.height,
        };
    }), { timeout, message: 'The active PDF page bitmap and GPU viewport must match the measured document viewport at the real browser DPR' }).toEqual({
        measuredViewport: true,
        cssMatchesViewport: true,
        bitmapMatchesViewport: true,
        drawingBufferMatchesBitmap: true,
        gpuViewportMatchesBitmap: true,
    });
    return scene;
}

export async function readyPdf(page, documentId = 'professional-visual') {
    return waitForPdfPresentation(page.getByRole('region', { name: 'PdfEditor visual matrix' }), documentId);
}
