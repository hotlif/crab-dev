import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual } from '../../../test/visual/component-fixture.mjs';
import { sitePages, designIds, openSite, chooseDesign, chooseMode, assertDocumentWidth } from './site-visual-support.mjs';

// Repeated configuration changes preserve the interactive home preview.
test.describe.configure({ timeout: 90_000 });
const home = sitePages.find(page => page.id === 'home');
const environments = environmentCases.filter(environment => ['forced-colors', 'reduced-motion'].includes(environment.id));
for (const config of configurations) for (const environment of environments) {
    test('Site home draft and accessibility ' + [config.designSystem, config.colorMode, environment.id].join(' '), {
        tag: ['@website', '@site-home', '@chromium-only'],
        annotation: { type: 'site', description: JSON.stringify({ ...config, environment: environment.id, state: 'home-draft-resize-keyboard' }) },
    }, async ({ page, previewOrigin }, info) => {
        await applyEnvironment(page, environment);
        await page.setViewportSize({ width: 1440, height: 900 });
        await openSite(page, previewOrigin, home, config);
        const preview = page.getByRole('region', { name: '交互组件预览', exact: true });
        const input = preview.getByRole('textbox', { name: '示例项目名称', exact: true });
        await input.fill('保留跨布局的草稿');
        const instance = await input.elementHandle();
        for (const width of [768, 320, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            await expect(input).toHaveValue('保留跨布局的草稿');
            expect(await input.evaluate((node, previous) => node === previous, instance)).toBe(true);
            await assertDocumentWidth(page, info);
        }
        await chooseDesign(page, designIds[(designIds.indexOf(config.designSystem) + 1) % designIds.length]);
        await chooseMode(page, config.colorMode === 'light' ? 'dark' : 'light');
        await expect(input).toHaveValue('保留跨布局的草稿');
        expect(await input.evaluate((node, previous) => node === previous, instance)).toBe(true);
        await input.focus();
        await input.press('Tab');
        const collaboration = preview.getByRole('switch', { name: '允许团队协作', exact: true });
        await expect(collaboration).toBeFocused();
        await collaboration.press('Space');
        await collaboration.press('Tab');
        const create = preview.getByRole('button', { name: '创建项目', exact: true });
        await expect(create).toBeFocused();
        await create.press('Enter');
        await expect(preview.getByRole('status')).toHaveText('已创建「保留跨布局的草稿」，仅自己可见。');
        await captureVisual(preview, [config.designSystem, config.colorMode, environment.id, 'home-preview'].join('-') + '.png', info);
    });
}
