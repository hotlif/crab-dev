import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";
import { assertSliderGeometry } from './visual-geometry.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`Slider ${config.designSystem} ${config.colorMode} real 200% zoom`, {
    tag: ["@rc-slider", "@environment", "@chromium-only"],
    annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-slider", spec.demo, config);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("slider");
    await control.focus();
    await page.keyboard.press("ArrowUp");
    await expect(control).toHaveAttribute("aria-valuenow", "45");
    const original = await control.elementHandle();
    await realZoom.set200(page);
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    await expect(control).toHaveAttribute("aria-valuenow", "45");
    await page.getByLabel("验收状态", { exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(control).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(control).toHaveAttribute("aria-valuenow", "50");
    await page.keyboard.press("ArrowDown");
    await expect(control).toHaveAttribute("aria-valuenow", "45");
    await control.scrollIntoViewIfNeeded();
    await expect(control).toBeInViewport({ ratio: 1 });
    await settleFiniteAnimations(page);
    expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.document.documentElement.clientWidth + 1)).toBe(true);
    expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await info.attach("zoom-content-geometry", { body: JSON.stringify(await assertSliderGeometry(frame)), contentType: "application/json" });
    await info.attach("zoom-component-geometry", { body: JSON.stringify({ control: await control.boundingBox(), handle: await control.locator("[data-slot='slider-handle']").boundingBox(), scroll: await page.evaluate(() => ({ x: globalThis.scrollX, y: globalThis.scrollY })) }), contentType: "application/json" });
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200.png`, info);
});
