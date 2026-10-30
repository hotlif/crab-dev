import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
async function capture(scene, name, browserName, info) {
    await captureVisual(scene, name, info, browserName);
}

for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(state => !['loading', 'web-component-var', 'web-component-module'].includes(state))) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-realm', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-realm', spec.demo, { ...config, size, density });
        const scene = page.getByRole('region', { name: 'Realm visual matrix' });
        const complete = page.getByRole('button', { name: '完成请求', exact: true });
        await expect(complete).toBeEnabled();
        if (state === 'sandbox') {
            await page.getByRole('button', { name: '切换协议', exact: true }).click();
            await expect(scene).toHaveAttribute('data-protocol', 'mount'); await expect(complete).toBeEnabled();
        }
        if (state === 'error') {
            await page.getByRole('button', { name: '请求失败', exact: true }).click();
            await expect(scene.getByRole('alert')).toBeVisible(); await expect(scene.getByRole('button', { name: '重试', exact: true })).toBeEnabled();
        } else {
            await complete.click();
            const input = scene.getByRole('textbox'); await expect(input).toBeVisible();
            await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'false');
            if (state === 'focus-visible') {
                await page.getByRole('button', { name: '切换协议', exact: true }).focus(); await page.keyboard.press('Tab');
                await expect(input).toBeFocused(); expect(await input.evaluate(node => node.matches(':focus-visible'))).toBe(true);
            }
            if (state === 'sandbox') expect(await input.evaluate(node => node.getRootNode() instanceof globalThis.ShadowRoot)).toBe(true);
        }
        await settleFiniteAnimations(page);
        await capture(scene, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, browserName, info);
    });
}

for (const config of configurations) for (const protocol of ['component', 'mount']) test(`${config.designSystem} ${config.colorMode} ${protocol} draft survives config`, { tag: ['@rc-realm', '@boundary'] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, 'rc-realm', spec.demo, config);
    const complete = page.getByRole('button', { name: '完成请求', exact: true }); await expect(complete).toBeEnabled();
    if (protocol === 'mount') { await page.getByRole('button', { name: '切换协议', exact: true }).click(); await expect(complete).toBeEnabled(); }
    await complete.click();
    const scene = page.getByRole('region', { name: 'Realm visual matrix' }), input = scene.getByRole('textbox');
    await input.fill('保留 remote draft 2026'); const original = await input.elementHandle();
    for (const next of configurations) {
        await page.evaluate(config => globalThis.postMessage({ type: 'crab:preview-config', ...config, size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8b3c75' }, location.origin), next);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-crab-design', next.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true); await expect(input).toHaveValue('保留 remote draft 2026');
        expect(await input.evaluate(node => getComputedStyle(node).direction)).toBe('rtl');
    }
});

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} retry uses a fresh real request`, { tag: ['@rc-realm', '@interaction'] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, 'rc-realm', spec.demo, config);
    const complete = page.getByRole('button', { name: '完成请求', exact: true }); await expect(complete).toBeEnabled();
    await page.getByRole('button', { name: '请求失败', exact: true }).click();
    const scene = page.getByRole('region', { name: 'Realm visual matrix' }); await expect(scene.getByRole('alert')).toBeVisible();
    await scene.getByRole('button', { name: '重试', exact: true }).click(); await expect(complete).toBeEnabled();
    await complete.click(); await expect(scene.getByRole('textbox')).toHaveValue('CRAB-2026'); await expect(scene.getByRole('alert')).toHaveCount(0);
});

for (const environment of environmentCases) test.describe('Realm environment ' + environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(config.designSystem + ' ' + config.colorMode, { tag: ['@rc-realm', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, 'rc-realm', spec.demo, { ...config, ...environment.config });
        const complete = page.getByRole('button', { name: '完成请求', exact: true }); await expect(complete).toBeEnabled();
        if (environment.hasTouch) {
            const bounds = await complete.locator(':scope > span[aria-hidden=true]').first().boundingBox();
            expect(bounds.height).toBeGreaterThanOrEqual(44); expect(bounds.width).toBeGreaterThanOrEqual(44); await complete.tap();
        } else await complete.click();
        const scene = page.getByRole('region', { name: 'Realm visual matrix' }), input = scene.getByRole('textbox');
        await input.fill('企业级远程内容与保留草稿 Enterprise remote content and preserved draft');
        await page.getByRole('button', { name: '切换协议', exact: true }).focus(); await page.keyboard.press('Tab'); await expect(input).toBeFocused();
        expect(await scene.evaluate(node => node.getBoundingClientRect().right <= globalThis.innerWidth + 1)).toBe(true);
        await capture(scene, config.designSystem + '-' + config.colorMode + '-' + environment.id + '.png', browserName, info);
    });
});
