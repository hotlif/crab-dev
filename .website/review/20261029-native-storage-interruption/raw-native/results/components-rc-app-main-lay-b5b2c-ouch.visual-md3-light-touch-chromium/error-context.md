# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-app-main-layout\docs\app-main-layout-touch.visual.spec.mjs >> md3 light touch
- Location: components\rc-app-main-layout\docs\app-main-layout-touch.visual.spec.mjs:16:5

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 48
Received:    36
```

# Page snapshot

```yaml
- region "AppMainLayout visual matrix" [ref=e5]:
  - generic [ref=e6]:
    - complementary [ref=e7]:
      - generic [ref=e8]:
        - generic [aria-hidden] [ref=e10]: ◈
        - generic [ref=e11]: Crab 专业工作区
      - list [ref=e13]:
        - listitem [ref=e14] [cursor=pointer]:
          - button "概览 Overview" [ref=e15]
        - listitem [ref=e17] [cursor=pointer]:
          - button "订单 Orders" [ref=e18]
    - generic [ref=e20]:
      - generic [ref=e21]:
        - tablist "已打开页面" [ref=e23]:
          - tab "概览 Overview" [selected] [ref=e24] [cursor=pointer]
          - tab "订单 Orders" [ref=e29] [cursor=pointer]
          - button "关闭标签页" [ref=e34] [cursor=pointer]
        - generic [ref=e40]:
          - button "切换侧边栏" [expanded] [ref=e41] [cursor=pointer]
          - button "通知" [ref=e45] [cursor=pointer]
          - button "张维 / Wei Zhang" [ref=e52] [cursor=pointer]:
            - generic [ref=e55]:
              - generic [ref=e56]:
                - generic "张维 / Wei Zhang" [ref=e57]
                - generic "系统管理员 / Administrator" [ref=e58]
              - generic [ref=e60]: 张
      - region "工作区页面" [ref=e61]:
        - tabpanel "概览 Overview" [ref=e62]:
          - generic [ref=e63]:
            - heading "概览 Overview" [level=2] [ref=e64]
            - generic [ref=e65]:
              - generic [ref=e66]: 工作备注
              - generic [ref=e68]:
                - group [aria-hidden]
                - textbox "工作备注" [ref=e69]:
                  - /placeholder: 保留当前草稿 / Keep this draft
```

# Test source

```ts
  1  | import {
  2  |     test,
  3  |     expect,
  4  |     configurations,
  5  |     openDemo,
  6  |     readVisualSpec,
  7  |     settleFiniteAnimations,
  8  |     captureVisual,
  9  |     environmentCases,
  10 |     applyEnvironment,
  11 | } from '../../../test/visual/component-fixture.mjs';
  12 | const spec = await readVisualSpec(import.meta.url),
  13 |     environment = environmentCases.find((item) => item.id === 'touch');
  14 | test.use({ hasTouch: environment.hasTouch });
  15 | for (const config of configurations)
  16 |     test(
  17 |         `${config.designSystem} ${config.colorMode} touch`,
  18 |         {
  19 |             tag: ['@rc-app-main-layout', '@environment', '@chromium-only'],
  20 |             annotation: { type: 'environment', description: JSON.stringify({ id: environment.id, ...config }) },
  21 |         },
  22 |         async ({ page, browserName, previewOrigin }, info) => {
  23 |             await applyEnvironment(page, environment);
  24 |             await openDemo(page, previewOrigin, 'rc-app-main-layout', spec.demo, config);
  25 |             expect(await page.evaluate(() => globalThis.matchMedia('(pointer:coarse)').matches)).toBe(true);
  26 |             const scene = page.getByRole('region', { name: 'AppMainLayout visual matrix' });
  27 |             await expect(scene.getByRole('button', { name: '张维 / Wei Zhang', exact: true })).toBeVisible();
  28 |             const toggle = scene.getByRole('button', { name: '切换侧边栏', exact: true });
> 29 |             expect((await toggle.boundingBox()).height).toBeGreaterThanOrEqual(48);
     |                                                         ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  30 |             await toggle.tap();
  31 | 
  32 |             await settleFiniteAnimations(page);
  33 |             await captureVisual(scene, `${config.designSystem}-${config.colorMode}-touch.png`, info, browserName);
  34 |         },
  35 |     );
  36 | 
```