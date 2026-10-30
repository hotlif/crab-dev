import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, captureZoom } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} real 200%`, { tag: ['@rc-theme', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'zoom-200' }) } }, async ({ page, previewOrigin, realZoom }, info) => {
        await openDemo(page, previewOrigin, 'rc-theme', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Theme visual matrix', exact: true });
        const input = scene.getByRole('textbox'); await input.fill('Theme draft at real browser zoom');
        await realZoom.set200(page); await input.scrollIntoViewIfNeeded(); await input.press('Shift+Tab');
        await expect(input).toHaveValue('Theme draft at real browser zoom');
        expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200.png`, info);
    });
}
