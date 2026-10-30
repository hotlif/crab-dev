import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, captureZoom } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} real 200%`, { tag: ['@rc-config-provider', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'zoom-200' }) } }, async ({ page, previewOrigin, realZoom }, info) => {
        await openDemo(page, previewOrigin, 'rc-config-provider', spec.demo, config);
        const scene = page.getByRole('region', { name: 'ConfigProvider visual matrix', exact: true });
        const input = scene.getByRole('textbox', { name: '业务草稿' }); await input.fill('200% draft');
        await realZoom.set200(page); await scene.getByLabel('验收状态').selectOption('portal');
        const portal = page.getByRole('region', { name: 'Portal boundary', exact: true });
        for (const [attribute, value] of Object.entries({ 'data-crab-design': config.designSystem, 'data-theme': config.colorMode, 'data-crab-size': 'medium', 'data-crab-density': 'standard', lang: 'zh-CN', dir: 'ltr' })) await expect(portal).toHaveAttribute(attribute, value);
        expect(await portal.evaluate(node => node.nonce)).toBe('visual-boundary');
        await expect(portal.getByRole('textbox')).toHaveValue('200% draft');
        await portal.scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth + 1)).toBe(true);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom200-portal.png`, info);
    });
}
