import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} medium standard default`, { tag: ['@rc-token-global', '@matrix'], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size: 'medium', density: 'standard', state: 'default' }) } }, async ({ page, previewOrigin, browserName }, info) => {
        const root = await openDemo(page, previewOrigin, 'rc-token-global', spec.demo, config);
        const swatch = root.locator('[aria-hidden="true"]');
        const color = await swatch.evaluate(node => globalThis.getComputedStyle(node).backgroundColor);
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
        await expect(root).toContainText('Blue 600');
        await info.attach('raw-swatch', { body: JSON.stringify({ color, bounds: await swatch.boundingBox() }), contentType: 'application/json' });
        await captureVisual(root, `${config.designSystem}-${config.colorMode}-default.png`, info, browserName);
    });
}
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`primitives ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: environment.hasTouch ?? false });
        test('labeled primitive environment', { tag: ['@rc-token-global', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await applyEnvironment(page, environment);
            const root = await openDemo(page, previewOrigin, 'rc-token-global', spec.demo, { ...config, ...environment.config });
            expect(await root.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            await expect(root).toContainText('原始色块');
            await captureVisual(root, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        });
    });
}
