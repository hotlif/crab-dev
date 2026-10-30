import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const state of spec.states) {
    test(`${config.designSystem} ${config.colorMode} ${state}`, { tag: ['@rc-token-semantic', '@matrix'], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size: 'medium', density: 'standard', state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-token-semantic', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Semantic token visual matrix' });
        if (state === 'focus-visible') { await page.locator('body').click({ position: { x: 1, y: 1 } }); await scene.getByRole('button').focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await expect(scene.getByRole('button')).toBeFocused(); }
        const pairs = await scene.locator('div').evaluateAll(nodes => nodes.map(node => { const style = globalThis.getComputedStyle(node); return { color: style.color, background: style.backgroundColor }; }));
        expect(pairs.every(pair => pair.color !== pair.background)).toBe(true);
        await info.attach('resolved-pairs', { body: JSON.stringify(pairs), contentType: 'application/json' });
        await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${state}.png`, info, browserName);
    });
}
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`semantic ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: environment.hasTouch ?? false });
        test('role environment', { tag: ['@rc-token-semantic', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await applyEnvironment(page, environment);
            const root = await openDemo(page, previewOrigin, 'rc-token-semantic', spec.demo, { ...config, ...environment.config });
            const scene = root.getByRole('region', { name: 'Semantic token visual matrix' });
            expect(await scene.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        });
    });
}
