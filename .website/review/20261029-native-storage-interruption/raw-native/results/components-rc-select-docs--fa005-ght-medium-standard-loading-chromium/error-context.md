# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-select\docs\select-motion.visual.spec.mjs >> md3 light medium standard loading
- Location: components\rc-select\docs\select-motion.visual.spec.mjs:5:107

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByRole('combobox', { name: '团队', exact: true })
Expected: "true"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" getByRole('combobox', { name: '团队', exact: true }) with timeout 10000ms
  - waiting for getByRole('combobox', { name: '团队', exact: true })

```

```yaml
- region "Select visual matrix":
  - text: 验收状态
  - combobox "验收状态":
    - option "default"
    - option "error"
    - option "warning"
    - option "disabled"
    - option "multiple"
    - option "empty"
    - option "loading" [selected]
  - text: 团队 Team
  - combobox "团队 Team":
    - text: 搜索或选择团队
    - button "展开选项"
  - text: 选择负责本次交付的团队。 填充团队
  - combobox "填充团队":
    - text: 设计 Design
    - button "展开选项"
  - text: 同一配置边界内的填充外观。
  - status "状态说明": 配置切换保留当前选择和输入草稿。
```

# Test source

```ts
  1  | import { test, expect, configurations, openDemo, readVisualSpec } from "../../../test/visual/component-fixture.mjs";
  2  | 
  3  | test.use({ video: "on" });
  4  | const spec = await readVisualSpec(import.meta.url);
  5  | for (const config of configurations) for (const size of spec.sizes) for (const density of spec.densities) test(`${config.designSystem} ${config.colorMode} ${size} ${density} loading`, { tag: ["@rc-select", "@matrix", "@chromium-only"], annotation: { type: "matrix", description: JSON.stringify({ ...config, size, density, state: "loading" }) } }, async ({ page, previewOrigin }, info) => {
  6  |     await openDemo(page, previewOrigin, "rc-select", spec.demo, { ...config, size, density });
  7  |     await page.getByLabel("验收状态", { exact: true }).selectOption("loading");
> 8  |     const field = page.getByRole("combobox", { name: "团队", exact: true }); await expect(field).toHaveAttribute("aria-busy", "true");
     |                                                                                                ^ Error: expect(locator).toHaveAttribute(expected) failed
  9  |     await field.click({ position: { x: 12, y: 12 } }); await expect(page.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
  10 |     for (let frame = 0; frame < 2; frame++) { await page.waitForTimeout(250); await info.attach(`natural-loading-frame-${frame}`, { body: await page.screenshot({ animations: "allow", caret: "hide" }), contentType: "image/png" }); }
  11 | });
  12 | 
```