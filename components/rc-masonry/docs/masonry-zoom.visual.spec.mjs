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
            tag: ['@rc-masonry', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(page, previewOrigin, 'rc-masonry', spec.demo, config);
            const scene = page.getByRole('region', { name: 'Masonry visual matrix' });
            await page.getByLabel('验收状态', { exact: true }).selectOption('sequential');
            const cards = scene.locator('[data-masonry-card]');
            await expect(cards).toHaveCount(8);
            await settleFiniteAnimations(page);
            const original = await cards.first().elementHandle();
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
            await expect(page.getByLabel('验收状态', { exact: true })).toHaveValue('sequential');
            await expect(cards).toHaveCount(8);
            const boxes = await cards.evaluateAll((nodes) =>
                nodes.map((node) => {
                    const b = node.getBoundingClientRect();
                    return { x: b.x, y: b.y, right: b.right, bottom: b.bottom };
                }),
            );
            for (let i = 0; i < boxes.length; i++)
                for (let j = i + 1; j < boxes.length; j++) {
                    const a = boxes[i],
                        b = boxes[j];
                    expect(
                        a.right <= b.x + 0.5 || b.right <= a.x + 0.5 || a.bottom <= b.y + 0.5 || b.bottom <= a.y + 0.5,
                        'Items remain disjoint at real 200% zoom',
                    ).toBe(true);
                }
            await cards.first().scrollIntoViewIfNeeded();
            await assertPageWidth();
            await captureZoom(
                page,
                realZoom,
                `${config.designSystem}-${config.colorMode}-zoom-200-masonry-start.png`,
                info,
            );
            await cards.last().scrollIntoViewIfNeeded();
            await expect(cards.last()).toBeVisible();
            await assertPageWidth();
            await captureZoom(
                page,
                realZoom,
                `${config.designSystem}-${config.colorMode}-zoom-200-masonry-end.png`,
                info,
            );
        },
    );
