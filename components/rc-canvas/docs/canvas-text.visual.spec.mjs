import { test, expect, configurations, openDemo } from '../../../test/visual/component-fixture.mjs';

for (const dpr of [1, 1.25, 2]) {
    test.describe(`text DPR ${dpr}`, () => {
        test.use({ deviceScaleFactor: dpr });
        for (const config of configurations) {
            test(`${config.designSystem} ${config.colorMode} adaptive text`, { tag: ['@rc-canvas'] }, async ({ page, previewOrigin }, info) => {
                await openDemo(page, previewOrigin, 'rc-canvas', 'text-comparison.demo.tsx', config);
                const region = page.getByRole('region', { name: 'HTML 与画布文字对照', exact: true });
                const canvas = region.locator('canvas');
                await expect(canvas).toBeVisible();
                await expect.poll(() => canvas.evaluate(node => node.width / 960)).toBeCloseTo(dpr, 2);
                let previousZoom = 1;
                for (const zoom of [1, 0.75, 0.5, 0.25, 2]) {
                    if (zoom !== previousZoom) {
                        // This matrix verifies exact raster scales. Native wheel
                        // injection is normalized by Windows/DPR, so dispatch a
                        // CSS-pixel wheel delta through the real Viewport handler.
                        await canvas.dispatchEvent('wheel', { deltaY: (1 - zoom / previousZoom) / 0.001, deltaMode: 0 });
                        await expect(region).toContainText(`缩放 ${Math.round(zoom * 100)}%`);
                        previousZoom = zoom;
                    }
                    // Allow the documented 100ms settling delay and a GPU frame.
                    await page.waitForTimeout(180);
                    const pixels = await canvas.evaluate(node => {
                        const gl = node.getContext('webgl2');
                        const data = new Uint8Array(node.width * node.height * 4);
                        gl.readPixels(0, 0, node.width, node.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
                        return { error: gl.getError(), ink: data.some((value, index) => index % 4 === 3 && value > 0) };
                    });
                    expect(pixels).toEqual({ error: 0, ink: true });
                    const path = info.outputPath(`text-${zoom}.png`);
                    await region.screenshot({ path });
                    await info.attach(`HTML-SDF-auto-${zoom}`, { path, contentType: 'image/png' });
                }
            });
        }
    });
}
