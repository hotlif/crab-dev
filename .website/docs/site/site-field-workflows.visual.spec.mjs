import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, chooseDesign, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };
const selectPage = { path: '/design/select', heading: 'Select 选择器' };
const formPage = { path: '/design/form', heading: 'Form 表单' };
const selectScene = page => page.locator('[data-select-prototype] .crab-field-workflow-scene');
const formScene = page => page.locator('[data-form-prototype] .crab-field-workflow-scene');

async function capture(scene, info, filename, title) {
    const path = info.outputPath(filename);
    await settleFiniteAnimations(scene.page());
    await scene.screenshot({ path, animations: 'disabled' });
    await info.attach(title, { path, contentType: 'image/png' });
}

test('Select and Form have links from the design overview and component docs', options, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    for (const [name, definition] of [['选择器', selectPage], ['表单', formPage]]) {
        await page.getByRole('link', { name: `体验${name}原型` }).click();
        await expect(page.getByRole('heading', { name: definition.heading, level: 1 })).toBeVisible();
        await page.getByRole('link', { name: /^查看 (Select|Form) 组件文档$/ }).click();
        await expect(page.getByRole('link', { name: '查看设计原型' })).toHaveAttribute('href', new RegExp(definition.path + '/?$'));
        await page.getByRole('navigation', { name: '主导航', exact: true }).getByRole('link', { name: '设计', exact: true }).click();
    }
});

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Select searches, filters and retries in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 900 });
            await openSite(page, previewOrigin, selectPage, { designSystem, colorMode });
            const scene = selectScene(page);
            const type = scene.getByRole('combobox', { name: '设备类型' });
            const options = page.getByRole('listbox');
            const trigger = scene.getByRole('button', { name: /^运行状态/ });
            const search = scene.getByRole('textbox', { name: '搜索状态' });
            const count = scene.getByText(/^显示 \d 台设备$/);
            await type.press('ArrowDown');
            await expect(options).toBeVisible();
            await expect(options.getByRole('option', { name: '旧式压力变送器（已停用）' })).toHaveAttribute('aria-disabled', 'true');
            await type.press('Escape');
            await expect(options).toBeHidden();
            await expect(type).toBeFocused();
            await expect(count).toHaveText('显示 4 台设备');
            await type.press('ArrowDown');
            await options.getByRole('option', { name: '远程振动监测与故障预警采集终端' }).click();
            await expect(type).toBeFocused();
            await expect(count).toHaveText('显示 1 台设备');
            await type.hover();
            await scene.getByRole('button', { name: '清除', exact: true }).click();
            await expect(count).toHaveText('显示 4 台设备');
            await trigger.press('Enter');
            await expect(search).toBeFocused();
            await expect(scene.getByText('找到 4 个状态。')).toBeVisible();
            await search.press('Tab');
            const first = scene.getByRole('checkbox', { name: '运行正常' });
            await expect(first).toBeFocused();
            await first.press('Space');
            await expect(count).toHaveText('显示 1 台设备');
            await search.fill('库存');
            await expect(scene.getByText('没有匹配的状态。')).toBeVisible();
            await expect(count).toHaveText('显示 1 台设备');

            await page.getByRole('button', { name: '下次搜索返回错误' }).click();
            await search.fill('运行');
            await expect(scene.getByText('正在搜索状态…')).toBeVisible();
            await expect(scene.getByText('状态加载失败，已保留搜索词和筛选。')).toBeVisible();
            await expect(search).toHaveValue('运行');
            await capture(scene, info, `select-${designSystem}-${colorMode}-failure.png`, '搜索失败与已选筛选');
            await scene.getByRole('button', { name: '重试查询' }).press('Enter');
            await expect(search).toBeFocused();
            await expect(scene.getByText('找到 2 个状态。')).toBeVisible();
            await expect(first).toBeChecked();
            await scene.getByRole('group', { name: '匹配的状态' }).getByText('运行中，等待现场维护窗口确认', { exact: true }).click();
            await expect(count).toHaveText('显示 2 台设备');
            await capture(scene, info, `select-${designSystem}-${colorMode}-filtered.png`, '异步结果和多选');
            await search.press('Escape');
            await expect(trigger).toBeFocused();
            await expect(trigger).toHaveAttribute('aria-expanded', 'false');
            await scene.getByRole('button', { name: '清空状态' }).click();
            await expect(trigger).toBeFocused();
            await expect(count).toHaveText('显示 4 台设备');
            await assertDocumentWidth(page, info);
        });

        test(`Form validates and retains its draft in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 900 });
            await openSite(page, previewOrigin, formPage, { designSystem, colorMode });
            const scene = formScene(page);
            const form = scene.getByRole('form', { name: '采样规则' });
            const name = scene.getByRole('textbox', { name: /配置名称/ });
            const save = scene.getByRole('button', { name: '保存配置', exact: true });
            const attempts = page.locator('[data-form-attempts]');
            const savedName = page.locator('[data-saved-name]');
            const dirty = scene.locator('[data-form-dirty]');

            await name.fill('北');
            await save.click();
            await expect(name).toBeFocused();
            await expect(name).toHaveAttribute('aria-invalid', 'true');
            await expect(name).toHaveAccessibleDescription(/请输入至少 3 个字符/);
            await expect(attempts).toHaveText('0');
            await capture(scene, info, `form-${designSystem}-${colorMode}-validation.png`, '字段错误与首个错误焦点');
            await name.fill('北区备用采样');
            await page.getByRole('button', { name: '下次保存返回错误' }).click();
            await name.press('Enter');
            await expect(scene.getByRole('button', { name: '正在保存' })).toHaveAttribute('aria-busy', 'true');
            await form.evaluate(element => element.requestSubmit());
            await expect(scene.getByRole('alert').filter({ hasText: '保存失败' })).toBeVisible();
            await expect(attempts).toHaveText('1');
            await expect(name).toBeFocused();
            await expect(name).toHaveValue('北区备用采样');
            await expect(savedName).toHaveText('北区输水运行');
            await expect(dirty).toHaveText('有未保存修改');
            await capture(scene, info, `form-${designSystem}-${colorMode}-failed.png`, '请求失败与草稿保留');

            await save.click();
            await expect(scene.getByRole('button', { name: '正在保存' })).toBeVisible();
            await name.fill('下一班采样配置');
            await expect(scene.getByText('配置已保存。')).toBeVisible();
            await expect(attempts).toHaveText('2');
            await expect(savedName).toHaveText('北区备用采样');
            await expect(name).toHaveValue('下一班采样配置');
            await expect(dirty).toHaveText('有未保存修改');
            await scene.getByRole('button', { name: '还原修改' }).click();
            await expect(name).toBeFocused();
            await expect(name).toHaveValue('北区备用采样');
            await expect(dirty).toHaveText('与已保存配置一致');
            await assertDocumentWidth(page, info);
        });
    }
}

test('Select ignores earlier results and preserves filters across themes', options, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, selectPage, { designSystem: 'md3', colorMode: 'light' });
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    const scene = selectScene(page);
    await scene.getByRole('button', { name: '运行状态', exact: true }).click();
    const search = scene.getByRole('textbox', { name: '搜索状态' });
    await search.fill('库存');
    await search.fill('运行');
    await expect(scene.getByText('找到 2 个状态。')).toBeVisible();
    await scene.getByRole('checkbox', { name: '运行正常' }).press('Space');
    for (const theme of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, theme);
        await expect(search).toHaveValue('运行');
        await expect(scene.getByRole('checkbox', { name: '运行正常' })).toBeChecked();
        await expect(scene.getByText('显示 1 台设备')).toBeVisible();
    }
});

test('Form preserves both fields across actual theme changes in forced colors', options, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, formPage, { designSystem: 'md3', colorMode: 'light' });
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    const scene = formScene(page);
    const name = scene.getByRole('textbox', { name: /配置名称/ });
    const interval = scene.getByRole('combobox', { name: '采样频率' });
    await name.fill('南区夜间配置');
    await interval.click();
    await page.getByRole('option', { name: '每 15 秒' }).click();
    for (const theme of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, theme);
        await expect(name).toHaveValue('南区夜间配置');
        await expect(interval).toContainText('每 15 秒');
        await expect(scene.locator('[data-form-dirty]')).toHaveText('有未保存修改');
    }
});
