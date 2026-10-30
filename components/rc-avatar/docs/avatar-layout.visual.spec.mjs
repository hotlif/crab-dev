import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
const modes = [{ id: 'normal' }, { id: 'forced-colors', forcedColors: 'active' }, { id: 'touch', hasTouch: true }];
for (const mode of modes) test.describe(`Avatar intrinsic layout ${mode.id}`, () => {
    test.use({ hasTouch: mode.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode}`, {
        tag: ['@rc-avatar', '@environment', '@layout', '@chromium-only'],
        annotation: { type: 'environment', description: JSON.stringify({ id: 'intrinsic-layout', mode: mode.id, ...config }) },
    }, async ({ page, previewOrigin }, info) => {
        if (mode.forcedColors) await page.emulateMedia({ forcedColors: mode.forcedColors });
        await openDemo(page, previewOrigin, 'rc-avatar', spec.demo, config);
        const frame = page.getByRole('region', { name: 'Avatar visual matrix' });
        const action = frame.locator('[data-visual-target]');
        const measurements = [];
        let activations = 0;
        for (const layout of ['grid', 'flex']) for (const size of spec.sizes) {
            await page.getByLabel('宿主布局', { exact: true }).selectOption(layout);
            await page.getByLabel('验收尺寸', { exact: true }).selectOption(size);
            await settleFiniteAnimations(page);
            await action.scrollIntoViewIfNeeded();
            const visual = action.locator(':scope > span:last-child > span');
            const root = await action.boundingBox(), avatar = await visual.boundingBox();
            expect(avatar.width).toBeGreaterThan(0);
            expect(Math.abs(root.width - avatar.width)).toBeLessThan(1);
            expect(Math.abs(root.height - avatar.height)).toBeLessThan(1);
            if (layout === 'flex') {
                const companion = await frame.locator('[data-numeric-avatar]').boundingBox();
                expect(Math.abs(root.y + root.height / 2 - companion.y - companion.height / 2)).toBeLessThan(1);
            }
            await page.getByLabel('配置切换草稿', { exact: true }).focus();
            await page.keyboard.press('Tab');
            await expect(action).toBeFocused();
            expect(await action.evaluate(node => node.matches(':focus-visible'))).toBe(true);
            const outline = await action.evaluate(node => ({ width: parseFloat(getComputedStyle(node).outlineWidth), style: getComputedStyle(node).outlineStyle }));
            expect(outline.width).toBeGreaterThan(0);
            expect(outline.style).not.toBe('none');
            const target = action.locator(':scope > span[aria-hidden="true"]').first();
            const hit = await target.boundingBox();
            measurements.push({ layout, size, root, avatar, hit, outline });
            if (mode.hasTouch) {
                expect(hit.width).toBeGreaterThanOrEqual(48);
                expect(hit.height).toBeGreaterThanOrEqual(48);
                const center = { x: hit.x + hit.width / 2, y: hit.y + hit.height / 2 };
                const points = [{ x: hit.x + 1, y: center.y }, { x: hit.x + hit.width - 1, y: center.y }, { x: center.x, y: hit.y + 1 }, { x: center.x, y: hit.y + hit.height - 1 }];
                for (const point of points) {
                    expect(await action.evaluate((node, point) => { const hit = node.ownerDocument.elementFromPoint(point.x, point.y); return hit === node || node.contains(hit); }, point)).toBe(true);
                    await page.touchscreen.tap(point.x, point.y);
                    await expect(frame.getByLabel('操作次数')).toHaveText(String(++activations));
                }
            } else {
                await page.keyboard.press('Enter');
                await expect(frame.getByLabel('操作次数')).toHaveText(String(++activations));
            }
        }
        await info.attach('avatar-intrinsic-layout', { body: JSON.stringify({ mode: mode.id, measurements }), contentType: 'application/json' });
    });
});
