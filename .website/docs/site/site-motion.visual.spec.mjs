import { test, expect, configurations } from '../../../test/visual/component-fixture.mjs';
import { sitePages, openSite, chooseDesign, chooseMode, assertSiteConfiguration } from './site-visual-support.mjs';

test.describe.configure({ timeout: 90_000 });
test.use({ video: 'on', viewport: { width: 1440, height: 900 } });
const home = sitePages.find(page => page.id === 'home');
const labels = { md3: 'MD3', apple: 'Apple', shadcn: 'shadcn' };

async function settleReveal(target) {
    // Firefox retains pending component transitions inside closed <details>.
    // The site's entrance belongs to this wrapper; observe its own animations.
    await expect.poll(() => target.evaluate(node => node.getAnimations()
        .filter(animation => animation.playState === 'running' && Number.isFinite(animation.effect?.getComputedTiming().endTime)).length),
    { message: 'Revealed section finishes naturally' }).toBe(0);
    await expect(target).toHaveCSS('opacity', '1');
    await expect(target).toHaveCSS('transform', 'none');
}

for (const config of configurations) {
    test('Site motion and live theme picker ' + [config.designSystem, config.colorMode].join(' '), {
        tag: ['@website', '@site-motion'],
        annotation: { type: 'site', description: JSON.stringify({ ...config, state: 'finite-entrance-once-and-retained-drafts' }) },
    }, async ({ page, previewOrigin }, info) => {
        await page.addInitScript(() => {
            globalThis.siteEntrances = [];
            document.addEventListener('animationstart', event => {
                if (event.target.matches('.crab-site-enter, [data-site-reveal]')) {
                    globalThis.siteEntrances.push({ name: event.animationName, hero: event.target.matches('.crab-site-enter') });
                }
            });
        });
        await openSite(page, previewOrigin, home, config);
        const choreography = await page.locator('.crab-site-enter').evaluateAll(nodes => nodes.map(node => {
            const style = getComputedStyle(node);
            return { duration: style.animationDuration.split(',').map(value => parseFloat(value) * 1000), delay: style.animationDelay.split(',').map(value => parseFloat(value) * 1000) };
        }));
        expect(choreography).toHaveLength(3);
        for (const step of choreography) {
            expect(Math.max(...step.delay)).toBeLessThanOrEqual(150);
            expect(Math.max(...step.duration) + Math.max(...step.delay)).toBeLessThanOrEqual(800);
        }
        const heroCount = await page.evaluate(() => globalThis.siteEntrances.filter(event => event.hero).length);
        expect(heroCount).toBe(6);
        const input = page.getByRole('textbox', { name: '示例项目名称', exact: true });
        await input.fill('快速切换后保留的工作区');
        const instance = await input.elementHandle();
        const picker = page.getByRole('radiogroup', { name: '首页设计体系', exact: true });
        const views = page.getByRole('radiogroup', { name: '示例视图', exact: true });
        await views.getByRole('radio', { name: '活动', exact: true }).locator('..').click();
        for (const designSystem of ['apple', 'shadcn', 'md3', config.designSystem]) {
            await picker.getByRole('radio', { name: labels[designSystem], exact: true }).locator('..').click();
            await assertSiteConfiguration(page, { ...config, designSystem });
        }
        const other = config.designSystem === 'apple' ? 'shadcn' : 'apple';
        await chooseDesign(page, other);
        await expect(picker.getByRole('radio', { name: labels[other], exact: true })).toBeChecked();
        await chooseMode(page, config.colorMode === 'light' ? 'dark' : 'light');
        await expect(input).toHaveValue('快速切换后保留的工作区');
        await expect(views.getByRole('radio', { name: '活动', exact: true })).toBeChecked();
        expect(await input.evaluate((node, previous) => node === previous, instance)).toBe(true);
        expect(await page.evaluate(() => globalThis.siteEntrances.filter(event => event.hero).length)).toBe(heroCount);

        const section = page.locator('.crab-site-reveal').last();
        await expect(section).toHaveAttribute('data-site-reveal', 'pending');
        await section.scrollIntoViewIfNeeded();
        await expect(section).toHaveAttribute('data-site-reveal', 'entered');
        await settleReveal(section);
        const first = await page.evaluate(() => globalThis.siteEntrances.length);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await section.scrollIntoViewIfNeeded();
        await settleReveal(section);
        expect(await page.evaluate(() => globalThis.siteEntrances.length)).toBe(first);
        await info.attach('motion-timing', { body: JSON.stringify({ choreography, heroCount, entrances: await page.evaluate(() => globalThis.siteEntrances) }), contentType: 'application/json' });

        await page.getByRole('navigation', { name: '主导航', exact: true }).getByRole('link', { name: '组件', exact: true }).click();
        const group = page.locator('.crab-catalog-section').last();
        await expect(group).toHaveAttribute('data-site-reveal', 'pending');
        await group.scrollIntoViewIfNeeded();
        await expect(group).toHaveAttribute('data-site-reveal', 'entered');
        await settleReveal(group);
        const catalogCount = await page.evaluate(() => globalThis.siteEntrances.length);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await group.scrollIntoViewIfNeeded();
        await settleReveal(group);
        expect(await page.evaluate(() => globalThis.siteEntrances.length)).toBe(catalogCount);
    });

    test('Site motion respects focus and reduced motion ' + [config.designSystem, config.colorMode].join(' '), {
        tag: ['@website', '@site-motion'],
    }, async ({ page, previewOrigin }) => {
        await openSite(page, previewOrigin, home, config);
        const section = page.locator('.crab-site-reveal').last();
        await expect(section).toHaveAttribute('data-site-reveal', 'pending');
        await section.getByRole('button').first().focus();
        await expect(section).toHaveAttribute('data-site-reveal', 'visible');
        await expect(section).toHaveCSS('opacity', '1');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await expect(page.locator('[data-site-reveal="pending"]')).toHaveCount(0);
        await expect(page.locator('.crab-site-enter').first()).toHaveCSS('animation-name', 'none');
        await page.reload();
        await expect(page.locator('.crab-site-reveal')).toHaveCount(4);
        await expect(page.locator('[data-site-reveal="pending"]')).toHaveCount(0);
        await expect(page.locator('.crab-site-enter').first()).toHaveCSS('opacity', '1');
    });
}

test('Site reveals stay readable without IntersectionObserver', { tag: ['@website', '@site-motion'] }, async ({ page, previewOrigin }) => {
    await page.addInitScript(() => { globalThis.IntersectionObserver = undefined; });
    await openSite(page, previewOrigin, home, configurations[0]);
    await expect(page.locator('.crab-site-reveal')).toHaveCount(4);
    await expect(page.locator('[data-site-reveal="pending"]')).toHaveCount(0);
    for (const section of await page.locator('.crab-site-reveal').all()) await expect(section).toHaveCSS('opacity', '1');
});
