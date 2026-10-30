import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} Breadcrumbs at real 200%`, {
    tag: ['@rc-breadcrumbs', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-breadcrumbs', spec.demo, config);
    const frame = page.getByRole('region', { name: 'Breadcrumbs visual matrix' });
    const action = frame.getByRole('button', { name: '项目', exact: true });
    const link = frame.getByRole('link', { name: '设计系统与团队共享资源目录', exact: true });
    const original = await link.elementHandle();
    await action.click();
    await action.press('Tab');
    await expect(link).toBeFocused();
    await realZoom.set200(page);
    await expect(frame.getByRole('status')).toHaveText('projects');
    await expect(frame.locator('[aria-current="page"]')).toHaveText('当前组件规范');
    expect(await link.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(link).toBeFocused();
    expect(await link.evaluate(node => node.matches(':focus-visible'))).toBe(true);
    await link.scrollIntoViewIfNeeded();
    await settleFiniteAnimations(page);
    const viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    const bounds = await link.boundingBox();
    expect(viewport.width).toBeLessThanOrEqual(640);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-path-focus.png`, info);
    await link.press('Enter');
    await expect(frame.getByRole('status')).toHaveText('team');
    await expect(link).toBeFocused();
});
