import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${state}`, { tag: ["@rc-drawer", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-drawer", spec.demo, { ...config, size, density });
        const placement = ["left", "top", "bottom"].includes(state) ? state : "right";
        await page.getByLabel("验收方向", { exact: true }).selectOption(placement); if (state === "long-content") await page.getByLabel("长内容", { exact: true }).check();
        await page.getByRole("button", { name: "打开验收抽屉", exact: true }).click();
        const dialog = page.getByRole("dialog", { name: "项目详情 Project details" }); await expect(dialog).toBeVisible();
        const panel = dialog.getByRole("document"); await expect(panel).toHaveAttribute("data-size", size); await expect(panel).toHaveAttribute("data-placement", placement);
        if (state === "focus-visible") { await dialog.getByRole("textbox").focus(); await page.keyboard.press("Tab"); const save = dialog.getByRole("button", { name: "保存草稿" }); await expect(save).toBeFocused(); expect(await save.evaluate(node => node.matches(":focus-visible"))).toBe(true); }
        if (state === "long-content") { await dialog.getByRole("textbox").scrollIntoViewIfNeeded(); await expect(dialog.getByRole("button", { name: "保存草稿" })).toBeInViewport(); }
        await settleFiniteAnimations(page);
        const rect = await panel.boundingBox(), viewport = page.viewportSize(); expect(rect.x).toBeGreaterThanOrEqual(-1); expect(rect.y).toBeGreaterThanOrEqual(-1); expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width + 1); expect(rect.y + rect.height).toBeLessThanOrEqual(viewport.height + 1);
        await expect(dialog).toHaveAttribute("data-crab-design", config.designSystem); await expect(dialog).toHaveAttribute("data-theme", config.colorMode);
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
    });
}

test("drawer draft and owner configuration survive close/reopen", { tag: ["@rc-drawer", "@boundary"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-drawer", spec.demo, configurations[0]); const trigger = page.getByRole("button", { name: "打开验收抽屉", exact: true }); await trigger.click(); const input = page.getByRole("textbox", { name: "项目备注" }); await input.fill("保留草稿 Draft"); const original = await input.elementHandle();
    for (const config of configurations) { await page.evaluate(config => globalThis.postMessage({ type: "crab:preview-config", ...config, direction: "rtl", locale: "en-US" }, globalThis.location.origin), config); await expect(page.getByRole("dialog")).toHaveAttribute("data-crab-design", config.designSystem); await expect(input).toHaveValue("保留草稿 Draft"); expect(await original.evaluate(node => node.isConnected)).toBe(true); }
    await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible(); await expect(trigger).toBeFocused(); await trigger.click(); await expect(input).toHaveValue("保留草稿 Draft");
});

