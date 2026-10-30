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
const spec = await readVisualSpec(import.meta.url),
    environment = environmentCases.find((item) => item.id === 'touch');
test.use({ hasTouch: environment.hasTouch });
for (const config of configurations)
    test(
        `${config.designSystem} ${config.colorMode} touch`,
        {
            tag: ['@rc-table-pro', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
        },
        async ({ page, browserName, previewOrigin }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-table-pro', spec.demo, config);
            expect(await page.evaluate(() => globalThis.matchMedia('(pointer:coarse)').matches)).toBe(true);
            const scene = page.getByRole('region', { name: 'TablePro visual matrix' });
            await expect(scene.getByText('订单 001 / Order', { exact: true })).toBeVisible();
            const checkbox = scene.getByRole('checkbox', { name: '选择行', exact: true }).first();
            await checkbox.tap();
            await expect(checkbox).toBeChecked();
            const row = scene.getByRole('row').filter({ has: checkbox });
            expect((await row.boundingBox()).height).toBeGreaterThanOrEqual(48);

            await settleFiniteAnimations(page);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-touch.png`, info, browserName);
        },
    );
