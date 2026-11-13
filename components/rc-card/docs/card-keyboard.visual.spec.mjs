import { test, expect, configurations, openDemo, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

for (const config of configurations) test(`nested card actions ${config.designSystem} ${config.colorMode}`, {
    tag: ['@rc-card', '@boundary'],
    annotation: { type: 'environment', description: JSON.stringify({ id: 'nested-keyboard-actions', ...config }) },
}, async ({ page, previewOrigin }, info) => {
    const boundary = await openDemo(page, previewOrigin, 'rc-card', 'clickable.demo.tsx', config);
    const card = boundary.locator('div[role="button"]');
    const status = card.getByRole('status');
    for (const [name, result] of [['更多', '点击了 extra, 未触发整卡'], ['编辑', '点击了操作区, 未触发整卡']]) {
        const control = card.getByRole('button', { name, exact: true });
        await control.focus();
        await page.keyboard.press('Enter');
        await expect(status).toHaveText(result);
        const original = await control.elementHandle();
        const next = { designSystem: config.designSystem === 'md3' ? 'macos' : 'md3', colorMode: config.colorMode === 'light' ? 'dark' : 'light' };
        await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, globalThis.location.origin), next);
        await expect(boundary).toHaveAttribute('data-crab-design', next.designSystem);
        await expect(boundary).toHaveAttribute('data-theme', next.colorMode);
        expect(await original.evaluate(node => node.isConnected && node === node.ownerDocument.activeElement)).toBe(true);
        await page.keyboard.press('Space');
        await expect(status).toHaveText(result);
        await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, globalThis.location.origin), config);
        await expect(boundary).toHaveAttribute('data-crab-design', config.designSystem);
        await expect(boundary).toHaveAttribute('data-theme', config.colorMode);
        await expect(control).toBeFocused();
    }
    await settleFiniteAnimations(page);
    await captureVisual(card, `${config.designSystem}-${config.colorMode}-nested-actions.png`, info);
    await card.focus();
    for (const key of ['Enter', 'Space']) {
        await page.keyboard.press(key);
        await expect(status).toContainText('整卡点击');
    }
});
