import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from "../../../test/visual/component-fixture.mjs";
import { assertSpinGeometry } from './visual-geometry.mjs';
import { readSpinActivity, assertNaturalActivity, prepareWrappedControl, assertOverlayIsolation, assertWrappedControlRestored } from './visual-behavior.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`Spin ${config.designSystem} ${config.colorMode} real 200% zoom`, {
    tag: ["@rc-spin", "@environment", "@chromium-only"],
    annotation: [
        { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) },
        { type: "continuous-animation", description: "Natural activity video and timed full-viewport samples; no static pixel baseline for a moving indicator." },
    ],
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-spin", spec.demo, config);
    const stateControl = page.getByLabel("验收状态", { exact: true });
    const frame = page.locator("[data-visual-frame]");
    const wrapped = await prepareWrappedControl(frame, stateControl);
    const { control, original } = wrapped;
    await stateControl.selectOption("overlay");
    await expect(frame.locator("[aria-busy]")).toHaveAttribute("aria-busy", "true");
    await realZoom.set200(page);
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    await expect(control).toHaveAttribute("aria-checked", "true");
    await assertOverlayIsolation(page, frame, stateControl, wrapped, info);
    const status = frame.getByRole("status");
    await status.scrollIntoViewIfNeeded();
    await expect(status).toBeInViewport({ ratio: 1 });
    await settleFiniteAnimations(page);
    expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.document.documentElement.clientWidth + 1)).toBe(true);
    expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await info.attach("zoom-content-geometry", { body: JSON.stringify(await assertSpinGeometry(frame)), contentType: "application/json" });
    const sequence = [];
    for (let index = 0; index < 4; index += 1) {
        sequence.push(await readSpinActivity(status));
        await info.attach(`actual-zoom-200-activity-${index}`, { body: await realZoom.capture200(page), contentType: "image/png" });
        await page.waitForTimeout(160);
    }
    await info.attach("zoom-activity-sequence", { body: JSON.stringify(sequence), contentType: "application/json" });
    assertNaturalActivity(sequence);
    await assertWrappedControlRestored(page, frame, stateControl, wrapped, info);
    await control.scrollIntoViewIfNeeded();
    await expect(control).toBeInViewport({ ratio: 1 });
    await settleFiniteAnimations(page);
    await info.attach("actual-zoom-200-restored-content", { body: await realZoom.capture200(page), contentType: "image/png" });
});
