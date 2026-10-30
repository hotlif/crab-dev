# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-spin\docs\spin-environment.visual.spec.mjs >> Spin md3 light reduced-motion >> activity remains visible and contained
- Location: components\rc-spin\docs\spin-environment.visual.spec.mjs:9:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- region "Spin visual matrix" [ref=e5]:
  - generic [ref=e6]:
    - text: 验收状态
    - combobox "验收状态" [ref=e7]:
      - option "default" [selected]
      - option "expressive"
      - option "overlay"
      - option "idle"
      - option "delayed"
      - option "custom"
  - status [ref=e10]:
    - generic [ref=e14]: 正在刷新项目列表，保留当前编辑草稿
```

# Test source

```ts
  1  | import { test, expect, configurations, openDemo, readVisualSpec, environmentCases, applyEnvironment, settleFiniteAnimations } from "../../../test/visual/component-fixture.mjs";
  2  | import { assertSpinGeometry } from './visual-geometry.mjs';
  3  | 
  4  | test.use({ video: "on" });
  5  | const spec = await readVisualSpec(import.meta.url);
  6  | const scenarios = environmentCases.filter(scenario => !scenario.hasTouch);
  7  | for (const config of configurations) for (const scenario of scenarios) {
  8  |     test.describe(`Spin ${config.designSystem} ${config.colorMode} ${scenario.id}`, () => {
  9  |         test("activity remains visible and contained", { tag: ["@rc-spin", "@environment", "@chromium-only"], annotation: { type: "environment", description: JSON.stringify({ id: scenario.id, ...config }) } }, async ({ page, previewOrigin }, info) => {
  10 |             await openDemo(page, previewOrigin, "rc-spin", spec.demo, { ...config, ...scenario.config });
  11 |             await applyEnvironment(page, scenario);
  12 |             const frame = page.locator("[data-visual-frame]");
  13 |             const status = frame.getByRole("status");
  14 |             await expect(status).toBeVisible();
  15 |             expect(await frame.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  16 |             await settleFiniteAnimations(page);
  17 |             const content = await assertSpinGeometry(frame);
  18 |             const sequence = [];
  19 |             for (let index = 0; index < 4; index += 1) {
  20 |                 sequence.push(await status.evaluate(node => node.getAnimations({ subtree: true }).map(animation => ({ name: animation.animationName, currentTime: animation.currentTime }))));
  21 |                 await info.attach(`activity-${index}`, { body: await frame.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" });
  22 |                 await page.waitForTimeout(160);
  23 |             }
> 24 |             if (scenario.media?.reducedMotion) expect(sequence.flat().some(animation => animation.name === "rc-spin-breathe")).toBe(true);
     |                                                                                                                                ^ Error: expect(received).toBe(expected) // Object.is equality
  25 |             await info.attach("environment", { body: JSON.stringify({ scenario, sequence, content }), contentType: "application/json" });
  26 |         });
  27 |     });
  28 | }
  29 | 
  30 | test("configuration changes preserve wrapped content and its selected value", { tag: ["@rc-spin", "@boundary", "@chromium-only"] }, async ({ page, previewOrigin }) => {
  31 |     await openDemo(page, previewOrigin, "rc-spin", spec.demo, configurations[0]);
  32 |     await page.getByLabel("验收状态", { exact: true }).selectOption("idle");
  33 |     const control = page.locator("[data-visual-frame]").getByRole("switch");
  34 |     await control.click();
  35 |     const original = await control.elementHandle();
  36 |     for (const config of configurations) {
  37 |         await page.evaluate(configuration => globalThis.postMessage({ type: "crab:preview-config", ...configuration, size: "large", density: "comfortable", locale: "en-US", direction: "rtl" }, globalThis.location.origin), config);
  38 |         await expect(page.locator(".demo-default-preview").first()).toHaveAttribute("data-crab-design", config.designSystem);
  39 |         expect(await original.evaluate(node => node.isConnected)).toBe(true);
  40 |         await expect(control).toBeChecked();
  41 |     }
  42 | });
  43 | 
```