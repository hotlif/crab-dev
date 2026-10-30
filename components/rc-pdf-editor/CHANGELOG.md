# @crab-dev/rc-pdf-editor

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep PDF thumbnail focus outlines inside the virtual column without changing its row geometry, including selected pages and RTL. Share outline width and offset with the row's reserved space.
  
  Use theme-aware semantic text and edge colors in Canvas and FlowDiagram examples. Start the Transformer example with all shapes visible and retain viewport changes while selecting and transforming shapes.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 补充专业组件三体系的桌面扩展规格、公开入口 Demo 与 Playwright 状态矩阵。图表图例补齐真实按下反馈，提示使用三体系浮层边界；图例和提示间距通过 L3 令牌继承密度，Realm 的反馈样式与远程加载状态机分离。PDF 和流程图的领域坐标保持原有协议，并提供加载、失败、编辑、键盘及配置切换的实际引擎场景。
  
  Realm 新增同源 script / ESM 网络入口与真正 Web Component 示例，使用现有生产加载协议，核对远程属性更新、Shadow DOM 草稿、网络失败重试和卸载。预注册容器、网络入口和实际自定义元素分别记录覆盖；场景发现和默认测试不代替候选截图复审。
  
  修复 BarChart 图例与提示引用静态 space 导致三档密度相同的问题，改为消费 L2 density 节奏角色，保留 standard 间距及绘图坐标、柱宽和数据；增加真实浏览器几何不变量回归。
  
  补齐 Flow 真实画布呈现及公开 fit/pan/domain zoom/PNG 导出场景。PDF 增加带原许可的真实字体与固定文档/图片资源，覆盖实际文本、图像、变换历史、绘图、保存导出、工具栏和区域插件；独立 Web Component 继续使用同一生产产物与内嵌运行时，WASM loading 补齐三尺寸三密度自然动画矩阵。旧示例改用公开入口与公开资源，移除隐式 Demo helper 依赖。
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-canvas@0.1.0
  - @crab-dev/rc-color-picker@0.1.0
  - @crab-dev/rc-auto-sizer@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-checkbox@0.1.0
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-dialog@0.1.0
  - @crab-dev/rc-line-edit@0.1.0
  - @crab-dev/rc-number-edit@0.1.0
  - @crab-dev/rc-select@0.1.0
  - @crab-dev/rc-spin@0.1.0
  - @crab-dev/rc-text-edit@0.1.0
  - @crab-dev/rc-theme@0.1.0
  - @crab-dev/rc-token-semantic@1.0.0
  - @crab-dev/rc-tooltip@0.1.0
  - @crab-dev/rc-tree@0.2.0
  - @crab-dev/rc-virtual@0.2.0

## 0.0.2

### Patch Changes

- Updated dependencies [[`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0), [`3a32293`](https://github.com/hotlif/crab-dev/commit/3a32293c30ac0e77d5f0a6fa0e2173e9293cd462), [`01b9bde`](https://github.com/hotlif/crab-dev/commit/01b9bde4201bf08eced59f222a53bb3d018460e3), [`7b3b40e`](https://github.com/hotlif/crab-dev/commit/7b3b40e6318be339f5ea5e16fe85e9be76477696)]:
  - @crab-dev/rc-button@0.0.3
  - @crab-dev/rc-virtual@0.1.4
  - @crab-dev/rc-select@0.0.5
  - @crab-dev/rc-token-semantic@0.0.4
  - @crab-dev/rc-color-picker@0.0.4
  - @crab-dev/rc-dialog@0.0.3
  - @crab-dev/rc-line-edit@0.0.5
  - @crab-dev/rc-number-edit@0.0.3
  - @crab-dev/rc-spin@0.0.4
  - @crab-dev/rc-text-edit@0.0.2
  - @crab-dev/rc-checkbox@0.0.4
  - @crab-dev/rc-config-provider@0.0.2
  - @crab-dev/rc-theme@0.0.2
  - @crab-dev/rc-tree@0.1.4
