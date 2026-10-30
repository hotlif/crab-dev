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
            tag: ['@rc-table-pro', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(page, previewOrigin, 'rc-table-pro', spec.demo, config);
            const scene = page.getByRole('region', { name: 'TablePro visual matrix' });
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
            const refresh = scene.getByRole('button', { name: '刷新', exact: true });
            await refresh.scrollIntoViewIfNeeded();
            await expect(refresh).toBeVisible();
            await expect(refresh).toBeEnabled();
            await assertPageWidth();
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-toolbar.png`, info);
            const columns = scene.getByRole('button', { name: '列设置', exact: true });
            await columns.scrollIntoViewIfNeeded();
            await columns.click();
            await expect(scene.getByRole('textbox', { name: '搜索列', exact: true })).toBeVisible();
            await info.attach('local-scroll-regions', {
                body: JSON.stringify([
                    {
                        name: await grid.getAttribute('aria-label'),
                        scope: 'TablePro retains the Table grid as its local data scroller',
                        bounds: await grid.boundingBox(),
                    },
                ]),
                contentType: 'application/json',
            });
            await assertPageWidth();
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-columns.png`, info);
        },
    );
