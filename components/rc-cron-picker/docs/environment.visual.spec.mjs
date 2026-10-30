import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: Boolean(environment.hasTouch) });
        test('component environment', { tag: ['@rc-cron-picker', '@environment', ...(environment.hasTouch ? ['@chromium-only'] : [])], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id, size: 'medium', density: 'standard', ...environment.config }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await page.clock.setFixedTime(new Date('2026-06-16T04:00:00Z'));
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-cron-picker', spec.demo, { ...config, ...environment.config });
            await applyEnvironment(page, environment);
            const frame = page.getByRole('region', { name: 'CronPicker visual matrix' });
            const field = frame.getByRole('textbox', { name: '执行计划', exact: true });
            await expect(field).toBeVisible();
            await field.click(); await expect(page.getByRole('dialog')).toBeVisible();
            if (environment.hasTouch) expect(await page.evaluate(() => navigator.maxTouchPoints)).toBeGreaterThan(0);
            await settleFiniteAnimations(page);
            const box = await frame.boundingBox();
            expect(box.width).toBeGreaterThan(0);
            expect(box.x).toBeGreaterThanOrEqual(-1);
            expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
            const dialog = page.getByRole('dialog'); const popup = await dialog.boundingBox(); expect(popup.x).toBeGreaterThanOrEqual(-1); expect(popup.x + popup.width).toBeLessThanOrEqual(page.viewportSize().width + 1); expect(popup.y).toBeGreaterThanOrEqual(-1); expect(popup.y + popup.height).toBeLessThanOrEqual(page.viewportSize().height + 1);
            await info.attach('geometry', { body: JSON.stringify({ component: box, viewport: page.viewportSize() }), contentType: 'application/json' });
            await captureVisual(page, `${config.designSystem}-${config.colorMode}-environment-${environment.id}.png`, info, browserName);
        });
    });
}

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} configuration retention`, { tag: ['@rc-cron-picker', '@environment'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'configuration-retention' }) } }, async ({ page, previewOrigin, browserName }, info) => {
    await page.clock.setFixedTime(new Date('2026-06-16T04:00:00Z'));
    const root = await openDemo(page, previewOrigin, 'rc-cron-picker', spec.demo, config);
    const frame = page.getByRole('region', { name: 'CronPicker visual matrix' });
    const field = frame.getByRole('textbox', { name: '执行计划', exact: true });
    const original = await field.elementHandle();
    await field.fill('*/10 * * * *');
    const next = { type: 'crab:preview-config', designSystem: config.designSystem === 'md3' ? 'apple' : config.designSystem === 'apple' ? 'shadcn' : 'md3', colorMode: config.colorMode === 'light' ? 'dark' : 'light', size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8c3cc8', nonce: 'visual-retention' };
    await page.evaluate(configuration => globalThis.postMessage(configuration, globalThis.location.origin), next);
    await expect(root).toHaveAttribute('data-crab-design', next.designSystem);
    await expect(root).toHaveAttribute('data-theme', next.colorMode);
    await expect(root).toHaveAttribute('data-crab-size', next.size);
    await expect(root).toHaveAttribute('data-crab-density', next.density);
    expect(await field.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(field).toHaveValue('*/10 * * * *'); await expect(frame.getByRole('status')).toHaveText('30 9 * * 1-5');
    await settleFiniteAnimations(page);
    await captureVisual(page, `${config.designSystem}-${config.colorMode}-to-${next.designSystem}-${next.colorMode}-retention.png`, info, browserName);
});
