import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} Tag at real 200%`, {
    tag: ['@rc-tag', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-tag', spec.demo, config);
    const frame = page.getByRole('region', { name: 'Tag visual matrix' });
    const selected = frame.getByRole('checkbox').first();
    const next = frame.getByRole('checkbox').nth(1);
    const close = frame.getByRole('button', { name: '移除筛选' });
    await selected.click();
    await selected.press('Tab');
    await expect(next).toBeFocused();
    await realZoom.set200(page);
    await expect(selected).toHaveAttribute('aria-checked', 'true');
    await expect(next).toBeFocused();
    expect(await next.evaluate(node => node.matches(':focus-visible'))).toBe(true);
    await next.scrollIntoViewIfNeeded();
    await settleFiniteAnimations(page);
    const viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    const bounds = await next.boundingBox();
    expect(viewport.width).toBeLessThanOrEqual(640);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-selected.png`, info);
    await next.press('Tab');
    await expect(close).toBeFocused();
    await close.scrollIntoViewIfNeeded();
    await expect(close).toBeInViewport();
    await settleFiniteAnimations(page);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-close-action.png`, info);
    await close.press('Enter');
    await expect(close).toHaveCount(0);
    await expect(selected).toHaveAttribute('aria-checked', 'true');
    await expect(frame.getByRole('status')).toContainText('筛选已移除');
});
