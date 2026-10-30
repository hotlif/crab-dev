import { test, expect, configurations, openDemo, readVisualSpec } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations)
    for (const size of spec.sizes)
        for (const density of spec.densities) {
            const state = 'loading';
            test(
                `${config.designSystem} ${config.colorMode} ${size} ${density} loading`,
                {
                    tag: ['@rc-tree', '@matrix', '@chromium-only'],
                    annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) },
                },
                async ({ page, previewOrigin }, info) => {
                    await openDemo(page, previewOrigin, 'rc-tree', spec.demo, { ...config, size, density });
                    await page.getByLabel('验收状态', { exact: true }).selectOption('loading');
                    const scene = page.getByRole('region', { name: 'Tree visual matrix' });
                    await scene.locator('[data-expanded=false]').click();
                    await expect(scene.locator('[data-loading-indicator]')).toBeVisible();
                    const before = await scene.evaluate((node) =>
                        node
                            .getAnimations({ subtree: true })
                            .filter((animation) => animation.playState === 'running')
                            .map((animation) => Number(animation.currentTime)),
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
                    expect(after.some((time, index) => time > (before[index] ?? Infinity))).toBe(true);
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
