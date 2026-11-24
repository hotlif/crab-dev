import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const config = { tag: ['@website'] };

async function capture(locator, info, route, theme, mode) {
    await settleFiniteAnimations(locator.page());
    const path = info.outputPath(`${route}-${theme}-${mode}.png`);
    await locator.screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

async function assertFits(locator, page) {
    await expect(locator).toBeVisible();
    await settleFiniteAnimations(page);
    const { width, height } = page.viewportSize();
    const box = await locator.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Dialog protects focus and retries the destructive action in ${designSystem} ${colorMode}`, config, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 700 });
            await openSite(page, previewOrigin, { path: '/design/dialog', heading: 'Dialog 对话框' }, { designSystem, colorMode });
            const opener = page.getByRole('button', { name: '删除配置', exact: true });
            const confirmation = page.getByRole('dialog', { name: '删除配置？' });
            await opener.click();
            await expect(confirmation.locator('.crab-overlay-modal-actions').getByRole('button', { name: '取消' })).toBeFocused();
            await page.mouse.click(2, 2);
            await expect(confirmation).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(confirmation).toBeHidden();
            await expect(opener).toBeFocused();

            await opener.press('Enter');
            await confirmation.getByRole('button', { name: '删除配置', exact: true }).click();
            await expect(confirmation.getByRole('button', { name: '正在删除' })).toHaveAttribute('aria-busy', 'true');
            await page.keyboard.press('Escape');
            await expect(confirmation.getByRole('alert')).toContainText('删除失败');
            await capture(confirmation, info, 'dialog', designSystem, colorMode);
            await confirmation.getByRole('button', { name: '重试删除' }).click();
            await expect(confirmation).toBeHidden();
            await expect(page.getByRole('button', { name: '恢复示例配置' })).toBeFocused();
            await page.getByRole('button', { name: '恢复示例配置' }).press('Enter');

            const editTrigger = page.getByRole('button', { name: '编辑配置' });
            const edit = page.getByRole('dialog', { name: '编辑配置' });
            await editTrigger.click();
            const name = edit.getByRole('textbox', { name: '配置名称' });
            await expect(name).toBeFocused();
            await name.fill('泵');
            await name.press('Enter');
            await expect(name).toBeFocused();
            await expect(name).toHaveAttribute('aria-invalid', 'true');
            await edit.getByRole('button', { name: '查看高级设置' }).click();
            const details = edit.locator('[data-dialog-details]');
            expect(await details.evaluate(node => node.scrollHeight)).toBeGreaterThan(await details.evaluate(node => node.clientHeight));
            await details.evaluate(node => { node.scrollTop = node.scrollHeight; });
            expect(await details.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
            await expect(edit.getByRole('button', { name: '保存名称' })).toBeInViewport();
            await name.fill('夜间设备巡检配置');
            await name.press('Enter');
            await expect(edit).toBeHidden();
            await expect(editTrigger).toBeFocused();
            await expect(page.getByRole('heading', { name: '夜间设备巡检配置' })).toBeVisible();
            await assertDocumentWidth(page, info);
        });

        test(`DropdownContainer repositions and distinguishes dismissal in ${designSystem} ${colorMode}`, config, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 730 });
            await openSite(page, previewOrigin, { path: '/design/dropdown-container', heading: 'DropdownContainer 浮层容器' }, { designSystem, colorMode });
            const popup = page.getByRole('dialog', { name: '巡检工具' });
            const search = popup.getByRole('textbox', { name: '临时筛选词' });
            for (const corner of ['左上角', '右上角', '左下角', '右下角']) {
                await page.getByRole('button', { name: corner }).click();
                const trigger = page.getByRole('button', { name: '测试浮层' });
                await trigger.click();
                await expect(search).toBeFocused();
                await assertFits(popup, page);
                if (corner.includes('下')) await expect(popup).toHaveAttribute('data-placement', /^(top|left|right)-/);
                if (corner === '右下角') {
                    const nextWidth = width === 320 ? 360 : 720;
                    await page.setViewportSize({ width: nextWidth, height: 680 });
                    await assertFits(popup, page);
                    await capture(popup, info, 'dropdown-container', designSystem, colorMode);
                    await page.setViewportSize({ width, height: 730 });
                }
                await search.fill('压力');
                await search.press('Escape');
                await expect(popup).toBeHidden();
                await expect(trigger).toBeFocused();
            }
            await page.getByRole('button', { name: '常规位置' }).click();
            await page.getByRole('button', { name: '打开巡检工具' }).click();
            await expect(search).toHaveValue('压力');
            await page.getByRole('button', { name: '浮层外操作' }).click();
            await expect(popup).toBeHidden();
            await expect(page.getByRole('button', { name: '浮层外操作' })).toBeFocused();
            await expect(page.getByText('浮层外的操作已执行。')).toBeVisible();
            await assertDocumentWidth(page, info);
        });

        test(`Menu supports grouped and nested commands in ${designSystem} ${colorMode}`, config, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 730 });
            await openSite(page, previewOrigin, { path: '/design/menu', heading: 'Menu 菜单' }, { designSystem, colorMode });
            const opener = page.getByRole('button', { name: '设备操作' });
            const menu = page.getByRole('menu', { name: '北区输水泵操作' });
            await opener.press('ArrowDown');
            await assertFits(menu, page);
            await expect(menu.getByRole('menuitem', { name: '查看最近读数' })).toBeFocused();
            await page.keyboard.press('ArrowDown');
            const unavailable = menu.getByRole('menuitem', { name: /归档设备/ });
            await expect(unavailable).toBeFocused();
            await expect(unavailable).toHaveAttribute('aria-disabled', 'true');
            await page.keyboard.press('Enter');
            await expect(menu).toBeVisible();
            await capture(menu, info, 'menu', designSystem, colorMode);
            await page.keyboard.press('End');
            await expect(menu.getByRole('menuitem', { name: '导出巡检记录' })).toBeFocused();
            await page.keyboard.press('ArrowRight');
            const csv = menu.getByRole('menuitem', { name: '导出 CSV' });
            await expect(csv).toBeFocused();
            await page.keyboard.press('ArrowLeft');
            await expect(menu.getByRole('menuitem', { name: '导出巡检记录' })).toBeFocused();
            await page.keyboard.press('ArrowRight');
            await expect(csv).toBeFocused();
            await csv.press('Enter');
            await expect(menu).toBeHidden();
            await expect(opener).toBeFocused();
            await expect(page.getByText(/已生成 CSV 导出任务/)).toBeVisible();
            await opener.press('Enter');
            await page.keyboard.press('Escape');
            await expect(menu).toBeHidden();
            await expect(opener).toBeFocused();
            await assertDocumentWidth(page, info);
        });

        test(`Drawer guards unsaved notes and restores focus in ${designSystem} ${colorMode}`, config, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 630 });
            await openSite(page, previewOrigin, { path: '/design/drawer', heading: 'Drawer 抽屉' }, { designSystem, colorMode });
            const trigger = page.getByRole('button', { name: '查看 P-104 详情' });
            const drawer = page.getByRole('dialog', { name: '北区输水泵' });
            const field = drawer.getByRole('textbox', { name: '巡检备注' });
            await trigger.click();
            await expect(drawer).toBeVisible();
            expect(await drawer.evaluate(node => node.contains(document.activeElement))).toBe(true);
            await field.fill('夜班再次读取压力。');
            await page.keyboard.press('Escape');
            const resume = drawer.getByRole('button', { name: '继续编辑' });
            await expect(resume).toBeFocused();
            await capture(drawer, info, 'drawer', designSystem, colorMode);
            await resume.press('Enter');
            await expect(field).toBeFocused();
            await expect(field).toHaveValue('夜班再次读取压力。');
            if (width > 320) await page.mouse.click(2, 30);
            else await drawer.getByRole('button', { name: '关闭设备详情' }).click();
            await expect(resume).toBeFocused();
            await drawer.getByRole('button', { name: '放弃修改' }).click();
            await expect(drawer).toBeHidden();
            await expect(trigger).toBeFocused();
            await trigger.press('Enter');
            await expect(field).toHaveValue('下次巡检核对入口压力。');
            await field.fill('夜班压力已核对。');
            await drawer.getByRole('button', { name: '保存备注' }).click();
            await expect(drawer).toBeHidden();
            await expect(trigger).toBeFocused();
            await expect(page.getByText(/P-104 · 夜班压力已核对/)).toBeVisible();
            await assertDocumentWidth(page, info);
        });
    }
}
