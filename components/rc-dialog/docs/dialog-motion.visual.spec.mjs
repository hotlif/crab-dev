import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from "../../../test/visual/component-fixture.mjs";

test.use({ video: "on" });
const spec = await readVisualSpec(import.meta.url);
for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(value => value.startsWith("pending-"))) {
    const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
    test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ["@rc-dialog", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin }, info) => {
        await openDemo(page, previewOrigin, "rc-dialog", spec.demo, { ...config, size, density });
        await page.getByLabel("验收状态", { exact: true }).selectOption(state);
        const trigger = page.getByRole("button", { name: "打开验收对话框", exact: true }); await trigger.click();
        const dialog = page.getByRole("dialog", { name: "保存工作区 Save workspace" }); await expect(dialog).toBeVisible();
        const action = state === "pending-confirm" ? "confirm" : "cancel", sibling = action === "confirm" ? "cancel" : "confirm";
        const initiator = dialog.locator(`[data-dialog-action="${action}"]`), other = dialog.locator(`[data-dialog-action="${sibling}"]`);
        await dialog.getByRole("textbox", { name: "工作区名称", exact: true }).focus();
        await page.keyboard.press("Tab"); if (action === "confirm") await page.keyboard.press("Tab");
        await expect(initiator).toBeFocused(); await initiator.press("Enter");
        await expect(dialog).toHaveAttribute("aria-busy", "true"); await expect(initiator).toHaveAttribute("data-is-loading", "true");
        await expect(initiator).toBeFocused(); expect(await initiator.evaluate(node => node.matches(":focus-visible"))).toBe(true);
        // Pending blocks re-entry while the native button remains focusable.
        await expect(initiator).toHaveJSProperty("disabled", false); await expect(initiator).toHaveAttribute("aria-disabled", "true");
        await expect(other).toBeDisabled(); await expect(other).toHaveJSProperty("disabled", true);
        await expect(dialog.getByRole("button").first()).toBeDisabled(); await expect(dialog.getByRole("button").first()).toHaveJSProperty("disabled", true);
        const requestCount = dialog.getByLabel("异步请求次数", { exact: true });
        const completeRequest = dialog.getByRole("button", { name: "完成异步请求", exact: true });
        await expect(requestCount).toHaveText("1"); await expect(completeRequest).toBeEnabled();
        await initiator.press("Enter"); await page.keyboard.press("Escape");
        await expect(dialog).toBeVisible(); await expect(requestCount).toHaveText("1"); await expect(initiator).toBeFocused();
        await settleFiniteAnimations(page);
        for (let frame = 0; frame < 2; frame++) { await page.waitForTimeout(250); await info.attach(`natural-${state}-frame-${frame}`, { body: await page.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" }); }
        await completeRequest.click();
        await expect(dialog).not.toHaveAttribute("aria-busy", "true"); await expect(dialog).toBeVisible(); await expect(other).toBeEnabled();
        await expect(initiator).toHaveJSProperty("disabled", false); await expect(initiator).not.toHaveAttribute("data-is-loading", "true"); await expect(initiator).not.toHaveAttribute("aria-disabled", "true");
        await dialog.locator('[data-dialog-action="cancel"]').click(); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
    });
}
