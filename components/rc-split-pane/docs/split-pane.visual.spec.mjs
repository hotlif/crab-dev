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
                        tag: ['@rc-split-pane', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, browserName, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-split-pane', spec.demo, {
                            ...config,
                            size: size,
                            density,
                        });
                        const scene = page.getByRole('region', { name: 'SplitPane visual matrix' });
                        if (['disabled', 'vertical'].includes(state))
                            await page.getByLabel('验收状态', { exact: true }).selectOption(state);
                        const separator = scene.getByRole('separator');
                        if (state === 'hover') await separator.hover();
                        if (state === 'focus-visible') {
                            await page.getByLabel('验收状态', { exact: true }).focus();
                            await page.keyboard.press('Tab');
                            await expect(separator).toBeFocused();
                            expect(await separator.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
                        }
                        if (state === 'pressed') {
                            const box = await separator.boundingBox();
                            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                            await page.mouse.down();
                            await page.mouse.move(box.x + box.width / 2 + 24, box.y + box.height / 2);
                            await expect(separator).toHaveAttribute('data-dragging', '');
                        }
                        if (state === 'minimum' || state === 'maximum') {
                            await separator.focus();
                            await separator.press(state === 'minimum' ? 'Home' : 'End');
                            await expect(separator).toHaveAttribute(
                                'aria-valuenow',
                                state === 'minimum' ? '64' : '220',
                            );
                        }
                        if (state === 'disabled') await expect(separator).toHaveAttribute('aria-disabled', 'true');
                        if (state === 'vertical')
                            await expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
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
                        if (state === 'pressed') await page.mouse.up();
                    },
                );
            }
