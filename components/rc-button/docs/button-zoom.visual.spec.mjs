import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, captureZoom, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} real 200%`, { tag: ['@rc-button', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'zoom-200' }) } }, async ({ page, previewOrigin, realZoom }, info) => {
        await openDemo(page, previewOrigin, 'rc-button', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Button visual matrix' });
        await scene.getByLabel('验收状态', { exact: true }).selectOption('variants');
        await realZoom.set200(page);
        await scene.scrollIntoViewIfNeeded();
        const action = scene.locator('[data-visual-scene] button').first();
        await action.focus(); await page.keyboard.press('Enter'); await settleFiniteAnimations(page);
        expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200-actions.png`, info);
        await scene.getByRole('button', { name: '保存完整工作区 · Save the complete workspace' }).scrollIntoViewIfNeeded();
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200-variants.png`, info);
    });
}
