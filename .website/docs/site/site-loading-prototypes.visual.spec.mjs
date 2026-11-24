import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };
const pages = {
    empty: { path: '/design/empty', heading: 'Empty 空状态' },
    spin: { path: '/design/spin', heading: 'Spin 等待反馈' },
    skeleton: { path: '/design/skeleton', heading: 'Skeleton 骨架屏' },
};

async function capture(page, info, route, design, mode) {
    const path = info.outputPath(`${route}-${design}-${mode}.png`);
    await settleFiniteAnimations(page);
    await page.locator('[data-loading-stage]').screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Empty distinguishes three causes and recovery actions in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, pages.empty, { designSystem, colorMode });
            await expect(page.getByText('还没有设备', { exact: true })).toBeVisible();
            await capture(page, info, 'empty', designSystem, colorMode);
            await page.getByRole('button', { name: '添加第一台设备' }).press('Enter');
            const input = page.getByRole('textbox', { name: '设备名称' });
            await expect(input).toBeFocused();
            await input.press('Enter');
            await expect(input).toHaveAttribute('aria-invalid', 'true');
            await input.fill('3 号加压泵');
            await input.press('Enter');
            const results = page.getByRole('heading', { name: '设备列表' });
            await expect(results).toBeFocused();
            await expect(page.getByText('3 号加压泵')).toBeVisible();

            await page.getByRole('radio', { name: '搜索无结果' }).press('Space');
            const search = page.getByRole('textbox', { name: '搜索设备' });
            await expect(search).toHaveValue('东区');
            await expect(page.getByText('没有匹配的设备', { exact: true })).toBeVisible();
            await page.getByRole('button', { name: '清除搜索条件' }).press('Enter');
            await expect(search).toBeFocused();
            await expect(search).toHaveValue('');
            await expect(page.getByText('北区输水泵')).toBeVisible();

            await page.getByRole('radio', { name: '加载失败' }).press('Space');
            await expect(page.getByText('暂时无法读取设备列表')).toBeVisible();
            await page.getByRole('button', { name: '重新加载' }).press('Enter');
            await expect(page.getByText('正在重新读取设备列表')).toBeVisible();
            await expect(results).toBeFocused();
            await expect(page.getByText('回流管压力表')).toBeVisible();
            await assertDocumentWidth(page, info);
        });

        test(`Spin delays short waits and restricts each busy scope in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, pages.spin, { designSystem, colorMode });
            await page.clock.install();
            const slow = page.getByRole('button', { name: '模拟慢请求' });
            const fast = page.getByRole('button', { name: '模拟快速响应' });
            const cancel = page.getByRole('button', { name: '取消同步' });
            const area = page.locator('[data-spin-page]');
            const panel = page.locator('[data-spin-panel]');
            const recent = page.getByRole('button', { name: '最近巡检' });
            const status = page.locator('[data-spin-result]');

            await fast.press('Enter');
            await page.clock.fastForward(300);
            await expect(status).toHaveText('设备已同步。');
            await expect(slow).toHaveAttribute('aria-busy', 'false');
            await expect(fast).toBeFocused();

            await slow.press('Enter');
            await page.clock.fastForward(500);
            await expect(slow).toHaveAttribute('aria-busy', 'true');
            await expect(recent).toBeVisible();
            await recent.press('Enter');
            await expect(recent).toHaveAttribute('aria-expanded', 'true');
            await cancel.press('Enter');
            await expect(slow).toBeFocused();
            await expect(status).toHaveText('同步已取消。');

            await page.getByRole('radio', { name: '局部面板' }).press('Space');
            await slow.press('Enter');
            await page.clock.fastForward(500);
            await expect(panel).toHaveAttribute('aria-busy', 'true');
            await expect(panel.locator('[inert]')).toHaveCount(1);
            await expect(area).toHaveAttribute('aria-busy', 'false');
            await expect(recent).toBeVisible();
            await capture(page, info, 'spin', designSystem, colorMode);
            await cancel.press('Enter');

            await page.getByRole('radio', { name: '整页' }).press('Space');
            await slow.press('Enter');
            await page.clock.fastForward(500);
            await expect(area).toHaveAttribute('aria-busy', 'true');
            await expect(area.locator('[inert]')).toHaveCount(1);
            expect(await recent.evaluate((node) => {
                node.focus();
                return node.ownerDocument.activeElement === node;
            })).toBe(false);
            await page.clock.fastForward(4200);
            await expect(area).toHaveAttribute('aria-busy', 'false');
            await expect(recent).toBeVisible();
            await assertDocumentWidth(page, info);
        });

        test(`Skeleton reserves row sizes and preserves old results in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, pages.skeleton, { designSystem, colorMode });
            await page.clock.install();
            const stage = page.locator('[data-skeleton-surface]');
            const status = page.locator('[data-skeleton-status]');
            const loading = page.locator('[data-skeleton-placeholder]');
            const records = page.locator('[data-skeleton-records]');
            const measures = (list) => list.locator('li').evaluateAll(nodes => nodes.map(node => Math.round(node.getBoundingClientRect().height)));
            const realSizes = await measures(records);
            expect(realSizes).toHaveLength(3);
            await page.getByRole('button', { name: '模拟首次加载' }).press('Enter');
            await expect(loading).toBeVisible();
            await expect(stage).toHaveAttribute('aria-busy', 'true');
            expect(await measures(loading)).toEqual(realSizes);
            await capture(page, info, 'skeleton', designSystem, colorMode);
            await page.clock.fastForward(1900);
            await expect(records).toBeVisible();
            expect(await measures(records)).toEqual(realSizes);

            const refresh = page.getByRole('button', { name: '后台刷新' });
            await refresh.press('Enter');
            await expect(status).toContainText('仍可查看上一批设备');
            await expect(records).toBeVisible();
            await expect(loading).toHaveCount(0);
            await page.clock.fastForward(1900);
            await expect(records).toContainText('已复核');
            await expect(refresh).toBeFocused();

            await page.getByRole('button', { name: '返回空数据' }).press('Enter');
            await page.clock.fastForward(1900);
            await expect(page.getByText('暂无设备', { exact: true })).toBeVisible();
            await page.getByRole('button', { name: '模拟读取失败' }).press('Enter');
            await page.clock.fastForward(1900);
            await expect(page.getByText('设备台账请求失败')).toBeVisible();
            await page.getByRole('button', { name: '重试读取设备' }).press('Enter');
            await page.clock.fastForward(1900);
            await expect(records).toBeVisible();
            await assertDocumentWidth(page, info);
        });
    }
}

