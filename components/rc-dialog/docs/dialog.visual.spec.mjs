import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(value => !value.startsWith("pending-"))) {
    const crossEngine = spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ["@rc-dialog", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-dialog", spec.demo, { ...config, size, density });
        await page.getByLabel("验收状态", { exact: true }).selectOption(["long-content", "error"].includes(state) ? state : "default");
        await page.getByRole("button", { name: "打开验收对话框", exact: true }).click();
        const dialog = page.getByRole("dialog", { name: "保存工作区 Save workspace" }); await expect(dialog).toBeVisible();
        const confirm = dialog.locator('[data-dialog-action="confirm"]');
        if (state === "hover") await confirm.hover();
        if (state === "focus-visible") { await dialog.getByRole("textbox").focus(); await page.keyboard.press("Tab"); await page.keyboard.press("Tab"); await expect(confirm).toBeFocused(); expect(await confirm.evaluate(node => node.matches(":focus-visible"))).toBe(true); }
        if (state === "pressed") { await confirm.hover(); await page.mouse.down(); }
        if (state === "error") await expect(dialog.getByRole("alert")).toBeVisible();
        if (state === "long-content") { await confirm.scrollIntoViewIfNeeded(); await expect(confirm).toBeInViewport(); }
        await settleFiniteAnimations(page);
        const rect = await dialog.boundingBox(), viewport = page.viewportSize(); expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width);
        await expect(dialog).toHaveAttribute("data-crab-design", config.designSystem); await expect(dialog).toHaveAttribute("data-theme", config.colorMode);
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-${state}.png`, info, browserName);
        if (state === "pressed") await page.mouse.up();
    });
}

test("modal configuration switches and close/reopen preserve the actual draft", { tag: ["@rc-dialog", "@boundary"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-dialog", spec.demo, configurations[0]);
    const trigger = page.getByRole("button", { name: "打开验收对话框", exact: true }); await trigger.click();
    const input = page.getByRole("textbox", { name: "工作区名称" }); await input.fill("持久草稿 Draft"); const original = await input.elementHandle();
    for (const config of configurations) { await page.evaluate(config => globalThis.postMessage({ type: "crab:preview-config", ...config, direction: "rtl", locale: "en-US" }, globalThis.location.origin), config); await expect(page.getByRole("dialog")).toHaveAttribute("data-crab-design", config.designSystem); await expect(input).toHaveValue("持久草稿 Draft"); expect(await original.evaluate(node => node.isConnected)).toBe(true); }
    await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible(); await expect(trigger).toBeFocused(); await trigger.click(); await expect(input).toHaveValue("持久草稿 Draft");
});

