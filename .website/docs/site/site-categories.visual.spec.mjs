import { test, expect, configurations, environmentCases, applyEnvironment, captureVisual, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, assertDocumentWidth } from './site-visual-support.mjs';

// Include the initial home route, card geometry and saved-anchor navigation.
test.describe.configure({ timeout: 60_000 });
const home = sitePages.find(page => page.id === 'home');
const environments = environmentCases.filter(environment => ['narrow', 'tablet', 'desktop', 'forced-colors', 'reduced-motion'].includes(environment.id));
for (const config of configurations) for (const environment of environments) {
    test('Site task categories ' + [config.designSystem, config.colorMode, environment.id].join(' '), {
        tag: ['@website', '@site-categories', '@chromium-only'],
        annotation: { type: 'site', description: JSON.stringify({ ...config, environment: environment.id, state: 'task-categories-keyboard' }) },
    }, async ({ page, previewOrigin }, info) => {
        await page.setViewportSize(environment.viewport ?? { width: 1440, height: 900 });
        await applyEnvironment(page, environment);
        await openSite(page, previewOrigin, home, config);
        const section = page.getByRole('region', { name: '从常用能力开始探索。', exact: true });
        const cards = section.getByRole('article');
        const links = section.locator('.crab-home-component-links').getByRole('link');
        await expect(cards).toHaveCount(6);
        await expect(links).toHaveCount(24);
        await expect(section.getByRole('navigation', { name: '任务入口跳转', exact: true })).toHaveCount(0);
        for (const title of ['输入与操作', '信息展示', '反馈与浮层', '导航', '布局与性能', '数据与可视化']) {
            await expect(section.getByRole('navigation', { name: `${title}组件`, exact: true })).toBeVisible();
        }
        const geometry = await section.evaluate(node => {
            const articles = Array.from(node.querySelectorAll('article'));
            const firstRow = articles[0].getBoundingClientRect().top;
            return {
                width: node.clientWidth,
                rem: Number.parseFloat(getComputedStyle(globalThis.document.documentElement).fontSize),
                columns: articles.filter(article => Math.abs(article.getBoundingClientRect().top - firstRow) < 1).length,
                overflow: articles.some(article => article.scrollWidth > article.clientWidth + 1),
            };
        });
        expect(geometry.columns).toBe(geometry.width >= 64 * geometry.rem ? 3 : geometry.width >= 40 * geometry.rem ? 2 : 1);
        expect(geometry.overflow).toBe(false);
        await assertDocumentWidth(page, info);
        await expect(links.first()).toHaveAccessibleName('按钮');
        await expect(links.last()).toHaveAccessibleName('画布');

        const catalog = section.getByRole('link', { name: '查看全部组件', exact: true });
        await catalog.focus();
        await catalog.press('Tab');
        for (let index = 0; index < await links.count(); index += 1) {
            const link = links.nth(index);
            await expect(link).toBeFocused();
            await expect(link).toBeInViewport();
            expect(await link.evaluate(node => node.matches(':focus-visible') && Number.parseFloat(getComputedStyle(node).outlineWidth) > 0)).toBe(true);
            if (index < await links.count() - 1) await link.press('Tab');
        }
        await links.first().hover();
        await settleFiniteAnimations(page);
        await section.evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await captureVisual(section, [config.designSystem, config.colorMode, environment.id, 'task-categories'].join('-') + '.png', info);
        if (environment.id === 'desktop') {
            await page.goto(previewOrigin + '/#home-data-visualization');
            await expect(page.locator('#home-data-visualization')).toBeInViewport();
        }
    });
}
