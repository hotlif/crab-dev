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
            tag: ['@rc-table', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
        },
        async ({ page, browserName, previewOrigin }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-table', spec.demo, config);
            expect(await page.evaluate(() => globalThis.matchMedia('(pointer:coarse)').matches)).toBe(true);
            const scene = page.getByRole('region', { name: 'Table visual matrix' });
            await expect(scene.getByText('订单 001 / Order', { exact: true })).toBeVisible();
            const grid = scene.getByRole('grid');
            const checkbox = grid.getByRole('checkbox', { name: '选择行', exact: true }).first();
            const selectionCell = grid.locator('[data-table-selection-cell]').first();
            const target = await selectionCell.boundingBox();
            expect(target.width).toBeGreaterThanOrEqual(48);
            expect(target.height).toBeGreaterThanOrEqual(48);
            // The native input is visually clipped. Tap the actual visible cell,
            // without forcing events through an occluding element.
            await selectionCell.tap();
            await expect(checkbox).toBeChecked();
            const row = grid.getByRole('row').filter({ has: page.getByRole('checkbox', { name: '选择行', exact: true }) }).first();
            expect((await row.boundingBox()).height).toBeGreaterThanOrEqual(48);

            await settleFiniteAnimations(page);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        },
    );
