import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
import { waitForFlowPresentation } from './flow-diagram.visual-helpers.mjs';
const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} natural flowing edges`, { tag: ['@rc-flow-diagram', '@motion', '@chromium-only'] }, async ({ page, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, 'rc-flow-diagram', spec.demo, config);
    await page.getByLabel('验收状态', { exact: true }).selectOption('motion');
    const scene = page.getByRole('region', { name: 'FlowDiagram visual matrix' });
    await expect(scene.getByLabel('布局状态')).toHaveAttribute('data-layout', 'ready');
    await waitForFlowPresentation(scene, { labels: true });
    const samples = [];
    for (let index = 0; index < 3; index++) {
        const image = await scene.screenshot({ animations: 'allow' }); samples.push(image);
        await info.attach(`natural-edge-${index}`, { body: image, contentType: 'image/png' });
        if (index < 2) await page.waitForTimeout(120);
    }
    expect(samples[0].equals(samples[2])).toBe(false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(120);
    const reduced = await scene.screenshot({ animations: 'allow' }); await page.waitForTimeout(120);
    expect(reduced.equals(await scene.screenshot({ animations: 'allow' }))).toBe(true);
    await info.attach('reduced-motion-edge', { body: reduced, contentType: 'image/png' });
});
