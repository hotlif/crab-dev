import { test, expect, openDemo, settleFiniteAnimations, captureVisual } from '../../../test/visual/component-fixture.mjs';

for (const colorMode of ['light', 'dark']) {
    test(`macos ${colorMode} independent AppKit controls`, { tag: ['@rc-button', '@chromium-only'] }, async ({ page, previewOrigin, browserName }, info) => {
        await openDemo(page, previewOrigin, 'rc-button', 'visual-matrix.demo.tsx', { designSystem: 'macos', colorMode });
        const scene = page.locator('[data-visual-scene]');
        const ordinary = scene.locator('[data-appearance="outlined"]');
        for (const [size, radius] of [['xs', '6px'], ['s', '8px'], ['m', '10px'], ['l', '20px'], ['xl', '24px']]) {
            await page.getByLabel('验收尺寸', { exact: true }).selectOption(size);
            await expect(ordinary).toHaveCSS('border-radius', radius);
        }
        await page.getByLabel('验收尺寸', { exact: true }).selectOption('m');
        const tonal = scene.locator('[data-appearance="tonal"]');
        expect(await tonal.evaluate(node => getComputedStyle(node, '::before').content)).toBe('none');
        expect(await tonal.evaluate(node => getComputedStyle(node, '::after').content)).toBe('none');
        await expect(ordinary).toHaveCSS('backdrop-filter', 'none');
        await expect(scene.locator('[data-appearance="elevated"]')).toHaveCSS('backdrop-filter', 'blur(24px) saturate(1.5)');
        await tonal.hover(); await page.mouse.down();
        await settleFiniteAnimations(page);
        await expect(tonal).toHaveCSS('border-radius', '10px');
        await page.mouse.up();
        await captureVisual(scene, `macos-${colorMode}-independent-controls.png`, info, browserName);
        await openDemo(page, previewOrigin, 'rc-button', 'macos.demo.tsx', { designSystem: 'macos', colorMode });
        const showcase = page.getByRole('region', { name: 'macOS Tahoe controls' });
        await showcase.getByRole('button', { name: '网格', exact: true }).click();
        await expect(showcase.getByRole('button', { name: '网格', exact: true })).toHaveAttribute('aria-pressed', 'true');
        await expect(showcase.getByRole('button', { name: '网格', exact: true })).toHaveCSS('backdrop-filter', 'none');
        await captureVisual(showcase, `macos-${colorMode}-showcase.png`, info, browserName);
    });
}
