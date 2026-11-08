import { test, expect, configurations, captureVisual } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, assertDocumentWidth } from './site-visual-support.mjs';

test.describe.configure({ timeout: 60_000 });
const guide = sitePages.find(page => page.id === 'design');
const home = sitePages.find(page => page.id === 'home');
for (const config of configurations) {
    test('Site RTL shell and long content ' + [config.designSystem, config.colorMode].join(' '), {
        tag: ['@website', '@site-environment'],
    }, async ({ page, previewOrigin }, info) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await openSite(page, previewOrigin, guide, config);
        // The site has no direction switch. Exercise its own CSS boundary;
        // this does not claim to validate component or iframe RTL behavior.
        await page.evaluate(() => {
            document.documentElement.dir = 'rtl';
            document.querySelector('.crab-docs').dir = 'rtl';
        });
        const sidebar = await page.locator('.crab-docs-sidebar').boundingBox();
        const heading = page.locator('.crab-docs-page-heading h1');
        const title = await page.locator('.crab-docs-page-heading').boundingBox();
        expect(sidebar.x, 'RTL sidebar must remain outside the reading area').toBeGreaterThanOrEqual(title.x + title.width);
        await assertDocumentWidth(page, info);
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-rtl-guide.png`, info);

        await page.setViewportSize({ width: 320, height: 768 });
        await expect(page.locator('.crab-docs-sidebar')).not.toBeVisible();
        await heading.evaluate(node => {
            node.textContent = '三套设计体系与跨团队协作中的组件使用规范 — InternationalizationAndResponsiveComponentDocumentationWithLongUnbrokenWords';
        });
        await assertDocumentWidth(page, info);
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-rtl-long-title.png`, info);

        await openSite(page, previewOrigin, home, config);
        const input = page.getByRole('textbox', { name: '示例项目名称', exact: true });
        const draft = '团队协作与国际化设计工作区 · International design workspace'.slice(0, Number(await input.getAttribute('maxlength')));
        await input.fill(draft);
        await expect(input).toHaveValue(draft);
        await assertDocumentWidth(page, info);
        await captureVisual(page.getByRole('region', { name: '交互组件预览', exact: true }), `${config.designSystem}-${config.colorMode}-long-draft.png`, info);
    });
}
