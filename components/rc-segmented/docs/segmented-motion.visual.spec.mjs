import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { sampleMotion } from '../../../test/visual/motion-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
test.use({ video: 'on' });
for (const config of configurations) for (const size of spec.sizes) {
    test(`${config.designSystem} ${config.colorMode} ${size} segment continuity`, { tag: ['@motion', '@rc-segmented', ...(size !== 'medium' ? ['@chromium-only'] : [])] }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-segmented', spec.demo, { ...config, size });
        const group = page.getByRole('radiogroup', { name: 'Time range', exact: true });
        const week = group.getByRole('radio', { name: 'Week', exact: true });
        const original = await week.elementHandle();
        const graphic = await group.locator('[data-segment-graphic="check"]').first().elementHandle();
        await group.locator('label').nth(1).click();
        await expect(week).toBeChecked();
        await sampleMotion(page, group, info, 'selection');
        await group.evaluate(node => new Promise(resolve => {
            const inputs = node.querySelectorAll('input');
            inputs[0].click();
            globalThis.requestAnimationFrame(() => { inputs[1].click(); resolve(); });
        }));
        await settleFiniteAnimations(page);
        await expect(week).toBeChecked();
        expect(await week.evaluate((node, old) => node === old, original)).toBe(true);
        expect(await group.locator('[data-segment-graphic="check"]').first().evaluate((node, old) => node === old, graphic)).toBe(true);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await group.locator('label').first().click();
        await expect(group.getByRole('radio', { name: 'Day', exact: true })).toBeChecked();
        expect(await group.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
        await original.dispose(); await graphic.dispose();
    });
}
