import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";
import { assertSwitchGeometry } from './visual-geometry.mjs';
import { assertSwitchFeedback } from './visual-feedback.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`Switch ${config.designSystem} ${config.colorMode} real 200% zoom`, {
    tag: ["@rc-switch", "@environment", "@chromium-only"],
    annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-switch", spec.demo, config);
    const frame = page.locator("[data-visual-frame]");
    const control = frame.getByRole("switch", { name: "Primary option", exact: true });
    const target = control;
    await target.click();
    await expect(control).toBeChecked();
    await assertSwitchFeedback(frame, control);
    const original = await control.elementHandle();
    await realZoom.set200(page);
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    await expect(control).toBeChecked();
    await assertSwitchFeedback(frame, control);

    await page.getByLabel("验收状态", { exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(control).toBeFocused();
    expect(await control.evaluate(node => node.matches(":focus-visible"))).toBe(true);
    await target.scrollIntoViewIfNeeded();
    await expect(target).toBeInViewport({ ratio: 1 });
    await settleFiniteAnimations(page);
    expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.document.documentElement.clientWidth + 1)).toBe(true);
    expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    const initialContent = await assertSwitchGeometry(frame);
    const edgePoint = initialContent.hit.points[0];
    await page.mouse.click(edgePoint.x, edgePoint.y);
    await expect(control).not.toBeChecked();
    await assertSwitchFeedback(frame, control);
    await page.mouse.click(edgePoint.x, edgePoint.y);
    await expect(control).toBeChecked();
    await assertSwitchFeedback(frame, control);
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    await page.getByLabel("验收状态", { exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(control).toBeFocused();
    expect(await control.evaluate(node => node.matches(":focus-visible"))).toBe(true);
    await settleFiniteAnimations(page);
    await info.attach("zoom-content-geometry", { body: JSON.stringify({ beforeEdgeInput: initialContent, afterEdgeInput: await assertSwitchGeometry(frame) }), contentType: "application/json" });
    await info.attach("zoom-component-geometry", { body: JSON.stringify({ target: await target.boundingBox(), scroll: await page.evaluate(() => ({ x: globalThis.scrollX, y: globalThis.scrollY })) }), contentType: "application/json" });
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200.png`, info);
});

