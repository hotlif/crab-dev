import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureVisual,
    environmentCases,
    applyEnvironment,
} from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url),
    environment = environmentCases.find((item) => item.id === 'touch');
test.use({ hasTouch: environment.hasTouch });
for (const config of configurations)
    test(
        `${config.designSystem} ${config.colorMode} touch`,
        {
            tag: ['@rc-masonry', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
        },
        async ({ page, browserName, previewOrigin }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-masonry', spec.demo, config);
            expect(await page.evaluate(() => globalThis.matchMedia('(pointer:coarse)').matches)).toBe(true);
            const scene = page.getByRole('region', { name: 'Masonry visual matrix' });
            await expect(scene.locator('[data-masonry-card]')).toHaveCount(8);
            await expect
                .poll(() =>
                    scene
                        .locator('[data-masonry-card]')
                        .first()
                        .evaluate((node) => node.getBoundingClientRect().width),
                )
                .toBeGreaterThan(0);
            await expect(scene.locator('[data-masonry-card]')).toHaveCount(8);

            await settleFiniteAnimations(page);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-touch.png`, info, browserName);
        },
    );
