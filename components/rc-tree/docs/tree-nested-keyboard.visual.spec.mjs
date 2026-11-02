import { test, expect, configurations, openDemo, readVisualSpec, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`Tree ${config.designSystem} ${config.colorMode} nested checkbox keyboard`, { tag: ['@rc-tree', '@boundary'] }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-tree', spec.demo, config);
        const tree = page.getByRole('tree', { name: '项目文档树' });
        await tree.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        const activeNode = await tree.getAttribute('aria-activedescendant');
        expect(activeNode).toBeTruthy();
        const checkbox = tree.getByRole('checkbox').nth(2);
        await checkbox.focus();
        for (const key of ['ArrowDown', 'Enter']) {
            await page.keyboard.press(key);
            await expect(checkbox).toBeFocused();
            await expect(tree).toHaveAttribute('aria-activedescendant', activeNode);
        }
        await page.keyboard.press('Space');
        await expect(checkbox).toBeChecked();
        await expect(tree).toHaveAttribute('aria-activedescendant', activeNode);
        await captureVisual(tree, `${config.designSystem}-${config.colorMode}-nested-checkbox.png`, info, browserName);
        await tree.focus();
        await page.keyboard.press('ArrowDown');
        await expect(tree).not.toHaveAttribute('aria-activedescendant', activeNode);
    });
}
