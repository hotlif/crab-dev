import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
import { settleChart } from './bar-chart.visual-helpers.mjs';
const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} natural data transition`, { tag: ['@rc-bar-chart', '@motion', '@chromium-only'] }, async ({ page, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, 'rc-bar-chart', spec.demo, config);
    const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
    await settleChart(page);
    await page.getByRole('button', { name: '刷新数据', exact: true }).click();
    const samples = [];
    for (const delay of [0, 120, 900]) {
        if (delay) await page.waitForTimeout(delay);
        const image = await scene.screenshot({ animations: 'allow' }); samples.push(image);
        await info.attach(`natural-transition-${delay}`, { body: image, contentType: 'image/png' });
    }
    expect(samples[0].equals(samples[2])).toBe(false);
    await expect(scene).toHaveAttribute('data-revision', '1');
    await info.attach('motion-window', { body: JSON.stringify({ offsets: [0, 120, 1020], unit: 'milliseconds', animations: 'natural requestAnimationFrame; no seeking or pausing' }), contentType: 'application/json' });
});
