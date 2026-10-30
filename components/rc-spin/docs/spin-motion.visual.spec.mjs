import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";
import { readSpinActivity, assertNaturalActivity, prepareWrappedControl, assertOverlayIsolation, assertWrappedControlRestored } from './visual-behavior.mjs';

// Continuous progress feedback is never stopped for a snapshot comparison.
test.use({ video: "on" });
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test(`Spin ${config.designSystem} ${config.colorMode} ${size} ${state}`, {
        tag: ["@rc-spin", "@matrix", "@motion", ...(!crossEngine ? ["@chromium-only"] : [])],
        annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state }) },
    }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-spin", spec.demo, { ...config, size });
        const stateControl = page.getByLabel("验收状态", { exact: true });
        const frame = page.locator("[data-visual-frame]");
        const wrapped = state === 'overlay' ? await prepareWrappedControl(frame, stateControl) : null;
        await stateControl.selectOption(state);
        const status = frame.getByRole("status");
        if (state === "delayed") {
            await expect(status).toHaveCount(0);
            await page.getByRole("switch", { name: "Start delayed request" }).click();
            await expect(status).toHaveCount(0);
        }
        if (state === "idle") {
            await expect(status).toHaveCount(0);
            await expect(frame.locator("[aria-busy]")).toHaveAttribute("aria-busy", "false");
            await expect(frame.getByRole("switch")).toBeEnabled();
        } else {
            await expect(status).toBeVisible();
            await expect(status).toHaveAttribute("aria-live", "polite");
            if (state === "expressive") await expect(status.locator('[data-indicator="expressive"]')).toBeVisible();
            if (state === "overlay") {
                await assertOverlayIsolation(page, frame, stateControl, wrapped, info);
            }
        }
        await settleFiniteAnimations(page);
        if (["idle", "custom"].includes(state)) {
            await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
        } else {
            const sequence = [];
            for (let index = 0; index < 4; index += 1) {
                sequence.push(await readSpinActivity(status));
                await info.attach(`activity-${index}`, { body: await frame.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" });
                await page.waitForTimeout(160);
            }
            await info.attach("activity-sequence", { body: JSON.stringify(sequence), contentType: "application/json" });
            assertNaturalActivity(sequence);
        }
        if (wrapped) await assertWrappedControlRestored(page, frame, stateControl, wrapped, info);
    });
}
