import { Buffer } from 'node:buffer';
import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
import { sampleFlowFrames, waitForFlowPresentation } from './flow-diagram.visual-helpers.mjs';
const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} natural flowing edges`, { tag: ['@rc-flow-diagram', '@motion', '@chromium-only'] }, async ({ page, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, config);
    await page.getByLabel('验收状态', { exact: true }).selectOption('motion');
    const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' });
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
    await waitForFlowPresentation(scene, { labels: true });
    // Remote screenshots can sample identical phases of a repeating dash.
    // Observe actual GPU paints on natural frames without changing the clock.
    const canvas = scene.locator('canvas').first();
    const frames = await sampleFlowFrames(canvas, 900);
    const paints = [...new Map(frames.map(frame => [frame.png, frame])).values()];
    expect(paints.length).toBeGreaterThan(2);
    for (const index of [0, Math.floor(paints.length / 2), paints.length - 1]) {
        await info.attach(`natural-edge-${index}`, { body: Buffer.from(paints[index].png.split(',')[1], 'base64'), contentType: 'image/png' });
    }
    await info.attach('natural-edge-scene', { body: await scene.screenshot({ animations: 'allow' }), contentType: 'image/png' });
    await info.attach('natural-edge-times', { body: JSON.stringify({ offsets: frames.map(frame => frame.time - frames[0].time), distinctPaints: paints.length }), contentType: 'application/json' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await waitForFlowPresentation(scene);
    const reduced = await sampleFlowFrames(canvas, 240);
    expect(new Set(reduced.map(frame => frame.png)).size).toBe(1);
    await info.attach('reduced-motion-edge', { body: await scene.screenshot({ animations: 'allow' }), contentType: 'image/png' });
});
