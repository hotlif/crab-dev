import { test, expect } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, openSite } from './site-visual-support.mjs';

const definition = { path: '/design/switch', heading: 'Switch 开关' };
const designs = ['md3', 'macos', 'shadcn'];
const setting = page => page.locator('#switch-setting');
const toggle = page => setting(page).getByRole('switch', { name: '自动刷新', exact: true });
const simulator = page => setting(page).getByRole('button', { name: '模拟下次失败' });
const retry = page => setting(page).getByRole('button', { name: '重试保存' });
const feedback = page => setting(page).getByRole('status');
const mode = page => setting(page).locator('.crab-switch-mode dd');

async function pauseSaveClock(page) {
    const now = new Date();
    await page.clock.install({ time: now });
    await page.clock.pauseAt(new Date(now.getTime() + 10_000));
}

async function tabToSetting(page) {
    await page.getByRole('navigation', { name: '原型章节' }).getByRole('link', { name: '交互规则' }).focus();
    await page.keyboard.press('Tab');
    await expect(toggle(page)).toBeFocused();
}

test('Switch prototype is linked from the design overview and component docs', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('link', { name: '体验开关原型' }).click();
    await expect(page.getByRole('heading', { name: definition.heading, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: /查看 Switch 组件文档/ }).click();
    await expect(page).toHaveURL(/\/components\/rc-switch\/?$/);
    await expect(page.getByRole('link', { name: '查看设计原型' })).toHaveAttribute('href', /\/design\/switch\/?$/);
});

for (const designSystem of designs) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Switch rolls back and retries in ${designSystem} ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 950 });
            await openSite(page, previewOrigin, definition, { designSystem, colorMode });
            const control = toggle(page);
            const managed = page.locator('#switch-permission').getByRole('switch', { name: '后台刷新' });
            await expect(control).not.toBeChecked();
            await expect(control).toHaveAccessibleDescription('开启后每 30 秒检查一次巡检数据。');
            await expect(managed).toBeDisabled();
            await expect(managed).toBeChecked();
            await expect(managed).toHaveAccessibleDescription('团队策略已开启后台刷新，仅管理员可更改。');
            await expect(mode(page)).toHaveText('手动刷新');
            await pauseSaveClock(page);
            await simulator(page).press('Enter');
            await expect(simulator(page)).toHaveAttribute('aria-pressed', 'true');
            await tabToSetting(page);
            const before = await control.boundingBox();
            await page.keyboard.press('Space');
            await expect(control).toBeChecked();
            await expect(control).toHaveAttribute('aria-disabled', 'true');
            await expect(mode(page)).toHaveText('每 30 秒自动刷新');
            await expect(feedback(page)).toHaveText('正在保存设置…');
            expect(await control.boundingBox()).toEqual(before);
            await page.keyboard.press('Space');
            await expect(control).toBeChecked();

            await page.clock.runFor(1200);
            await expect(control).not.toBeChecked();
            await expect(control).toBeFocused();
            await expect(control).toBeEnabled();
            await expect(mode(page)).toHaveText('手动刷新');
            await expect(feedback(page)).toHaveText('保存失败。已恢复为手动刷新。');
            await expect(simulator(page)).toHaveAttribute('aria-pressed', 'false');
            const failedImage = info.outputPath(`switch-${designSystem}-${colorMode}-rollback.png`);
            await setting(page).screenshot({ path: failedImage, animations: 'disabled' });
            await info.attach('失败回退', { path: failedImage, contentType: 'image/png' });

            await page.keyboard.press('Tab');
            await expect(retry(page)).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(control).toBeFocused();
            await expect(control).toBeChecked();
            await expect(feedback(page)).toHaveText('正在保存设置…');
            await page.clock.runFor(1200);
            await expect(control).toBeChecked();
            await expect(feedback(page)).toHaveText('刷新设置已保存。');
            await expect(retry(page)).toHaveCount(0);

            await simulator(page).press('Enter');
            await tabToSetting(page);
            await page.keyboard.press('Space');
            await expect(control).not.toBeChecked();
            await expect(mode(page)).toHaveText('手动刷新');
            await page.clock.runFor(1200);
            await expect(control).toBeChecked();
            await expect(mode(page)).toHaveText('每 30 秒自动刷新');
            await expect(feedback(page)).toHaveText('保存失败。已恢复为每 30 秒自动刷新。');
            await expect(control).toBeFocused();
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
    }
}

test('changing design preserves the pending save and the rollback', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'dark' });
    await pauseSaveClock(page);
    await simulator(page).press('Enter');
    await toggle(page).press('Space');
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        await expect(page.locator('[data-switch-prototype]')).toHaveAttribute('data-prototype-design', design);
        await expect(toggle(page)).toBeChecked();
        await expect(feedback(page)).toHaveText('正在保存设置…');
    }
    await page.clock.runFor(1200);
    await expect(toggle(page)).not.toBeChecked();
    await expect(feedback(page)).toHaveText('保存失败。已恢复为手动刷新。');
});

test('focus and rollback remain visible with forced colors and reduced motion', { tag: ['@website', '@chromium-only'] }, async ({ page, previewOrigin }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    await pauseSaveClock(page);
    for (const design of designs) {
        if (design !== 'md3') await chooseDesign(page, design);
        await simulator(page).press('Enter');
        await tabToSetting(page);
        const control = toggle(page);
        await expect(control).toHaveCSS('outline-style', 'solid');
        await expect(control.locator('span')).toHaveCSS('transition-duration', '0s');
        await page.keyboard.press('Space');
        await expect(control).toBeChecked();
        await page.clock.runFor(1200);
        await expect(control).toBeFocused();
        await expect(control).not.toBeChecked();
        await expect(feedback(page)).toHaveText('保存失败。已恢复为手动刷新。');
    }
});

test.describe('Switch touch target', () => {
    test.use({ hasTouch: true });
    test('the entire settings label activates the switch in all three themes', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'dark' });
        await pauseSaveClock(page);
        for (const design of designs) {
            if (design !== 'md3') await chooseDesign(page, design);
            const control = toggle(page);
            const before = await control.isChecked();
            expect((await control.locator('..').boundingBox()).height).toBeGreaterThanOrEqual(44);
            await setting(page).getByText('开启后每 30 秒检查一次巡检数据。', { exact: true }).tap();
            await expect(control).toBeChecked({ checked: !before });
            await page.clock.runFor(1200);
            await expect(feedback(page)).toHaveText('刷新设置已保存。');
        }
    });
});
