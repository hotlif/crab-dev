import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
import { settleChart } from './bar-chart.visual-helpers.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`${config.designSystem} ${config.colorMode} density changes HTML rhythm and preserves plot geometry`, {
    tag: ['@rc-bar-chart', '@geometry'],
    annotation: { type: 'geometry', description: JSON.stringify({ ...config, scope: 'legend-tooltip-density-and-plot-invariance' }) },
}, async ({ page, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, 'rc-bar-chart', spec.demo, config);
    const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
    const legend = scene.getByRole('group', { name: '图例', exact: true });
    const bars = scene.getByRole('group', { name: 'Revenue chart', exact: true }).getByRole('button');
    const measurements = [];
    for (const density of spec.densities) {
        await page.evaluate(config => globalThis.postMessage({ type: 'crab:preview-config', ...config, size: 'medium', locale: 'zh-CN', direction: 'ltr', brandColor: null }, location.origin), { ...config, density });
        await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-crab-density', density);
        await expect(bars).toHaveCount(8); await settleChart(page);
        const canvas = scene.locator('canvas').first(), box = await canvas.boundingBox(), target = await bars.first().boundingBox();
        await canvas.hover({ position: { x: target.x + target.width / 2 - box.x, y: target.y + target.height / 2 - box.y } });
        const tooltip = scene.locator('[aria-hidden=true]').last();
        await expect(tooltip).toContainText('收入');
        const plot = await canvas.evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }));
        const barGeometry = await bars.evaluateAll(nodes => nodes.map(node => ({ x: node.style.left, y: node.style.top, width: node.style.width, height: node.style.height, label: node.getAttribute('aria-label') })));
        const legendRhythm = await legend.getByRole('button').first().evaluate(node => ({ height: node.getBoundingClientRect().height, paddingInline: parseFloat(getComputedStyle(node).paddingInlineStart), gap: parseFloat(getComputedStyle(node).columnGap) }));
        const tooltipRhythm = await tooltip.evaluate(node => ({ paddingBlock: parseFloat(getComputedStyle(node).paddingBlockStart), paddingInline: parseFloat(getComputedStyle(node).paddingInlineStart) }));
        measurements.push({ density, plot, barGeometry, legendRhythm, tooltipRhythm });
    }
    for (let index = 1; index < measurements.length; index++) {
        const previous = measurements[index - 1], current = measurements[index];
        expect(current.plot).toEqual(measurements[0].plot);
        expect(current.barGeometry).toEqual(measurements[0].barGeometry);
        expect(current.legendRhythm.height).toBeGreaterThan(previous.legendRhythm.height);
        expect(current.legendRhythm.paddingInline).toBeGreaterThan(previous.legendRhythm.paddingInline);
        expect(current.legendRhythm.gap).toBeGreaterThan(previous.legendRhythm.gap);
        expect(current.tooltipRhythm.paddingBlock).toBeGreaterThan(previous.tooltipRhythm.paddingBlock);
        expect(current.tooltipRhythm.paddingInline).toBeGreaterThan(previous.tooltipRhythm.paddingInline);
    }
    await info.attach('density-geometry', { body: JSON.stringify({ ...config, measurements }, null, 2), contentType: 'application/json' });
});
