import { test, expect, configurations, openDemo, captureVisual } from '../../../test/visual/component-fixture.mjs';

for (const config of configurations) test(`Router workflow ${config.designSystem} ${config.colorMode}`, {
    tag: ['@rc-router', '@boundary'],
}, async ({ page, previewOrigin, browserName }, info) => {
    const boundary = await openDemo(page, previewOrigin, 'rc-router', 'workflow.demo.tsx', config);
    await boundary.getByRole('link', { name: '编辑草稿', exact: true }).click();
    const draft = boundary.getByRole('textbox', { name: '工作区草稿' });
    await draft.fill('保留的编辑会话');
    const input = await draft.elementHandle();
    await boundary.getByRole('link', { name: '概览', exact: true }).click();
    const confirm = boundary.getByRole('region', { name: '未保存草稿' });
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: '模拟保存失败' }).click();
    await expect(boundary.getByRole('alert')).toContainText('保存失败');
    await expect(draft).toHaveValue('保留的编辑会话');
    await confirm.getByRole('button', { name: '继续编辑' }).focus();
    await page.keyboard.press('Enter');
    await expect(confirm).toHaveCount(0);
    expect(await draft.evaluate((node, original) => node === original, input)).toBe(true);
    const next = { designSystem: config.designSystem === 'md3' ? 'macos' : 'md3', colorMode: config.colorMode === 'light' ? 'dark' : 'light' };
    await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, globalThis.location.origin), next);
    await expect(boundary).toHaveAttribute('data-crab-design', next.designSystem);
    await expect(draft).toHaveValue('保留的编辑会话');
    expect(await draft.evaluate((node, original) => node === original, input)).toBe(true);
    await page.evaluate(value => globalThis.postMessage({ type: 'crab:preview-config', ...value }, globalThis.location.origin), config);
    await expect(boundary).toHaveAttribute('data-crab-design', config.designSystem);
    await boundary.getByRole('link', { name: '概览', exact: true }).click();
    await captureVisual(boundary, `${config.designSystem}-${config.colorMode}-router-confirm.png`, info, browserName);
    await confirm.getByRole('button', { name: '保存并离开' }).click();
    await expect(boundary.getByRole('heading', { name: '工作区概览' })).toBeVisible();
    await boundary.getByRole('link', { name: '失败页面' }).click();
    await expect(boundary.getByRole('alert')).toContainText('示例页面发生渲染错误');
    await boundary.getByRole('link', { name: '返回概览' }).click();
    await expect(boundary.getByRole('heading', { name: '工作区概览' })).toBeVisible();
});

test('Router workflow narrow keyboard and forced colors', { tag: ['@rc-router', '@environment'] }, async ({ page, previewOrigin }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    const boundary = await openDemo(page, previewOrigin, 'rc-router', 'workflow.demo.tsx', { designSystem: 'md3', colorMode: 'light' });
    await boundary.getByRole('link', { name: '编辑草稿', exact: true }).focus();
    await page.keyboard.press('Enter');
    const draft = boundary.getByRole('textbox', { name: '工作区草稿' });
    await draft.fill('键盘编辑草稿');
    await boundary.getByRole('link', { name: '概览', exact: true }).focus();
    await page.keyboard.press('Enter');
    const cancel = boundary.getByRole('button', { name: '继续编辑' });
    await cancel.focus();
    await expect(cancel).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(draft).toHaveValue('键盘编辑草稿');
    expect(await boundary.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
});
