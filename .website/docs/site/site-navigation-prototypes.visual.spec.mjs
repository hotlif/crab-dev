import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };

async function capture(page, info, route, design, mode) {
    const path = info.outputPath(`${route}-${design}-${mode}.png`);
    await settleFiniteAnimations(page);
    await page.locator(`[data-navigation-prototype="${route}"] .crab-navigation-stage`).first().screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Tabs activates from the keyboard and preserves panel state in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 830 });
            await openSite(page, previewOrigin, { path: '/design/tabs', heading: 'Tabs 页签' }, { designSystem, colorMode });
            const config = page.getByRole('tab', { name: '配置', exact: true });
            const activity = page.getByRole('tab', { name: '运行记录', exact: true });
            const history = page.getByRole('tab', { name: '交接与历次设备检修记录' });
            const draft = page.getByRole('textbox', { name: '交接草稿' });
            await draft.fill('夜间复测入口压差。');
            await config.press('ArrowRight');
            await expect(activity).toBeFocused();
            await expect(activity).toHaveAttribute('aria-selected', 'true');
            await expect(draft).toBeHidden();
            const today = page.getByRole('switch', { name: '仅看今天' });
            await today.press('Space');
            await expect(page.getByRole('list', { name: '运行记录' }).getByRole('listitem')).toHaveCount(2);
            await activity.press('End');
            await expect(history).toBeFocused();
            await expect(history).toHaveAttribute('aria-selected', 'true');
            await expect(page.getByRole('tab', { name: '权限设置' })).toBeDisabled();
            await capture(page, info, 'tabs', designSystem, colorMode);
            await history.press('Home');
            await expect(config).toBeFocused();
            await expect(draft).toHaveValue('夜间复测入口压差。');
            await activity.click();
            await expect(today).toBeChecked();
            await assertDocumentWidth(page, info);
        });

        test(`Breadcrumbs collapses and restores the location in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 830 });
            await openSite(page, previewOrigin, { path: '/design/breadcrumbs', heading: 'Breadcrumbs 面包屑导航' }, { designSystem, colorMode });
            const breadcrumb = page.getByRole('navigation', { name: '工程位置' });
            const title = page.locator('[data-project-place]');
            await expect(breadcrumb.locator('[aria-current=page]')).toHaveText('11 月 23 日巡检记录');
            const long = breadcrumb.getByRole('button', { name: /高压循环输送泵/ });
            if (width === 320) await expect(long).toBeHidden();
            else await expect(long).toBeVisible();
            await page.getByRole('button', { name: '查看完整路径' }).press('Enter');
            const full = page.getByRole('list', { name: '完整项目路径' });
            await expect(full).toBeVisible();
            await capture(page, info, 'breadcrumbs', designSystem, colorMode);
            await full.getByRole('button', { name: '北区输水站改造' }).press('Enter');
            await expect(full).toBeHidden();
            await expect(title).toBeFocused();
            await expect(breadcrumb.locator('[aria-current=page]')).toHaveText('北区输水站改造');
            await page.getByRole('button', { name: '打开高压输送设备子系统' }).click();
            await expect(title).toBeFocused();
            await expect(title).toHaveText('高压输送设备子系统');
            await assertDocumentWidth(page, info);
        });

        test(`Pagination preserves the result offset and clamps the last page in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 830 });
            await openSite(page, previewOrigin, { path: '/design/pagination', heading: 'Pagination 分页' }, { designSystem, colorMode });
            const navigation = page.getByRole('region', { name: '巡检结果列表' }).getByRole('navigation', { name: '分页', exact: true });
            const result = page.locator('[data-pagination-result]');
            await expect(navigation.getByRole('button', { name: '上一页', exact: true })).toBeDisabled();
            await navigation.getByRole('button', { name: '第 10 页', exact: true }).press('Enter');
            await expect(result).toHaveText('正在读取巡检结果…');
            await expect(result).toContainText('第 10 页');
            await expect(navigation.getByRole('button', { name: '下一页', exact: true })).toBeDisabled();
            await page.getByRole('button', { name: '删除末条记录' }).click();
            await expect(result).toBeFocused();
            await expect(result).toContainText('第 9 页');
            await expect(navigation.locator('[aria-current=page]')).toHaveAccessibleName('第 9 页');
            await navigation.getByRole('combobox', { name: '每页条数' }).click();
            await page.getByRole('option', { name: /20/ }).click();
            await expect(result).toContainText('第 5 页');
            await expect(page.getByRole('list', { name: '当前页结果' }).getByText('R-081')).toBeVisible();
            await capture(page, info, 'pagination', designSystem, colorMode);
            await assertDocumentWidth(page, info);
        });

        test(`Tree expands, filters and keeps the opened node in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 830 });
            await openSite(page, previewOrigin, { path: '/design/tree', heading: 'Tree 树' }, { designSystem, colorMode });
            const tree = page.getByRole('tree', { name: '工程目录树' });
            const pumps = tree.getByRole('treeitem', { name: '输水设备' });
            await pumps.click();
            await tree.press('ArrowRight');
            await expect(pumps).toHaveAttribute('aria-expanded', 'true');
            await tree.press('ArrowDown');
            const terminal = tree.getByRole('treeitem', { name: /P-104/ });
            await expect(terminal).toHaveAttribute('aria-selected', 'true');
            const open = page.getByRole('button', { name: '打开所选节点' });
            const opened = page.locator('[data-tree-opened]');
            await expect(opened).toHaveText('尚未打开设备或目录。');
            await open.click();
            await expect(opened).toContainText('P-104 高压循环输送泵与远程巡检终端');
            const search = page.getByRole('textbox', { name: '搜索设备目录' });
            await search.fill('压力');
            await expect(tree.getByRole('treeitem', { name: /M-032/ })).toBeVisible();
            await expect(terminal).toBeHidden();
            await expect(opened).toContainText('P-104');
            await capture(page, info, 'tree', designSystem, colorMode);
            await search.fill('');
            await expect(pumps).toHaveAttribute('aria-expanded', 'true');
            await tree.getByRole('treeitem', { name: '备用设备' }).click();
            await open.click();
            await expect(opened).toHaveText('备用设备');
            await expect(page.getByText('此目录暂无设备。')).toBeVisible();
            await assertDocumentWidth(page, info);
        });
    }
}
