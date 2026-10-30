import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from "../../../test/visual/component-fixture.mjs";
import { assertSliderGeometry } from './visual-geometry.mjs';

const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases;
for (const config of configurations) for (const scenario of scenarios) {
    test.describe(`slider ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
        test.use({ hasTouch: scenario.hasTouch ?? false });
        test("environment and real input", { tag: ["@rc-slider", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: scenario.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
            await openDemo(page, previewOrigin, "rc-slider", spec.demo, { ...config, ...scenario.config });
            await applyEnvironment(page, scenario);
            const frame = page.locator("[data-visual-frame]");
            const control = frame.getByRole("slider");
            await control.focus(); await page.keyboard.press("ArrowUp"); await expect(control).toHaveAttribute("aria-valuenow", "45");
            await settleFiniteAnimations(page);
            expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            if (scenario.hasTouch) {
                expect(await page.evaluate(() => globalThis.matchMedia("(pointer: coarse)").matches)).toBe(true);
                const target = await control.boundingBox();
                expect(target.height).toBeGreaterThanOrEqual(48);
                await page.touchscreen.tap(target.x + target.width * 0.7, target.y + target.height / 2);
                await expect(control).not.toHaveAttribute("aria-valuenow", "45");
                expect(Number(await control.getAttribute("aria-valuenow"))).toBeGreaterThan(45);
            }
            await settleFiniteAnimations(page);
            const geometry = await control.boundingBox();
            const content = await assertSliderGeometry(frame);
            await info.attach("environment", { body: JSON.stringify({ ...scenario, geometry, content }), contentType: "application/json" });
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${scenario.id}.png`, info, browserName);
        });
    });
}
test("configuration changes keep the actual control and its value", { tag: ["@rc-slider", "@boundary", "@chromium-only"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-slider", spec.demo, configurations[0]);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("slider");
    await control.focus(); await page.keyboard.press("ArrowUp"); await expect(control).toHaveAttribute("aria-valuenow", "45");
    const original = await control.elementHandle();
    for (const [index, config] of configurations.entries()) {
        await page.evaluate(configuration => globalThis.postMessage({ type: "crab:preview-config", ...configuration }, globalThis.location.origin), { ...config, size: index % 2 ? "large" : "small", density: ["compact", "standard", "comfortable"][index % 3], locale: "en-US", direction: "rtl" });
        await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(control).toHaveAttribute("aria-valuenow", "45");
    }
});