test('animation preferences preserve readable waiting and placeholder state', options, async ({ page, previewOrigin }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await openSite(page, previewOrigin, pages.skeleton, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('button', { name: '模拟首次加载' }).press('Enter');
    const placeholder = page.locator('[data-skeleton-placeholder]');
    await expect(placeholder).toBeVisible();
    expect(await placeholder.evaluate(node => node.getAnimations({ subtree: true }).filter(animation => animation.effect.getTiming().iterations === Infinity).length)).toBe(0);
    await expect(page.locator('[data-skeleton-status]')).toContainText('正在加载');

    await openSite(page, previewOrigin, pages.spin, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('radio', { name: '局部面板' }).press('Space');
    await page.getByRole('button', { name: '模拟慢请求' }).press('Enter');
    const tip = page.getByRole('status').filter({ hasText: '正在读取设备列表' });
    await expect(tip).toBeVisible();
    const motion = await tip.evaluate((node) => node.getAnimations({ subtree: true })
        .filter((animation) => animation.effect.getTiming().iterations === Infinity)
        .flatMap((animation) => animation.effect.getKeyframes()));
    expect(motion.length).toBeGreaterThan(0);
    expect(motion.some((frame) => frame.opacity !== undefined)).toBe(true);
    expect(motion.some((frame) => /rotate|translate|skew/.test(frame.transform ?? ''))).toBe(false);
});
