import { test, expect, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { designIds, openSite, sitePages } from './site-visual-support.mjs';

for (const designSystem of designIds) for (const colorMode of ['light', 'dark']) {
    test(`engineering workspace ${designSystem} ${colorMode}: drafts and modal survive resize`, async ({ page, previewOrigin }, info) => {
        await page.setViewportSize({ width: 1600, height: 1000 });
        await openSite(page, previewOrigin, sitePages.find(item => item.id === 'design'), { designSystem, colorMode });
        const opener = page.getByRole('button', { name: '打开工程设备工作台', exact: true });
        await opener.click();
        const dialog = page.getByRole('dialog', { name: '工程设备工作台', exact: true });
        const panel = dialog.getByRole('tabpanel').filter({ visible: true });
        const properties = panel.getByRole('complementary', { name: '设备属性', exact: true });
        const note = properties.getByRole('textbox', { name: '工作备注', exact: true });
        const save = properties.getByRole('button', { name: '保存修改', exact: true });
        await expect(save).toBeDisabled();
        await expect(panel.getByRole('treeitem', { name: '华东工厂', exact: true })).toBeVisible();
        const grid = panel.getByRole('grid', { name: '设备列表' }).or(panel.getByRole('table', { name: '设备列表' }));
        await expect(grid.getByRole('radio')).toHaveCount(0);
        await expect(grid.getByRole('row', { selected: true })).toHaveCount(1);
        const inactiveSelection = await grid.getByRole('row', { selected: true }).evaluate(node => getComputedStyle(node).backgroundColor);
        const extent = await grid.evaluate(node => {
            const last = [...node.querySelectorAll('[role="columnheader"]')].at(-1);
            return { end: last?.getBoundingClientRect().right, viewportEnd: node.getBoundingClientRect().right };
        });
        expect(Math.abs(extent.end - extent.viewportEnd)).toBeLessThanOrEqual(2);
        await settleFiniteAnimations(page);
        await captureVisual(dialog.getByRole('region', { name: '工程管理与设备运维', exact: true }), `engineering-${designSystem}-${colorMode}.png`, info);

        if (designSystem === 'macos') {
            // Sample quiet interior pixels, away from borders and text. Changing
            // only the backing must change the painted glass, not the data canvas.
            const backdrop = dialog.locator('[data-workspace-part="backdrop"]');
            const sidebar = await panel.locator('[data-workspace-part="sidebar"]').boundingBox();
            const inspector = await properties.boundingBox();
            const table = await grid.boundingBox();
            const clips = [
                { x: sidebar.x + 18, y: sidebar.y + sidebar.height - 64, width: 16, height: 16 },
                { x: inspector.x + 6, y: inspector.y + inspector.height / 2, width: 10, height: 16 },
                { x: table.x + table.width - 22, y: table.y + 50, width: 8, height: 8 },
            ];
            const before = [];
            for (const clip of clips) before.push(await page.screenshot({ clip, scale: 'css', animations: 'allow' }));
            try {
                await backdrop.evaluate(node => { node.style.visibility = 'hidden'; });
                await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                for (const [index, clip] of clips.entries()) {
                    const after = await page.screenshot({ clip, scale: 'css', animations: 'allow' });
                    expect(before[index].equals(after), index === 2 ? 'Data canvas must remain opaque' : 'Glass interior must transmit the underlying environment').toBe(index === 2);
                }
            } finally {
                await backdrop.evaluate(node => { node.style.removeProperty('visibility'); });
                await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            }
        }

        await panel.getByText('CW-101', { exact: true }).click();
        if (designSystem === 'macos') {
            await expect(grid).toBeFocused();
            await expect.poll(() => grid.getByRole('row', { selected: true }).evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe(inactiveSelection);
        }
        await properties.getByRole('button', { name: '下一台设备', exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(properties.getByRole('heading', { name: '循环水泵 B', exact: true })).toBeVisible();

        await note.fill('保留未提交的保养参数');
        await expect(save).toBeEnabled();
        await panel.getByRole('textbox', { name: '搜索设备', exact: true }).fill('AC-201');
        await panel.getByText('空压机 01', { exact: true }).click();
        await expect(properties.getByRole('heading', { name: '空压机 01', exact: true })).toBeVisible();
        await panel.getByRole('button', { name: '重置', exact: true }).click();
        await panel.getByText('循环水泵 B', { exact: true }).click();
        await expect(note).toHaveValue('保留未提交的保养参数');

        await save.click();
        await expect(save).toBeDisabled();
        await note.fill('待还原的临时修改');
        await properties.getByRole('button', { name: '还原', exact: true }).click();
        await expect(note).toHaveValue('保留未提交的保养参数');
        await expect(save).toBeDisabled();
        await dialog.getByRole('tab', { name: '保养工单 · 3', exact: true }).click();
        await expect(dialog.getByRole('region', { name: '保养任务', exact: true })).toBeVisible();
        await dialog.getByRole('tab', { name: '设备台账', exact: true }).click();
        await expect(note).toHaveValue('保留未提交的保养参数');

        const initialDialog = await dialog.elementHandle();
        const initialNote = await note.elementHandle();
        await expect.poll(() => dialog.evaluate(node => node.matches(':modal'))).toBe(true);
        await page.setViewportSize({ width: 900, height: 800 });
        await expect(page.locator('.crab-docs-reading-body')).toHaveAttribute('data-wide', 'false');
        // A keyed React instance can survive a DOM move while its native modal
        // state is lost. Assert both browser state and the actual editor node.
        expect(await dialog.evaluate((node, initial) => node === initial, initialDialog)).toBe(true);
        expect(await note.evaluate((node, initial) => node === initial, initialNote)).toBe(true);
        await expect.poll(() => dialog.evaluate(node => node.matches(':modal'))).toBe(true);
        await expect(note).toHaveValue('保留未提交的保养参数');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= globalThis.innerWidth)).toBe(true);
        await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
        if (designSystem === 'macos') {
            for (const part of ['sidebar', 'commands', 'inspector']) {
                await expect(panel.locator(`[data-workspace-part="${part}"]`)).toHaveCSS('backdrop-filter', 'none');
            }
            await expect(dialog.locator('[data-workspace-part="backdrop"]')).toHaveCSS('opacity', '0');
        }
        await dialog.getByRole('button', { name: '关闭工作台', exact: true }).focus();
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(opener).toBeFocused();
    });
}
