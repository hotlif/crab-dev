import {
    zoomTest,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureZoom,
} from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations)
    zoomTest(
        `${config.designSystem} ${config.colorMode} real zoom 200%`,
        {
            tag: ['@rc-table', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(page, previewOrigin, 'rc-table', spec.demo, config);
            const scene = page.getByRole('region', { name: 'Table visual matrix' });
            const grid = scene.getByRole('grid');
            await expect(grid.getByText('订单 001 / Order', { exact: true })).toBeVisible();
            const selected = grid.getByRole('checkbox', { name: '选择行', exact: true }).first();
            await selected.check();
            const original = await grid.elementHandle();
            await realZoom.set200(page);
            await settleFiniteAnimations(page);
            await scene.scrollIntoViewIfNeeded();
            const assertPageWidth = async () =>
                expect(
                    await page.evaluate(
                        () =>
                            Math.max(
                                globalThis.document.documentElement.scrollWidth,
                                globalThis.document.body.scrollWidth,
                            ) <=
                            globalThis.innerWidth + 1,
                    ),
                    'Browser page must not grow horizontally at real 200% zoom; local component scrollers own overflow',
                ).toBe(true);
            expect(await original.evaluate((node) => node.isConnected)).toBe(true);
            await expect(selected).toBeChecked();
            await expect(grid.getByText('订单 001 / Order', { exact: true })).toBeVisible();
            await grid.getByRole('columnheader').first().scrollIntoViewIfNeeded();
            await assertPageWidth();
            await info.attach('local-scroll-regions', {
                body: JSON.stringify([
                    {
                        name: await grid.getAttribute('aria-label'),
                        scope: 'Virtual rows and columns remain inside the named grid',
                        bounds: await grid.boundingBox(),
                    },
                ]),
                contentType: 'application/json',
            });
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-grid.png`, info);
        },
    );
