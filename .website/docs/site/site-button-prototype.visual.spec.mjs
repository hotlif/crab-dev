import { test, expect } from '../../../test/visual/component-fixture.mjs';
import { openSite } from './site-visual-support.mjs';

const definition = { path: '/design/button', heading: 'Button 按钮' };

function geometry(button, waitForCorners = false) {
    return button.evaluate(async (node, wait) => {
        if (wait) {
            // Read the style to flush the press before waiting for any corner transitions.
            void getComputedStyle(node).borderTopLeftRadius;
            await Promise.allSettled(node.getAnimations()
                .filter(animation => animation.transitionProperty?.endsWith('-radius'))
                .map(animation => animation.finished));
        }
        const { x, y, width, height } = node.getBoundingClientRect();
        const { borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius } = getComputedStyle(node);
        return {
            bounds: [x + globalThis.scrollX, y + globalThis.scrollY, width, height],
            corners: [borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius],
        };
    }, waitForCorners);
}

async function pressWithFixedShape(page, button) {
    await button.hover();
    const before = await geometry(button, true);
    await page.mouse.down();
    try {
        expect(await button.evaluate(node => node.matches(':active'))).toBe(true);
        expect(await geometry(button, true)).toEqual(before);
    } finally {
        await page.mouse.up();
    }
    expect(await geometry(button, true)).toEqual(before);
}

for (const { width, colorMode } of [{ width: 1440, colorMode: 'light' }, { width: 360, colorMode: 'dark' }]) {
    test(`MD3 Button prototype keeps its corners and label offset at ${width}px`, { tag: ['@website'] }, async ({ page, previewOrigin }) => {
        await page.setViewportSize({ width, height: 900 });
        await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode });
        const states = page.locator('#button-states');
        const sample = states.getByRole('group', { name: '可操作样本' }).getByRole('button');
        const swatch = state => states.locator(`.crab-design-swatch[data-state="${state}"] button`);
        const idle = await geometry(swatch('idle'));
        expect((await geometry(swatch('press'))).corners).toEqual(idle.corners);
        expect(await swatch('press').evaluate(node => getComputedStyle(node).backgroundImage)).toContain('linear-gradient');
        await pressWithFixedShape(page, sample);

        const lab = page.locator('#button-motion');
        const candidate = lab.getByRole('group', { name: '候选方案' }).getByRole('button');
        await pressWithFixedShape(page, lab.getByRole('group', { name: '现有方案' }).getByRole('button'));
        await pressWithFixedShape(page, candidate);
        await expect(lab.locator('.crab-design-motion-clip')).toHaveCSS('border-radius', idle.corners[0]);

        await states.getByRole('button', { name: '切换按钮', exact: true }).click();
        const before = await geometry(sample);
        await sample.press('Space');
        await expect(sample).toHaveAttribute('aria-pressed', 'true');
        expect(await geometry(sample, true)).toEqual(before);

        const filters = page.getByRole('group', { name: '设备状态筛选' }).getByRole('button');
        for (const filter of await filters.all()) await pressWithFixedShape(page, filter);
        await expect(filters.nth(1)).toHaveAttribute('aria-pressed', 'true');

        const sizeSelect = states.getByRole('combobox', { name: '按钮尺寸' });
        const label = sample.locator('.crab-design-button-label');
        await expect(label).toHaveCSS('inset-block-start', '1.4px');
        for (const size of ['XS', 'S', 'M', 'L', 'XL']) {
            await sizeSelect.click();
            await page.getByRole('option', { name: size, exact: true }).click();
            await expect(label).toHaveCSS('inset-block-start', '1.4px');
        }
    });
}
