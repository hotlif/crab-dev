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
                        tag: ['@rc-masonry', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, browserName, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-masonry', spec.demo, {
                            ...config,
                            size: size,
                            density,
                        });
                        const scene = page.getByRole('region', { name: 'Masonry visual matrix' });
                        if (state !== 'default') await page.getByLabel('验收状态', { exact: true }).selectOption(state);
                        await expect(scene.locator('[data-masonry-card]')).toHaveCount(
                            state === 'empty' ? 0 : state === 'inserted' ? 10 : 8,
                        );
                        if (state !== 'empty')
                            await expect
                                .poll(() =>
                                    scene
                                        .locator('[data-masonry-card]')
                                        .first()
                                        .evaluate((node) => node.getBoundingClientRect().width),
                                )
                                .toBeGreaterThan(0);
                        await settleFiniteAnimations(page);
                        const boxes = await scene.locator('[data-masonry-card]').evaluateAll((nodes) =>
                            nodes.map((node) => {
                                const b = node.getBoundingClientRect();
                                return { x: b.x, y: b.y, right: b.right, bottom: b.bottom };
                            }),
                        );
                        for (let i = 0; i < boxes.length; i++)
                            for (let j = i + 1; j < boxes.length; j++) {
                                const a = boxes[i],
                                    b = boxes[j];
                                expect(
                                    a.right <= b.x + 0.5 ||
                                        b.right <= a.x + 0.5 ||
                                        a.bottom <= b.y + 0.5 ||
                                        b.bottom <= a.y + 0.5,
                                    'Masonry items must not overlap',
                                ).toBe(true);
                            }
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
