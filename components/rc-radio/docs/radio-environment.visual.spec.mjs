import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from "../../../test/visual/component-fixture.mjs";
import { assertRadioGeometry } from './visual-geometry.mjs';
import { assertRadioFeedback } from './visual-feedback.mjs';

const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases;
for (const config of configurations) for (const scenario of scenarios) {
    test.describe(`radio ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
        test.use({ hasTouch: scenario.hasTouch ?? false });
        test("environment and real input", { tag: ["@rc-radio", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: scenario.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
            await openDemo(page, previewOrigin, "rc-radio", spec.demo, { ...config, ...scenario.config });
            await applyEnvironment(page, scenario);
            const frame = page.locator("[data-visual-frame]");
            const control = frame.getByRole("radio", { name: "Primary option", exact: true });
            if (scenario.hasTouch) await control.locator("..").tap();
            else await control.locator("..").click();
            await expect(control).toBeChecked();
            await assertRadioFeedback(frame, control, { locale: scenario.config?.locale });
            await settleFiniteAnimations(page);
            expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            if (scenario.hasTouch) {
                expect(await page.evaluate(() => globalThis.matchMedia("(pointer: coarse)").matches)).toBe(true);
                const target = await control.locator("..").locator("[data-radio-part='control']").boundingBox();
                expect(target.width).toBeGreaterThanOrEqual(48); expect(target.height).toBeGreaterThanOrEqual(48);
            }
            const geometry = await control.boundingBox();
            const content = await assertRadioGeometry(frame);
            await info.attach("environment", { body: JSON.stringify({ ...scenario, geometry, content }), contentType: "application/json" });
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${scenario.id}.png`, info, browserName);
        });
    });
}
test("configuration changes keep the actual control and its value", { tag: ["@rc-radio", "@boundary", "@chromium-only"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-radio", spec.demo, configurations[0]);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("radio", { name: "Primary option", exact: true });
    const stateControl = page.getByLabel("验收状态", { exact: true });
    await expect(control).toHaveJSProperty("checked", false);
    await assertRadioFeedback(frame, control);
    await stateControl.selectOption("disabled-selected");
    await expect(control).toBeDisabled();
    await expect(control).toHaveJSProperty("checked", true);
    await assertRadioFeedback(frame, control);
    await stateControl.selectOption("default");
    await expect(control).toBeEnabled();
    await expect(control).toHaveJSProperty("checked", false);
    await assertRadioFeedback(frame, control);
    await control.locator("..").click(); await expect(control).toBeChecked();
    const original = await control.elementHandle();
    await stateControl.selectOption("disabled-selected");
    await expect(control).toBeDisabled();
    await expect(control).toHaveJSProperty("checked", true);
    await assertRadioFeedback(frame, control);
    await stateControl.selectOption("default");
    await expect(control).toBeEnabled();
    await expect(control).toHaveJSProperty("checked", true);
    await assertRadioFeedback(frame, control);
    for (const [index, config] of configurations.entries()) {
        await page.evaluate(configuration => globalThis.postMessage({ type: "crab:preview-config", ...configuration }, globalThis.location.origin), { ...config, size: index % 2 ? "large" : "small", density: ["compact", "standard", "comfortable"][index % 3], locale: "en-US", direction: "rtl" });
        await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(control).toBeChecked();
        await assertRadioFeedback(frame, control, { locale: "en-US" });
    }
});

