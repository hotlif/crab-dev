import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-tag', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-tag', spec.demo, { ...config, size, density });
        const frame = page.getByRole('region', { name: 'Tag visual matrix' });
        const selector = page.getByLabel('验收状态', { exact: true });
        await selector.selectOption(state === 'disabled' ? state : 'default');
        const control = frame.getByRole('checkbox').first();
        if (state === 'hover' || state === 'pressed') await control.hover();
        if (state === 'pressed') await page.mouse.down();
        if (state === 'focus-visible') { await selector.focus(); await page.keyboard.press('Tab'); await expect(control).toBeFocused(); expect(await control.evaluate(node => node.matches(':focus-visible'))).toBe(true); }
        if (state === 'disabled') { await expect(control).toHaveAttribute('aria-disabled', 'true'); await expect(control).toHaveAttribute('tabindex', '-1'); await selector.focus(); await page.keyboard.press('Tab'); await expect(frame.getByRole('button', { name: '移除筛选' })).toBeFocused(); await expect(control).toHaveAttribute('aria-checked', 'false'); }
        if (state === 'selected') { await control.click(); await expect(control).toHaveAttribute('aria-checked', 'true'); await expect(control.locator('[data-role="selected-icon"]')).toBeVisible(); }
        if (state === 'removed') { await frame.getByRole('button', { name: '移除筛选' }).click(); await expect(frame.getByRole('button', { name: '移除筛选' })).toHaveCount(0); await expect(frame.getByRole('status')).toContainText('筛选已移除'); }
        await settleFiniteAnimations(page);
        const geometry = await control.boundingBox(); expect(geometry.width).toBeGreaterThan(0); expect(geometry.height).toBeGreaterThan(0);
        await info.attach('geometry', { body: JSON.stringify(geometry), contentType: 'application/json' });
        await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        if (state === 'pressed') await page.mouse.up();
    });
}
