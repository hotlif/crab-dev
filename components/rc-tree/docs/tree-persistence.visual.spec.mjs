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
    { tag: ['@rc-tree', '@boundary'] },
    async ({ page, previewOrigin }) => {
        await openDemo(page, previewOrigin, 'rc-tree', spec.demo, configurations[0]);
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
        const scene = page.getByRole('region', { name: 'Tree visual matrix' });
        await scene.locator('[data-node-title]').nth(1).dblclick();
        const input = scene.getByRole('textbox');
        await input.fill('保留树草稿 / Draft');
        const original = await input.elementHandle();
        for (const config of configurations) {
            await switchConfig(config);
            expect(await original.evaluate((node) => node.isConnected)).toBe(true);
            await expect(input).toHaveValue('保留树草稿 / Draft');
        }
    },
);
