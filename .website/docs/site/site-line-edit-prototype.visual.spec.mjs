import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, chooseMode, openSite } from './site-visual-support.mjs';

const definition = { path: '/design/line-edit', heading: 'LineEdit 单行输入框' };
const form = page => page.getByRole('form', { name: '编辑工作区名称' });
const field = page => form(page).getByRole('textbox', { name: '工作区名称', exact: true });

test('LineEdit prototype is linked from the design overview and component docs', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    const entry = page.getByRole('link', { name: /体验输入框原型/ });
    await expect(entry.locator('..').locator('[data-field-control]')).toHaveAttribute('data-appearance', 'outlined');
    await entry.click();
    await expect(page.getByRole('heading', { level: 1, name: definition.heading })).toBeVisible();
    await page.getByRole('link', { name: /查看 LineEdit 组件文档/ }).click();
    await expect(page).toHaveURL(/\/components\/rc-line-edit\/?$/);
    await expect(page.getByRole('link', { name: '查看设计原型', exact: true })).toHaveAttribute('href', /\/design\/line-edit\/?$/);
});

async function describedText(input) {
    return input.evaluate(node => (node.getAttribute('aria-describedby') ?? '').split(' ')
        .map(id => node.ownerDocument.getElementById(id)?.textContent ?? '').join(' '));
}

function controlGeometry(input) {
    return input.evaluate(node => {
        const control = node.closest('[data-field-control]');
        const { x, y, width, height } = control.getBoundingClientRect();
        return [x + globalThis.scrollX, y + globalThis.scrollY, width, height, getComputedStyle(control).borderRadius];
    });
}

