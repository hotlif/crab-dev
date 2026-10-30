import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from "../../../test/visual/component-fixture.mjs";
import { assertCheckboxFeedback } from "./visual-feedback.mjs";
import { assertCheckboxGeometry } from './visual-geometry.mjs';

const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases;
for (const config of configurations) for (const scenario of scenarios) {
    test.describe(`checkbox ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
        test.use({ hasTouch: scenario.hasTouch ?? false });
        test("environment and real input", { tag: ["@rc-checkbox", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: scenario.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
            await openDemo(page, previewOrigin, "rc-checkbox", spec.demo, { ...config, ...scenario.config });
            await applyEnvironment(page, scenario);
            const frame = page.locator("[data-visual-frame]");
            const control = frame.getByRole("checkbox", { name: "Primary option", exact: true });
            if (scenario.hasTouch) await control.locator("..").tap();
            else await control.locator("..").click();
            await expect(control).toBeChecked();
            await assertCheckboxFeedback(frame, control, { locale: scenario.config?.locale });
            await settleFiniteAnimations(page);
            expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            if (scenario.hasTouch) {
                expect(await page.evaluate(() => globalThis.matchMedia("(pointer: coarse)").matches)).toBe(true);
                const target = await control.locator("..").locator("[data-checkbox-part='control']").boundingBox();
                expect(target.width).toBeGreaterThanOrEqual(48); expect(target.height).toBeGreaterThanOrEqual(48);
            }
            const geometry = await control.boundingBox();
            const content = await assertCheckboxGeometry(frame);
            await info.attach("environment", { body: JSON.stringify({ ...scenario, geometry, content }), contentType: "application/json" });
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${scenario.id}.png`, info, browserName);
        });
    });
}
test("configuration changes keep the actual control and its value", { tag: ["@rc-checkbox", "@boundary", "@chromium-only"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-checkbox", spec.demo, configurations[0]);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("checkbox", { name: "Primary option", exact: true });
    await control.locator("..").click(); await expect(control).toBeChecked();
    await assertCheckboxFeedback(frame, control);
    const original = await control.elementHandle();
    for (const [index, config] of configurations.entries()) {
        await page.evaluate(configuration => globalThis.postMessage({ type: "crab:preview-config", ...configuration }, globalThis.location.origin), { ...config, size: index % 2 ? "large" : "small", density: ["compact", "standard", "comfortable"][index % 3], locale: "en-US", direction: "rtl" });
        await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(control).toBeChecked();
        await assertCheckboxFeedback(frame, control, { locale: "en-US" });
    }
    const stateControl = page.getByLabel("验收状态", { exact: true });
    await stateControl.selectOption("indeterminate");
    await expect(control).toHaveJSProperty("checked", true);
    await expect(control).toHaveJSProperty("indeterminate", true);
    await assertCheckboxFeedback(frame, control, { locale: "en-US" });
    await control.locator("..").click();
    await expect(control).toHaveJSProperty("checked", false);
    await expect(control).toHaveJSProperty("indeterminate", true);
    await assertCheckboxFeedback(frame, control, { locale: "en-US" });
    await stateControl.selectOption("disabled-indeterminate");
    await expect(control).toBeDisabled();
    await expect(control).toHaveJSProperty("indeterminate", true);
    await assertCheckboxFeedback(frame, control, { locale: "en-US" });
    await stateControl.selectOption("default");
    await expect(control).toBeEnabled();
    await expect(control).toHaveJSProperty("checked", false);
    await expect(control).toHaveJSProperty("indeterminate", false);
    await assertCheckboxFeedback(frame, control, { locale: "en-US" });
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
});

