import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };

async function capture(page, info, route, design, mode) {
    const path = info.outputPath(`${route}-${design}-${mode}.png`);
    await settleFiniteAnimations(page);
    await page.locator('[data-feedback-panel]').screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

async function inspectWidth(page, info, width) {
    await assertDocumentWidth(page, info);
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(width + 1);
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Alert restores focus and recovers the failed save in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, { path: '/design/alert', heading: 'Alert 页内警告' }, { designSystem, colorMode });
            const save = page.getByRole('button', { name: '保存配置' });
            const folder = page.getByRole('textbox', { name: '导出目录' });
            const warning = page.getByRole('group', { name: '共享目录风险' });
            await warning.getByRole('button', { name: '关闭', exact: true }).press('Enter');
            await expect(save).toBeFocused();
            await expect(warning).toBeHidden();
            await save.press('Enter');
            await expect(page.getByRole('group', { name: '保存失败详情' })).toBeVisible();
            await expect(page.getByRole('alert')).toContainText('保存失败');
            await expect(folder).toHaveAttribute('aria-invalid', 'true');
            await expect(folder).toHaveValue('/exports/readonly');
            await capture(page, info, 'alert', designSystem, colorMode);

            await page.getByRole('button', { name: '使用工作区目录' }).press('Enter');
            await expect(folder).toBeFocused();
            await expect(folder).toHaveValue('/exports/workspace/line-07');
            await save.press('Enter');
            await expect(page.getByRole('group', { name: '保存结果' })).toContainText('/exports/workspace/line-07');
            await folder.fill('/exports/workspace/draft');
            await expect(page.getByRole('group', { name: '保存结果' })).toContainText('/exports/workspace/line-07');
            await inspectWidth(page, info, width);
        });

        test(`Message queues, merges and pauses the countdown in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, { path: '/design/message', heading: 'Message 短时反馈' }, { designSystem, colorMode });
            await page.clock.install();
            await page.getByRole('button', { name: '连续触发' }).press('Enter');
            const message = page.getByRole('group', { name: '当前消息' });
            const close = message.getByRole('button', { name: '关闭当前消息' });
            const paused = page.locator('[data-message-paused]');
            await expect(message).toContainText('配置已保存 ×2');
            await expect(page.locator('[data-message-queue]')).toHaveText('1 条等待展示');
            await message.hover();
            await expect(paused).toHaveAttribute('data-message-paused', 'true');
            await page.clock.fastForward(6500);
            await expect(message).toContainText('配置已保存 ×2');
            await close.focus();
            await page.mouse.move(0, 0);
            await expect(paused).toHaveAttribute('data-message-paused', 'true');
            await page.clock.fastForward(6500);
            await expect(close).toBeFocused();
            await capture(page, info, 'message', designSystem, colorMode);
            await close.press('Enter');
            await expect(page.getByRole('button', { name: '保存配置' })).toBeFocused();
            await expect(message).toContainText('已复制报告编号');
            await expect(paused).toHaveAttribute('data-message-paused', 'false');
            await page.clock.fastForward(6600);
            await expect(message).toBeHidden();
            await inspectWidth(page, info, width);
        });

        test(`Notification retains three jobs, retries and focuses its result in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, { path: '/design/notification', heading: 'Notification 持久通知' }, { designSystem, colorMode });
            const fail = page.getByRole('button', { name: '模拟巡检失败' });
            await fail.press('Enter');
            await expect(fail).toBeFocused();
            await page.getByRole('button', { name: '模拟汇总完成' }).press('Enter');
            await page.getByRole('button', { name: '模拟清单完成' }).press('Enter');
            const stack = page.locator('[data-notification-count]');
            await expect(stack).toHaveAttribute('data-notification-count', '3');
            const night = page.getByRole('button', { name: /夜间巡检 · 导出失败/ });
            await night.press('Enter');
            await expect(night).toBeFocused();
            const card = page.getByRole('group', { name: '夜间巡检通知' });
            await expect(card).toContainText('上游存储暂不可用');
            await capture(page, info, 'notification', designSystem, colorMode);
            await card.getByRole('button', { name: '重试导出' }).press('Enter');
            await expect(card).toContainText('正在重试');
            await expect(card).toContainText('导出完成');
            await card.getByRole('button', { name: '查看结果' }).press('Enter');
            await expect(page.getByRole('heading', { name: '导出结果' })).toBeFocused();
            await expect(page.getByText('夜间巡检 · CSV · 已完成')).toBeVisible();
            await card.getByRole('button', { name: /关闭/ }).press('Enter');
            await expect(fail).toBeFocused();
            await expect(stack).toHaveAttribute('data-notification-count', '2');
            await inspectWidth(page, info, width);
        });

        test(`Tooltip stays readable on hover, dismisses with Escape and expands the full path in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, { path: '/design/tooltip', heading: 'Tooltip 辅助提示' }, { designSystem, colorMode });
            await page.clock.install();
            const refresh = page.getByRole('button', { name: '刷新报告' });
            const tip = page.getByRole('tooltip');
            await refresh.hover();
            await expect(tip).toHaveText('重新读取最近一次巡检数据。');
            await tip.hover();
            await page.clock.fastForward(450);
            await expect(tip).toBeVisible();
            await page.mouse.move(0, 0);
            await expect(tip).toBeHidden();
            await refresh.focus();
            await expect(tip).toBeVisible();
            await expect(refresh).toHaveAccessibleDescription('重新读取最近一次巡检数据。');
            await capture(page, info, 'tooltip', designSystem, colorMode);
            await page.keyboard.press('Escape');
            await expect(tip).toBeHidden();
            await expect(refresh).toBeFocused();
            await refresh.press('Enter');
            await expect(page.locator('[data-feedback-panel]').getByRole('status')).toContainText('已刷新 1 次');
            const path = page.getByRole('button', { name: '报告路径', exact: true });
            await path.focus();
            await expect(tip).toContainText('/inspection/2026');
            await page.getByRole('button', { name: '查看完整路径' }).press('Enter');
            await expect(page.locator('#prototype-full-path')).toBeVisible();
            await expect(path).toHaveAttribute('aria-expanded', 'true');
            await inspectWidth(page, info, width);
        });
    }
}

test.describe('Tooltip touch', () => {
    test.use({ hasTouch: true, isMobile: true });
    test('keeps the information accessible on a touch screen', options, async ({ page, previewOrigin }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await openSite(page, previewOrigin, { path: '/design/tooltip', heading: 'Tooltip 辅助提示' }, { designSystem: 'md3', colorMode: 'light' });
        await page.getByRole('button', { name: '刷新报告' }).tap();
        await expect(page.locator('[data-feedback-panel]').getByRole('status')).toContainText('已刷新 1 次');
        await expect(page.getByRole('tooltip')).toHaveCount(0);
        await page.getByRole('button', { name: '查看完整路径' }).tap();
        await expect(page.locator('#prototype-full-path')).toBeVisible();
    });
});
