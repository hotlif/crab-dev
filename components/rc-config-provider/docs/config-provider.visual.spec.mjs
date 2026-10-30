import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const cross = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-config-provider', '@matrix', ...(!cross ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-config-provider', spec.demo, { ...config, size, density });
        const scene = page.getByRole('region', { name: 'ConfigProvider visual matrix', exact: true });
        if (state !== 'focus-visible') await scene.getByLabel('验收状态').selectOption(state);
        const input = scene.getByRole('textbox', { name: '业务草稿' });
        await input.fill('跨边界保留 Draft');
        await expect(scene.getByRole('region', { name: 'Inherited boundary', exact: true }).locator('[data-config-summary]')).toContainText(`${config.designSystem} / ${config.colorMode} / ${size} / ${density}`);
        const nested = scene.getByRole('region', { name: 'Nested boundary', exact: true });
        await expect(nested.locator('[data-config-summary]')).toContainText(`/ small / ${density}`);
        if (state === 'focus-visible') { await scene.getByLabel('验收状态').focus(); await page.keyboard.press('Tab'); await expect(input).toBeFocused(); }
        if (state === 'portal') {
            const portal = page.getByRole('region', { name: 'Portal boundary', exact: true });
            await expect(portal).toHaveAttribute('data-crab-design', config.designSystem);
            await expect(portal).toHaveAttribute('data-crab-density', density);
            await expect(portal.getByRole('textbox')).toHaveValue('跨边界保留 Draft');
            expect(await portal.evaluate(node => node.nonce)).toBe('visual-boundary');
        }
        if (state === 'brand') await expect(scene.locator('[data-crab-brand-style]')).toHaveCount(2);
        await captureVisual(state === 'portal' ? page : scene, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
    });
}
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`provider ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: environment.hasTouch ?? false });
        test('environment and retained draft', { tag: ['@rc-config-provider', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await applyEnvironment(page, environment);
            const root = await openDemo(page, previewOrigin, 'rc-config-provider', spec.demo, { ...config, ...environment.config });
            const input = root.getByRole('textbox', { name: '业务草稿' });
            if (environment.hasTouch) { await input.tap(); await expect(input).toBeFocused(); }
            await input.fill('保持输入 Draft across all configurations');
            const original = await input.elementHandle();
            for (const next of configurations) {
                await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, globalThis.location.origin), { ...next, size: 'large', density: 'compact', locale: 'en-US', direction: 'rtl' });
                await expect(root).toHaveAttribute('data-crab-design', next.designSystem);
                expect(await original.evaluate(node => node.isConnected)).toBe(true);
                await expect(input).toHaveValue('保持输入 Draft across all configurations');
            }
            // Retention exercises other configurations; the screenshot must
            // return to the environment and design declared by this case.
            const restored = { ...config, size: 'medium', density: 'standard', locale: 'zh-CN', direction: 'ltr', brandColor: null, ...environment.config };
            await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, globalThis.location.origin), restored);
            for (const [attribute, value] of Object.entries({ 'data-crab-design': restored.designSystem, 'data-theme': restored.colorMode, 'data-crab-size': restored.size, 'data-crab-density': restored.density, lang: restored.locale, dir: restored.direction })) await expect(root).toHaveAttribute(attribute, value);
            expect(await original.evaluate(node => node.isConnected)).toBe(true);
            await expect(input).toHaveValue('保持输入 Draft across all configurations');
            expect(await root.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            await captureVisual(root, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        });
    });
}
