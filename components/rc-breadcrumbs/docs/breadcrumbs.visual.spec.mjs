import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';
import { TokenVars as semanticVars } from '@crab-dev/rc-token-semantic';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ['@rc-breadcrumbs', '@matrix', ...(!crossEngine ? ['@chromium-only'] : [])], annotation: { type: 'matrix', description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-breadcrumbs', spec.demo, { ...config, size, density });
        const frame = page.getByRole('region', { name: 'Breadcrumbs visual matrix' });
        const selector = page.getByLabel('路径显示', { exact: true });
        const link = frame.getByRole('link').first();
        if (state === 'collapsed') await selector.selectOption('collapsed');
        if (state === 'hover' || state === 'pressed') await link.hover();
        if (state === 'pressed') await page.mouse.down();
        if (state === 'focus-visible') { await selector.focus(); await page.keyboard.press('Tab'); await expect(link).toBeFocused(); expect(await link.evaluate(node => node.matches(':focus-visible'))).toBe(true); }
        if (state === 'action') { await frame.getByRole('button', { name: '项目', exact: true }).click(); await expect(frame.getByRole('status')).toHaveText('projects'); }
        if (state === 'disabled') { const disabled = frame.getByRole('button', { name: '受限目录' }); await expect(disabled).toBeDisabled(); await selector.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await expect(frame.getByRole('link').nth(1)).toBeFocused(); }
        await expect(frame.locator('[aria-current="page"]')).toHaveText('当前组件规范');
        await expect(frame.getByRole('navigation')).toHaveCount(1);
        await settleFiniteAnimations(page);
        const geometry = await frame.getByRole('list').evaluate((list, variable) => {
            const style = getComputedStyle(list);
            const [first, second] = [...list.children].map(item => item.getBoundingClientRect());
            return { expectedGap: Number.parseFloat(style.getPropertyValue(variable)), gap: Number.parseFloat(style.columnGap), measuredGap: second.left - first.right };
        }, semanticVars['density.gap']);
        expect(Number.isFinite(geometry.expectedGap)).toBe(true);
        expect(geometry.expectedGap).toBeGreaterThan(0);
        expect(geometry.gap).toBeCloseTo(geometry.expectedGap, 4);
        expect(geometry.measuredGap).toBeCloseTo(geometry.expectedGap, 4);
        await info.attach('density-geometry', { body: JSON.stringify({ density, ...geometry }), contentType: 'application/json' });
        await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${density}-${state}.png`, info, browserName);
        if (state === 'pressed') await page.mouse.up();
    });
}
