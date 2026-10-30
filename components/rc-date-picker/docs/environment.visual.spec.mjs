import { test, expect, configurations, environmentCases, applyEnvironment, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: Boolean(environment.hasTouch) });
        test('component environment', { tag: ['@rc-date-picker', '@environment', ...(environment.hasTouch ? ['@chromium-only'] : [])], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id, size: 'medium', density: 'standard', ...environment.config }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await page.clock.setFixedTime(new Date('2026-06-16T04:00:00Z'));
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-date-picker', spec.demo, { ...config, ...environment.config });
            await applyEnvironment(page, environment);
            const frame = page.getByRole('region', { name: 'DatePicker visual matrix' });
            const field = frame.getByRole('textbox', { name: '计划日期', exact: true });
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

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} configuration retention`, { tag: ['@rc-date-picker', '@environment'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'configuration-retention' }) } }, async ({ page, previewOrigin, browserName }, info) => {
    await page.clock.setFixedTime(new Date('2026-06-16T04:00:00Z'));
    const root = await openDemo(page, previewOrigin, 'rc-date-picker', spec.demo, config);
    const frame = page.getByRole('region', { name: 'DatePicker visual matrix' });
    const field = frame.getByRole('textbox', { name: '计划日期', exact: true });
    const original = await field.elementHandle();
    await field.click(); await page.getByRole('dialog').getByRole('button', { name: '2026-06-18', exact: true }).click();
    const next = { type: 'crab:preview-config', designSystem: config.designSystem === 'md3' ? 'apple' : config.designSystem === 'apple' ? 'shadcn' : 'md3', colorMode: config.colorMode === 'light' ? 'dark' : 'light', size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8c3cc8', nonce: 'visual-retention' };
    await page.evaluate(configuration => globalThis.postMessage(configuration, globalThis.location.origin), next);
    await expect(root).toHaveAttribute('data-crab-design', next.designSystem);
    await expect(root).toHaveAttribute('data-theme', next.colorMode);
    await expect(root).toHaveAttribute('data-crab-size', next.size);
    await expect(root).toHaveAttribute('data-crab-density', next.density);
    expect(await field.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(field).toHaveValue('2026-06-15'); await expect(page.getByRole('dialog').getByRole('button', { name: '2026-06-18', exact: true })).toHaveAttribute('aria-pressed', 'true'); await expect(page.getByRole('dialog')).toHaveAttribute('data-crab-design', next.designSystem);
    await settleFiniteAnimations(page);
    await captureVisual(page, `${config.designSystem}-${config.colorMode}-to-${next.designSystem}-${next.colorMode}-retention.png`, info, browserName);
});

for (const config of configurations) test(`${config.designSystem} ${config.colorMode} time draft configuration retention`, { tag: ['@rc-date-picker', '@environment'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: 'time-draft-retention' }) } }, async ({ page, previewOrigin, browserName }, info) => {
    const root = await openDemo(page, previewOrigin, 'rc-date-picker', spec.demo, config);
    const frame = page.getByRole('region', { name: 'DatePicker visual matrix' });
    const field = frame.getByRole('textbox', { name: '秒精度时间', exact: true });
    await field.click();
    const dialog = page.getByRole('dialog');
    const hour = dialog.locator('[data-time-part="hour"] input');
    const minute = dialog.locator('[data-time-part="minute"] input');
    const original = await hour.elementHandle();
    await hour.fill('99');
    await minute.fill('42');
    const next = { type: 'crab:preview-config', designSystem: config.designSystem === 'md3' ? 'apple' : config.designSystem === 'apple' ? 'shadcn' : 'md3', colorMode: config.colorMode === 'light' ? 'dark' : 'light', size: 'large', density: 'comfortable', locale: 'en-US', direction: 'rtl', brandColor: '#8c3cc8', nonce: 'visual-time-retention' };
    await page.evaluate(configuration => globalThis.postMessage(configuration, globalThis.location.origin), next);
    await expect(root).toHaveAttribute('data-crab-design', next.designSystem);
    await expect(root).toHaveAttribute('data-theme', next.colorMode);
    await expect(root).toHaveAttribute('data-crab-size', next.size);
    await expect(root).toHaveAttribute('data-crab-density', next.density);
    await expect(dialog).toHaveAttribute('data-crab-design', next.designSystem);
    await expect(dialog).toHaveAttribute('data-theme', next.colorMode);
    expect(await hour.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(hour).toHaveValue('99');
    await expect(hour).toHaveAttribute('aria-invalid', 'true');
    await expect(minute).toHaveValue('42');
    await expect(dialog.getByRole('button', { name: 'Confirm', exact: true })).toBeDisabled();
    await expect(field).toHaveValue('09:30:15 AM');
    await expect(frame.getByRole('status')).toContainText('9:30:15');
    await settleFiniteAnimations(page);
    await captureVisual(page, `${config.designSystem}-${config.colorMode}-time-draft-retention.png`, info, browserName);
    await minute.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(field).toHaveValue('09:30:15 AM');
});
