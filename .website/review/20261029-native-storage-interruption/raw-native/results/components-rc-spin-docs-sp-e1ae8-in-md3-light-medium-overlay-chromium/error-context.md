# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-spin\docs\spin-motion.visual.spec.mjs >> Spin md3 light medium overlay
- Location: components\rc-spin\docs\spin-motion.visual.spec.mjs:8:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-visual-frame]').getByRole('switch')
Expected: 0
Received: 1
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" locator('[data-visual-frame]').getByRole('switch') with timeout 10000ms
  - waiting for locator('[data-visual-frame]').getByRole('switch')
    23 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- region "Spin visual matrix" [ref=e5]:
  - generic [ref=e6]:
    - text: 验收状态
    - combobox "验收状态" [ref=e7]:
      - option "default"
      - option "expressive"
      - option "overlay" [selected]
      - option "idle"
      - option "delayed"
      - option "custom"
  - generic [ref=e9]:
    - generic [ref=e11]:
      - paragraph [ref=e12]: 项目草稿
      - generic [ref=e13] [cursor=pointer]:
        - switch "允许编辑" [ref=e14]
        - generic [ref=e16]: 允许编辑
    - generic:
      - status:
        - generic: 正在刷新项目列表，保留当前编辑草稿
```

# Test source

```ts
  1  | import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations, captureVisual } from "../../../test/visual/component-fixture.mjs";
  2  | 
  3  | // Continuous progress feedback is never stopped for a snapshot comparison.
  4  | test.use({ video: "on" });
  5  | const spec = await readVisualSpec(import.meta.url);
  6  | for (const config of configurations) for (const size of spec.sizes) for (const state of spec.states) {
  7  |     const crossEngine = spec.crossEngine.sizes.includes(size) && spec.crossEngine.states.includes(state);
  8  |     test(`Spin ${config.designSystem} ${config.colorMode} ${size} ${state}`, {
  9  |         tag: ["@rc-spin", "@matrix", "@motion", ...(!crossEngine ? ["@chromium-only"] : [])],
  10 |         annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density: "standard", state }) },
  11 |     }, async ({ page, browserName, previewOrigin }, info) => {
  12 |         await openDemo(page, previewOrigin, "rc-spin", spec.demo, { ...config, size });
  13 |         await page.getByLabel("验收状态", { exact: true }).selectOption(state);
  14 |         const frame = page.locator("[data-visual-frame]");
  15 |         const status = frame.getByRole("status");
  16 |         if (state === "delayed") {
  17 |             await expect(status).toHaveCount(0);
  18 |             await page.getByRole("switch", { name: "Start delayed request" }).click();
  19 |             await expect(status).toHaveCount(0);
  20 |         }
  21 |         if (state === "idle") {
  22 |             await expect(status).toHaveCount(0);
  23 |             await expect(frame.locator("[aria-busy]")).toHaveAttribute("aria-busy", "false");
  24 |             await expect(frame.getByRole("switch")).toBeEnabled();
  25 |         } else {
  26 |             await expect(status).toBeVisible();
  27 |             await expect(status).toHaveAttribute("aria-live", "polite");
  28 |             if (state === "expressive") await expect(status.locator('[data-indicator="expressive"]')).toBeVisible();
  29 |             if (state === "overlay") {
  30 |                 await expect(frame.locator("[aria-busy]")).toHaveAttribute("aria-busy", "true");
  31 |                 expect(await frame.locator("[inert]").evaluate(node => node.inert)).toBe(true);
> 32 |                 await expect(frame.getByRole("switch")).toHaveCount(0);
     |                                                         ^ Error: expect(locator).toHaveCount(expected) failed
  33 |             }
  34 |         }
  35 |         await settleFiniteAnimations(page);
  36 |         if (["idle", "custom"].includes(state)) {
  37 |             await captureVisual(frame, `${config.designSystem}-${config.colorMode}-${size}-${state}.png`, info, browserName);
  38 |         } else {
  39 |             const sequence = [];
  40 |             for (let index = 0; index < 4; index += 1) {
  41 |                 sequence.push(await status.evaluate(node => [...node.getAnimations({ subtree: true })].map(animation => ({ currentTime: animation.currentTime, duration: animation.effect?.getTiming().duration, iterations: animation.effect?.getTiming().iterations }))));
  42 |                 await info.attach(`activity-${index}`, { body: await frame.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" });
  43 |                 await page.waitForTimeout(160);
  44 |             }
  45 |             expect(sequence.some(frame => frame.some(animation => animation.iterations === Infinity))).toBe(true);
  46 |             await info.attach("activity-sequence", { body: JSON.stringify(sequence), contentType: "application/json" });
  47 |         }
  48 |     });
  49 | }
  50 | 
```