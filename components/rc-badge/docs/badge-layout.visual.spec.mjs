import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);
const modes = [{ id: 'normal' }, { id: 'rtl', direction: 'rtl' }, { id: 'touch', hasTouch: true }];
for (const mode of modes) test.describe(`Badge intrinsic anchor ${mode.id}`, () => {
    test.use({ hasTouch: mode.hasTouch ?? false });
    for (const config of configurations) test(`${config.designSystem} ${config.colorMode}`, {
        tag: ['@rc-badge', '@environment', '@layout', '@chromium-only'],
        annotation: { type: 'environment', description: JSON.stringify({ id: 'intrinsic-layout', mode: mode.id, ...config }) },
    }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, 'rc-badge', spec.demo, { ...config, direction: mode.direction ?? 'ltr' });
        const frame = page.getByRole('region', { name: 'Badge visual matrix' });
        const wrapper = frame.locator('[data-wrapped-badge]');
        const host = wrapper.getByRole('button');
        const indicator = wrapper.getByRole('status');
        const measurements = [];
        let activations = 0;
        for (const layout of ['grid', 'flex']) for (const size of spec.sizes) for (const long of [false, true]) {
            await page.getByLabel('宿主布局', { exact: true }).selectOption(layout);
            await page.getByLabel('验收尺寸', { exact: true }).selectOption(size);
            await page.getByLabel('长文本', { exact: true }).setChecked(long);
            await page.getByLabel('验收状态', { exact: true }).selectOption(long ? 'status' : 'default');
            await settleFiniteAnimations(page);
            await host.scrollIntoViewIfNeeded();
            const root = await wrapper.boundingBox(), button = await host.boundingBox(), badge = await indicator.boundingBox();
            expect(Math.abs(root.width - button.width)).toBeLessThan(1);
            expect(Math.abs(root.height - button.height)).toBeLessThan(1);
            expect(Math.abs(badge.x + badge.width / 2 - (mode.direction === 'rtl' ? button.x : button.x + button.width))).toBeLessThan(1);
            expect(Math.abs(badge.y + badge.height / 2 - button.y)).toBeLessThan(1);
            if (long) await expect(host).toHaveAccessibleName(/abcdefghijklmnopqrstuvwxyz0123456789/);
            const widths = await frame.evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth, document: globalThis.document.documentElement.scrollWidth, viewport: globalThis.document.documentElement.clientWidth }));
            expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
            expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
            measurements.push({ layout, size, long, root, button, badge, widths });
            if (mode.hasTouch) await host.tap();
            else await host.click();
            await expect(frame.getByLabel('宿主操作次数')).toHaveText(String(++activations));
        }
        await info.attach('badge-intrinsic-anchor', { body: JSON.stringify({ mode: mode.id, measurements }), contentType: 'application/json' });
    });
});
