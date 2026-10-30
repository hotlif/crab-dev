import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations)
    for (const size of spec.sizes)
        for (const density of spec.densities)
            for (const state of ['loading', 'refreshing']) {
                test(
                    `${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`,
                    {
                        tag: ['@rc-table-pro', '@matrix', '@chromium-only'],
                        annotation: {
                            type: 'matrix',
                            description: JSON.stringify({ ...config, size, density, state }),
                        },
                    },
                    async ({ page, previewOrigin }, info) => {
                        await openDemo(page, previewOrigin, 'rc-table-pro', spec.demo, { ...config, size, density });
                        const scene = page.getByRole('region', { name: 'TablePro visual matrix' });
                        await expect(scene.getByText('订单 001 / Order', { exact: true })).toBeVisible();
                        await page.getByLabel('验收状态', { exact: true }).selectOption(state);
                        if (state === 'refreshing')
                            await scene.getByRole('button', { name: '刷新', exact: true }).click();
                        await expect(scene.getByRole('status')).toContainText('加载中');
                        if (state === 'refreshing')
                            await expect(scene.getByText('订单 001 / Order', { exact: true })).toBeVisible();
                        else await expect(scene.getByText('订单 001 / Order', { exact: true })).toHaveCount(0);
                        await expect(scene.getByText('暂无数据', { exact: true })).toHaveCount(0);
                        const before = await scene.evaluate((node) =>
                            node
                                .getAnimations({ subtree: true })
                                .filter((animation) => animation.playState === 'running')
                                .map((animation) => ({
                                    time: Number(animation.currentTime),
                                    duration: animation.effect?.getComputedTiming().duration,
                                })),
                        );
                        await info.attach('motion-start', {
                            body: await scene.screenshot({ animations: 'allow', caret: 'hide' }),
                            contentType: 'image/png',
                        });
                        await page.waitForTimeout(150);
                        const after = await scene.evaluate((node) =>
                            node
                                .getAnimations({ subtree: true })
                                .filter((animation) => animation.playState === 'running')
                                .map((animation) => Number(animation.currentTime)),
                        );
                        expect(before.length).toBeGreaterThan(0);
                        expect(after.some((time, index) => time > (before[index]?.time ?? Infinity))).toBe(true);
                        await info.attach('motion-times', {
                            body: JSON.stringify({ before, after }),
                            contentType: 'application/json',
                        });
                        await info.attach('motion-end', {
                            body: await scene.screenshot({ animations: 'allow', caret: 'hide' }),
                            contentType: 'image/png',
                        });
                    },
                );
            }
