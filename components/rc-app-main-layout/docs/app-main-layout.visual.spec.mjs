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
                        tag: ['@rc-app-main-layout', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, browserName, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-app-main-layout', spec.demo, {
                            ...config,
                            size: size,
                            density,
                        });
                        const scene = page.getByRole('region', { name: 'AppMainLayout visual matrix' });
                        await expect(
                            scene.getByRole('button', { name: '张维 / Wei Zhang', exact: true }),
                        ).toBeVisible();
                        const toggle = scene.getByRole('button', { name: '切换侧边栏', exact: true });
                        if (state === 'hover') await toggle.hover();
                        if (state === 'focus-visible') {
                            await toggle.focus();
                            await page.keyboard.press('Tab');
                            expect(await page.locator(':focus-visible').count()).toBeGreaterThan(0);
                        }
                        if (state === 'collapsed') {
                            await toggle.click();
                            await expect(scene.getByText('Crab 专业工作区', { exact: true })).toBeHidden();
                        }
                        if (state === 'account') {
                            await scene.getByRole('button', { name: '张维 / Wei Zhang', exact: true }).click();
                            await expect(page.getByRole('menuitem', { name: '切换角色', exact: true })).toBeVisible();
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
