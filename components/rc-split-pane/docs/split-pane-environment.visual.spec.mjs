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
for (const config of configurations)
    for (const environment of environmentCases.filter((item) => !item.hasTouch)) {
        test(
            `${config.designSystem} ${config.colorMode} ${environment.id}`,
            {
                tag: ['@rc-split-pane', '@environment', '@chromium-only'],
                annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
            },
            async ({ page, browserName, previewOrigin }, info) => {
                await applyEnvironment(page, environment);
                await openDemo(page, previewOrigin, 'rc-split-pane', spec.demo, { ...config, ...environment.config });
                const scene = page.getByRole('region', { name: 'SplitPane visual matrix' });
                await expect(scene.getByRole('separator')).toBeVisible();
                if (environment.id === 'rtl')
                    expect(await scene.evaluate((node) => getComputedStyle(node).direction)).toBe('rtl');
                if (environment.id === 'forced-colors')
                    expect(await page.evaluate(() => globalThis.matchMedia('(forced-colors:active)').matches)).toBe(
                        true,
                    );
                if (environment.id === 'reduced-motion')
                    expect(
                        await page.evaluate(() => globalThis.matchMedia('(prefers-reduced-motion:reduce)').matches),
                    ).toBe(true);
                await settleFiniteAnimations(page);
                if (environment.viewport) {
                    const box = await scene.boundingBox();
                    expect(box.x).toBeGreaterThanOrEqual(0);
                    expect(box.x + box.width).toBeLessThanOrEqual(environment.viewport.width + 1);
                    expect(
                        await scene.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
                        'Nested scrollers own overflow',
                    ).toBe(true);
                }
                await captureVisual(
                    scene,
                    `${config.designSystem}-${config.colorMode}-${environment.id}.png`,
                    info,
                    browserName,
                );
            },
        );
    }
