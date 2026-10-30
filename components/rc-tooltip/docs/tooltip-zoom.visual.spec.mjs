import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} real zoom 200%`, { tag: ["@rc-tooltip", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) } }, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-tooltip", spec.demo, config);
    await realZoom.set200(page);
    const scenario = page.getByLabel("验收状态", { exact: true }); await scenario.selectOption("long-text"); await scenario.focus(); await scenario.press("Tab");
    const trigger = page.getByRole("button", { name: "提示触发器", exact: true }); await expect(trigger).toBeFocused();
    expect(await trigger.evaluate(node => node.matches(":focus-visible"))).toBe(true);
    const tip = page.getByRole("tooltip"); await expect(tip).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-describedby", await tip.getAttribute("id"));
    await settleFiniteAnimations(page);
    const rect = await tip.boundingBox(), viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.y).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width); expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height);
    await expect(tip.locator("xpath=ancestor-or-self::*[@data-crab-design][1]")).toHaveAttribute("data-crab-design", config.designSystem);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-tooltip.png`, info);
    await trigger.press("Escape"); await expect(tip).not.toBeVisible(); await expect(trigger).toBeFocused();
});
