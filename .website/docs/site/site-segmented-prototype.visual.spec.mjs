import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { chooseDesign, openSite } from './site-visual-support.mjs';

const definition = { path: '/design/segmented', heading: 'Segmented 分段控制器' };
const designs = ['md3', 'macos', 'shadcn'];
const trend = page => page.locator('#segmented-trend');
const overflow = page => page.locator('#segmented-overflow');
const period = (page, name) => trend(page).getByRole('radio', { name, exact: true });
const scope = (page, name) => overflow(page).getByRole('radio', { name, exact: true });

async function tabToTrend(page) {
    await page.getByRole('navigation', { name: '原型章节' }).getByRole('link', { name: '交互规则' }).focus();
    await page.keyboard.press('Tab');
}

test('Segmented prototype is linked from the design overview and component docs', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, { path: '/design', heading: '设计' }, { designSystem: 'md3', colorMode: 'light' });
    await page.getByRole('link', { name: '体验分段控制器原型' }).click();
    await expect(page.getByRole('heading', { name: definition.heading, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: /查看 Segmented 组件文档/ }).click();
    await expect(page).toHaveURL(/\/components\/rc-segmented\/?$/);
    await expect(page.getByRole('link', { name: '查看设计原型' })).toHaveAttribute('href', /\/design\/segmented\/?$/);
});

for (const designSystem of designs) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Segmented switches data and reveals long labels in ${designSystem} ${colorMode}`, { tag: ['@website'] }, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 950 });
            await openSite(page, previewOrigin, definition, { designSystem, colorMode });
            const group = trend(page).getByRole('radiogroup', { name: '巡检时间范围' });
            const counts = trend(page).getByRole('list', { name: '各时段巡检条数' }).getByRole('listitem');
            const day = period(page, '日视图');
            const week = period(page, '周视图');
            const month = period(page, '月视图');
            await expect(day).toBeChecked();
            await expect(trend(page).getByRole('status')).toContainText('84 条巡检记录');
            await expect(counts).toHaveCount(6);
            await tabToTrend(page);
            await expect(day).toBeFocused();
            const initial = await group.boundingBox();
            await page.keyboard.press('ArrowRight');
            await expect(week).toBeFocused();
            await expect(week).toBeChecked();
            await expect(trend(page).getByRole('status')).toContainText('520 条巡检记录');
            await expect(counts).toHaveCount(7);
            expect(await group.boundingBox()).toEqual(initial);
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('Space');
            await page.keyboard.press('Enter');
            await expect(month).toBeFocused();
            await expect(month).toBeChecked();
            await expect(trend(page).getByRole('status')).toContainText('2197 条巡检记录');
            await expect(counts).toHaveCount(6);
            await settleFiniteAnimations(page);
            const chartImage = info.outputPath(`segmented-${designSystem}-${colorMode}.png`);
            await trend(page).screenshot({ path: chartImage, animations: 'disabled' });
            await info.attach('时间范围', { path: chartImage, contentType: 'image/png' });

            const currentShift = scope(page, '工作区当前班次');
            const archive = scope(page, '已归档的原始记录');
            const handover = scope(page, '跨班组交接巡检记录');
            await expect(archive).toBeDisabled();
            const scroller = overflow(page).locator('.crab-segmented-overflow-scroll');
            await page.keyboard.press('Tab');
            await expect(currentShift).toBeFocused();
            await page.keyboard.press('ArrowRight');
            await expect(handover).toBeFocused();
            await expect(handover).toBeChecked();
            await expect(archive).not.toBeChecked();
            await expect(overflow(page).getByRole('status')).toHaveText('当前范围 跨班组交接巡检记录');
            const label = handover.locator('..').getByText('跨班组交接巡检记录', { exact: true });
            const geometry = await label.evaluate(node => {
                const viewport = node.closest('.crab-segmented-overflow-scroll');
                const visible = viewport.getBoundingClientRect();
                const text = document.createRange();
                text.selectNodeContents(node);
                const bounds = text.getBoundingClientRect();
                return { first: visible.left, last: visible.left + viewport.clientWidth,
                    start: bounds.left, end: bounds.right, fits: node.scrollWidth <= node.clientWidth + 1 };
            });
            expect(geometry.fits).toBe(true);
            expect(geometry.start).toBeGreaterThanOrEqual(geometry.first);
            expect(geometry.end).toBeLessThanOrEqual(geometry.last + 1);
            if (width === 320) expect(await scroller.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
            const overflowImage = info.outputPath(`segmented-${designSystem}-${colorMode}-overflow.png`);
            await overflow(page).screenshot({ path: overflowImage, animations: 'disabled' });
            await info.attach('长标签', { path: overflowImage, contentType: 'image/png' });

            await page.keyboard.press('Tab');
            await expect(page.getByRole('link', { name: /查看 Segmented 组件文档/ })).toBeFocused();
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
    }
}

test('changing design preserves both selection groups', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'dark' });
    await period(page, '周视图').press('Space');
    await scope(page, '跨班组交接巡检记录').press('Enter');
    for (const design of ['macos', 'shadcn', 'md3']) {
        await chooseDesign(page, design);
        await expect(page.locator('[data-segmented-prototype]')).toHaveAttribute('data-prototype-design', design);
        await expect(period(page, '周视图')).toBeChecked();
        await expect(scope(page, '跨班组交接巡检记录')).toBeChecked();
        await expect(trend(page).getByRole('status')).toContainText('520 条巡检记录');
    }
});

test('selection and keyboard focus remain visible in forced colors and reduced motion', { tag: ['@website', '@chromium-only'] }, async ({ page, previewOrigin }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
    for (const design of designs) {
        if (design !== 'md3') await chooseDesign(page, design);
        await tabToTrend(page);
        await page.keyboard.press('ArrowRight');
        const focused = trend(page).locator('input:focus:checked');
        await expect(focused).toHaveCount(1);
        await expect(focused.locator('..')).toHaveCSS('outline-style', 'solid');
        await expect(focused.locator('..')).toHaveCSS('transition-duration', '0s');
        const bar = trend(page).locator('.crab-segmented-bar').first();
        await expect(bar).toHaveCSS('forced-color-adjust', 'none');
    }
});

test.describe('Segmented touch targets', () => {
    test.use({ hasTouch: true });
    test('tap selects different time ranges across the three themes', { tag: ['@website'] }, async ({ page, previewOrigin }) => {
        await page.setViewportSize({ width: 320, height: 900 });
        await openSite(page, previewOrigin, definition, { designSystem: 'md3', colorMode: 'light' });
        for (const design of designs) {
            if (design !== 'md3') await chooseDesign(page, design);
            await period(page, '日视图').locator('..').tap();
            await expect(period(page, '日视图')).toBeChecked();
            await period(page, '月视图').locator('..').tap();
            await expect(period(page, '月视图')).toBeChecked();
            await expect(trend(page).getByRole('status')).toContainText('2197 条巡检记录');
        }
    });
});
