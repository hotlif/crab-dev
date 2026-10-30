import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} flowing`, { tag: ['@rc-canvas', '@matrix', '@motion', '@chromium-only'], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size: 'medium', density: 'standard', state: 'flowing' }) } }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-canvas', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Canvas visual matrix', exact: true });
        const telemetry = scene.getByRole('region', { name: '画布局部滚动区' });
        await expect.poll(async () => Number(await telemetry.getAttribute('data-render-count'))).toBeGreaterThan(0);
        await scene.getByRole('checkbox').check();
        const before = Number(await telemetry.getAttribute('data-render-count'));
        await expect.poll(async () => Number(await telemetry.getAttribute('data-render-count'))).toBeGreaterThan(before + 4);
        await info.attach('motion-observation', { body: JSON.stringify({ before, after: Number(await telemetry.getAttribute('data-render-count')) }), contentType: 'application/json' });
        await info.attach('motion-actual', { body: await scene.screenshot({ animations: 'allow', caret: 'hide' }), contentType: 'image/png' });
    });
}
