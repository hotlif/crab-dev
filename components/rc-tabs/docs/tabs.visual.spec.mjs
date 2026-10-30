import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-tabs', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-tabs', spec.demo, { ...config, size, density });
        const [variant, interaction] = state === 'default' ? ['line', 'default'] : state.split(':');
        const selector = page.getByLabel('页签外观', { exact: true }); await selector.selectOption(variant);
        const frame = page.getByRole('region', { name: 'Tabs visual matrix' });
        const first = frame.getByRole('tab', { name: '概览', exact: true });
        const second = frame.getByRole('tab', { name: '活动与审计历史长标签', exact: true });
        if (interaction === 'hover' || interaction === 'pressed') await second.hover();
        if (interaction === 'pressed') await page.mouse.down();
        if (interaction === 'focus-visible') { await selector.focus(); await page.keyboard.press('Tab'); await expect(first).toBeFocused(); expect(await first.evaluate(node => node.matches(':focus-visible'))).toBe(true); }
        if (interaction === 'selected') { await first.focus(); await page.keyboard.press('ArrowRight'); await expect(second).toBeFocused(); await expect(second).toHaveAttribute('aria-selected', 'true'); await expect(frame.getByRole('tabpanel')).toHaveCount(1); }
        if (interaction === 'disabled') { await expect(frame.getByRole('tab', { name: '已归档' })).toBeDisabled(); await first.focus(); await page.keyboard.press('End'); await expect(frame.getByRole('tab', { name: '项目设置' })).toBeFocused(); }
        if (interaction === 'closed') { const closing = frame.getByRole('tab', { name: '项目设置' }); await closing.click(); await closing.press('Delete'); await expect(closing).toHaveCount(0); await expect(second).toBeFocused(); }
        if (interaction === 'overflow') { await page.setViewportSize({ width: 320, height: 720 }); await first.focus(); await page.keyboard.press('End'); const selected = frame.getByRole('tab', { selected: true }); const strip = frame.getByRole('tablist'); const box = await selected.boundingBox(), bounds = await strip.boundingBox(); expect(box.x).toBeGreaterThanOrEqual(bounds.x - 1); expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1); }
        await settleFiniteAnimations(page);
        await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state.replace(':', '-')}.png`, info, browserName);
        if (interaction === 'pressed') await page.mouse.up();
    });
}
