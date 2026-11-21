import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, openSite } from './site-visual-support.mjs';

const definition = { path: '/design/checkbox', heading: 'Checkbox 复选框' };
const prototype = page => page.locator('[data-checkbox-prototype]');
const scenario = page => page.locator('#checkbox-export');
const master = page => scenario(page).getByRole('checkbox', { name: '全选可导出任务' });
const longTask = page => scenario(page).getByRole('checkbox', { name: /^巡检附件与现场照片/ });
const exportButton = page => scenario(page).getByRole('button', { name: '预览导出清单' });
const designs = ['md3', 'macos', 'shadcn'];

test('Checkbox prototype is linked from the design overview and component docs', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('link', { name: /体验复选框原型/ }).click();
    await expect(page.getByRole('heading', { name: definition.heading, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: /查看 Checkbox 组件文档/ }).click();
    await expect(page).toHaveURL(/\/components\/rc-checkbox\/?$/);
    await expect(page.getByRole('link', { name: '查看设计原型' })).toHaveAttribute('href', /\/design\/checkbox\/?$/);
});

for (const designSystem of designs) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Checkbox export selection works in ${designSystem} ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 950 });
            await openSite(page, previewOrigin, definition, { designSystem, colorMode });
            const all = master(page);
            const status = scenario(page).getByRole('status');
            const unavailable = scenario(page).getByRole('checkbox', { name: '历史归档附件' });
            await expect(all).toHaveAttribute('aria-checked', 'mixed');
            expect(await all.evaluate(node => node.indeterminate)).toBe(true);
            await expect(status).toHaveText('已选 1 / 3 项');
            await expect(unavailable).toBeDisabled();
            await expect(unavailable).toHaveAccessibleDescription(/需要归档导出权限/);
            await expect(prototype(page).locator('#checkbox-states').getByRole('checkbox', { name: '保留审计标识' })).toBeChecked();

            await all.press('Space');
            await expect(all).toBeFocused();
            await expect(all).toBeChecked();
            await expect(status).toHaveText('已选 3 / 3 项');
            await expect(unavailable).not.toBeChecked();
            await longTask(page).press('Tab');
            await expect(exportButton(page)).toBeFocused();
            await exportButton(page).press('Enter');
            const receipt = scenario(page).getByRole('list', { name: '选中的导出任务' });
            await expect(receipt.getByRole('listitem')).toHaveCount(3);
            await expect(receipt).not.toContainText('历史归档附件');
            await settleFiniteAnimations(page);
            const evidence = info.outputPath(`checkbox-${designSystem}-${colorMode}.png`);
            await scenario(page).screenshot({ path: evidence, animations: 'disabled' });
            await info.attach('导出任务', { path: evidence, contentType: 'image/png' });

            await all.press('Space');
            await expect(all).not.toBeChecked();
            await expect(all).toHaveAttribute('aria-checked', 'false');
            await expect(exportButton(page)).toBeDisabled();
            await expect(receipt).toHaveCount(0);

            const name = scenario(page).getByText(/^巡检附件与现场照片/);
            await name.scrollIntoViewIfNeeded();
            const geometry = await name.evaluate(node => {
                const range = document.createRange();
                const text = node.firstChild;
                range.setStart(text, text.length - 2);
                range.setEnd(text, text.length);
                const rect = range.getBoundingClientRect();
                range.selectNodeContents(node);
                return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, lines: range.getClientRects().length };
            });
            if (width === 320) expect(geometry.lines).toBeGreaterThan(1);
            await page.mouse.click(geometry.x, geometry.y);
            await expect(longTask(page)).toBeChecked();
            await expect(all).toHaveAttribute('aria-checked', 'mixed');
            await expect(status).toHaveText('已选 1 / 3 项');
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
    }
}

test('Checkbox draft and preview survive switching design systems', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'dark' });
    await longTask(page).press('Space');
    await exportButton(page).click();
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        await expect(prototype(page)).toHaveAttribute('data-prototype-design', design);
        await expect(master(page)).toHaveAttribute('aria-checked', 'mixed');
        await expect(longTask(page)).toBeChecked();
        await expect(scenario(page).getByRole('list', { name: '选中的导出任务' }).getByRole('listitem')).toHaveCount(2);
    }
});

test('Checkbox keeps native mixed state and visible keyboard focus in forced colors', { tag: ['@website', '@chromium-only'] }, async ({ page, previewOrigin }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    for (const design of designs) {
        if (design !== 'md3') await chooseDesign(page, design);
        await master(page).focus();
        await expect(master(page)).toHaveAttribute('aria-checked', 'mixed');
        const control = master(page).locator('..').locator('[data-checkbox-part="control"]');
        await expect(control).toHaveCSS('outline-style', 'solid');
        await expect(control.locator('[data-checkbox-part="box"]')).toHaveCSS('transition-duration', '0s');
    }
});

test.describe('Checkbox touch targets', () => {
    test.use({ hasTouch: true });
    test('touch can activate the label across the three themes', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
        for (const design of designs) {
            if (design !== 'md3') await chooseDesign(page, design);
            const label = longTask(page).locator('..');
            const box = await label.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(44);
            const checked = await longTask(page).isChecked();
            await scenario(page).getByText('按设备和巡检时间归档', { exact: true }).tap();
            await expect(longTask(page)).toBeChecked({ checked: !checked });
        }
    });
});
