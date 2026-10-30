import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual, environmentCases, applyEnvironment } from "../../../test/visual/component-fixture.mjs";
import { assertSwitchGeometry } from './visual-geometry.mjs';
import { assertSwitchFeedback } from './visual-feedback.mjs';

const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases;
for (const config of configurations) for (const scenario of scenarios) {
    test.describe(`switch ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
        test.use({ hasTouch: scenario.hasTouch ?? false });
        test("environment and real input", { tag: ["@rc-switch", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: scenario.id, ...config }) } }, async ({ page, browserName, previewOrigin }, info) => {
            await openDemo(page, previewOrigin, "rc-switch", spec.demo, { ...config, ...scenario.config });
            await applyEnvironment(page, scenario);
            const frame = page.locator("[data-visual-frame]");
            const control = frame.getByRole("switch", { name: "Primary option", exact: true });
            if (scenario.hasTouch) await control.tap();
            else await control.click();
            await expect(control).toBeChecked();
            await assertSwitchFeedback(frame, control, { locale: scenario.config?.locale });
            await settleFiniteAnimations(page);
            expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            if (scenario.hasTouch) {
                expect(await page.evaluate(() => globalThis.matchMedia("(pointer: coarse)").matches)).toBe(true);
                const target = await control.boundingBox();
                const edge = { x: target.x + target.width / 2, y: target.y + (target.height - 48) / 2 + 1 };
                expect(await control.evaluate((node, point) => node.contains(globalThis.document.elementFromPoint(point.x, point.y)), edge)).toBe(true);
            }
            const geometry = await control.boundingBox();
            const content = await assertSwitchGeometry(frame);
            const edgePoint = content.hit.points[0];
            if (scenario.hasTouch) await page.touchscreen.tap(edgePoint.x, edgePoint.y);
            else await page.mouse.click(edgePoint.x, edgePoint.y);
            await expect(control).not.toBeChecked();
            await assertSwitchFeedback(frame, control, { locale: scenario.config?.locale });
            if (scenario.hasTouch) await page.touchscreen.tap(edgePoint.x, edgePoint.y);
            else await page.mouse.click(edgePoint.x, edgePoint.y);
            await expect(control).toBeChecked();
            await assertSwitchFeedback(frame, control, { locale: scenario.config?.locale });
            await settleFiniteAnimations(page);
            expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            await info.attach("environment", { body: JSON.stringify({ ...scenario, geometry, content }), contentType: "application/json" });
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${scenario.id}.png`, info, browserName);
        });
    });
}
test("configuration changes keep the actual control and its value", { tag: ["@rc-switch", "@boundary", "@chromium-only"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-switch", spec.demo, configurations[0]);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("switch", { name: "Primary option", exact: true });
    const stateControl = page.getByLabel("验收状态", { exact: true });
    await expect(control).toHaveAttribute("aria-checked", "false");
    await assertSwitchFeedback(frame, control);
    await stateControl.selectOption("disabled-selected");
    await expect(control).toBeDisabled();
    await expect(control).toHaveAttribute("aria-checked", "true");
    await assertSwitchFeedback(frame, control);
    await stateControl.selectOption("default");
    await expect(control).toBeEnabled();
    await expect(control).toHaveAttribute("aria-checked", "false");
    await assertSwitchFeedback(frame, control);
    await control.click(); await expect(control).toBeChecked();
    const original = await control.elementHandle();
    await stateControl.selectOption("disabled-selected");
    await expect(control).toBeDisabled();
    await expect(control).toHaveAttribute("aria-checked", "true");
    await assertSwitchFeedback(frame, control);
    await stateControl.selectOption("default");
    await expect(control).toBeEnabled();
    await expect(control).toHaveAttribute("aria-checked", "true");
    await assertSwitchFeedback(frame, control);
    for (const [index, config] of configurations.entries()) {
        await page.evaluate(configuration => globalThis.postMessage({ type: "crab:preview-config", ...configuration }, globalThis.location.origin), { ...config, size: index % 2 ? "large" : "small", density: ["compact", "standard", "comfortable"][index % 3], locale: "en-US", direction: "rtl" });
        await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(control).toBeChecked();
        await assertSwitchFeedback(frame, control, { locale: "en-US" });
    }
});

