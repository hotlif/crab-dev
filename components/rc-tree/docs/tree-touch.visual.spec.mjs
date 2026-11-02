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
const spec = await readVisualSpec(import.meta.url);
test.use({ hasTouch: true });
for (const environment of environmentCases.filter((item) => item.hasTouch))
for (const config of configurations)
    test(
        `${config.designSystem} ${config.colorMode} ${environment.id}`,
        {
            tag: ['@rc-tree', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
        },
        async ({ page, browserName, previewOrigin }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-tree', spec.demo, config);
            expect(await page.evaluate(() => globalThis.matchMedia('(pointer:coarse)').matches)).toBe(true);
            const scene = page.getByRole('region', { name: 'Tree visual matrix' });
            await expect(scene.getByRole('treeitem').nth(1)).toBeVisible();
            const row = scene.getByRole('treeitem').nth(1);
            await row.locator('[data-node-title]').tap();
            await expect(row).toHaveAttribute('aria-selected', 'true');
            expect((await row.boundingBox()).height).toBeGreaterThanOrEqual(48);

            await settleFiniteAnimations(page);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        },
    );
