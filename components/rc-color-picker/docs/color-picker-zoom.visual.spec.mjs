import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";
import { commitHexPreservingAlpha } from "./color-picker-assertions.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} real zoom 200%`, { tag: ["@rc-color-picker", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) } }, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-color-picker", spec.demo, config);
    await realZoom.set200(page);
    const trigger = page.getByRole("button", { name: "主题颜色", exact: true }); await trigger.click();
    const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); await expect(dialog.getByRole("slider")).toHaveCount(4);
    const slider = dialog.getByRole("slider").first(); await slider.focus(); await slider.press("Tab");
    await settleFiniteAnimations(page);
    const floating = dialog.locator("xpath=ancestor::*[@data-state][1]"); const rect = await floating.boundingBox(), viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.y).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width); expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height);
    await expect(floating).toHaveAttribute("data-crab-design", config.designSystem);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-controls.png`, info);
    await dialog.getByRole("textbox").scrollIntoViewIfNeeded(); const input = await commitHexPreservingAlpha(page, dialog, "#123456"); await input.press("Tab");
    const confirm = dialog.getByRole("button", { name: "确定", exact: true }); await confirm.scrollIntoViewIfNeeded(); await confirm.focus(); await confirm.press("Shift+Tab"); await page.keyboard.press("Tab");
    await expect(confirm).toBeFocused(); await expect(confirm).toBeInViewport();
    expect(await confirm.evaluate(node => node.matches(":focus-visible"))).toBe(true);
    await settleFiniteAnimations(page);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-actions.png`, info);
    await confirm.click(); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
});
