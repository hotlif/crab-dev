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
            for (const state of spec.states.filter((value) => !['loading', 'refreshing'].includes(value))) {
                const crossEngine =
                    spec.crossEngine.sizes.includes(size) &&
                    spec.crossEngine.densities.includes(density) &&
                    spec.crossEngine.states.includes(state);
                test(
                    `${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`,
                    {
                        tag: ['@rc-table-pro', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, browserName, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-table-pro', spec.demo, {
                            ...config,
                            size: size,
                            density,
                        });
                        const scene = page.getByRole('region', { name: 'TablePro visual matrix' });
                        if (['empty', 'error', 'columns-error'].includes(state))
                            await page.getByLabel('验收状态', { exact: true }).selectOption(state);
                        if (state === 'error') await expect(scene.getByRole('alert')).toContainText('Data unavailable');
                        else if (state === 'columns-error')
                            await expect(scene.getByRole('alert')).toContainText('Columns unavailable');
                        else if (state === 'empty')
                            await expect(scene.getByText('暂无数据', { exact: true })).toBeVisible();
                        else {
                            const grid = scene.getByRole('grid');
                            await expect(grid.getByText('订单 001 / Order', { exact: true })).toBeVisible();
                            if (['editing', 'edit-committed', 'edit-cancelled'].includes(state)) {
                                await grid.getByText('订单 001 / Order', { exact: true }).dblclick();
                                const editor = grid.getByRole('textbox', { name: '专业订单名称草稿', exact: true });
                                await expect(editor).toBeFocused();
                                await editor.fill('专业编辑草稿 / Edited order');
                                if (state === 'edit-committed') {
                                    await scene.getByRole('textbox', { name: /^(搜索表格|Search table)$/ }).click();
                                    await expect(editor).toHaveCount(0);
                                    await expect(grid.getByText('专业编辑草稿 / Edited order', { exact: true })).toBeVisible();
                                } else if (state === 'edit-cancelled') {
                                    await editor.press('Escape');
                                    await expect(editor).toHaveCount(0);
                                    await expect(grid.getByText('订单 001 / Order', { exact: true })).toBeVisible();
                                    await expect(grid.getByText('专业编辑草稿 / Edited order', { exact: true })).toHaveCount(0);
                                }
                            }
                            if (state === 'focus-visible') {
                                await grid.focus();
                                await page.keyboard.press('Tab');
                                await page.keyboard.press('Shift+Tab');
                                await expect(grid).toBeFocused();
                                expect(await grid.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
                            }
                            if (state === 'selected') {
                                await grid.getByRole('checkbox', { name: '选择行', exact: true }).first().check();
                                await expect(
                                    grid.getByRole('checkbox', { name: '选择行', exact: true }).first(),
                                ).toBeChecked();
                            }
                            if (state === 'sidebar') {
                                await scene.getByRole('button', { name: '列设置', exact: true }).click();
                                await expect(scene.getByRole('textbox', { name: '搜索列', exact: true })).toBeVisible();
                                await expect(scene.getByRole('tree').getByText('项目 / Project', { exact: true })).toBeVisible();
                            }
                            if (state === 'scrolled') {
                                await grid.hover();
                                await page.mouse.wheel(0, 10000);
                                await expect(grid.getByText('订单 001 / Order', { exact: true })).toHaveCount(0);
                                const last = grid.getByText('订单 020 / Order', { exact: true });
                                await expect(last).toBeVisible();
                                await expect(last).toBeInViewport();
                                const renderedRows = grid.getByRole('row').filter({ has: page.getByRole('gridcell') });
                                expect(await renderedRows.count()).toBeGreaterThan(0);
                                expect(await renderedRows.count()).toBeLessThan(20);
                            }
                            if (['refreshed', 'refresh-error', 'refresh-recovered'].includes(state)) {
                                const original = await grid.elementHandle();
                                const selected = grid.getByRole('checkbox', { name: '选择行', exact: true }).first();
                                await selected.check();
                                await page.getByLabel('验收状态', { exact: true }).selectOption('refreshing');
                                await scene.getByRole('button', { name: '刷新', exact: true }).click();
                                await expect(scene.getByRole('status')).toContainText('加载中');
                                await expect(grid.getByText('订单 001 / Order', { exact: true })).toBeVisible();
                                await expect(selected).toBeChecked();
                                if (state === 'refreshed') {
                                    await page.getByRole('button', { name: '完成请求 / Complete request', exact: true }).click();
                                    await expect(grid.getByText('订单 001 / Order / Updated', { exact: true })).toBeVisible();
                                } else {
                                    await page.getByRole('button', { name: '请求失败 / Fail request', exact: true }).click();
                                    await expect(scene.getByRole('alert')).toContainText('Refresh failed');
                                    await expect(grid.getByText('订单 001 / Order', { exact: true })).toBeVisible();
                                    await expect(grid.getByText('暂无数据', { exact: true })).toHaveCount(0);
                                    if (state === 'refresh-recovered') {
                                        await page.getByLabel('验收状态', { exact: true }).selectOption('default');
                                        await scene.getByRole('alert').getByRole('button', { name: '重试', exact: true }).click();
                                        await expect(scene.getByRole('alert')).toHaveCount(0);
                                        await expect(grid.getByText('订单 001 / Order', { exact: true })).toBeVisible();
                                    }
                                }
                                await expect(scene.getByRole('status')).toHaveCount(0);
                                await expect(selected).toBeChecked();
                                expect(await original.evaluate((node) => node.isConnected)).toBe(true);
                            }
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
