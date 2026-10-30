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
            for (const state of spec.states.filter((value) => value !== 'loading')) {
                const crossEngine =
                    spec.crossEngine.sizes.includes(size) &&
                    spec.crossEngine.densities.includes(density) &&
                    spec.crossEngine.states.includes(state);
                test(
                    `${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`,
                    {
                        tag: ['@rc-tree', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, browserName, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-tree', spec.demo, { ...config, size: size, density });
                        const scene = page.getByRole('region', { name: 'Tree visual matrix' }),
                            tree = scene.getByRole('tree');
                        if (state === 'empty') await page.getByLabel('验收状态', { exact: true }).selectOption('empty');
                        else await expect(tree.getByRole('treeitem').nth(1)).toBeVisible();
                        const title = tree.locator('[data-node-title]').nth(1);
                        if (state === 'hover') await title.hover();
                        if (state === 'focus-visible') {
                            await tree.focus();
                            await page.keyboard.press('Tab');
                            await page.keyboard.press('Shift+Tab');
                            await expect(tree).toBeFocused();
                            expect(await tree.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
                        }
                        if (state === 'selected') {
                            await title.click();
                            await expect(tree.getByRole('treeitem').nth(1)).toHaveAttribute('aria-selected', 'true');
                        }
                        if (state === 'checked') {
                            await tree.getByRole('checkbox').nth(1).check();
                            await expect(tree.getByRole('checkbox').nth(1)).toBeChecked();
                        }
                        if (state === 'collapsed') {
                            await tree.locator('[data-node-title]').first().click();
                            await tree.press('ArrowLeft');
                            await expect(tree.getByRole('treeitem')).toHaveCount(1);
                        }
                        if (state === 'editing') {
                            await title.dblclick();
                            const input = tree.getByRole('textbox');
                            await expect(input).toBeFocused();
                            await input.fill('保留文档草稿 / Draft');
                        }
                        if (state === 'scrolled') {
                            await tree.hover();
                            await page.mouse.wheel(0, 10000);
                            await expect(
                                tree.locator('[data-node-title]').filter({ hasText: '设计文档 01 / Document' }),
                            ).toHaveCount(0);
                            const last = tree.locator('[data-node-title]').filter({ hasText: '设计文档 40 / Document' });
                            await expect(last).toBeVisible();
                            await expect(last).toBeInViewport();
                            expect(await tree.getByRole('treeitem').count()).toBeGreaterThan(0);
                            expect(await tree.getByRole('treeitem').count()).toBeLessThan(41);
                        }
                        if (state !== 'collapsed' && state !== 'scrolled' && state !== 'empty')
                            await expect(tree.getByRole('treeitem', { disabled: true })).toHaveCount(1);
                        if (state === 'empty') await expect(tree.getByRole('treeitem')).toHaveCount(0);
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
