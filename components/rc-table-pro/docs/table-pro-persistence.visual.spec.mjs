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
    { tag: ['@rc-table-pro', '@boundary'] },
    async ({ page, previewOrigin }) => {
        await openDemo(page, previewOrigin, 'rc-table-pro', spec.demo, configurations[0]);
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
        const scene = page.getByRole('region', { name: 'TablePro visual matrix' });
        const input = scene.getByRole('textbox', { name: /^(搜索表格|Search table)$/ });
        await input.fill('Order');
        const original = await input.elementHandle();
        for (const config of configurations) {
            await switchConfig(config);
            expect(await original.evaluate((node) => node.isConnected)).toBe(true);
            await expect(input).toHaveValue('Order');
        }
        await scene.getByRole('grid').getByText('订单 001 / Order', { exact: true }).dblclick();
        const editor = scene.getByRole('textbox', { name: '专业订单名称草稿', exact: true });
        await expect(editor).toBeFocused();
        await editor.fill('跨体系保留专业草稿 / Retained draft');
        const originalEditor = await editor.elementHandle();
        for (const config of configurations) {
            await switchConfig(config);
            expect(await originalEditor.evaluate((node) => node.isConnected)).toBe(true);
            await expect(editor).toHaveValue('跨体系保留专业草稿 / Retained draft');
        }
        await editor.press('Escape');
        await expect(scene.getByRole('grid').getByText('订单 001 / Order', { exact: true })).toBeVisible();
    },
);
