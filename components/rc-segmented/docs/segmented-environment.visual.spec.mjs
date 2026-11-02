import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from "../../../test/visual/component-fixture.mjs";
import { assertSegmentedGeometry } from './visual-geometry.mjs';

const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases;
for (const config of configurations) for (const scenario of scenarios) {
    test.describe(`segmented ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
        test.use({ hasTouch: scenario.hasTouch ?? false });
        test("environment and real input", { tag: ["@rc-segmented", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: scenario.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
            await openDemo(page, previewOrigin, "rc-segmented", spec.demo, { ...config, ...scenario.config });
            await applyEnvironment(page, scenario);
            const frame = page.locator("[data-visual-frame]");
            const control = frame.getByRole("radio", { name: "Week", exact: true });
            if (scenario.hasTouch) await control.locator("..").tap();
            else await control.locator("..").click();
            await expect(control).toBeChecked();
            await settleFiniteAnimations(page);
            expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            if (scenario.hasTouch) {
                expect(await page.evaluate(() => globalThis.matchMedia("(pointer: coarse)").matches)).toBe(true);
                const option = control.locator("..");
                const height = await option.evaluate(node => Number.parseFloat(globalThis.getComputedStyle(node, "::after").height));
                expect(height).toBeGreaterThanOrEqual(48);
                for (const edge of [-1, 1]) {
                    await frame.getByRole('radio', { name: 'Day', exact: true }).locator('..').tap();
                    await expect(control).not.toBeChecked();
                    await option.scrollIntoViewIfNeeded();
                    const bounds = await option.boundingBox();
                    const point = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 + edge * (height / 2 - 1) };
                    expect(await option.evaluate((node, point) => node.ownerDocument.elementFromPoint(point.x, point.y)?.closest('label') === node, point)).toBe(true);
                    await page.touchscreen.tap(point.x, point.y);
                    await expect(control).toBeChecked();
                }
            }
            const geometry = await control.boundingBox();
            const content = await assertSegmentedGeometry(frame);
            await info.attach("environment", { body: JSON.stringify({ ...scenario, geometry, content }), contentType: "application/json" });
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${scenario.id}.png`, info, browserName);
        });
    });
}
test("configuration changes keep the actual control and its value", { tag: ["@rc-segmented", "@boundary", "@chromium-only"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-segmented", spec.demo, configurations[0]);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("radio", { name: "Week", exact: true });
    await control.locator("..").click(); await expect(control).toBeChecked();
    const original = await control.elementHandle();
    for (const [index, config] of configurations.entries()) {
        await page.evaluate(configuration => globalThis.postMessage({ type: "crab:preview-config", ...configuration }, globalThis.location.origin), { ...config, size: index % 2 ? "large" : "small", density: ["compact", "standard", "comfortable"][index % 3], locale: "en-US", direction: "rtl" });
        await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(control).toBeChecked();
    }
});

