import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sampleMotion } from '../../../test/visual/motion-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations) for (const direction of ['ltr', 'rtl']) {
    test(`${config.designSystem} ${config.colorMode} ${direction} flip and reverse`, { tag: ['@motion', '@rc-dropdown-container'] }, async ({ page, previewOrigin }, info) => {
        await page.setViewportSize({ width: 480, height: 540 });
        await openDemo(page, previewOrigin, 'rc-dropdown-container', spec.demo, { ...config, direction });
        await page.getByLabel('触发位置', { exact: true }).selectOption('bottom');
        const trigger = page.getByRole('button', { name: '打开验收浮层', exact: true });
        await trigger.click();
        const surface = page.locator('[data-positioned="true"][data-placement]');
        await expect(surface).toHaveAttribute('data-placement', /^top/);
        await sampleMotion(page, surface, info, 'flipped-entry');
        await settleFiniteAnimations(page);
        const original = await surface.elementHandle();
        // One task sends rapid real activations without locator auto-waits settling the exit.
        await trigger.evaluate(node => new Promise(resolve => {
            node.click();
            globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(() => { node.click(); resolve(); }));
        }));
        await expect(surface).toHaveAttribute('data-state', 'open');
        expect(await surface.evaluate((node, previous) => node === previous, original)).toBe(true);
        await trigger.click();
        await expect(surface).toHaveCount(0);
        await trigger.click();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog', { name: '浮层内容' })).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await original.dispose();
    });
}
