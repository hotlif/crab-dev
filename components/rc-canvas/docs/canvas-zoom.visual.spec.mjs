import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, captureZoom } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} real 200%`, { tag: ['@rc-canvas', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'zoom-200' }) } }, async ({ page, previewOrigin, realZoom }, info) => {
        await openDemo(page, previewOrigin, 'rc-canvas', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Canvas visual matrix', exact: true });
        await expect.poll(async () => Number(await scene.getByRole('region', { name: '画布局部滚动区' }).getAttribute('data-render-count'))).toBeGreaterThan(0);
        await realZoom.set200(page);
        const canvas = scene.locator('canvas'); await canvas.scrollIntoViewIfNeeded();
        await expect.poll(() => canvas.evaluate(node => Math.abs(node.width - node.getBoundingClientRect().width * globalThis.devicePixelRatio))).toBeLessThanOrEqual(1);
        expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200.png`, info);
    });
}
