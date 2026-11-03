import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sampleMotion } from '../../../test/visual/motion-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations) for (const placement of ['right', 'left', 'top', 'bottom']) {
    test(`${config.designSystem} ${config.colorMode} ${placement} drawer reversal`, { tag: ['@motion', '@rc-drawer', ...(placement !== 'right' ? ['@chromium-only'] : [])] }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-drawer', spec.demo, config);
        await page.getByLabel('验收方向', { exact: true }).selectOption(placement);
        const trigger = page.getByRole('button', { name: '打开验收抽屉', exact: true });
        await trigger.focus();
        await trigger.press('Enter');
        const dialog = page.getByRole('dialog', { name: '项目详情 Project details' });
        await settleFiniteAnimations(page);
        const input = dialog.getByRole('textbox', { name: '项目备注', exact: true });
        await input.fill('连续开关保留的草稿');
        const original = await input.elementHandle();
        const save = dialog.getByRole('button', { name: '保存草稿', exact: true });
        const opener = await trigger.elementHandle();
        await save.evaluate((node, opener) => new Promise(resolve => {
            node.click();
            globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(() => { opener.click(); resolve(); }));
        }), opener);
        await sampleMotion(page, dialog, info, 'drawer-reversal');
        await settleFiniteAnimations(page);
        expect(await input.evaluate((node, old) => node === old, original)).toBe(true);
        await expect(input).toHaveValue('连续开关保留的草稿');
        expect(await dialog.evaluate(node => node.contains(node.ownerDocument.activeElement))).toBe(true);
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(trigger).toBeFocused();
        await original.dispose(); await opener.dispose();
    });
}
