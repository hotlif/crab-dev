import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };

async function capture(page, info, route, design, mode) {
    const path = info.outputPath(`${route}-${design}-${mode}.png`);
    await settleFiniteAnimations(page);
    await page.locator('[data-content-stage]').screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Avatar keeps size through image fallback and exposes more members in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/avatar', heading: 'Avatar 成员头像' }, { designSystem, colorMode });
            const roster = page.getByRole('list', { name: '操作员列表' });
            const leader = roster.locator('[data-member-id="op-01"] [data-roster-avatar]');
            await expect(leader.locator('img')).toBeVisible();
            await expect.poll(() => leader.locator('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
            const height = (await leader.boundingBox()).height;
            await page.getByRole('button', { name: '模拟图片失败' }).press('Enter');
            await expect(leader.locator('img')).toHaveCount(0);
            await expect(leader).toHaveText('林');
            expect((await leader.boundingBox()).height).toBe(height);
            await expect(roster.getByText('林月', { exact: true })).toBeVisible();

            const group = page.locator('[aria-label="当班成员概览"]');
            const more = group.getByRole('button');
            await expect(more).toHaveAccessibleName(/2/);
            await more.press('Enter');
            await expect(page.getByRole('heading', { name: '全部当班人员' })).toBeFocused();
            await expect(roster.getByRole('listitem')).toHaveCount(4);
            await page.getByRole('button', { name: '正常照片' }).press('Enter');
            await expect.poll(() => leader.locator('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
            await capture(page, info, 'avatar', designSystem, colorMode);
            await page.getByRole('button', { name: '收起当班名单' }).press('Enter');
            await expect(more).toBeFocused();
            await expect(roster.getByRole('listitem')).toHaveCount(2);
            await page.getByRole('button', { name: '密集显示' }).press('Enter');
            expect((await leader.boundingBox()).height).not.toBe(height);
            await assertDocumentWidth(page, info);
        });

        test(`Badge preserves exact counts and announces status with text in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/badge', heading: 'Badge 角标' }, { designSystem, colorMode });
            const navbar = page.getByRole('navigation', { name: '任务和设备' });
            const tasks = navbar.getByRole('button', { name: /^巡检任务/ });
            await expect(tasks).toHaveAccessibleName('巡检任务，未读 3 条');
            await page.getByRole('button', { name: '0', exact: true }).press('Enter');
            await expect(navbar.getByText('0', { exact: true })).toHaveCount(0);
            await page.getByRole('button', { name: '显示零值' }).press('Enter');
            await expect(navbar.getByText('0', { exact: true })).toBeVisible();
            await page.getByRole('button', { name: '99', exact: true }).press('Enter');
            await expect(navbar.getByText('99', { exact: true })).toBeVisible();
            await page.getByRole('button', { name: '1234', exact: true }).press('Enter');
            await expect(navbar.getByText('99+', { exact: true })).toBeVisible();
            await expect(tasks).toHaveAccessibleName('巡检任务，未读 1234 条');
            await expect(navbar.getByRole('status')).toHaveCount(0);
            await navbar.getByRole('button', { name: '设备中心，网关在线' }).press('Enter');
            await page.getByRole('button', { name: '模拟离线' }).press('Enter');
            await expect(page.getByText('网关离线', { exact: true })).toBeVisible();
            await expect(navbar.getByRole('button', { name: '设备中心，网关离线' })).toHaveAttribute('aria-current', 'page');
            await capture(page, info, 'badge', designSystem, colorMode);
            await assertDocumentWidth(page, info);
        });

        test(`Card isolates the full-card entry and separate actions in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/card', heading: 'Card 内容卡片' }, { designSystem, colorMode });
            const card = page.getByRole('button', { name: '打开北区输水泵详情' });
            const openAlarm = page.getByRole('button', { name: '查看告警' });
            await expect(page.locator('[data-static-card]')).not.toHaveAttribute('tabindex');
            await card.press('Space');
            const pump = page.getByRole('heading', { name: '北区输水泵详情' });
            await expect(pump).toBeFocused();
            const watch = page.getByRole('button', { name: '关注设备' });
            await watch.press('Enter');
            await expect(page.getByRole('button', { name: '取消关注' })).toBeFocused();
            await expect(pump).toBeVisible();
            await expect(page.getByText('已关注进水调节阀。')).toBeVisible();
            await openAlarm.press('Enter');
            await expect(page.getByRole('heading', { name: '进水调节阀告警记录' })).toBeFocused();
            await expect(pump).toHaveCount(0);
            await capture(page, info, 'card', designSystem, colorMode);
            await assertDocumentWidth(page, info);
        });

        test(`Prose preserves heading navigation and local wide scrolling in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/prose', heading: 'Prose 长文排版' }, { designSystem, colorMode });
            const article = page.getByRole('article', { name: '输水泵巡检流程' });
            await page.getByRole('radio', { name: '较大正文' }).press('Space');
            await expect(article).toHaveAttribute('data-reading-size', 'lg');
            const toc = page.getByRole('navigation', { name: '手册目录' });
            await toc.getByRole('link', { name: '采样检查表' }).press('Enter');
            await expect(article.getByRole('heading', { name: '采样检查表' })).toBeFocused();
            const table = article.getByRole('region', { name: '横向滚动采样检查表' });
            await expect(table.getByRole('table', { name: '示例记录' })).toBeVisible();
            await expect(table.getByRole('rowheader', { name: 'V-019' })).toBeVisible();
            if (width === 320) {
                await table.press('ArrowRight');
                await expect.poll(() => table.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
                const code = article.getByRole('region', { name: '横向滚动记录代码' });
                await code.press('ArrowRight');
                await expect.poll(() => code.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
            }
            await article.getByRole('link', { name: '回到作业前确认' }).press('Enter');
            await expect(article.getByRole('heading', { name: '作业前确认' })).toBeFocused();
            await capture(page, info, 'prose', designSystem, colorMode);
            await assertDocumentWidth(page, info);
        });

        test(`Tag updates filters and restores focus after removal in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/tag', heading: 'Tag 状态与筛选标签' }, { designSystem, colorMode });
            const applied = page.getByRole('group', { name: '已应用的筛选' });
            const review = page.getByRole('checkbox', { name: '待复核', exact: true });
            const intake = page.getByRole('checkbox', { name: '进水调节阀与远程监测终端' });
            const list = page.getByRole('list', { name: '筛选结果' });
            await expect(list.getByRole('listitem')).toHaveCount(2);
            await expect(list.getByRole('button')).toHaveCount(0);
            await expect(review).toBeChecked();
            await capture(page, info, 'tag', designSystem, colorMode);
            await applied.getByRole('button', { name: '移除待复核', exact: true }).press('Enter');
            await expect(review).not.toBeChecked();
            const close = applied.getByRole('button', { name: '移除进水调节阀与远程监测终端' });
            await expect(close).toBeFocused();
            await close.press('Enter');
            await expect(intake).toBeFocused();
            await expect(intake).not.toBeChecked();
            await expect(list.getByRole('listitem')).toHaveCount(3);
            await review.press('Space');
            await expect(review).toBeChecked();
            await expect(list.getByRole('listitem')).toHaveCount(1);
            await assertDocumentWidth(page, info);
        });
    }
}
