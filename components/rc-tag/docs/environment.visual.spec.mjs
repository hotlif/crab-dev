import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: Boolean(environment.hasTouch) });
        test('component environment', { tag: ['@rc-tag', '@environment', ...(environment.hasTouch ? ['@chromium-only'] : [])], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id, size: 'medium', density: 'standard', ...environment.config }) } }, async ({ page, previewOrigin, browserName }, info) => {
            
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-tag', spec.demo, { ...config, ...environment.config });
            await applyEnvironment(page, environment);
            const frame = page.getByRole('region', { name: 'Tag visual matrix' });
            const field = frame.getByRole('checkbox').first();
            await expect(field).toBeVisible();
            
            if (environment.hasTouch) expect(await page.evaluate(() => navigator.maxTouchPoints)).toBeGreaterThan(0);
            await settleFiniteAnimations(page);
            const box = await frame.boundingBox();
            expect(box.width).toBeGreaterThan(0);
            expect(box.x).toBeGreaterThanOrEqual(-1);
            expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
            
            await info.attach('geometry', { body: JSON.stringify({ component: box, viewport: page.viewportSize() }), contentType: 'application/json' });
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-environment-${environment.id}.png`, info, browserName);
        });
    });
}

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} configuration retention`, { tag: ['@rc-tag', '@environment'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'configuration-retention' }) } }, async ({ page, previewOrigin, browserName }, info) => {
    
    const root = await openDemo(page, previewOrigin, 'rc-tag', spec.demo, config);
    const frame = page.getByRole('region', { name: 'Tag visual matrix' });
    const field = frame.getByRole('checkbox').first();
    const original = await field.elementHandle();
    await field.click();
    const next = { type: 'crab:preview-config', designSystem: config.designSystem === 'md3' ? 'apple' : config.designSystem === 'apple' ? 'shadcn' : 'md3', colorMode: config.colorMode === 'light' ? 'dark' : 'light', size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8c3cc8', nonce: 'visual-retention' };
    await page.evaluate(configuration => globalThis.postMessage(configuration, globalThis.location.origin), next);
    await expect(root).toHaveAttribute('data-crab-design', next.designSystem);
    await expect(root).toHaveAttribute('data-theme', next.colorMode);
    await expect(root).toHaveAttribute('data-crab-size', next.size);
    await expect(root).toHaveAttribute('data-crab-density', next.density);
    expect(await field.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(field).toHaveAttribute('aria-checked', 'true');
    await settleFiniteAnimations(page);
    await captureVisual(frame, `${config.designSystem}-${config.colorMode}-to-${next.designSystem}-${next.colorMode}-retention.png`, info, browserName);
});
