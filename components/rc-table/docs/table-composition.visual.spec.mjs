import { test, expect, configurations, openDemo, readVisualSpec, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) {
    test(`Table ${config.designSystem} ${config.colorMode} input method draft retention`, { tag: ['@rc-table', '@boundary'] }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-table', spec.demo, config);
        const scene = page.getByRole('region', { name: 'Table visual matrix' });
        const grid = scene.getByRole('grid');
        await grid.getByRole('gridcell').filter({ hasText: '订单 001 / Order' }).first().dblclick();
        const editor = scene.getByRole('textbox', { name: '订单名称草稿' });
        await expect(editor).toBeFocused();
        await editor.fill('输入中的草稿 / Draft');
        for (const keyboard of [{ key: 'Enter', isComposing: true }, { key: 'Tab', isComposing: true }, { key: 'Enter', keyCode: 229 }]) {
            // Browser automation cannot drive platform IME candidate windows. Dispatch
            // the native composition flags, then verify real Enter commits below.
            const prevented = await editor.evaluate((node, init) => {
                const event = new node.ownerDocument.defaultView.KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
                node.dispatchEvent(event);
                return event.defaultPrevented;
            }, keyboard);
            expect(prevented).toBe(false);
            await expect(editor).toBeFocused();
            await expect(editor).toHaveValue('输入中的草稿 / Draft');
        }
        await captureVisual(scene, `${config.designSystem}-${config.colorMode}-composition-draft.png`, info, browserName);
        await page.keyboard.press('Enter');
        await expect(grid.getByRole('gridcell').filter({ hasText: '输入中的草稿 / Draft' })).toHaveCount(1);
        await expect(editor).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(editor).toHaveCount(0);
        await expect(grid).toBeFocused();
    });
}