for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
    test(`Material LineEdit uses a fixed outlined shape and floating label in ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
        await page.setViewportSize({ width, height: 980 });
        await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode });
        const input = field(page);
        const root = form(page).locator('[data-field-root]');
        const label = root.locator('label');
        const control = root.locator('[data-field-control]');
        const outline = control.locator('fieldset');
        const notchWidth = () => outline.locator('legend').evaluate(node => node.getBoundingClientRect().width);
        const empty = page.getByRole('button', { name: '空值', exact: true });
        const readout = page.locator('.crab-line-edit-readout dd');
        const labelOffset = () => label.evaluate(node => node.getBoundingClientRect().y - node.parentElement.getBoundingClientRect().y);

        await expect(control).toHaveAttribute('data-appearance', 'outlined');
        await expect(page.locator('[data-line-edit-prototype] [data-field-control]:not([data-appearance="outlined"])')).toHaveCount(0);
        await expect(page.getByRole('radiogroup', { name: '字段外观', exact: true })).toHaveCount(0);
        await expect(control).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await empty.click();
        await empty.focus();
        await settleFiniteAnimations(page);
        const geometry = await controlGeometry(input);
        expect(geometry[3]).toBe(56);
        await expect(label).toHaveCSS('font-size', '16px');
        expect(await labelOffset()).toBeGreaterThan(12);
        expect(await notchWidth()).toBe(0);
        await expect(outline).toHaveCSS('border-top-width', '1px');
        await input.focus();
        await settleFiniteAnimations(page);
        await expect(label).toHaveCSS('font-size', '12px');
        expect(await labelOffset()).toBeLessThan(0);
        await expect(outline).toHaveCSS('border-top-width', '2px');
        expect(await notchWidth()).toBeGreaterThan(20);
        expect(await controlGeometry(input)).toEqual(geometry);
        await input.fill('北区调试工作区');
        await empty.focus();
        await settleFiniteAnimations(page);
        await expect(input).toHaveValue('北区调试工作区');
        await expect(label).toHaveCSS('font-size', '12px');
        expect(await labelOffset()).toBeLessThan(0);
        expect(await notchWidth()).toBeGreaterThan(20);
        expect(await controlGeometry(input)).toEqual(geometry);
        await expect(readout).toHaveText('北区巡检工作区');
        if (colorMode === 'light') {
            await input.focus();
            await settleFiniteAnimations(page);
            await captureScene(page, info, 'md3-outlined');
        }

        await empty.click();
        await input.press('Enter');
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        await expect(form(page).getByRole('alert')).toContainText('请输入工作区名称');
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        if (colorMode === 'dark') await captureScene(page, info, 'md3-outlined-dark-error');
    });
}

test('LineEdit design validates on submit and preserves focus, geometry and the saved value', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await page.setViewportSize({ width: 320, height: 880 });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'dark' });
    const input = field(page);
    const scene = page.locator('#line-edit-scenario');
    const save = form(page).getByRole('button', { name: '保存配置' });
    await expect(input).toHaveValue('北区巡检工作区');
    await expect(input).toHaveAttribute('required', '');
    expect(await describedText(input)).toContain('最多 32 个字符');

    await scene.getByRole('button', { name: '空值', exact: true }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await input.press('Enter');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeFocused();
    expect(await describedText(input)).toContain('请输入工作区名称');

    await scene.getByRole('button', { name: '已占用名称', exact: true }).click();
    await settleFiniteAnimations(page);
    const beforeError = await controlGeometry(input);
    await save.click();
    await expect(input).toHaveValue('系统默认');
    await expect(form(page).getByRole('alert')).toContainText('此名称已被占用');
    expect(await describedText(input)).toContain('此名称已被占用');
    await settleFiniteAnimations(page);
    expect(await controlGeometry(input)).toEqual(beforeError);
    await expect(scene.locator('.crab-line-edit-readout dd')).toHaveText('北区巡检工作区');

    await scene.getByRole('button', { name: '长名称', exact: true }).click();
    await expect(input).toHaveValue('华东区域配电巡检与远程设备运行状态联合调试工作区');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await input.press('End');
    expect(await input.evaluate(node => node.selectionStart)).toBe((await input.inputValue()).length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await input.press('Tab');
    const clear = form(page).getByRole('button', { name: /清除/ });
    await expect(clear).toBeFocused();
    await clear.press('Space');
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
    await expect(clear).toHaveCount(0);
    await expect(scene.locator('.crab-line-edit-readout dd')).toHaveText('北区巡检工作区');

    await input.fill('南区设备巡检');
    await input.press('Enter');
    await expect(form(page).getByRole('status')).toHaveText('工作区名称已保存。');
    await expect(scene.locator('.crab-line-edit-readout dd')).toHaveText('南区设备巡检');
});

test('LineEdit keeps the draft while switching the real site theme', { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
    await page.setViewportSize({ width: 1440, height: 1050 });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    const input = field(page);
    await input.fill('待确认的巡检名称');
    await expect(form(page).getByRole('heading', { name: '工程工作区配置' })).toBeVisible();
    await expect(form(page).locator('[data-field-control]').first()).toHaveAttribute('data-appearance', 'outlined');
    await captureScene(page, info, 'md3');

    await chooseDesign(page, 'macos');
    await expect(input).toHaveValue('待确认的巡检名称');
    const identifier = form(page).getByRole('textbox', { name: '工作区标识' });
    await expect(identifier).toHaveAttribute('readonly', '');
    await expect(form(page).getByRole('heading', { name: '工作区设置' })).toBeVisible();
    const [, nameTop, , nameHeight] = await controlGeometry(input);
    const [, identifierTop, , identifierHeight] = await controlGeometry(identifier);
    expect(identifierTop).toBeCloseTo(nameTop, 1);
    expect(identifierHeight).toBeCloseTo(nameHeight, 1);
    await input.press('Escape');
    await expect(input).toHaveValue('北区巡检工作区');
    await expect(input).toBeFocused();
    await captureScene(page, info, 'macos');

    await input.fill('准备切换的巡检名称');
    await chooseDesign(page, 'shadcn');
    await chooseMode(page, 'dark');
    await expect(input).toHaveValue('准备切换的巡检名称');
    await expect(form(page).getByRole('heading', { name: '工作区资料' })).toBeVisible();
    await expect(form(page).getByRole('textbox', { name: '当前访问路径' })).toHaveAttribute('readonly', '');
    await expect(form(page).getByText('/workspaces/', { exact: true })).toBeVisible();
    await captureScene(page, info, 'shadcn');
});

async function captureScene(page, info, designSystem) {
    const path = info.outputPath(`line-edit-${designSystem}.png`);
    await page.locator('#line-edit-scenario').screenshot({ path, animations: 'disabled' });
    await info.attach(`LineEdit ${designSystem}`, { path, contentType: 'image/png' });
}

test('Chinese composition defers submission until committed text can be saved', { tag: ['@website', '@chromium-only'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    const cdp = await page.context().newCDPSession(page);
    const input = field(page);
    const readout = page.locator('.crab-line-edit-readout dd');
    await input.fill('');
    await input.focus();
    await cdp.send('Input.imeSetComposition', { text: 'beiqu', selectionStart: 5, selectionEnd: 5 });
    await expect(input).toHaveValue('beiqu');
    await form(page).evaluate(node => node.requestSubmit());
    await expect(readout).toHaveText('北区巡检工作区');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await cdp.send('Input.insertText', { text: '北区配电巡检' });
    await expect(input).toHaveValue('北区配电巡检');
    await expect(readout).toHaveText('北区巡检工作区');
    await input.press('Enter');
    await expect(readout).toHaveText('北区配电巡检');
});

test('LineEdit keyboard states work under forced colors and reduced motion', { tag: ['@website', '@chromium-only'] }, async ({ page, previewOrigin }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    const scene = page.locator('#line-edit-states');
    const empty = scene.getByRole('textbox', { name: '待编辑名称' });
    const readonly = scene.getByRole('textbox', { name: '已分配名称' });
    const disabled = scene.getByRole('textbox', { name: '归档名称' });
    const affix = scene.getByRole('textbox', { name: '工作区路径' });
    await expect(empty).toBeVisible();
    const before = await controlGeometry(empty);
    await empty.focus();
    await expect(empty).toBeFocused();
    const control = scene.locator('[data-field-control]').first();
    await expect(control).toHaveCSS('transition-duration', '0s');
    await expect(control).toHaveCSS('outline-style', 'solid');
    expect(await controlGeometry(empty)).toEqual(before);
    await expect(readonly).toHaveAttribute('readonly', '');
    await expect(disabled).toBeDisabled();
    await readonly.press('Tab');
    await expect(affix).toBeFocused();
});
