import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, openSite } from './site-visual-support.mjs';

const pageDefinition = { path: '/design/number-edit', heading: 'NumberEdit 数值输入框' };
const settings = page => page.getByRole('form', { name: '采样与告警设置' });
const rate = page => settings(page).getByRole('spinbutton', { name: '采样频率' });
const savedRate = page => page.locator('[data-saved-rate]');

test('NumberEdit has links between its design prototype and component documentation', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('link', { name: '体验数值输入框原型' }).click();
    await expect(page.getByRole('heading', { name: pageDefinition.heading, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: '查看 NumberEdit 组件文档' }).click();
    await expect(page.getByRole('link', { name: '查看设计原型' })).toHaveAttribute('href', /\/design\/number-edit\/?$/);
});

for (const designSystem of ['md3', 'macos', 'shadcn']) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`NumberEdit retains draft input, normalizes values and explicitly saves in ${designSystem} ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 900 });
            await openSite(page, previewOrigin, pageDefinition, { designSystem, colorMode });
            const field = rate(page);
            const count = settings(page).getByRole('spinbutton', { name: '告警数量' });
            const save = settings(page).getByRole('button', { name: '保存设置' });
            const scene = page.locator('#number-edit-settings');
            await expect(field).toHaveAttribute('aria-valuemin', '0.5');
            await expect(field).toHaveAttribute('aria-valuemax', '8');
            await expect(savedRate(page)).toHaveText('2.00 Hz');

            await field.focus();
            await field.fill('-');
            await expect(field).toHaveValue('-');
            await expect(field).not.toHaveAttribute('aria-invalid', 'true');
            await field.press('Enter');
            await expect(field).toHaveValue('');
            await expect(field).toHaveAttribute('aria-invalid', 'true');
            await save.click();
            await expect(field).toBeFocused();
            await expect(field).toHaveAccessibleDescription(/请输入有效数值/);
            await expect(savedRate(page)).toHaveText('2.00 Hz');
            const errorImage = info.outputPath(`number-edit-${designSystem}-${colorMode}-error.png`);
            await scene.screenshot({ path: errorImage, animations: 'disabled' });
            await info.attach('提交无效数值', { path: errorImage, contentType: 'image/png' });

            await field.focus();
            await field.fill('3.');
            await expect(field).toHaveValue('3.');
            await field.press('Enter');
            await expect(field).toHaveValue('3.00');
            await field.focus();
            await field.fill('3.126');
            await field.press('Enter');
            await expect(field).toHaveValue('3.13');
            await expect(field).toHaveAccessibleDescription(/已按精度舍入为 3\.13 Hz/);
            await field.focus();
            await field.fill('9');
            await field.press('Enter');
            await expect(field).toHaveValue('8.00');
            await expect(field).toHaveAccessibleDescription(/超出范围，已调整为 8\.00 Hz/);
            const limitImage = info.outputPath(`number-edit-${designSystem}-${colorMode}-limit.png`);
            await settleFiniteAnimations(page);
            await scene.screenshot({ path: limitImage, animations: 'disabled' });
            await info.attach('上限反馈', { path: limitImage, contentType: 'image/png' });
            await field.press('ArrowDown');
            await expect(field).toHaveAttribute('aria-valuenow', '7.75');
            await field.press('PageUp');
            await expect(field).toHaveAttribute('aria-valuenow', '8');
            await field.press('ArrowUp');
            await expect(field).toHaveAttribute('aria-valuenow', '8');

            await count.focus();
            await count.fill('14.6');
            await count.press('Enter');
            await expect(count).toHaveValue('15');
            await expect(page.locator('[data-saved-count]')).toHaveText('30 条');
            await save.click();
            await expect(settings(page).getByRole('status')).toHaveText('采样与告警设置已保存。');
            await expect(savedRate(page)).toHaveText('8.00 Hz');
            await expect(page.locator('[data-saved-count]')).toHaveText('15 条');

            await field.focus();
            await field.fill('0.1');
            await field.press('Enter');
            await expect(field).toHaveValue('0.50');
            await expect(field).toHaveAccessibleDescription(/超出范围，已调整为 0\.50 Hz/);
            await field.press('ArrowDown');
            await expect(field).toHaveAttribute('aria-valuenow', '0.5');
            await expect(savedRate(page)).toHaveText('8.00 Hz');
            const readonly = page.getByRole('spinbutton', { name: '设备额定频率' });
            await readonly.focus();
            await readonly.press('ArrowUp');
            await expect(readonly).toHaveJSProperty('readOnly', true);
            await expect(readonly).toHaveAttribute('aria-valuenow', '6');
            await expect(page.getByRole('spinbutton', { name: '维护期间告警数量' })).toBeDisabled();
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
    }
}

test('NumberEdit retains unsubmitted and saved values across the theme switch', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, pageDefinition, { designSystem: 'md3', colorMode: 'dark' });
    await rate(page).focus();
    await rate(page).fill('3.25');
    await rate(page).press('Enter');
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        await expect(rate(page)).toHaveValue('3.25');
        await expect(savedRate(page)).toHaveText('2.00 Hz');
    }
});
