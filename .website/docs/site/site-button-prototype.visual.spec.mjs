import { test, expect } from '../../../test/visual/component-fixture.mjs';
import { openSite } from './site-visual-support.mjs';

const definition = { path: '/design/button', heading: 'Button 按钮' };

async function selectOption(page, control, name) {
    await control.click();
    await page.getByRole('option', { name, exact: true }).click();
}

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
            await selectOption(page, sizeSelect, size);
            await expect(label).toHaveCSS('inset-block-start', '1.4px');
        }
    });
}

test('MD3 large samples keep the full action label in narrow containers', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await page.setViewportSize({ width: 320, height: 850 });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    const matrix = page.locator('#button-states');
    await matrix.getByRole('button', { name: '危险操作', exact: true }).click();
    const sample = matrix.getByRole('group', { name: '可操作样本' }).getByRole('button', { name: '删除测试配置' });
    const sizeSelect = matrix.getByRole('combobox', { name: '按钮尺寸' });
    const iconSelect = matrix.getByRole('combobox', { name: '图标位置' });
    const labelFits = () => sample.locator('.crab-design-button-label').evaluate(label => {
        const clip = label.parentElement;
        const range = document.createRange();
        range.selectNodeContents(label);
        const edges = clip.getBoundingClientRect();
        return [...range.getClientRects()].every(line => line.left >= edges.left - 1 && line.right <= edges.right + 1) &&
            label.offsetHeight <= clip.clientHeight && clip.scrollHeight <= clip.clientHeight + 2;
    });
    for (const width of [320, 360, 768]) {
        await page.setViewportSize({ width, height: 850 });
        for (const size of ['L', 'XL']) {
            await selectOption(page, sizeSelect, size);
            for (const icon of ['仅文字', '前置图标', '后置图标']) {
                await selectOption(page, iconSelect, icon);
                await expect.poll(labelFits).toBe(true);
            }
        }
    }
});

for (const [designSystem, textKind] of [
    ['md3', '文字按钮'], ['macos', '无背板按钮'], ['shadcn', '幽灵按钮'],
]) {
    test(`Button prototype save focus and live states agree in ${designSystem}`, { tag: ['@website'] }, async ({ page, previewOrigin }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await openSite(page, previewOrigin, definition, { designSystem, colorMode: 'light' });
        const scene = page.locator('#button-scenario');
        const save = scene.locator('button[type="submit"]');
        const input = scene.getByRole('textbox', { name: '显示名称' });
        const speed = scene.getByRole('combobox', { name: '响应速度' });

        await selectOption(page, speed, '快速 · 0.36 秒');
        await scene.getByRole('switch', { name: '下次保存失败' }).click();
        await save.press('Enter');
        await expect(scene.getByRole('status')).toContainText('保存失败');
        await expect(save).toBeFocused();
        await save.press(designSystem === 'macos' ? 'Meta+s' : 'Space');
        await expect(save).toBeDisabled();
        await expect(input).toBeFocused();

        await scene.getByRole('button', { name: '重置场景' }).click();
        await save.press('Enter');
        await expect(save).toHaveAttribute('aria-busy', 'true');
        await speed.focus();
        await expect(save).toBeDisabled();
        await expect(speed).toBeFocused();

        const matrix = page.locator('#button-states');
        const control = matrix.getByRole('combobox', { name: '试验状态' });
        const sample = matrix.getByRole('group', { name: '可操作样本' }).getByRole('button');
        await matrix.getByRole('button', { name: textKind, exact: true }).click();
        await expect(matrix.getByRole('table')).toContainText('即时完成');
        await control.click();
        await expect(page.getByRole('option', { name: '可用' })).toBeVisible();
        await expect(page.getByRole('option', { name: '加载中' })).toHaveCount(0);
        await page.keyboard.press('Escape');
        await control.press('Tab');
        await expect(sample).toBeFocused();
        const outline = target => target.evaluate(node => {
            const style = getComputedStyle(node);
            return [style.outlineWidth, style.outlineStyle, style.outlineOffset, style.outlineColor];
        });
        await expect.poll(() => outline(matrix.locator('[data-state="focus"] button'))).toEqual(await outline(sample));
    });
}
