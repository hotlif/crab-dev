import { zoomTest, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureZoom } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) zoomTest(`${config.designSystem} ${config.colorMode} real zoom 200%`, { tag: ["@rc-drawer", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: "zoom-200", ...config }) } }, async ({ page, previewOrigin, realZoom }, info) => {
    await openDemo(page, previewOrigin, "rc-drawer", spec.demo, config);
    await realZoom.set200(page);
    await page.getByLabel("长内容", { exact: true }).check();
    const trigger = page.getByRole("button", { name: "打开验收抽屉", exact: true }); await trigger.click();
    const dialog = page.getByRole("dialog", { name: "项目详情 Project details" }); const panel = dialog.getByRole("document");
    await expect(panel).toBeVisible();
    const input = dialog.getByRole("textbox", { name: "项目备注" }); await input.fill("200% 草稿 Draft"); await input.press("Tab");
    const save = dialog.getByRole("button", { name: "保存草稿", exact: true }); await expect(save).toBeFocused(); await expect(save).toBeInViewport();
    await settleFiniteAnimations(page);
    const rect = await panel.boundingBox(), viewport = await page.evaluate(() => ({ width: globalThis.innerWidth, height: globalThis.innerHeight }));
    expect(rect.x).toBeGreaterThanOrEqual(-1); expect(rect.y).toBeGreaterThanOrEqual(-1); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width + 1); expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height + 1);
    await expect(dialog).toHaveAttribute("data-crab-design", config.designSystem);
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-top.png`, info);
    const body = input.locator("xpath=ancestor::div[2]");
    await body.evaluate(node => node.scrollBy(0, node.clientHeight));
    await expect.poll(() => body.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
    await expect(save).toBeInViewport();
    await captureZoom(page, realZoom, `${config.designSystem}-${config.colorMode}-zoom-200-scrolled.png`, info);
    await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
});
