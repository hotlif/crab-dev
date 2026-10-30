import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, captureZoom } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} real 200%`, { tag: ['@rc-token-semantic', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'zoom-200' }) } }, async ({ page, previewOrigin, realZoom }, info) => {
        await openDemo(page, previewOrigin, 'rc-token-semantic', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Semantic token visual matrix' });
        await realZoom.set200(page); await scene.getByRole('button').focus();
        await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
        await expect(scene.getByRole('button')).toBeFocused();
        expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200.png`, info);
    });
}
