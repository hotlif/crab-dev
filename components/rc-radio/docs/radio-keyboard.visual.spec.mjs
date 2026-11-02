import { test, expect, configurations, openDemo, captureVisual } from '../../../test/visual/component-fixture.mjs';

for (const config of configurations) {
    test(`Radio ${config.designSystem} ${config.colorMode} native group arrow focus`, { tag: ['@rc-radio', '@boundary'] }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-radio', 'group.demo.tsx', config);
        const apple = page.getByRole('radio', { name: '苹果', exact: true });
        const banana = page.getByRole('radio', { name: '香蕉', exact: true });
        await apple.focus();
        await page.keyboard.press('ArrowRight');
        await expect(banana).toBeFocused();
        await expect(banana).toBeChecked();
        const control = banana.locator('..').locator('[data-radio-part="control"]');
        expect(await control.evaluate(node => globalThis.getComputedStyle(node).outlineStyle)).not.toBe('none');
        await captureVisual(page.getByRole('radiogroup'), `${config.designSystem}-${config.colorMode}-native-arrow-focus.png`, info);
        await page.keyboard.press('ArrowRight');
        await expect(page.getByRole('radio', { name: '橘子', exact: true })).toBeChecked();
        await page.keyboard.press('ArrowLeft');
        await expect(banana).toBeFocused();
        await expect(banana).toBeChecked();
        await page.keyboard.press('ArrowLeft');
        await expect(apple).toBeFocused();
        await expect(apple).toBeChecked();
        await banana.locator('..').click();
        await expect(banana).toBeChecked();
        expect(await control.evaluate(node => globalThis.getComputedStyle(node).outlineStyle)).toBe('none');
    });
}
