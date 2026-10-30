import { zoomTest as test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";
import { assertSegmentedGeometry } from './visual-geometry.mjs';

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) test(`Segmented ${config.designSystem} ${config.colorMode} real 200% zoom`, {
    tag: ["@rc-segmented", "@environment", "@chromium-only"],
    annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) },
}, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-segmented", spec.demo, config);
    const frame = page.locator("[data-visual-frame]");
    const group = frame.getByRole("radiogroup", { name: "Time range" });
    const day = group.getByRole("radio", { name: "Day", exact: true });
    const week = group.getByRole("radio", { name: "Week", exact: true });
    await week.locator("..").click();
    await expect(week).toBeChecked();
    const original = await week.elementHandle();
    await realZoom.set200(page);
    expect(await original.evaluate(node => node.isConnected)).toBe(true);
    await expect(week).toBeChecked();
    await page.getByLabel("验收状态", { exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(week).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(day).toBeChecked();
    await expect(day).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(week).toBeFocused();
    await expect(week).toBeChecked();
    await group.scrollIntoViewIfNeeded();
    await expect(group).toBeInViewport({ ratio: 1 });
    await settleFiniteAnimations(page);
    expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.document.documentElement.clientWidth + 1)).toBe(true);
    expect(await group.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await info.attach("zoom-content-geometry", { body: JSON.stringify(await assertSegmentedGeometry(frame)), contentType: "application/json" });
    await info.attach("zoom-component-geometry", { body: JSON.stringify({ group: await group.boundingBox(), option: await week.locator("..").boundingBox(), scroll: await page.evaluate(() => ({ x: globalThis.scrollX, y: globalThis.scrollY })) }), contentType: "application/json" });
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200.png`, info);
});
