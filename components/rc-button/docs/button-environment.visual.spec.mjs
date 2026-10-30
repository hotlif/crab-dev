import { test, expect, configurations, openDemo, readVisualSpec, captureVisual, settleFiniteAnimations, environmentCases, applyEnvironment } from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const environment of environmentCases) {
    test.describe(`button ${config.designSystem} ${config.colorMode} ${environment.id}`, () => {
        test.use({ hasTouch: environment.hasTouch ?? false });
        test('action environment and all variants', { tag: ['@rc-button', '@environment', '@chromium-only'], annotation: { type: 'environment', description: JSON.stringify({ ...config, id: environment.id }) } }, async ({ page, previewOrigin, browserName }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-button', spec.demo, { ...config, ...environment.config });
            const frame = page.getByRole('region', { name: 'Button visual matrix' });
            await frame.getByLabel('验收状态', { exact: true }).selectOption('variants');
            const primary = frame.locator('[data-visual-scene] button').first();
            if (environment.hasTouch) await primary.tap();
            else await primary.click();
            await settleFiniteAnimations(page);
            const geometry = await frame.evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth, grid: globalThis.getComputedStyle(node).gridTemplateColumns }));
            await info.attach('environment-content-geometry', { body: JSON.stringify(geometry), contentType: 'application/json' });
            expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
            const fitAction = frame.getByRole('button', { name: '保存完整工作区 · Save the complete workspace', exact: true });
            await expect(fitAction).toBeEnabled();
            const fitGeometry = await fitAction.evaluate(node => {
                const label = node.lastElementChild, style = globalThis.getComputedStyle(label), box = node.getBoundingClientRect();
                return { width: box.width, parentWidth: node.parentElement.clientWidth, client: label.clientWidth, scroll: label.scrollWidth, overflow: style.textOverflow };
            });
            expect(fitGeometry.width).toBeLessThanOrEqual(fitGeometry.parentWidth + 1);
            if (fitGeometry.scroll > fitGeometry.client + 1) expect(fitGeometry.overflow).toBe('ellipsis');
            if (environment.hasTouch) {
                expect(await page.evaluate(() => globalThis.matchMedia('(pointer: coarse)').matches)).toBe(true);
                const hit = primary.locator('[data-button-part="touch-target"]');
                await expect(hit).toHaveCount(1);
                const bounds = await hit.boundingBox();
                expect(bounds.width).toBeGreaterThanOrEqual(48); expect(bounds.height).toBeGreaterThanOrEqual(48);
                const point = { x: bounds.x + bounds.width / 2, y: bounds.y + 1 };
                expect(await primary.evaluate((node, point) => node.ownerDocument.elementFromPoint(point.x, point.y)?.closest('button') === node, point)).toBe(true);
                await page.touchscreen.tap(point.x, point.y);
            }
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${environment.id}.png`, info, browserName);
        });
    });
}
