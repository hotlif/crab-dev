import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, captureZoom } from '../../../test/visual/component-fixture.mjs';
import { sourceToggle, highlightedSource, assertToolbarReachable, inspectSourceScroll } from './preview-visual-support.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} real 200%`, { tag: ['@rc-component-preview', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'zoom-200' }) } }, async ({ page, previewOrigin, realZoom }, info) => {
        await openDemo(page, previewOrigin, 'rc-component-preview', spec.demo, config);
        const scene = page.getByRole('region', { name: 'ComponentPreview visual matrix' });
        await scene.getByRole('textbox').fill('Retained draft at browser zoom');
        await realZoom.set200(page);
        const action = sourceToggle(scene); await action.click();
        await highlightedSource(scene);
        await expect(scene.getByRole('textbox')).toHaveValue('Retained draft at browser zoom');
        await assertToolbarReachable(scene, page, info);
        await inspectSourceScroll(scene, page, info);
        await action.scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200.png`, info);
    });
}
