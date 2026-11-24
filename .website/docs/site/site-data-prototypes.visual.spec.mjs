import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };

async function capture(page, info, route, design, mode) {
    const path = info.outputPath(`${route}-${design}-${mode}.png`);
    await settleFiniteAnimations(page);
    await page.locator('[data-data-stage]').screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Table sorts, selects and commits or cancels notes in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/table', heading: 'Table 基础数据表格' }, { designSystem, colorMode });
            const grid = page.getByRole('grid', { name: '设备巡检清单' });
            const status = page.locator('[data-table-status]');
            const header = grid.getByRole('columnheader', { name: /巡检次数/ });
            await header.getByRole('button', { name: /巡检次数/ }).press('Enter');
            await expect(header).toHaveAttribute('aria-sort', /ascending|descending/);
            const row = grid.getByRole('row').filter({ hasText: 'P-104' });
            await row.getByRole('checkbox').press('Space');
            await expect(row).toHaveAttribute('aria-selected', 'true');
            await expect(status).toContainText('已选 1 台设备');

            const notes = row.getByRole('gridcell', { name: '检查入口压差' });
            await notes.dblclick();
            const editor = grid.getByRole('textbox', { name: 'P-104 巡检备注' });
            await expect(editor).toBeFocused();
            await editor.fill('现场复测完成');
            await page.getByRole('heading', { name: '设备巡检清单', exact: true }).click();
            await expect(status).toContainText('P-104 备注已保存');
            await expect(row.getByText('现场复测完成')).toBeVisible();
            await row.getByRole('gridcell', { name: '现场复测完成' }).dblclick();
            await editor.fill('此稿撤销');
            await editor.press('Escape');
            await expect(status).toContainText('已放弃备注草稿');
            await expect(row.getByText('现场复测完成')).toBeVisible();
            await capture(page, info, 'table', designSystem, colorMode);

            await page.getByRole('button', { name: '模拟空结果' }).press('Enter');
            await expect(page.getByText('当前没有匹配的设备。')).toBeVisible();
            await page.getByRole('button', { name: '模拟连接失败' }).press('Enter');
            await expect(page.getByRole('alert')).toContainText('网关暂时不可达');
            await page.getByRole('button', { name: '重新读取' }).press('Enter');
            await expect(page.getByText('正在读取设备清单')).toBeVisible();
            await expect(row.getByText('现场复测完成')).toBeVisible();
            await assertDocumentWidth(page, info);
        });

        test(`TablePro scopes the batch, recovers failures and restores its view in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/table-pro', heading: 'TablePro 跨页数据工作流' }, { designSystem, colorMode });
            const scope = page.locator('[data-table-pro-scope]');
            const batchStatus = page.locator('[data-batch-result]');
            const complete = page.getByRole('button', { name: '批量标记已复核' });
            const fullSelection = page.getByRole('button', { name: '选择全部匹配记录' });
            const search = page.getByRole('textbox', { name: '搜索全部记录' });
            await expect(complete).toBeDisabled();
            await expect(fullSelection).toBeEnabled();
            const pageSelection = page.getByRole('grid').getByRole('checkbox').first();
            await pageSelection.press('Space');
            await expect(scope).toContainText('手动选择 4 条');
            await fullSelection.press('Enter');
            await expect(scope).toContainText('跨页匹配 18 条');
            await search.fill('南区');
            await expect(scope).toContainText('手动选择 0 条 · 查询结果 6 条');
            await expect(fullSelection).toBeEnabled();
            await fullSelection.press('Enter');
            await expect(scope).toContainText('跨页匹配 6 条');
            const settings = page.getByRole('button', { name: '列设置', exact: true });
            await settings.press('Enter');
            await expect(settings).toHaveAttribute('aria-expanded', 'true');
            await expect(page.getByRole('textbox', { name: '搜索列' })).toBeVisible();
            if (width > 320) {
                await page.getByRole('treeitem', { name: /工段/ }).getByRole('checkbox').press('Space');
                await expect(page.getByRole('columnheader', { name: '工段', exact: true })).toHaveCount(0);
            }
            await settings.press('Enter');

            await page.getByRole('button', { name: '模拟读取失败' }).press('Enter');
            const error = page.getByRole('alert').filter({ hasText: '数据加载失败' });
            await expect(error).toBeVisible();
            await error.getByRole('button', { name: '重试', exact: true }).press('Enter');
            await expect(error).toBeHidden();
            await expect(search).toHaveValue('南区');
            await expect(scope).toContainText('跨页匹配 6 条');
            await complete.press('Enter');
            await expect(batchStatus).toContainText('批量复核失败');
            await expect(scope).toContainText('跨页匹配 6 条');
            await capture(page, info, 'table-pro', designSystem, colorMode);
            await page.getByRole('button', { name: '重试批量复核' }).press('Enter');
            await expect(batchStatus).toHaveText('已复核 6 台设备。');
            await page.reload();
            await expect(search).toHaveValue('南区');
            await expect(fullSelection).toBeEnabled();
            if (width > 320) await expect(page.getByRole('columnheader', { name: '工段', exact: true })).toHaveCount(0);
            await page.getByRole('button', { name: '筛选', exact: true }).press('Enter');
            await page.getByRole('textbox', { name: '筛选巡检状态' }).fill('待复核');
            await expect(scope).toContainText('查询结果 2 条');
            await assertDocumentWidth(page, info);
        });

        test(`BarChart reads units, legend, zero and failure states in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/bar-chart', heading: 'BarChart 柱状图读值' }, { designSystem, colorMode });
            const legend = page.getByRole('group', { name: '班次图例' });
            const day = legend.getByRole('button', { name: '日班' });
            const night = legend.getByRole('button', { name: '夜班' });
            const chart = page.getByRole('group', { name: '泵站分班用水量（立方米）' });
            const value = chart.getByRole('button', { name: '北区输水泵 日班 24' });
            const reading = page.locator('[data-chart-reading]');
            await expect(page.getByText('计量单位 m³', { exact: true })).toBeVisible();
            await expect(reading).toContainText('0 m³');
            await expect(day).toHaveAttribute('aria-pressed', 'true');
            await night.press('Enter');
            await expect(night).toHaveAttribute('aria-pressed', 'false');
            await night.press('Enter');
            await expect(night).toHaveAttribute('aria-pressed', 'true');
            await value.press('Enter');
            await expect(reading).toHaveText('北区输水泵 · 日班 · 24 m³');
            const forward = width < 440 || designSystem === 'macos' ? 'ArrowDown' : 'ArrowRight';
            await value.press(forward);
            await expect(chart.getByRole('button', { name: '北区输水泵 夜班 19' })).toBeFocused();
            await page.getByRole('button', { name: '按班次堆叠' }).press('Enter');
            await capture(page, info, 'bar-chart', designSystem, colorMode);
            const phase = page.locator('[data-chart-phase]');
            await page.getByRole('button', { name: '模拟无数据' }).press('Enter');
            await expect(phase).toHaveAttribute('data-chart-phase', 'empty');
            await expect(chart).toBeHidden();
            await page.getByRole('button', { name: '模拟读取失败' }).press('Enter');
            await expect(page.getByRole('alert')).toContainText('无法读取用水量');
            await page.getByRole('button', { name: '重新读取用水量' }).press('Enter');
            await expect(phase).toHaveAttribute('data-chart-phase', 'loading');
            await expect(chart).toBeVisible();
            await assertDocumentWidth(page, info);
        });
    }
}
