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
                const height = await control.locator("..").evaluate(node => Number.parseFloat(globalThis.getComputedStyle(node, "::after").minHeight));
                expect(height).toBeGreaterThanOrEqual(48);
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

