import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
import { measureTextContrast } from '../../../test/visual/text-contrast.mjs';
const spec = await readVisualSpec(import.meta.url);
const nestedBrandCount = new Set(configurations.map(config => config.designSystem)).size + 1;
for (const config of configurations) for (const state of spec.states) {
    test(`${config.designSystem} ${config.colorMode} ${state}`, { tag: ['@rc-theme', '@matrix'], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size: 'medium', density: 'standard', state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-theme', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Theme visual matrix', exact: true });
        if (state === 'nested') await scene.getByLabel('验收状态').selectOption(state);
        if (state === 'focus-visible') { await scene.getByLabel('验收状态').focus(); await page.keyboard.press('Tab'); await expect(scene.getByRole('textbox')).toBeFocused(); }
        const brands = scene.locator('[data-role="brand"]');
        await expect(brands).toHaveCount(state === 'nested' ? nestedBrandCount : 1);
        const colors = await brands.evaluateAll(nodes => nodes.map(node => { const style = globalThis.getComputedStyle(node); return { text: style.color, surface: style.backgroundColor, radius: style.borderRadius }; }));
        expect(colors.every(value => value.text !== value.surface && value.surface !== 'rgba(0, 0, 0, 0)')).toBe(true);
        if (state === 'nested') expect(new Set(colors.slice(1).map(value => value.radius)).size).toBeGreaterThan(1);
        await info.attach('resolved-boundaries', { body: JSON.stringify(colors), contentType: 'application/json' });
        await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${state}.png`, info, browserName);
    });
}
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`theme ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: environment.hasTouch ?? false });
        test('environment and live boundary', { tag: ['@rc-theme', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-theme', spec.demo, { ...config, ...environment.config });
            const scene = page.getByRole('region', { name: 'Theme visual matrix', exact: true });
            await scene.getByRole('textbox').fill('长文本与草稿 Theme boundary draft remains unchanged');
            expect(await scene.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            if (environment.id === 'forced-colors') {
                await expect(scene.locator('[data-role="brand"]')).toHaveCSS('forced-color-adjust', 'none');
                const contrast = await scene.evaluate(measureTextContrast);
                expect(contrast.failures).toEqual([]);
                await info.attach('system-palette-text-contrast', { body: JSON.stringify(contrast), contentType: 'application/json' });
            }
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        });
    });
}
