import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
import { settleChart } from './bar-chart.visual-helpers.mjs';

const spec = await readVisualSpec(import.meta.url);
async function capture(scene, name, browserName, info) {
    await captureVisual(scene, name, info, browserName);
}

for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-bar-chart', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-bar-chart', spec.demo, { ...config, size, density });
        const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
        const inputMode = ['empty', 'horizontal', 'stacked', 'negative'].includes(state) ? state : 'default';
        await page.getByLabel('验收状态', { exact: true }).selectOption(inputMode);
        const bars = scene.getByRole('group', { name: 'Revenue chart', exact: true }).getByRole('button');
        const legends = scene.getByRole('group', { name: '图例', exact: true }).getByRole('button');
        if (state === 'empty') await expect(bars).toHaveCount(0);
        else {
            await expect(bars).toHaveCount(8);
            await expect(scene.getByRole('table', { name: 'Revenue chart' })).toHaveCount(1);
            if (state === 'focus-visible') {
                await legends.last().focus(); await page.keyboard.press('Tab');
                await expect(bars.first()).toBeFocused();
                expect(await bars.first().evaluate(node => node.matches(':focus-visible'))).toBe(true);
                await page.keyboard.press('ArrowRight'); await expect(bars.nth(1)).toBeFocused();
            }
            if (state === 'selected') { await legends.first().click(); await expect(legends.first()).toHaveAttribute('aria-pressed', 'false'); await expect(bars).toHaveCount(4); }
            if (state === 'refresh') { await page.getByRole('button', { name: '刷新数据', exact: true }).click(); await expect(scene).toHaveAttribute('data-revision', '1'); await expect(bars.first()).toHaveAttribute('aria-label', /180/); }
            if (state === 'hover') {
                // Accessible buttons use target layout geometry; the Canvas hit
                // regions still follow the natural growing bars until it ends.
                await settleChart(page);
                const bar = await bars.first().boundingBox(), canvas = scene.locator('canvas').first(), bounds = await canvas.boundingBox();
                await canvas.hover({ position: { x: bar.x + bar.width / 2 - bounds.x, y: bar.y + bar.height / 2 - bounds.y } });
                await expect(scene.locator('[aria-hidden=true]').last()).toContainText('收入');
            }
        }
        if (state === 'pressed') { await legends.first().hover(); await page.mouse.down(); expect(await legends.first().evaluate(node => node.matches(':active'))).toBe(true); }
        try { await settleChart(page, { empty: state === 'empty' }); await capture(scene, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, browserName, info); }
        finally { if (state === 'pressed') await page.mouse.up(); }
    });
}

for (const environment of environmentCases) test.describe('BarChart environment ' + environment.id, () => {
    test.use({ hasTouch: environment.hasTouch ?? false });
    for (const config of configurations) test(config.designSystem + ' ' + config.colorMode, { tag: ['@rc-bar-chart', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await openDemo(page, previewOrigin, 'rc-bar-chart', spec.demo, { ...config, ...environment.config });
        await page.getByLabel('验收状态', { exact: true }).selectOption('long-text');
        const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
        const legend = scene.getByRole('group', { name: environment.config?.locale === 'en-US' ? 'Legend' : '图例', exact: true }).getByRole('button').first();
        if (environment.hasTouch) {
            const bounds = await legend.boundingBox(); expect(bounds.height).toBeGreaterThanOrEqual(44); expect(bounds.width).toBeGreaterThanOrEqual(44);
            await legend.tap(); await expect(legend).toHaveAttribute('aria-pressed', 'false');
        } else {
            await legend.focus(); await page.keyboard.press('Tab');
            expect(await scene.evaluate(node => node.contains(document.activeElement))).toBe(true);
        }
        await settleChart(page);
        expect(await scene.evaluate(node => node.getBoundingClientRect().right <= globalThis.innerWidth + 1)).toBe(true);
        await capture(scene, config.designSystem + '-' + config.colorMode + '-' + environment.id + '.png', browserName, info);
    });
});

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} hidden series and live data survive configuration`, { tag: ['@rc-bar-chart', '@boundary'] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, 'rc-bar-chart', spec.demo, config);
    const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
    const legend = scene.getByRole('group', { name: '图例', exact: true }).getByRole('button').first();
    await legend.click(); await expect(legend).toHaveAttribute('aria-pressed', 'false');
    await page.getByRole('button', { name: '刷新数据', exact: true }).click();
    const canvas = await scene.locator('canvas').first().elementHandle();
    for (const next of configurations) {
        await page.evaluate(configuration => globalThis.postMessage({ type: 'crab:preview-config', ...configuration, size: 'large', density: 'comfortable', direction: 'rtl' }, globalThis.location.origin), next);
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-crab-design', next.designSystem);
        expect(await canvas.evaluate(node => node.isConnected)).toBe(true);
        await expect(legend).toHaveAttribute('aria-pressed', 'false'); await expect(scene).toHaveAttribute('data-revision', '1');
        await expect(scene.getByRole('group', { name: 'Revenue chart', exact: true }).getByRole('button')).toHaveCount(4);
    }
});
