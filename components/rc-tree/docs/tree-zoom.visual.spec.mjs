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
            tag: ['@rc-tree', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(page, previewOrigin, 'rc-tree', spec.demo, config);
            const scene = page.getByRole('region', { name: 'Tree visual matrix' });
            const tree = scene.getByRole('tree'),
                row = tree.getByRole('treeitem').nth(1);
            await expect(row).toBeVisible();
            await row.locator('[data-node-title]').click();
            await expect(row).toHaveAttribute('aria-selected', 'true');
            const original = await tree.elementHandle();
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
            await expect(row).toHaveAttribute('aria-selected', 'true');
            await row.scrollIntoViewIfNeeded();
            await expect(tree.getByRole('checkbox').nth(1)).toBeVisible();
            await assertPageWidth();
            await info.attach('local-scroll-regions', {
                body: JSON.stringify([
                    {
                        name: await tree.getAttribute('aria-label'),
                        scope: 'Virtual hierarchy scrolls within the named tree',
                        bounds: await tree.boundingBox(),
                    },
                ]),
                contentType: 'application/json',
            });
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-tree.png`, info);
        },
    );
