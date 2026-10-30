import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
} from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
test(
    'configuration switches retain actual nodes and user state',
    { tag: ['@rc-table', '@boundary'] },
    async ({ page, previewOrigin }) => {
        await openDemo(page, previewOrigin, 'rc-table', spec.demo, configurations[0]);
        const switchConfig = async (config) => {
            await page.evaluate(
                (config) =>
                    globalThis.postMessage(
                        {
                            type: 'crab:preview-config',
                            ...config,
                            size: 'large',
                            density: 'comfortable',
                            locale: 'en-US',
                            direction: 'rtl',
                            brandColor: '#157349',
                        },
                        globalThis.location.origin,
                    ),
                config,
            );
            await expect(page.locator('.demo-default-preview').first()).toHaveAttribute(
                'data-crab-design',
                config.designSystem,
            );
            await expect(page.locator('.demo-default-preview').first()).toHaveAttribute('data-theme', config.colorMode);
            await settleFiniteAnimations(page);
        };
        const scene = page.getByRole('region', { name: 'Table visual matrix' });
        await scene.getByRole('gridcell').filter({ hasText: '订单 001 / Order' }).first().dblclick();
        const input = scene.getByRole('textbox', { name: '订单名称草稿' });
        await input.fill('保留表格草稿 / Draft');
        const original = await input.elementHandle();
        for (const config of configurations) {
            await switchConfig(config);
            expect(await original.evaluate((node) => node.isConnected)).toBe(true);
            await expect(input).toHaveValue('保留表格草稿 / Draft');
        }
    },
);
