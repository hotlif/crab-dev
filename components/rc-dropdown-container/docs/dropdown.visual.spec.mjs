import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${state}`, { tag: ["@rc-dropdown-container", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-dropdown-container", spec.demo, { ...config, size, density });
        const trigger = page.getByRole("button", { name: "打开验收浮层", exact: true });
        if (state === "focus-visible") { await trigger.focus(); await page.keyboard.press("Tab"); await page.keyboard.press("Shift+Tab"); await expect(trigger).toBeFocused(); expect(await trigger.evaluate(node => node.matches(":focus-visible"))).toBe(true); }
        if (["expanded", "content-focus"].includes(state)) { await trigger.click(); await expect(page.getByRole("dialog", { name: "浮层内容" })).toBeVisible(); await expect(trigger).toHaveAttribute("aria-expanded", "true"); }
        if (state === "content-focus") { await page.getByRole("textbox", { name: "浮层草稿" }).focus(); await page.keyboard.press("Tab"); await expect(page.getByRole("button", { name: "浮层操作", exact: true })).toBeFocused(); }
        await settleFiniteAnimations(page);
        if (["expanded", "content-focus"].includes(state)) { const popup = page.getByRole("dialog", { name: "浮层内容" }); const rect = await popup.boundingBox(); expect(rect.x).toBeGreaterThanOrEqual(0); const boundary = popup.locator("xpath=ancestor::*[@data-crab-design][1]"); await expect(boundary).toHaveAttribute("data-crab-design", config.designSystem); await expect(boundary).toHaveAttribute("data-theme", config.colorMode); }
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
    });
}

test("Portal draft and configuration remain connected; Escape restores the trigger", { tag: ["@rc-dropdown-container", "@boundary"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-dropdown-container", spec.demo, configurations[0]); const trigger = page.getByRole("button", { name: "打开验收浮层", exact: true }); await trigger.click(); const input = page.getByRole("textbox", { name: "浮层草稿" }); await input.fill("保持输入 Draft"); const original = await input.elementHandle();
    for (const config of configurations) { await page.evaluate(config => globalThis.postMessage({ type: "crab:preview-config", ...config, direction: "rtl", locale: "en-US", brandColor: "#8b5cf6" }, globalThis.location.origin), config); const boundary = page.getByRole("dialog", { name: "浮层内容" }).locator("xpath=ancestor::*[@data-crab-design][1]"); await expect(boundary).toHaveAttribute("data-crab-design", config.designSystem); await expect(input).toHaveValue("保持输入 Draft"); expect(await original.evaluate(node => node.isConnected)).toBe(true); }
    await input.press("Escape"); await expect(page.getByRole("dialog", { name: "浮层内容" })).not.toBeVisible(); await expect(trigger).toBeFocused(); await trigger.click(); await expect(input).toHaveValue("保持输入 Draft"); await page.getByRole("button", { name: "浮层外操作", exact: true }).click(); await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

