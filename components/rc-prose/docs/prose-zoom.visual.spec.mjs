import {
    zoomTest,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureZoom,
} from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations)
    zoomTest(
        `${config.designSystem} ${config.colorMode} real zoom 200%`,
        {
            tag: ['@rc-prose', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(page, previewOrigin, 'rc-prose', spec.demo, config);
            const scene = page.getByRole('region', { name: 'Prose visual matrix' });
            await page.getByLabel('文章尺寸', { exact: true }).selectOption('xl');
            const article = scene.getByRole('article');
            await expect(article).toBeVisible();
            const original = await article.elementHandle();
            await realZoom.set200(page);
            await settleFiniteAnimations(page);
            await scene.scrollIntoViewIfNeeded();
            const assertPageWidth = async () =>
                expect(
                    await page.evaluate(
                        () =>
                            Math.max(
                                globalThis.document.documentElement.scrollWidth,
                                globalThis.document.body.scrollWidth,
                            ) <=
                            globalThis.innerWidth + 1,
                    ),
                    'Browser page must not grow horizontally at real 200% zoom; local component scrollers own overflow',
                ).toBe(true);
            expect(await original.evaluate((node) => node.isConnected)).toBe(true);
            await expect(page.getByLabel('文章尺寸', { exact: true })).toHaveValue('xl');
            await article.getByRole('heading', { level: 2 }).scrollIntoViewIfNeeded();
            await assertPageWidth();
            await captureZoom(
                page,
                realZoom,
                `${config.designSystem}-${config.colorMode}-zoom-200-article-start.png`,
                info,
            );
            const link = article.getByRole('link').first();
            await link.scrollIntoViewIfNeeded();
            await expect(link).toBeVisible();
            await link.focus();
            await page.keyboard.press('Tab');
            expect(await article.locator(':focus-visible').count()).toBeGreaterThan(0);
            const code = article.locator('pre');
            await code.scrollIntoViewIfNeeded();
            expect(await code.evaluate((node) => getComputedStyle(node).direction)).toBe('ltr');
            await assertPageWidth();
            await info.attach('local-scroll-regions', {
                body: JSON.stringify([
                    {
                        name: 'Article code block',
                        scope: 'Long code remains in the pre element horizontal scroller',
                        dimensions: await code.evaluate((node) => ({
                            clientWidth: node.clientWidth,
                            scrollWidth: node.scrollWidth,
                            overflowX: getComputedStyle(node).overflowX,
                        })),
                    },
                ]),
                contentType: 'application/json',
            });
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-code.png`, info);
            await article.getByText('内容结束 / End', { exact: true }).scrollIntoViewIfNeeded();
            await assertPageWidth();
            await captureZoom(
                page,
                realZoom,
                `${config.designSystem}-${config.colorMode}-zoom-200-article-end.png`,
                info,
            );
        },
    );
