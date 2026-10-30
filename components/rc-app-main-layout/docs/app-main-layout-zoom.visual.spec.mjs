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
            tag: ['@rc-app-main-layout', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: 'zoom-200', ...config }) },
        },
        async ({ page, previewOrigin, realZoom }, info) => {
            await openDemo(page, previewOrigin, 'rc-app-main-layout', spec.demo, config);
            const scene = page.getByRole('region', { name: 'AppMainLayout visual matrix' });
            await expect(scene.getByRole('button', { name: '张维 / Wei Zhang', exact: true })).toBeVisible();
            const input = scene.getByRole('textbox', { name: '工作备注' });
            await input.fill('200% 保留页面草稿 / Draft');
            const original = await input.elementHandle();
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
            await expect(input).toHaveValue('200% 保留页面草稿 / Draft');
            const toggle = scene.getByRole('button', { name: '切换侧边栏', exact: true });
            await toggle.scrollIntoViewIfNeeded();
            await expect(toggle).toBeVisible();
            await expect(toggle).toBeEnabled();
            await assertPageWidth();
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-toolbar.png`, info);
            await input.scrollIntoViewIfNeeded();
            await expect(input).toBeVisible();
            await assertPageWidth();
            await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-draft.png`, info);
            await toggle.scrollIntoViewIfNeeded();
            await toggle.click();
            const drawer = page.getByRole('dialog');
            await expect(drawer).toBeVisible();
            await expect(drawer.getByText('Crab 专业工作区', { exact: true })).toBeVisible();
            await settleFiniteAnimations(page);
            await assertPageWidth();
            await captureZoom(
                page,
                realZoom,
                `${config.designSystem}-${config.colorMode}-zoom-200-navigation.png`,
                info,
            );
            await page.keyboard.press('Escape');
            await expect(drawer).toBeHidden();
            await expect(input).toHaveValue('200% 保留页面草稿 / Draft');
        },
    );
