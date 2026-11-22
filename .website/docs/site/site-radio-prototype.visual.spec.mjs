import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, openSite } from './site-visual-support.mjs';

const definition = { path: '/design/radio', heading: 'Radio 单选框' };
const designs = ['md3', 'macos', 'shadcn'];
const prototype = page => page.locator('[data-radio-prototype]');
const startup = page => page.locator('#radio-startup');
const required = page => page.locator('#radio-required');
const radio = (section, name) => section.getByRole('radio', { name, exact: true });
const control = input => input.locator('..').locator('[data-radio-part="control"]');
const jumpLink = page => page.getByRole('navigation', { name: '原型章节' }).getByRole('link', { name: '交互规则' });

test('Radio prototype is reachable from the design overview and component docs', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('link', { name: '体验单选框原型' }).click();
    await expect(page.getByRole('heading', { name: definition.heading, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: /查看 Radio 组件文档/ }).click();
    await expect(page).toHaveURL(/\/components\/rc-radio\/?$/);
    await expect(page.getByRole('link', { name: '查看设计原型' })).toHaveAttribute('href', /\/design\/radio\/?$/);
});

for (const designSystem of designs) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Radio startup and required groups work in ${designSystem} ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 950 });
            await openSite(page, previewOrigin, definition, { designSystem, colorMode });
            const start = startup(page);
            const group = start.getByRole('radiogroup', { name: '启动方式' });
            const restore = radio(group, '恢复上次会话');
            const blank = radio(group, '打开空白工作区');
            const managed = radio(group, '使用团队预设');
            const save = start.getByRole('button', { name: '保存设置' });
            const status = start.getByRole('status');
            await expect(restore).toBeChecked();
            await expect(managed).toBeDisabled();
            await expect(managed).toHaveAccessibleDescription('需要管理员授权才能载入团队维护的布局。');
            await expect(save).toBeDisabled();
            await expect(status).toHaveText('当前生效 恢复上次会话');
            await settleFiniteAnimations(page);
            const scenarioImage = info.outputPath(`radio-${designSystem}-${colorMode}.png`);
            await start.screenshot({ path: scenarioImage, animations: 'disabled' });
            await info.attach('启动设置', { path: scenarioImage, contentType: 'image/png' });

            await jumpLink(page).focus();
            await page.keyboard.press('Tab');
            await expect(restore).toBeFocused();
            const priorBox = await control(restore).locator('[data-radio-part="box"]').boundingBox();
            await page.keyboard.press('ArrowDown');
            await expect(blank).toBeFocused();
            await expect(blank).toBeChecked();
            await expect(restore).not.toBeChecked();
            expect(await control(restore).locator('[data-radio-part="box"]').boundingBox()).toEqual(priorBox);
            await expect(status).toHaveText('尚未保存。当前生效 恢复上次会话');
            await page.keyboard.press('ArrowDown');
            await expect(restore).toBeFocused();
            await expect(restore).toBeChecked();
            await expect(managed).not.toBeChecked();
            await page.keyboard.press('ArrowUp');
            await page.keyboard.press('Space');
            await expect(blank).toBeChecked();
            await page.keyboard.press('Tab');
            await expect(save).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(status).toHaveText('当前生效 打开空白工作区');
            await expect(save).toBeDisabled();

            const validation = required(page);
            const view = validation.getByRole('radiogroup', { name: '启动视图（必填）' });
            const overview = radio(view, '项目总览');
            const recent = radio(view, '最近项目');
            const confirm = validation.getByRole('button', { name: '确认视图' });
            const reset = validation.getByRole('button', { name: '重置' });
            await expect(view).toHaveAttribute('aria-required', 'true');
            await expect(overview).not.toBeChecked();
            await expect(recent).not.toBeChecked();
            await confirm.focus();
            await page.keyboard.press('Enter');
            await expect(overview).toBeFocused();
            await expect(control(overview)).toHaveCSS('outline-style', 'solid');
            await expect(view).toHaveAttribute('aria-invalid', 'true');
            await expect(overview).toHaveAccessibleDescription('请选择一个启动视图。');
            await expect(validation.getByRole('alert')).toHaveText('请选择一个启动视图。');
            const validationImage = info.outputPath(`radio-${designSystem}-${colorMode}-required.png`);
            await validation.screenshot({ path: validationImage, animations: 'disabled' });
            await info.attach('必填校验', { path: validationImage, contentType: 'image/png' });
            await page.keyboard.press('Space');
            await expect(overview).toBeChecked();
            await expect(validation.getByRole('alert')).toHaveCount(0);
            await expect(overview).not.toHaveAttribute('aria-invalid');
            await page.keyboard.press('ArrowRight');
            await expect(recent).toBeFocused();
            await expect(recent).toBeChecked();
            await page.keyboard.press('Tab');
            await expect(reset).toBeFocused();
            await page.keyboard.press('Tab');
            await expect(confirm).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(validation.getByRole('status')).toHaveText('已确认 最近项目');
            await reset.click();
            await expect(overview).not.toBeChecked();
            await expect(recent).not.toBeChecked();
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
    }
}

test('changing design keeps the draft, saved setting and validation groups independent', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    await radio(startup(page), '打开空白工作区').press('Space');
    await required(page).getByRole('button', { name: '确认视图' }).click();
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        await expect(prototype(page)).toHaveAttribute('data-prototype-design', design);
        await expect(radio(startup(page), '打开空白工作区')).toBeChecked();
        await expect(startup(page).getByRole('status')).toHaveText('尚未保存。当前生效 恢复上次会话');
        await expect(required(page).getByRole('alert')).toBeVisible();
        await expect(radio(required(page), '项目总览')).not.toBeChecked();
    }
});

test('selected ring and keyboard focus survive forced colors with reduced motion', { tag: ['@website', '@chromium-only'] }, async ({ page, previewOrigin }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    for (const design of designs) {
        if (design !== 'md3') await chooseDesign(page, design);
        const restore = radio(startup(page), '恢复上次会话');
        await jumpLink(page).focus();
        await page.keyboard.press('Tab');
        await expect(restore).toBeFocused();
        await expect(restore).toBeChecked();
        await expect(control(restore)).toHaveCSS('outline-style', 'solid');
        const dot = control(restore).locator('[data-radio-part="dot"]');
        await expect(dot).toHaveCSS('opacity', '1');
        await expect(dot).toHaveCSS('transition-duration', '0s');
    }
});

test.describe('Radio touch targets', () => {
    test.use({ hasTouch: true });
    test('tapping the option description selects it in all three themes', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
        for (const design of designs) {
            if (design !== 'md3') await chooseDesign(page, design);
            const start = startup(page);
            await start.getByText('重新打开上次使用的项目、标签页和面板。', { exact: true }).tap();
            const blank = radio(start, '打开空白工作区');
            const label = blank.locator('..');
            expect((await label.boundingBox()).height).toBeGreaterThanOrEqual(44);
            await start.getByText('从空白视图开始，之后可以手动打开项目。', { exact: true }).tap();
            await expect(blank).toBeChecked();
            await expect(radio(start, '使用团队预设')).toBeDisabled();
        }
    });
});
