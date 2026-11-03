import { test, expect, configurations, openDemo, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sampleMotion } from '../../../test/visual/motion-fixture.mjs';

test.use({ video: 'on' });
for (const config of configurations) {
    test(`${config.designSystem} ${config.colorMode} modal reversal`, { tag: ['@motion', '@rc-dialog'] }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-dialog', 'motion.demo.tsx', config);
        const trigger = page.getByRole('button', { name: '打开连续性演示', exact: true });
        // Safari does not focus buttons on pointer click. Start from a real
        // keyboard activation so returning focus has the same opener on each engine.
        await trigger.focus();
        await trigger.press('Enter');
        const dialog = page.getByRole('dialog', { name: '动效连续性', exact: true });
        await settleFiniteAnimations(page);
        const input = dialog.getByRole('textbox', { name: '连续性草稿', exact: true });
        await input.fill('重开后仍保留的草稿');
        const original = await input.elementHandle();
        await dialog.getByRole('button', { name: '关闭后立即重开', exact: true }).click();
        await sampleMotion(page, dialog, info, 'reversed-exit');
        await settleFiniteAnimations(page);
        await expect(input).toHaveValue('重开后仍保留的草稿');
        expect(await input.evaluate((node, old) => node === old, original)).toBe(true);
        expect(await dialog.evaluate(node => node.contains(node.ownerDocument.activeElement))).toBe(true);
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(trigger).toBeFocused();
        await original.dispose();
    });
}
