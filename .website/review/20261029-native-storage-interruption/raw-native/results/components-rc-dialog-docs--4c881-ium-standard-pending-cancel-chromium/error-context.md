# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-dialog\docs\dialog-motion.visual.spec.mjs >> md3 light medium standard pending-cancel
- Location: components\rc-dialog\docs\dialog-motion.visual.spec.mjs:7:5

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('dialog', { name: '保存工作区 Save workspace' }).locator('[data-dialog-action="cancel"]')
Expected: enabled
Received: disabled
Timeout:  10000ms

Call log:
  - Expect "toBeEnabled" getByRole('dialog', { name: '保存工作区 Save workspace' }).locator('[data-dialog-action="cancel"]') with timeout 10000ms
  - waiting for getByRole('dialog', { name: '保存工作区 Save workspace' }).locator('[data-dialog-action="cancel"]')
    23 × locator resolved to <button aria-busy="true" aria-disabled="true" data-is-loading="true" data-dialog-action="cancel" class="rc-button-23b6d8dff9fb rc-button-54238a99f7f1 rc-button-a18299f45118 rc-button-e332475f25aa rc-dialog-de0625c12145">…</button>
       - unexpected value "disabled"

```

```yaml
- button "取消" [disabled]
```

# Test source

```ts
  1  | import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from "../../../test/visual/component-fixture.mjs";
  2  | 
  3  | test.use({ video: "on" });
  4  | const spec = await readVisualSpec(import.meta.url);
  5  | for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) for (const state of spec.states.filter(value => value.startsWith("pending-"))) {
  6  |     const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.densities.includes(density) && spec.crossEngine.states.includes(state);
  7  |     test(`${config.designSystem} ${config.colorMode} ${size} ${density} ${state}`, { tag: ["@rc-dialog", "@matrix", ...(!crossEngine ? ["@chromium-only"] : [])], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state }) } }, async ({ page, previewOrigin }, info) => {
  8  |         await openDemo(page, previewOrigin, "rc-dialog", spec.demo, { ...config, size, density });
  9  |         await page.getByLabel("验收状态", { exact: true }).selectOption(state);
  10 |         const trigger = page.getByRole("button", { name: "打开验收对话框", exact: true }); await trigger.click();
  11 |         const dialog = page.getByRole("dialog", { name: "保存工作区 Save workspace" }); await expect(dialog).toBeVisible();
  12 |         const action = state === "pending-confirm" ? "confirm" : "cancel", sibling = action === "confirm" ? "cancel" : "confirm";
  13 |         const initiator = dialog.locator(`[data-dialog-action="${action}"]`), other = dialog.locator(`[data-dialog-action="${sibling}"]`);
  14 |         await dialog.getByRole("textbox", { name: "工作区名称", exact: true }).focus();
  15 |         await page.keyboard.press("Tab"); if (action === "confirm") await page.keyboard.press("Tab");
  16 |         await expect(initiator).toBeFocused(); await initiator.press("Enter");
  17 |         await expect(dialog).toHaveAttribute("aria-busy", "true"); await expect(initiator).toHaveAttribute("data-is-loading", "true");
> 18 |         await expect(initiator).toBeFocused(); expect(await initiator.evaluate(node => node.matches(":focus-visible"))).toBe(true); await expect(initiator).toBeEnabled(); await expect(initiator).toHaveAttribute("aria-disabled", "true"); await expect(other).toBeDisabled(); await expect(dialog.getByRole("button").first()).toBeDisabled();
     |                                                                                                                                                             ^ Error: expect(locator).toBeEnabled() failed
  19 |         await initiator.press("Enter"); await page.keyboard.press("Escape");
  20 |         await expect(dialog).toBeVisible(); await expect(dialog.getByLabel("异步请求次数", { exact: true })).toHaveText("1"); await expect(initiator).toBeFocused();
  21 |         await settleFiniteAnimations(page);
  22 |         for (let frame = 0; frame < 2; frame++) { await page.waitForTimeout(250); await info.attach(`natural-${state}-frame-${frame}`, { body: await page.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" }); }
  23 |         await dialog.getByRole("button", { name: "完成异步请求", exact: true }).click();
  24 |         await expect(dialog).not.toHaveAttribute("aria-busy", "true"); await expect(dialog).toBeVisible(); await expect(other).toBeEnabled();
  25 |         await dialog.locator('[data-dialog-action="cancel"]').click(); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
  26 |     });
  27 | }
  28 | 
```