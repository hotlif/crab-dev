import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} Form at real 200%`, {
    tag: ['@rc-form', '@environment', '@chromium-only'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, 'rc-form', spec.demo, config);
    const frame = page.getByRole('region', { name: 'Form visual matrix' });
    const name = frame.getByRole('textbox', { name: '项目名称', exact: true });
    const owner = frame.getByRole('textbox', { name: '项目负责人', exact: true });
    const action = frame.getByRole('button', { name: '校验字段', exact: true });
    const original = await name.elementHandle();
    await name.fill('Kept project draft at 200%');
    await owner.fill('Shared design team');
    await owner.press('Tab');
    await expect(action).toBeFocused();
    await realZoom.set200(page);
    await expect(name).toHaveValue('Kept project draft at 200%');
    await expect(owner).toHaveValue('Shared design team');
    expect(await name.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(action).toBeFocused();
    expect(await action.evaluate(node => node.matches(':focus-visible'))).toBe(true);
    await name.scrollIntoViewIfNeeded();
    await settleFiniteAnimations(page);
    const viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    const bounds = await name.boundingBox();
    expect(viewport.width).toBeLessThanOrEqual(640);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-fields.png`, info);
    await action.scrollIntoViewIfNeeded();
    await expect(action).toBeInViewport();
    await expect(action).toBeFocused();
    await settleFiniteAnimations(page);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-actions.png`, info);
    await action.press('Enter');
    await expect(frame.getByRole('status')).toContainText('校验完成');
    await expect(name).toHaveValue('Kept project draft at 200%');
});
