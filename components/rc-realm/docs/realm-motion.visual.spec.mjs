import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });

for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) test(`${config.designSystem} ${config.colorMode} ${size} ${density} loading`, { tag: ['@rc-realm', '@matrix', '@motion', '@chromium-only'], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state: 'loading' }) } }, async ({ page, previewOrigin }, info) => {
    await openDemo(page, previewOrigin, 'rc-realm', spec.demo, { ...config, size, density });
    const scene = page.getByRole('region', { name: 'Realm visual matrix' });
    await expect(page.getByRole('button', { name: '完成请求', exact: true })).toBeEnabled();
    await expect(scene.locator('[aria-busy]').first()).toHaveAttribute('aria-busy', 'true');
    const frames = [];
    for (let index = 0; index < 3; index++) {
        frames.push(await scene.evaluate(node => ({ time: performance.now(), animations: node.getAnimations({ subtree: true }).map(animation => ({ time: animation.currentTime, state: animation.playState })) })));
        await info.attach(`loading-${index}`, { body: await scene.screenshot({ animations: 'allow' }), contentType: 'image/png' });
        if (index < 2) await page.waitForTimeout(120);
    }
    expect(frames[2].time).toBeGreaterThan(frames[0].time);
    expect(frames.some(frame => frame.animations.some(animation => animation.state === 'running'))).toBe(true);
    await info.attach('natural-time-series', { body: JSON.stringify(frames, null, 2), contentType: 'application/json' });
    await page.getByRole('button', { name: '完成请求', exact: true }).click(); await expect(scene.getByRole('textbox')).toBeVisible();
});
