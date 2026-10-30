import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} Pagination at real 200%`, {
    tag: ['@rc-pagination', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-pagination', spec.demo, config);
    const frame = page.getByRole('region', { name: 'Pagination visual matrix' });
    const current = frame.getByRole('button', { name: 'Page 7', exact: true });
    await current.click();
    await current.press('Tab');
    const next = frame.getByRole('button', { name: 'Page 8', exact: true });
    await expect(next).toBeFocused();
    await realZoom.set200(page);
    await expect(frame.locator('[aria-current="page"]')).toHaveText('7');
    await expect(next).toBeFocused();
    expect(await next.evaluate(node => node.matches(':focus-visible'))).toBe(true);
    await next.scrollIntoViewIfNeeded();
    await settleFiniteAnimations(page);
    const viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    const bounds = await frame.getByRole('navigation').boundingBox();
    expect(viewport.width).toBeLessThanOrEqual(640);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-current-page.png`, info);
    const jump = frame.getByRole('textbox', { name: '跳转页码', exact: true });
    await jump.fill('12');
    await jump.press('Enter');
    await expect(frame.locator('[aria-current="page"]')).toHaveText('12');
    await jump.press('Tab');
    const menu = frame.getByRole('combobox', { name: '每页条数', exact: true });
    await expect(menu).toBeFocused();
    await menu.press('Enter');
    const list = page.getByRole('listbox');
    await expect(list).toBeVisible();
    await list.scrollIntoViewIfNeeded();
    await settleFiniteAnimations(page);
    await expect(list).toBeInViewport();
    await expect(frame.locator('[aria-current="page"]')).toHaveText('12');
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-size-menu.png`, info);
});
