import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} real zoom 200%`, { tag: ["@rc-dropdown-container", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) } }, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-dropdown-container", spec.demo, config);
    await realZoom.set200(page);
    const trigger = page.getByRole("button", { name: "打开验收浮层", exact: true }); await trigger.click();
    const popup = page.getByRole("dialog", { name: "浮层内容" }); await expect(popup).toBeVisible();
    const input = popup.getByRole("textbox", { name: "浮层草稿" }); await input.fill("200% 保留草稿 Draft"); await input.press("Tab");
    const action = popup.getByRole("button", { name: "浮层操作", exact: true }); await expect(action).toBeFocused(); await expect(action).toBeInViewport();
    expect(await action.evaluate(node => node.matches(":focus-visible"))).toBe(true);
    await settleFiniteAnimations(page);
    const rect = await popup.boundingBox(), viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.y).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width); expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height);
    await expect(popup.locator("xpath=ancestor::*[@data-crab-design][1]")).toHaveAttribute("data-crab-design", config.designSystem);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-expanded.png`, info);
    await action.press("Escape"); await expect(popup).not.toBeVisible(); await expect(trigger).toBeFocused();
    await trigger.click(); await expect(input).toHaveValue("200% 保留草稿 Draft");
});
