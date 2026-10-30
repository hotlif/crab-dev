import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} CronPicker at real 200%`, {
    tag: ['@rc-cron-picker', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await page.clock.setFixedTime(new Date('2026-06-16T04:00:00Z'));
    await openDemo(page, previewOrigin, 'rc-cron-picker', spec.demo, config);
    const frame = page.getByRole('region', { name: 'CronPicker visual matrix' });
    const input = frame.getByRole('textbox', { name: '执行计划', exact: true });
    const original = await input.elementHandle();
    await input.click();
    await input.fill('*/10 9 * * 1-5');
    await expect(frame.getByRole('status')).toHaveText('30 9 * * 1-5');
    await realZoom.set200(page);
    await expect(input).toHaveValue('*/10 9 * * 1-5');
    expect(await input.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(frame.getByRole('status')).toHaveText('30 9 * * 1-5');
    await info.attach('preserved-draft', { body: JSON.stringify({ draft: await input.inputValue(), committed: await frame.getByRole('status').textContent() }), contentType: 'application/json' });
    // Blur commits this valid draft by the public Cron protocol. Screenshots
    // then keep genuine keyboard focus on a non-text control, without a caret.
    await input.press('Tab');
    await expect(frame.getByRole('status')).toHaveText('*/10 9 * * 1-5');
    const dialog = page.getByRole('dialog', { name: 'Cron 表达式编辑面板' });
    await expect(dialog).toBeVisible();
    const minute = dialog.getByRole('tab', { name: '分钟', exact: true });
    await minute.focus();
    await minute.press('Tab');
    const mode = dialog.getByRole('combobox', { name: '分钟设置方式', exact: true });
    await expect(mode).toBeFocused();
    expect(await mode.evaluate(node => node.matches(':focus-visible'))).toBe(true);
    await mode.scrollIntoViewIfNeeded();
    await settleFiniteAnimations(page);
    const viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    const bounds = await mode.boundingBox();
    const popup = await dialog.boundingBox();
    expect(viewport.width).toBeLessThanOrEqual(640);
    expect(popup.x).toBeGreaterThanOrEqual(0);
    expect(popup.x + popup.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1);
    await expect(mode).toBeInViewport();
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-editor-focus.png`, info);
    const lastPreview = dialog.locator('time').last();
    await lastPreview.scrollIntoViewIfNeeded();
    await expect(lastPreview).toBeInViewport();
    await expect(input).toHaveValue('*/10 9 * * 1-5');
    await settleFiniteAnimations(page);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-preview-scroll.png`, info);
    await mode.scrollIntoViewIfNeeded();
    await mode.press('Tab');
    const start = dialog.getByRole('spinbutton', { name: '起始分钟', exact: true });
    await expect(start).toBeFocused();
    await start.press('ArrowUp');
    await start.press('Tab');
    const interval = dialog.getByRole('spinbutton', { name: '间隔（分钟）', exact: true });
    await expect(interval).toBeFocused();
    await interval.press('ArrowUp');
    await expect(start).toHaveValue('1');
    await expect(interval).toHaveValue('11');
    await expect(input).toHaveValue('1/11 9 * * 1-5');
    await expect(frame.getByRole('status')).toHaveText('1/11 9 * * 1-5');
    await interval.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(mode).toBeFocused();
    await expect(start).toBeInViewport();
    await expect(interval).toBeInViewport();
    await settleFiniteAnimations(page);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-keyboard-parameters.png`, info);
});
