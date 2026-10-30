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
                        tag: ['@rc-table', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, browserName, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-table', spec.demo, { ...config, size: size, density });
                        const scene = page.getByRole('region', { name: 'Table visual matrix' });
                        if (state === 'empty') await page.getByLabel('验收状态', { exact: true }).selectOption('empty');
                        const grid = scene.getByRole('grid');
                        await expect(grid).toBeVisible();
                        const cell = grid.getByRole('gridcell').filter({ hasText: '订单 001 / Order' }).first();
                        if (state === 'hover') {
                            const row = grid.getByRole('row').filter({ hasText: '订单 001 / Order' });
                            await page.getByLabel('验收状态', { exact: true }).hover();
                            await settleFiniteAnimations(page);
                            const background = await row.evaluate((node) => getComputedStyle(node).backgroundColor);
                            await cell.hover();
                            await expect
                                .poll(() => row.evaluate((node) => getComputedStyle(node).backgroundColor))
                                .not.toBe(background);
                            expect(await row.evaluate((node) => getComputedStyle(node).cursor)).toBe('pointer');
                        }
                        if (state === 'focus-visible') {
                            await page.getByLabel('验收状态', { exact: true }).focus();
                            await page.keyboard.press('Tab');
                            await expect(grid).toBeFocused();
                            expect(await grid.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
                        }
                        if (state === 'selected') {
                            await grid.getByRole('checkbox', { name: '选择行', exact: true }).first().check();
                            await expect(grid.getByRole('row').filter({ hasText: '订单 001 / Order' })).toHaveAttribute(
                                'aria-selected',
                                'true',
                            );
                        }
                        if (state === 'expanded') {
                            await grid.getByRole('button', { name: '展开行', exact: true }).first().click();
                            await expect(grid.getByText(/固定日期 2026-10-29/)).toBeVisible();
                        }
                        if (state === 'editing') {
                            await cell.dblclick();
                            await expect(scene.getByRole('textbox', { name: '订单名称草稿' })).toBeFocused();
                            await scene.getByRole('textbox', { name: '订单名称草稿' }).fill('保留编辑草稿 / Draft');
                        }
                        if (state === 'scrolled') {
                            await grid.hover();
                            await page.mouse.wheel(0, 10000);
                            await expect(cell).toHaveCount(0);
                            const last = grid.getByRole('gridcell').filter({ hasText: '订单 080 / Order' }).first();
                            await expect(last).toBeVisible();
                            await expect(last).toBeInViewport();
                            const renderedRows = grid.getByRole('row').filter({ has: page.getByRole('gridcell') });
                            expect(await renderedRows.count()).toBeGreaterThan(0);
                            expect(await renderedRows.count()).toBeLessThan(80);
                        }
                        if (state === 'empty') await expect(grid.getByText('暂无数据', { exact: true })).toBeVisible();
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
