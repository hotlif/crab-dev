import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };
const splitPage = { path: '/design/split-pane', heading: 'SplitPane 分栏' };
const dividerPage = { path: '/design/divider', heading: 'Divider 分隔线' };

async function capture(page, info, route, theme, mode) {
    const path = info.outputPath(`${route}-${theme}-${mode}.png`);
    await settleFiniteAnimations(page);
    await page.locator(`[data-layout-prototype="${route}"] .crab-layout-stage`).first().screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`AppMainLayout navigates and preserves the work area in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, { path: '/design/app-main-layout', heading: 'AppMainLayout 应用主布局' }, { designSystem, colorMode });
            const workspace = page.locator('.crab-layout-workspace');
            const content = workspace.getByRole('region', { name: '工作台内容' });
            const device = content.getByRole('button', { name: 'V-019 进水调节阀' });
            await device.press('Enter');
            await expect(device).toBeFocused();
            await expect(content.getByRole('region', { name: '当前设备详情' })).toContainText('待复核');
            const docScroll = await page.evaluate(() => window.scrollY);
            const scrollResult = await content.evaluate(node => {
                node.scrollTop = node.scrollHeight;
                return { amount: node.scrollTop, body: window.scrollY };
            });
            expect(scrollResult.amount).toBeGreaterThan(0);
            expect(scrollResult.body).toBe(docScroll);
            const sidebar = workspace.getByRole('button', { name: '切换侧边栏' });
            await expect(sidebar).toBeVisible();
            if (width === 320) {
                await sidebar.press('Enter');
                const drawer = page.getByRole('dialog').filter({ hasText: '巡检任务' });
                await expect(drawer).toBeVisible();
                await page.keyboard.press('Escape');
                await expect(drawer).toBeHidden();
                await expect(sidebar).toBeFocused();
                await sidebar.press('Enter');
                await drawer.getByText('巡检任务', { exact: true }).click();
                await expect(page.locator('dialog[open]').filter({ hasText: '巡检任务' })).toHaveCount(0);
            } else {
                await workspace.getByText('巡检任务', { exact: true }).first().click();
            }
            const draft = content.getByRole('textbox', { name: '巡检备注' });
            await draft.fill('夜班继续复查。');
            await expect(draft).toHaveValue('夜班继续复查。');
            await workspace.getByRole('tab', { name: '设备台账' }).click();
            await expect(content.getByRole('region', { name: '当前设备详情' })).toContainText('进水调节阀');
            await capture(page, info, 'app-main-layout', designSystem, colorMode);
            await workspace.getByRole('tab', { name: '巡检任务' }).click();
            await expect(draft).toHaveValue('夜班继续复查。');
            await assertDocumentWidth(page, info);
        });

        test(`SplitPane adjusts and clamps both orientations in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, splitPage, { designSystem, colorMode });
            const handle = page.getByRole('separator', { name: '调整设备列表大小' });
            const narrow = width === 320;
            const initial = narrow ? 145 : 245;
            const step = designSystem === 'macos' ? 12 : 16;
            await expect(handle).toHaveAttribute('aria-orientation', narrow ? 'horizontal' : 'vertical');
            await handle.press(narrow ? 'ArrowDown' : 'ArrowRight');
            await expect(handle).toBeFocused();
            await expect(handle).toHaveAttribute('aria-valuenow', String(initial + step));
            await handle.press('Home');
            await expect(handle).toHaveAttribute('aria-valuenow', narrow ? '105' : '158');
            await handle.press('Enter');
            await expect(handle).toHaveAttribute('aria-valuenow', String(initial));
            const rect = await handle.boundingBox();
            const x = rect.x + rect.width / 2;
            const y = rect.y + rect.height / 2;
            await page.mouse.move(x, y);
            await page.mouse.down();
            await page.mouse.move(x + (narrow ? 0 : 40), y + (narrow ? 40 : 0), { steps: 5 });
            await page.mouse.up();
            const changed = Number(await handle.getAttribute('aria-valuenow'));
            expect(changed).toBeGreaterThan(initial);
            await capture(page, info, 'split-pane', designSystem, colorMode);
            await page.getByRole('button', { name: '恢复默认' }).click();
            await expect(handle).toHaveAttribute('aria-valuenow', String(initial));
            await assertDocumentWidth(page, info);
        });

        test(`Divider separates content with stable keyboard order in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, dividerPage, { designSystem, colorMode });
            const toolbar = page.getByRole('region', { name: '工具栏分隔' });
            const list = page.getByRole('region', { name: '列表分隔' });
            const first = toolbar.getByRole('button', { name: '已复核' });
            const second = toolbar.getByRole('button', { name: '待跟进' });
            const boundary = page.getByRole('separator', { name: '采样设置和审计备注之间的分隔' });
            await expect(toolbar.getByRole('separator')).toHaveCount(0);
            await expect(list.getByRole('separator')).toHaveCount(0);
            await expect(boundary).toBeVisible();
            await first.press('Tab');
            await expect(second).toBeFocused();
            await second.press('Space');
            await expect(list).toContainText('进水调节阀 · 待跟进');
            const field = page.getByRole('textbox', { name: '审计备注' });
            const initialY = (await field.boundingBox()).y;
            await page.getByRole('button', { name: '扩大分隔留白' }).press('Enter');
            expect((await field.boundingBox()).y).toBeGreaterThan(initialY);
            await capture(page, info, 'divider', designSystem, colorMode);
            await page.emulateMedia({ forcedColors: 'active' });
            await expect(boundary).toBeVisible();
            await expect(field).toBeVisible();
            await assertDocumentWidth(page, info);
        });

        test(`Masonry keeps photo geometry and focus order in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 850 });
            await openSite(page, previewOrigin, { path: '/design/masonry', heading: 'Masonry 瀑布流' }, { designSystem, colorMode });
            const png = await page.request.get(previewOrigin + '/prototype-assets/inspection-equipment.png');
            expect(png.status()).toBe(200);
            expect(png.headers()['content-type']).toContain('image/png');
            const cards = page.locator('[data-snapshot]');
            const reload = page.getByRole('button', { name: '重新模拟图片加载' });
            const loadStatus = page.locator('[data-snapshot-status]');
            const positions = () => cards.evaluateAll(nodes => nodes.map(node => {
                const box = node.getBoundingClientRect();
                const stage = node.closest('.crab-layout-stage').getBoundingClientRect();
                return { id: node.getAttribute('data-snapshot'), left: Math.round(box.x - stage.x), top: Math.round(box.y - stage.y), height: Math.round(box.height) };
            }));
            await expect(page.locator('[data-snapshot-columns]')).toHaveAttribute('data-snapshot-columns', width === 320 ? '1' : '3');
            await expect(loadStatus).toHaveText('设备图片已载入。');
            const before = await positions();
            await reload.click();
            await expect(loadStatus).toHaveText('图片载入中…');
            expect(await positions()).toEqual(before);
            await expect(loadStatus).toHaveText('设备图片已载入。');
            expect(await positions()).toEqual(before);
            const order = [...before].sort((a, b) => a.top - b.top || a.left - b.left).map(item => item.id);
            expect(order).toEqual(before.map(item => item.id));
            let focused = reload;
            for (const id of order) {
                await focused.press('Tab');
                focused = page.getByRole('button', { name: `查看 ${id} 快照` });
                await expect(focused).toBeFocused();
            }
            await focused.press('Enter');
            await expect(page.locator('[data-active-snapshot]')).toContainText('流量计');
            await capture(page, info, 'masonry', designSystem, colorMode);
            await assertDocumentWidth(page, info);
        });
    }
}

test.describe('SplitPane touch input', () => {
    test.use({ hasTouch: true, viewport: { width: 320, height: 720 } });
    test('touch drag adjusts the compact split pane', options, async ({ page, previewOrigin, context, browserName }) => {
        test.skip(browserName !== 'chromium');
        await openSite(page, previewOrigin, splitPage, { designSystem: 'md3', colorMode: 'dark' });
        const handle = page.getByRole('separator', { name: '调整设备列表大小' });
        await handle.scrollIntoViewIfNeeded();
        const box = await handle.boundingBox();
        const session = await context.newCDPSession(page);
        try {
            const x = box.x + box.width / 2;
            const y = box.y + box.height / 2;
            await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ id: 1, x, y }] });
            await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 1, x, y: y + 45 }] });
            await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            await expect.poll(async () => Number(await handle.getAttribute('aria-valuenow'))).toBeGreaterThan(145);
        } finally {
            await session.detach();
        }
    });
});
