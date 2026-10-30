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
            tag: ['@rc-split-pane', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
        },
        async ({ page, browserName, previewOrigin }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-split-pane', spec.demo, config);
            expect(await page.evaluate(() => globalThis.matchMedia('(pointer:coarse)').matches)).toBe(true);
            const scene = page.getByRole('region', { name: 'SplitPane visual matrix' });
            await expect(scene.getByRole('separator')).toBeVisible();
            const separator = scene.getByRole('separator'),
                box = await separator.boundingBox();
            expect(box.width).toBeGreaterThanOrEqual(48);
            await separator.tap();
            await expect(separator).toHaveAttribute('aria-valuenow', '120');

            await settleFiniteAnimations(page);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-touch.png`, info, browserName);
        },
    );
