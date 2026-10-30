import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';
import { settleChart } from './bar-chart.visual-helpers.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`${config.designSystem} ${config.colorMode} chart at real 200%`, {
    tag: ['@rc-bar-chart', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-bar-chart', spec.demo, config);
    const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
    const legends = scene.getByRole('group', { name: '图例', exact: true }).getByRole('button');
    const bars = scene.getByRole('group', { name: 'Revenue chart', exact: true }).getByRole('button');
    await expect(bars).toHaveCount(8);
    await legends.first().click(); await expect(legends.first()).toHaveAttribute('aria-pressed', 'false');
    await page.getByRole('button', { name: '刷新数据', exact: true }).click();
    await expect(scene).toHaveAttribute('data-revision', '1'); await expect(bars).toHaveCount(4);
    await settleChart(page);
    const canvas = await scene.locator('canvas').first().elementHandle();
    await realZoom.set200(page);
    await scene.scrollIntoViewIfNeeded(); await settleFiniteAnimations(page); await settleChart(page);
    expect(await canvas.evaluate(node => node.isConnected)).toBe(true);
    await expect(scene).toHaveAttribute('data-revision', '1'); await expect(legends.first()).toHaveAttribute('aria-pressed', 'false');
    await expect(bars).toHaveCount(4);
    await expect(scene.getByRole('table', { name: 'Revenue chart' }).getByRole('columnheader')).toHaveCount(3);
    await legends.last().focus(); await page.keyboard.press('Tab'); await expect(bars.first()).toBeFocused();
    await page.keyboard.press('Enter'); await expect(scene.getByLabel('已激活数据')).not.toContainText('尚未激活数据');
    const geometry = await scene.evaluate(node => ({ overflow: getComputedStyle(node).overflowX, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth }));
    expect(geometry.overflow).toBe('auto'); expect(geometry.clientWidth).toBeGreaterThan(0);
    await info.attach('zoom-chart-state', { body: JSON.stringify({ geometry, revision: await scene.getAttribute('data-revision'), barCount: await bars.count() }), contentType: 'application/json' });
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-chart.png`, info);
});
