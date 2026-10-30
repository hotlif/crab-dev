import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-pagination', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-pagination', spec.demo, { ...config, size, density });
        const frame = page.getByRole('region', { name: 'Pagination visual matrix' });
        const selector = page.getByLabel('验收状态', { exact: true });
        if (state === 'disabled' || state === 'empty') await selector.selectOption(state);
        const next = frame.getByRole('button', { name: 'Next page', exact: true });
        if (state === 'hover' || state === 'pressed') await next.hover();
        if (state === 'pressed') await page.mouse.down();
        if (state === 'focus-visible') { await selector.focus(); await page.keyboard.press('Tab'); const previous = frame.getByRole('button', { name: 'Previous page', exact: true }); await expect(previous).toBeFocused(); expect(await previous.evaluate(node => node.matches(':focus-visible'))).toBe(true); }
        if (state === 'selected') { await frame.getByRole('button', { name: 'Page 7', exact: true }).click(); await expect(frame.locator('[aria-current="page"]')).toHaveText('7'); await expect(frame.getByRole('status')).toContainText('7'); }
        if (state === 'disabled' || state === 'empty') await expect(next).toBeDisabled();
        if (state === 'jump') { const input = frame.getByRole('textbox').first(); await input.fill('12'); await input.press('Enter'); await expect(frame.locator('[aria-current="page"]')).toHaveText('12'); }
        if (state === 'size-menu') { await frame.getByRole('combobox').click(); await expect(page.getByRole('listbox')).toBeVisible(); }
        await settleFiniteAnimations(page);
        const target = state === 'size-menu' ? page : frame;
        await captureVisual(target, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        if (state === 'pressed') await page.mouse.up();
    });
}
