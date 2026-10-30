import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";

const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${state}`, { tag: ["@rc-color-picker", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, browserName, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-color-picker", spec.demo, { ...config, size, density }); const scenario = page.getByLabel("验收状态", { exact: true }); await scenario.selectOption(state === "disabled" ? "disabled" : "default"); const trigger = page.getByRole("button", { name: "主题颜色", exact: true });
        if (state === "hover") await trigger.hover();
        if (state === "focus-visible") { await scenario.focus(); await page.keyboard.press("Tab"); await expect(trigger).toBeFocused(); expect(await trigger.evaluate(node => node.matches(":focus-visible"))).toBe(true); }
        if (state === "pressed") { await trigger.hover(); await page.mouse.down(); }
        if (state === "disabled") { await expect(trigger).toHaveAttribute("aria-disabled", "true"); await trigger.click(); await expect(trigger).toHaveAttribute("aria-expanded", "false"); }
        if (["expanded", "edited"].includes(state)) {
            await trigger.click(); const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); await expect(dialog.getByRole("slider")).toHaveCount(4); const boundary = dialog.locator("xpath=ancestor::*[@data-crab-design][1]"); await expect(boundary).toHaveAttribute("data-crab-design", config.designSystem);
            const supported = await dialog.evaluate(node => typeof node.ownerDocument.defaultView.EyeDropper === "function");
            await expect(dialog.getByRole("button", { name: "屏幕取色", exact: true })).toHaveCount(supported ? 1 : 0);
            await info.attach("screen-picker-capability", { body: JSON.stringify({ supported, nativeSelection: "requires real system interaction; not exercised by screenshot matrix" }), contentType: "application/json" });
        }
        if (state === "edited") { const slider = page.getByRole("slider").first(), initial = await slider.getAttribute("aria-valuenow"); await slider.focus(); await slider.press("ArrowRight"); expect(await slider.getAttribute("aria-valuenow")).not.toBe(initial); }
        await settleFiniteAnimations(page); const rect = await trigger.boundingBox(); expect(rect.width).toBeGreaterThanOrEqual(44); expect(rect.height).toBeGreaterThanOrEqual(44);
        await captureVisual(page, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
        if (state === "pressed") await page.mouse.up();
    });
}

test("color draft and nested format Portal preserve their configuration", { tag: ["@rc-color-picker", "@boundary"] }, async ({ page, previewOrigin }) => {
    await openDemo(page, previewOrigin, "rc-color-picker", spec.demo, configurations[0]); const trigger = page.getByRole("button", { name: "主题颜色", exact: true }); await trigger.click(); const input = page.getByRole("dialog").getByRole("textbox"); await input.fill("#123456"); const original = await input.elementHandle();
    for (const config of configurations) { await page.evaluate(config => globalThis.postMessage({ type: "crab:preview-config", ...config, direction: "rtl", locale: "en-US", brandColor: "#8b5cf6" }, globalThis.location.origin), config); await expect(input).toHaveValue("#123456"); expect(await original.evaluate(node => node.isConnected)).toBe(true); const boundary = page.getByRole("dialog").locator("xpath=ancestor::*[@data-crab-design][1]"); await expect(boundary).toHaveAttribute("data-crab-design", config.designSystem); }
    const format = page.getByRole("dialog").getByRole("combobox"); await format.click({ position: { x: 12, y: 12 } }); await expect(page.getByRole("listbox")).toBeVisible(); await page.getByRole("option", { name: "OKLCH", exact: true }).click(); await expect(page.getByRole("dialog")).toBeVisible(); await expect(format).toContainText("OKLCH");
    await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible(); await expect(trigger).toBeFocused();
});

