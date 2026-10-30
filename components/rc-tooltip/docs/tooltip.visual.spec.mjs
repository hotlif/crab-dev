import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${state}`, { tag: ["@rc-tooltip", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-tooltip", spec.demo, { ...config, size, density }); const scenario = page.getByLabel("验收状态", { exact: true }); await scenario.selectOption(["arrow", "long-text"].includes(state) ? state : "default"); const trigger = page.getByRole("button", { name: "提示触发器", exact: true });
        if (state === "focus-visible") { await scenario.focus(); await page.keyboard.press("Tab"); await expect(trigger).toBeFocused(); expect(await trigger.evaluate(node => node.matches(":focus-visible"))).toBe(true); }
        else if (state !== "default") await trigger.hover();
        if (state === "default") await expect(page.getByRole("tooltip")).toHaveCount(0);
        else { const tip = page.getByRole("tooltip"); await expect(tip).toBeVisible(); const id = await tip.getAttribute("id"); await expect(trigger).toHaveAttribute("aria-describedby", id); const boundary = tip.locator("xpath=ancestor-or-self::*[@data-crab-design][1]"); await expect(boundary).toHaveAttribute("data-crab-design", config.designSystem); }
        await settleFiniteAnimations(page);
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-${state}.png`, info, browserName);
        if (state !== "default") { await page.keyboard.press("Escape"); await expect(page.getByRole("tooltip")).not.toBeVisible(); }
    });
}

test("nearest Portal configuration updates without rebuilding the trigger", { tag: ["@rc-tooltip", "@boundary"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-tooltip", spec.demo, configurations[0]); const trigger = page.getByRole("button", { name: "提示触发器", exact: true }); await trigger.hover(); const original = await trigger.elementHandle(); await expect(page.getByRole("tooltip")).toBeVisible();
    for (const config of configurations) { await page.evaluate(config => globalThis.postMessage({ type: "crab:preview-config", ...config, direction: "rtl", locale: "en-US", brandColor: "#8b5cf6" }, globalThis.location.origin), config); const tip = page.getByRole("tooltip"); await expect(tip.locator("xpath=ancestor-or-self::*[@data-crab-design][1]")).toHaveAttribute("data-crab-design", config.designSystem); expect(await original.evaluate(node => node.isConnected)).toBe(true); }
});

