import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureVisual,
} from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations)
    for (const size of spec.sizes)
        for (const density of spec.densities)
            for (const state of spec.states.filter((value) => ![].includes(value))) {
                const crossEngine =
                    spec.crossEngine.sizes.includes(size) &&
                    spec.crossEngine.densities.includes(density) &&
                    spec.crossEngine.states.includes(state);
                test(
                    `${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`,
                    {
                        tag: ['@rc-prose', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, browserName, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-prose', spec.demo, {
                            ...config,
                            size: 'medium',
                            density,
                        });
                        const scene = page.getByRole('region', { name: 'Prose visual matrix' });
                        await page.getByLabel('文章尺寸', { exact: true }).selectOption(size);
                        if (state === 'inverse')
                            await page.getByLabel('验收状态', { exact: true }).selectOption('inverse');
                        const link = scene.getByRole('link').first();
                        if (state === 'hover') await link.hover();
                        if (state === 'focus-visible') {
                            await page.getByLabel('验收状态', { exact: true }).focus();
                            await page.keyboard.press('Tab');
                            await expect(link).toBeFocused();
                            expect(await link.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
                        }
                        await expect(scene.getByRole('article')).toBeVisible();
                        await expect(scene.locator('.not-prose')).toContainText('Embedded content');
                        expect(await scene.locator('pre').evaluate((node) => getComputedStyle(node).direction)).toBe(
                            'ltr',
                        );
                        await settleFiniteAnimations(page);
                        await info.attach('geometry', {
                            body: JSON.stringify(
                                await scene.evaluate((node) => {
                                    const b = node.getBoundingClientRect();
                                    return { width: b.width, height: b.height, scrollWidth: node.scrollWidth };
                                }),
                            ),
                            contentType: 'application/json',
                        });
                        await captureVisual(
                            scene,
                            `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`,
                            info,
                            browserName,
                        );
                    },
                );
            }
