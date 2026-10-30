import {
    test,
    expect,
    configurations,
    openDemo,
    readVisualSpec,
    settleFiniteAnimations,
    captureVisual,
    environmentCases,
    applyEnvironment,
} from '../../../test/visual/component-fixture.mjs';
const spec = await readVisualSpec(import.meta.url),
    environment = environmentCases.find((item) => item.id === 'touch');
test.use({ hasTouch: environment.hasTouch });
for (const config of configurations)
    test(
        `${config.designSystem} ${config.colorMode} touch`,
        {
            tag: ['@rc-app-main-layout', '@environment', '@chromium-only'],
            annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
        },
        async ({ page, browserName, previewOrigin }, info) => {
            await applyEnvironment(page, environment);
            await openDemo(page, previewOrigin, 'rc-app-main-layout', spec.demo, config);
            expect(await page.evaluate(() => globalThis.matchMedia('(pointer:coarse)').matches)).toBe(true);
            const scene = page.getByRole('region', { name: 'AppMainLayout visual matrix' });
            await expect(scene.getByRole('button', { name: '张维 / Wei Zhang', exact: true })).toBeVisible();
            const toggle = scene.getByRole('button', { name: '切换侧边栏', exact: true });
            await expect(toggle).toBeVisible();
            await toggle.scrollIntoViewIfNeeded();
            await settleFiniteAnimations(page);
            const hit = toggle.locator('[data-button-part="touch-target"]');
            await expect(hit).toHaveCount(1);
            const visibleBounds = await toggle.boundingBox();
            const hitBounds = await hit.boundingBox();
            expect(visibleBounds).not.toBeNull();
            expect(hitBounds).not.toBeNull();
            expect([...Object.values(visibleBounds), ...Object.values(hitBounds)].every(Number.isFinite)).toBe(true);
            expect(hitBounds.width).toBeGreaterThanOrEqual(48);
            expect(hitBounds.height).toBeGreaterThanOrEqual(48);
            // Exercise the expanded target, outside the visible control. A
            // center tap alone cannot prove the extra hit area is interactive.
            const point = [
                { x: hitBounds.x + hitBounds.width / 2, y: hitBounds.y + 1 },
                { x: hitBounds.x + hitBounds.width / 2, y: hitBounds.y + hitBounds.height - 1 },
                { x: hitBounds.x + 1, y: hitBounds.y + hitBounds.height / 2 },
                { x: hitBounds.x + hitBounds.width - 1, y: hitBounds.y + hitBounds.height / 2 },
            ].find(({ x, y }) => x < visibleBounds.x || x > visibleBounds.x + visibleBounds.width ||
                y < visibleBounds.y || y > visibleBounds.y + visibleBounds.height);
            expect(point, 'The actual hit target must extend beyond the visible control in this fixture').toBeDefined();
            expect(await toggle.evaluate((node, point) => node.ownerDocument.elementFromPoint(point.x, point.y)?.closest('button') === node, point)).toBe(true);
            const expandedBefore = await toggle.getAttribute('aria-expanded');
            expect(['true', 'false']).toContain(expandedBefore);
            const mobile = await page.evaluate(() => globalThis.matchMedia('(max-width: 767px)').matches);
            const sidebar = scene.getByRole('complementary');
            const sidebarBefore = mobile ? null : await sidebar.boundingBox();
            await info.attach('touch-target-geometry', {
                body: JSON.stringify({ visibleBounds, hitBounds, point, mobile, expandedBefore }),
                contentType: 'application/json',
            });
            await page.touchscreen.tap(point.x, point.y);
            await expect(toggle).toHaveAttribute('aria-expanded', expandedBefore === 'true' ? 'false' : 'true');
            await settleFiniteAnimations(page);
            if (mobile) await expect(page.getByRole('dialog')).toBeVisible();
            else {
                expect(sidebarBefore).not.toBeNull();
                const sidebarAfter = await sidebar.boundingBox();
                expect(sidebarAfter).not.toBeNull();
                if (expandedBefore === 'true') expect(sidebarAfter.width).toBeLessThan(sidebarBefore.width);
                else expect(sidebarAfter.width).toBeGreaterThan(sidebarBefore.width);
            }

            await settleFiniteAnimations(page);
            await captureVisual(scene, `${config.designSystem}-${config.colorMode}-touch.png`, info, browserName);
        },
    );
