import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, captureZoom } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} real 200%`, { tag: ['@rc-token-global', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'zoom-200' }) } }, async ({ page, previewOrigin, realZoom }, info) => {
        const root = await openDemo(page, previewOrigin, 'rc-token-global', spec.demo, config);
        const swatch = root.locator('[aria-hidden="true"]');
        const width = (await swatch.boundingBox()).width;
        await realZoom.set200(page); await root.scrollIntoViewIfNeeded();
        expect((await swatch.boundingBox()).width).toBeCloseTo(width, 1);
        await expect(root).toContainText('Blue 600');
        expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200.png`, info);
    });
}
