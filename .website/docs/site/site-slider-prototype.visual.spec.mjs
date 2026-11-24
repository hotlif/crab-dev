import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, openSite } from './site-visual-support.mjs';

const definition = { path: '/design/slider', heading: 'Slider 滑块' };
const scene = page => page.locator('#slider-threshold');
const slider = page => scene(page).getByRole('slider', { name: '负载告警阈值' });
const reading = page => scene(page).locator('[data-threshold-value]');
const count = page => scene(page).locator('[data-threshold-matches]');
const designs = ['md3', 'macos', 'shadcn'];

test('Slider has links between its design prototype and component documentation', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('link', { name: '体验滑块原型' }).click();
    await expect(page.getByRole('heading', { name: definition.heading, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: '查看 Slider 组件文档' }).click();
    await expect(page.getByRole('link', { name: '查看设计原型' })).toHaveAttribute('href', /\/design\/slider\/?$/);
});

for (const designSystem of designs) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Slider updates the threshold and chart in ${designSystem} ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 900 });
            await openSite(page, previewOrigin, definition, { designSystem, colorMode });
            const control = slider(page);
            const handle = control.locator('[data-slot="slider-handle"]');
            const reset = scene(page).getByRole('button', { name: '恢复默认 65%' });
            await expect(control).toHaveAttribute('aria-valuemin', '0');
            await expect(control).toHaveAttribute('aria-valuemax', '100');
            await expect(control).toHaveAttribute('aria-valuetext', '65%');
            await expect(count(page)).toHaveText('4 / 6 个时段达到阈值');
            await expect(scene(page).locator('[data-threshold-crossed="true"]')).toHaveCount(4);
            await control.press('ArrowRight');
            await expect(control).toBeFocused();
            await expect(control).toHaveAttribute('aria-valuenow', '66');
            await expect(reading(page)).toHaveText('66%');
            await expect(count(page)).toHaveText('3 / 6 个时段达到阈值');
            await control.press('PageDown');
            await expect(control).toHaveAttribute('aria-valuenow', '56');
            await expect(count(page)).toHaveText('5 / 6 个时段达到阈值');
            await control.press('End');
            await expect(reading(page)).toHaveText('100%');
            await expect(count(page)).toHaveText('0 / 6 个时段达到阈值');
            await control.press('ArrowRight');
            await expect(control).toHaveAttribute('aria-valuenow', '100');
            await control.press('Home');
            await expect(reading(page)).toHaveText('0%');
            await expect(count(page)).toHaveText('6 / 6 个时段达到阈值');
            await control.press('ArrowLeft');
            await expect(control).toHaveAttribute('aria-valuenow', '0');
            await control.scrollIntoViewIfNeeded();
            const rect = await control.boundingBox();
            const y = rect.y + rect.height / 2;
            await page.mouse.move(rect.x + 2, y);
            await page.mouse.down();
            await page.mouse.move(rect.x + rect.width * .8, y, { steps: 8 });
            await expect(handle).toHaveAttribute('data-is-dragging', 'true');
            await expect(reading(page)).toHaveText('80%');
            await expect(count(page)).toHaveText('1 / 6 个时段达到阈值');
            await page.mouse.up();
            await expect(handle).toHaveAttribute('data-is-dragging', 'false');
            await expect(control).toBeFocused();
            await settleFiniteAnimations(page);
            const capture = info.outputPath(`slider-${designSystem}-${colorMode}-threshold.png`);
            await scene(page).screenshot({ path: capture, animations: 'disabled' });
            await info.attach('拖动阈值后的读值', { path: capture, contentType: 'image/png' });
            await control.press('Tab');
            await expect(reset).toBeFocused();
            await reset.press('Enter');
            await expect(reset).toBeFocused();
            await expect(reading(page)).toHaveText('65%');
            const inactive = page.getByRole('slider', { name: '锁定阈值' });
            await expect(inactive).toHaveAttribute('aria-disabled', 'true');
            await reset.press('Tab');
            await expect(page.getByRole('link', { name: '查看 Slider 组件文档' })).toBeFocused();
            await expect(inactive).toHaveAttribute('aria-valuenow', '65');
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
    }
}

test.describe('Slider touch patterns', () => {
    test.use({ hasTouch: true, viewport: { width: 320, height: 850 } });
    for (const designSystem of designs) {
        test(`Slider follows a touch gesture and releases it in ${designSystem}`, { tag: ['@website', '@chromium-only'] }, async ({ page, context, browserName, previewOrigin }) => {
            test.skip(browserName !== 'chromium');
            await openSite(page, previewOrigin, definition, { designSystem, colorMode: 'dark' });
            const control = slider(page);
            await control.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
            const rect = await control.boundingBox();
            const y = rect.y + rect.height / 2;
            const session = await context.newCDPSession(page);
            try {
                const touch = (type, percent) => session.send('Input.dispatchTouchEvent', {
                    type,
                    touchPoints: percent === undefined ? [] : [{ x: rect.x + rect.width * percent, y, id: 1 }],
                });
                await touch('touchStart', .65);
                await touch('touchMove', .5);
                await touch('touchMove', .25);
                await expect(reading(page)).toHaveText('25%');
                await expect(count(page)).toHaveText('6 / 6 个时段达到阈值');
                await touch('touchEnd');
                await expect(control.locator('[data-slot="slider-handle"]')).toHaveAttribute('data-is-dragging', 'false');
                await page.touchscreen.tap(rect.x + rect.width * .9, y);
                await expect(reading(page)).toHaveText('90%');
                await scene(page).getByRole('button', { name: '恢复默认 65%' }).tap();
                await expect(reading(page)).toHaveText('65%');
            } finally {
                await session.detach();
            }
        });
    }
});

test('Slider retains its threshold when switching themes in forced colors', { tag: ['@website', '@chromium-only'] }, async ({ page, browserName, previewOrigin }) => {
    test.skip(browserName !== 'chromium');
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    await slider(page).press('PageUp');
    await expect(reading(page)).toHaveText('75%');
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        await expect(slider(page)).toHaveAttribute('aria-valuetext', '75%');
        await expect(count(page)).toHaveText('2 / 6 个时段达到阈值');
        await expect(slider(page).locator('[data-slot="slider-handle"]')).toHaveCSS('transition-duration', '0s');
    }
});
