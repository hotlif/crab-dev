import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} Tabs at real 200%`, {
    tag: ['@rc-tabs', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-tabs', spec.demo, config);
    const frame = page.getByRole('region', { name: 'Tabs visual matrix' });
    const draft = frame.getByRole('textbox', { name: '项目草稿', exact: true });
    const overview = frame.getByRole('tab', { name: '概览', exact: true });
    const activity = frame.getByRole('tab', { name: '活动与审计历史长标签', exact: true });
    await draft.fill('Kept panel draft at 200%');
    await draft.press('Shift+Tab');
    await expect(overview).toBeFocused();
    await overview.press('ArrowRight');
    await expect(activity).toBeFocused();
    await realZoom.set200(page);
    await expect(activity).toHaveAttribute('aria-selected', 'true');
    await expect(activity).toBeFocused();
    expect(await activity.evaluate(node => node.matches(':focus-visible'))).toBe(true);
    await activity.scrollIntoViewIfNeeded();
    await settleFiniteAnimations(page);
    const viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    const strip = await frame.getByRole('tablist').boundingBox(), selected = await activity.boundingBox();
    expect(viewport.width).toBeLessThanOrEqual(640);
    expect(strip.x + strip.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(selected.x).toBeGreaterThanOrEqual(strip.x - 1);
    expect(selected.x + selected.width).toBeLessThanOrEqual(strip.x + strip.width + 1);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-line-selected.png`, info);
    await activity.press('Home');
    await expect(draft).toHaveValue('Kept panel draft at 200%');
    const selector = page.getByLabel('页签外观', { exact: true });
    for (const variant of ['card', 'pill']) {
        await selector.selectOption(variant);
        await selector.press('Tab');
        await expect(overview).toBeFocused();
        await expect(overview).toHaveAttribute('aria-selected', 'true');
        await expect(draft).toHaveValue('Kept panel draft at 200%');
        await overview.scrollIntoViewIfNeeded();
        await settleFiniteAnimations(page);
        await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-${variant}-draft.png`, info);
    }
});
