import { test, expect, configurations, openDemo, readVisualSpec, environmentCases, applyEnvironment, settleFiniteAnimations } from "../../../test/visual/component-fixture.mjs";
import { assertSpinGeometry } from './visual-geometry.mjs';
import { readSpinActivity, assertNaturalActivity } from './visual-behavior.mjs';

test.use({ video: "on" });
const spec = await readVisualSpec(import.meta.url);
const scenarios = environmentCases.filter(scenario => !scenario.hasTouch);
for (const config of configurations) for (const scenario of scenarios) {
    test.describe(`Spin ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
        test("activity remains visible and contained", { tag: ["@rc-spin", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: scenario.id, ...config }) } }, async ({ page, previewOrigin }, info) => {
            await openDemo(page, previewOrigin, "rc-spin", spec.demo, { ...config, ...scenario.config });
            await applyEnvironment(page, scenario);
            const frame = page.locator("[data-visual-frame]");
            const status = frame.getByRole("status");
            await expect(status).toBeVisible();
            expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
            await settleFiniteAnimations(page);
            const content = await assertSpinGeometry(frame);
            const sequence = [];
            for (let index = 0; index < 4; index += 1) {
                sequence.push(await readSpinActivity(status));
                await info.attach(`activity-${index}`, { body: await frame.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" });
                await page.waitForTimeout(160);
            }
            await info.attach("environment", { body: JSON.stringify({ scenario, sequence, content }), contentType: "application/json" });
            assertNaturalActivity(sequence, { reducedMotion: scenario.media?.reducedMotion === 'reduce' });
        });
    });
}

test("configuration changes preserve wrapped content and its selected value", { tag: ["@rc-spin", "@boundary", "@chromium-only"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-spin", spec.demo, configurations[0]);
    await page.getByLabel("验收状态", { exact: true }).selectOption("idle");
    const control = page.locator("[data-visual-frame]").getByRole("switch");
    await control.click();
    const original = await control.elementHandle();
    for (const config of configurations) {
        await page.evaluate(configuration => globalThis.postMessage({ type: "crab:preview-config", ...configuration, size: "large", density: "comfortable", locale: "en-US", direction: "rtl" }, globalThis.location.origin), config);
        await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
        expect(await original.evaluate(node => node.isConnected)).toBe(true);
        await expect(control).toBeChecked();
    }
});
