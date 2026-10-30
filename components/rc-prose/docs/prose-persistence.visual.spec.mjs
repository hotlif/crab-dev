import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
} from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
test(
    'configuration switches retain actual nodes and user state',
    { tag: ['@rc-prose', '@boundary'] },
    async ({ page, previewOrigin }) => {
        await openDemo(page, previewOrigin, 'rc-prose', spec.demo, configurations[0]);
        const switchConfig = async (config) => {
            await page.evaluate(
                (config) =>
                    globalThis.postMessage(
                        {
                            type: 'crab:preview-config',
                            ...config,
                            size: 'large',
                            density: 'comfortable',
                            locale: 'en-US',
                            direction: 'rtl',
                            brandColor: '#157349',
                        },
                        globalThis.location.origin,
                    ),
                config,
            );
            await expect(page.locator('.demo-default-preview').first()).toHaveAttribute(
                'data-crab-design',
                config.designSystem,
            );
            await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-theme', config.colorMode);
            await settleFiniteAnimations(page);
        };
        const article = page.getByRole('region', { name: 'Prose visual matrix' }).getByRole('article');
        const original = await article.elementHandle();
        for (const config of configurations) {
            await switchConfig(config);
            expect(await original.evaluate((node) => node.isConnected)).toBe(true);
            await expect(article.getByRole('heading', { level: 2 })).toContainText('Maintainable interfaces');
            expect(await article.locator('pre').evaluate((node) => getComputedStyle(node).direction)).toBe('ltr');
        }
    },
);
