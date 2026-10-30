import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} real zoom 200%`, { tag: ["@rc-select", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) } }, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-select", spec.demo, config);
    await realZoom.set200(page);
    const field = page.getByRole("combobox", { name: "团队 Team", exact: true });
    await field.scrollIntoViewIfNeeded();
    await field.focus();
    await field.press("ArrowDown");
    const popup = page.getByRole("listbox");
    await expect(popup).toBeVisible();
    const search = field.getByRole("textbox");
    await search.fill("工程");
    await search.press("Tab");
    await expect(field.getByRole("button")).toBeFocused();
    await settleFiniteAnimations(page);
    const rect = await popup.boundingBox(), viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.y).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width); expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height);
    await expect(popup.locator("xpath=ancestor::*[@data-crab-design][1]")).toHaveAttribute("data-crab-design", config.designSystem);
    const option = page.getByRole("option", { name: "工程 Engineering", exact: true });
    await expect(option).toBeInViewport();
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-expanded.png`, info);
    await option.click();
    await expect(field).toContainText("工程 Engineering");
    await expect(field).toBeFocused();
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-selected.png`, info);
});
