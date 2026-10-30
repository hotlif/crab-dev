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
            tag: ['@rc-split-pane', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(page, previewOrigin, 'rc-split-pane', spec.demo, config);
            const scene = page.getByRole('region', { name: 'SplitPane visual matrix' });
            const separator = scene.getByRole('separator');
            await expect(separator).toBeVisible();
            await separator.focus();
            await separator.press('ArrowRight');
            const value = await separator.getAttribute('aria-valuenow');
            expect(value).not.toBe('120');
            const original = await separator.elementHandle();
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
            await expect(separator).toHaveAttribute('aria-valuenow', value);
            await separator.scrollIntoViewIfNeeded();
            await expect(separator).toBeVisible();
            await separator.focus();
            await separator.press('Home');
            await expect(separator).toHaveAttribute('aria-valuenow', '64');
            await separator.press('End');
            await expect(separator).toHaveAttribute('aria-valuenow', '220');
            await assertPageWidth();
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-split.png`, info);
        },
    );
