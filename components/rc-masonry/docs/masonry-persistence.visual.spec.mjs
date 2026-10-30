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
    { tag: ['@rc-masonry', '@boundary'] },
    async ({ page, previewOrigin }) => {
        await openDemo(page, previewOrigin, 'rc-masonry', spec.demo, configurations[0]);
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
        const scene = page.getByRole('region', { name: 'Masonry visual matrix' });
        await expect(scene.locator('[data-masonry-card]')).toHaveCount(8);
        const original = await scene.locator('[data-masonry-card]').first().elementHandle();
        for (const config of configurations) {
            await switchConfig(config);
            expect(await original.evaluate((node) => node.isConnected)).toBe(true);
            await expect(scene.locator('[data-masonry-card]')).toHaveCount(8);
            const bounds = await scene.locator('[data-masonry-card]').first().boundingBox();
            expect(bounds.width).toBeGreaterThan(0);
        }
    },
);
