# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components\rc-component-preview\docs\preview-loading.visual.spec.mjs >> md3 light standard loading
- Location: components\rc-component-preview\docs\preview-loading.visual.spec.mjs:9:5

# Error details

```
Error: route.continue: Route is already handled!
```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('region', { name: 'ComponentPreview visual matrix' }).getByRole('status').filter({ hasText: /^(正在加载源码高亮…|Loading syntax highlighting…)$/ })
Expected: 0
Received: 1

Call log:
  - Expect "toHaveCount" getByRole('region', { name: 'ComponentPreview visual matrix' }).getByRole('status').filter({ hasText: /^(正在加载源码高亮…|Loading syntax highlighting…)$/ }) with timeout 30000ms
  - waiting for getByRole('region', { name: 'ComponentPreview visual matrix' }).getByRole('status').filter({ hasText: /^(正在加载源码高亮…|Loading syntax highlighting…)$/ })
    6 × locator resolved to 1 element
      - unexpected value "1"
  - Test ended.

```

# Page snapshot

```yaml
- region "ComponentPreview visual matrix" [ref=e5]:
  - generic [ref=e6]:
    - text: 源码配色
    - combobox "源码配色" [ref=e7]:
      - option "light" [selected]
      - option "dark"
  - generic [ref=e8]:
    - checkbox "拒绝复制" [ref=e9]
    - text: 拒绝复制
  - article [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]: 工作区预览
      - paragraph [ref=e15]:
        - text: 较长的说明应在预览宽度内换行。
        - strong [ref=e16]: 保留当前业务草稿。
    - generic [ref=e19]:
      - text: 业务草稿
      - textbox "业务草稿" [ref=e20]: Draft remains during the actual pending import
    - group "预览操作" [ref=e21]:
      - button "复制代码" [ref=e22] [cursor=pointer]:
        - generic [ref=e28]: 复制
      - button "收起源码" [expanded] [active] [pressed] [ref=e29] [cursor=pointer]:
        - generic [ref=e35]: 收起
      - button "在新窗口打开" [ref=e36] [cursor=pointer]:
        - generic [ref=e43]: 新窗口
    - status [ref=e47]: 正在加载源码高亮…
  - status "操作结果"
```

# Test source

```ts
  1  | import { expect } from '../../../test/visual/component-fixture.mjs';
  2  | 
  3  | export const sourceToggle = scene => scene.getByRole('button', { name: /^(查看源码|收起源码|Show source|Hide source)$/ });
  4  | export const sourceLoading = scene => scene.getByRole('status').filter({ hasText: /^(正在加载源码高亮…|Loading syntax highlighting…)$/ });
  5  | 
  6  | export async function highlightedSource(scene) {
  7  |     await expect(sourceToggle(scene)).toHaveAttribute('aria-expanded', 'true');
  8  |     // The complete Prism language module graph is lazy. Cold local production
  9  |     // routes may still be importing after the panel itself has expanded.
> 10 |     await expect(sourceLoading(scene)).toHaveCount(0, { timeout: 30_000 });
     |                                        ^ Error: expect(locator).toHaveCount(expected) failed
  11 |     const code = scene.locator('pre > code.language-tsx');
  12 |     await expect(code).toBeVisible();
  13 |     await expect(code).toContainText('export function Workspace');
  14 |     // The real Prism renderer splits syntax into tokens. Raw source text alone
  15 |     // cannot prove the lazy highlighter has finished rendering its output.
  16 |     await expect(code.locator('.token').filter({ hasText: /^export$/ }).first()).toBeVisible();
  17 |     return code;
  18 | }
  19 | 
  20 | export async function assertToolbarReachable(scene, page, info) {
  21 |     const actions = scene.getByRole('group', { name: /^(预览操作|Preview actions)$/ }).getByRole('button');
  22 |     await expect(actions).toHaveCount(3);
  23 |     const geometry = [];
  24 |     for (const action of await actions.all()) {
  25 |         await action.scrollIntoViewIfNeeded();
  26 |         await expect(action).toBeVisible();
  27 |         await expect(action).toBeEnabled();
  28 |         const bounds = await action.evaluate(node => {
  29 |             const rect = node.getBoundingClientRect();
  30 |             const hit = node.ownerDocument.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
  31 |             return { name: node.getAttribute('aria-label'), x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom,
  32 |                 viewportWidth: globalThis.innerWidth, viewportHeight: globalThis.innerHeight, hit: hit === node || node.contains(hit) };
  33 |         });
  34 |         geometry.push(bounds);
  35 |         expect(bounds.x).toBeGreaterThanOrEqual(0);
  36 |         expect(bounds.y).toBeGreaterThanOrEqual(0);
  37 |         expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth + 1);
  38 |         expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight + 1);
  39 |         expect(bounds.hit).toBe(true);
  40 |     }
  41 |     const document = await page.evaluate(() => ({ client: globalThis.document.documentElement.clientWidth, scroll: globalThis.document.documentElement.scrollWidth }));
  42 |     await info.attach('preview-toolbar-geometry', { body: JSON.stringify({ actions: geometry, document }), contentType: 'application/json' });
  43 |     expect(document.scroll).toBeLessThanOrEqual(document.client + 1);
  44 | }
  45 | 
  46 | export async function inspectSourceScroll(scene, page, info, { touch = false } = {}) {
  47 |     const pre = scene.locator('pre');
  48 |     const scrollport = pre.locator('..');
  49 |     await scrollport.scrollIntoViewIfNeeded();
  50 |     const geometry = await scrollport.evaluate(node => ({ client: node.clientWidth, scroll: node.scrollWidth, overflow: globalThis.getComputedStyle(node).overflowX }));
  51 |     expect(geometry.client).toBeGreaterThan(0);
  52 |     const overflowing = geometry.scroll > geometry.client + 1;
  53 |     if (overflowing) {
  54 |         expect(['auto', 'scroll']).toContain(geometry.overflow);
  55 |         if (!touch) {
  56 |             await scrollport.hover();
  57 |             // A real horizontal wheel gesture moves this code-owned scrollport.
  58 |             // Keep the document fixed and never crop or hide the source text.
  59 |             const direction = await scrollport.evaluate(node => globalThis.getComputedStyle(node).direction === 'rtl' ? -1 : 1);
  60 |             await page.mouse.wheel(direction * geometry.scroll, 0);
  61 |             await expect.poll(() => scrollport.evaluate(node => Math.abs(node.scrollLeft))).toBeGreaterThan(0);
  62 |         }
  63 |     }
  64 |     await info.attach('preview-source-scroll', { body: JSON.stringify({ ...geometry, overflowing, input: overflowing ? touch ? 'touch pan not exercised; tap actions covered separately' : 'native horizontal wheel' : 'source fits; no horizontal scroll required' }), contentType: 'application/json' });
  65 | }
  66 | 
```