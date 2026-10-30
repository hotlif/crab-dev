import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";
import { assertRadioGeometry } from './visual-geometry.mjs';
import { assertRadioFeedback } from './visual-feedback.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`Radio ${config.designSystem} ${config.colorMode} real 200% zoom`, {
    tag: ["@rc-radio", "@environment", "@chromium-only"],
    annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-radio", spec.demo, config);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("radio", { name: "Primary option", exact: true });
    const target = control.locator('..');
    await target.click();
    await expect(control).toBeChecked();
    await assertRadioFeedback(frame, control);
    const original = await control.elementHandle();
    await realZoom.set200(page);
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    await expect(control).toBeChecked();
    await assertRadioFeedback(frame, control);

    await page.getByLabel("验收状态", { exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(control).toBeFocused();
    expect(await control.evaluate(node => node.matches(":focus-visible"))).toBe(true);
    await target.scrollIntoViewIfNeeded();
    await expect(target).toBeInViewport({ ratio: 1 });
    await settleFiniteAnimations(page);
    expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.document.documentElement.clientWidth + 1)).toBe(true);
    expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await info.attach("zoom-content-geometry", { body: JSON.stringify(await assertRadioGeometry(frame)), contentType: "application/json" });
    await info.attach("zoom-component-geometry", { body: JSON.stringify({ target: await target.boundingBox(), scroll: await page.evaluate(() => ({ x: globalThis.scrollX, y: globalThis.scrollY })) }), contentType: "application/json" });
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200.png`, info);
});

