import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };
test.use({ timezoneId: 'Asia/Singapore' });

async function capture(page, info, route, design, mode) {
    const path = info.outputPath(`${route}-${design}-${mode}.png`);
    await settleFiniteAnimations(page);
    await page.locator(`[data-picker-prototype="${route}"] .crab-picker-layout`).screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`DatePicker constrains dates and handles typed input in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 830 });
            await openSite(page, previewOrigin, { path: '/design/date-picker', heading: 'DatePicker 日期选择器' }, { designSystem, colorMode });
            const report = page.locator('[data-report-date]');
            const main = page.getByRole('textbox', { name: '选择报告日期' });
            const calendar = page.getByRole('dialog', { name: '选择日期' });
            await main.focus();
            await expect(calendar).toBeVisible();
            await main.press('ArrowRight');
            await main.press('Enter');
            await expect(report).toContainText('24');
            await expect(main).toBeFocused();
            const end = page.getByRole('textbox', { name: '结束日期' });
            await end.focus();
            await expect(end).toHaveAttribute('aria-expanded', 'true');
            const endCalendar = page.locator(`[id="${await end.getAttribute('aria-controls')}"]`);
            await expect(endCalendar.getByRole('button', { name: '2026-11-19', exact: true })).toBeDisabled();
            await endCalendar.getByRole('button', { name: '下个月' }).click();
            await expect(endCalendar.getByRole('button', { name: '2026-12-16', exact: true })).toBeDisabled();
            await page.keyboard.press('Escape');
            await expect(endCalendar).toBeHidden();
            await expect(end).toBeFocused();

            await page.getByRole('button', { name: '手动输入日期' }).click();
            const typed = page.getByRole('textbox', { name: '输入报告日期' });
            await expect(typed).toBeFocused();
            await typed.fill('2026-12-31');
            await typed.press('Enter');
            await expect(typed).toHaveAttribute('aria-invalid', 'true');
            await expect(report).toContainText('24');
            await typed.fill('2026-12-08');
            await typed.press('Enter');
            await expect(report).toContainText('12月8日');
            await page.getByRole('button', { name: '使用英文日期格式' }).click();
            await expect(report).toContainText('Dec 8, 2026');
            await capture(page, info, 'date-picker', designSystem, colorMode);
            await page.getByRole('button', { name: '清除报告日期' }).click();
            await expect(typed).toBeFocused();
            await expect(report).toHaveText('未设置');
            await assertDocumentWidth(page, info);
        });

        test(`ColorPicker keeps a draft and updates both charts on apply in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 830 });
            await openSite(page, previewOrigin, { path: '/design/color-picker', heading: 'ColorPicker 取色器' }, { designSystem, colorMode });
            const trigger = page.getByRole('button', { name: '选择进水流量颜色' });
            const popup = page.getByRole('dialog', { name: '颜色选择' });
            const input = popup.getByRole('textbox', { name: '颜色值' });
            const alpha = popup.getByRole('slider', { name: '透明度' });
            const committed = page.locator('[data-applied-color]');
            const opacity = page.locator('[data-applied-opacity]');
            await trigger.press('Enter');
            await expect(popup).toBeVisible();
            const initialHex = await input.inputValue();
            const swatches = popup.getByRole('button', { name: /^#[0-9a-f]{6}$/i });
            await expect(swatches).toHaveCount(4);
            await swatches.nth(1).click();
            await expect(input).not.toHaveValue(initialHex);
            await expect(committed).toContainText('256.0°');
            await input.fill('#2c9c67');
            await input.press('Enter');
            await alpha.press('Home');
            await expect(alpha).toHaveAttribute('aria-valuenow', '0');
            await expect(opacity).toHaveText('100%');
            await popup.getByRole('button', { name: '取消', exact: true }).click();
            await expect(popup).toBeHidden();
            await expect(trigger).toBeFocused();
            await expect(opacity).toHaveText('100%');
            await trigger.press('Enter');
            await input.fill('#2c9c67');
            await input.press('Enter');
            await alpha.press('Home');
            await alpha.press('PageUp');
            await popup.getByRole('button', { name: '应用颜色' }).click();
            await expect(popup).toBeHidden();
            await expect(trigger).toBeFocused();
            await expect(committed).not.toContainText('256.0°');
            await expect(opacity).not.toHaveText('100%');
            await page.getByRole('button', { name: '精确输入 OKLCH' }).click();
            const precise = page.getByRole('textbox', { name: 'OKLCH 数值' });
            await expect(precise).not.toHaveValue('56.0% 0.158 256.0 / 100%');
            await precise.fill('140% 0.150 140 / 65%');
            await precise.press('Enter');
            await expect(precise).toHaveAttribute('aria-invalid', 'true');
            await expect(committed).not.toContainText('140.0%');
            await precise.fill('61% 0.150 140 / 65%');
            await precise.press('Enter');
            await expect(committed).toHaveText('61.0% · 0.150 · 140.0°');
            await expect(opacity).toHaveText('65%');
            await expect(page.locator('.crab-picker-chart li i')).toHaveCount(8);
            const fills = await page.locator('.crab-picker-chart li i').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).backgroundColor));
            expect(new Set(fills).size).toBe(1);
            await capture(page, info, 'color-picker', designSystem, colorMode);
            await assertDocumentWidth(page, info);
        });

        test(`CronPicker validates edits and preserves the schedule in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 830 });
            await openSite(page, previewOrigin, { path: '/design/cron-picker', heading: 'CronPicker 定时表达式' }, { designSystem, colorMode });
            const field = page.getByRole('textbox', { name: 'Cron 表达式' });
            const expression = page.locator('[data-cron-expression]');
            await expect(page.locator('[data-cron-zone]')).toHaveText('Asia/Singapore');
            await page.getByRole('button', { name: '每周一 09:15' }).click();
            await expect(field).toHaveValue('15 9 * * 1');
            await expect(page.getByRole('list', { name: '后续执行时间' }).getByRole('listitem')).toHaveCount(4);
            await field.fill('90 8 * * 1-5');
            await field.press('Enter');
            await expect(field).toHaveAttribute('aria-invalid', 'true');
            await expect(expression).toHaveText('15 9 * * 1');
            await field.press('Escape');
            await expect(field).toHaveValue('15 9 * * 1');
            await field.fill('45 10 * * 1-5');
            await field.press('Enter');
            await expect(expression).toHaveText('45 10 * * 1-5');
            const archived = page.getByRole('textbox', { name: '原巡检计划' });
            await expect(archived).toHaveAttribute('readonly', '');
            await archived.press('End');
            await archived.press('Backspace');
            await expect(archived).toHaveValue('0 7 * * 1');
            await capture(page, info, 'cron-picker', designSystem, colorMode);
            await assertDocumentWidth(page, info);
        });
    }
}
