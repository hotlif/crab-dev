import { Buffer } from 'node:buffer';
import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
import { settleChart } from './bar-chart.visual-helpers.mjs';
const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} natural data transition`, { tag: ['@rc-bar-chart', '@motion', '@chromium-only'] }, async ({ page, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, 'rc-bar-chart', spec.demo, config);
    const scene = page.getByRole('region', { name: 'BarChart visual matrix' });
    await settleChart(page);
    const before = await scene.screenshot({ animations: 'allow' });
    const refresh = page.getByRole('button', { name: '刷新数据', exact: true });
    await refresh.evaluate(button => {
        globalThis.__crabChartMotion = new Promise(resolve => {
            button.addEventListener('click', () => {
                const canvas = document.querySelector('section[aria-label="BarChart visual matrix"] canvas');
                const started = performance.now();
                const frames = [{ time: started, png: canvas.toDataURL('image/png') }];
                function sample(time) {
                    frames.push({ time, png: canvas.toDataURL('image/png') });
                    if (time - started < 1200) requestAnimationFrame(sample);
                    else resolve(frames);
                }
                requestAnimationFrame(sample);
            }, { capture: true, once: true });
        });
    });
    await refresh.click();
    const frames = await page.evaluate(() => globalThis.__crabChartMotion);
    const distinct = [...new Map(frames.map(frame => [frame.png, frame])).values()];
    // Remote screenshots can arrive after Apple's short transition has ended.
    // Sample the real retained GPU bitmap on natural browser frames instead.
    expect(distinct.length).toBeGreaterThan(2);
    for (const index of [0, Math.floor(distinct.length / 2), distinct.length - 1]) {
        await info.attach(`natural-gpu-frame-${index}`, { body: Buffer.from(distinct[index].png.split(',')[1], 'base64'), contentType: 'image/png' });
    }
    const after = await scene.screenshot({ animations: 'allow' });
    expect(before.equals(after)).toBe(false);
    await info.attach('before-data-transition', { body: before, contentType: 'image/png' });
    await info.attach('after-data-transition', { body: after, contentType: 'image/png' });
    await expect(scene).toHaveAttribute('data-revision', '1');
    await info.attach('motion-window', { body: JSON.stringify({ offsets: frames.map(frame => frame.time - frames[0].time), distinctPaints: distinct.length, unit: 'milliseconds', animations: 'natural requestAnimationFrame; actual retained GPU bitmaps; no seeking or pausing' }), contentType: 'application/json' });
});
