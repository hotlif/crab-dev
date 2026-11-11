import { test, expect, configurations, openDemo, captureVisual } from '../../../test/visual/component-fixture.mjs';

for (const config of configurations) test(`readable overview ${config.designSystem} ${config.colorMode}`, { tag: ['@rc-flow-diagram', '@chromium-only'] }, async ({ page, previewOrigin, browserName }, info) => {
    await openDemo(page, previewOrigin, 'rc-flow-diagram', 'readability.demo.tsx', config);
    const scene = page.getByRole('region', { name: '缩放可读性示例' });
    const label = scene.locator('[data-detail-level]');
    const details = scene.getByRole('button', { name: '查看商品模型完整字段' });
    await expect(label).toHaveAttribute('data-detail-level', 'full');
    await expect(label).toContainText('decimal');
    await expect(label).toHaveCSS('font-weight', '400');
    await captureVisual(scene, `${config.designSystem}-${config.colorMode}-readable-full.png`, info, browserName);
    await page.getByRole('button', { name: '60%', exact: true }).click();
    await expect(label).toHaveAttribute('data-detail-level', 'compact');
    await expect(label).toHaveCSS('font-size', '10px');
    await page.getByRole('button', { name: '25%', exact: true }).click();
    await expect(label).toHaveAttribute('data-detail-level', 'overview');
    await expect(label).toHaveText('商品 · 4 字段');
    await expect(label).toHaveCSS('font-size', '10px');
    await details.hover();
    await expect(page.getByRole('tooltip')).toContainText('price · decimal');
    await page.mouse.move(0, 0);
    await expect(page.getByRole('tooltip')).not.toBeVisible();
    await scene.getByRole('region', { name: '模型画布' }).focus();
    for (let step = 0; step < 4 && !await details.evaluate(node => node === document.activeElement); step++) {
        await page.keyboard.press('Tab');
    }
    await expect(details).toBeFocused();
    await expect(page.getByRole('tooltip')).toContainText('revision · integer');
    await captureVisual(page, `${config.designSystem}-${config.colorMode}-readable-details.png`, info, browserName);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).not.toBeVisible();
    await expect(details).toBeFocused();
    const before = await details.boundingBox();
    await page.getByRole('button', { name: '向右平移', exact: true }).click();
    await expect.poll(async () => Math.round((await details.boundingBox()).x - before.x)).toBe(20);
    await captureVisual(scene, `${config.designSystem}-${config.colorMode}-readable-overview.png`, info, browserName);
});
