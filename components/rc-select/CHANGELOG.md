# @crab-dev/rc-select

## 0.1.2

### Patch Changes

- [`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a) Thanks [@hotlif](https://github.com/hotlif)! - MD3 默认采用紧凑桌面几何与上置标签：继承尺寸的按钮为 32/36/40px，单行字段为 32/40/48px，Tab 为 32/36/40px。显式 Button Expressive 五档保持不变；多行内容仍由 rows/autoSize 决定高度，触控目标至少 48px，并在粗指针布局中预留空间以避免相邻操作重叠。
  
  修正三主题字段标签宽度和 MD3 桌面 Switch 留白。公共 props、值与事件语义保持一致；依赖旧浮动标签、轮廓缺口或固定高度的自定义 CSS 需按迁移指南调整。
- Updated dependencies [[`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a)]:
  - @crab-dev/rc-button@1.0.2
  - @crab-dev/rc-line-edit@0.1.2
  - @crab-dev/rc-token-semantic@1.1.0

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce) Thanks [@hotlif](https://github.com/hotlif)! - 精修三体系控件反馈：浮动标签、分段标记及文字位置连续过渡，分离开关各部件与滑块光晕的空间和颜色反馈，将零散时序集中到组件令牌。保留开关 root.transition 覆盖，减少动画时保留必要的焦点、选中与加载反馈。

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Keep the popup indicator out of the page Tab sequence so keyboard users move directly between fields. Preserve the independent clear action's keyboard access.
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`ab93160`](https://github.com/hotlif/crab-dev/commit/ab93160f53925f875c66bfabf871766e9e919af3), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`cb1361d`](https://github.com/hotlif/crab-dev/commit/cb1361d1e5fec7f6f73a10b48883d698aad729bd), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-token-semantic@1.0.1
  - @crab-dev/rc-dropdown-container@0.1.1
  - @crab-dev/rc-config-provider@0.1.1
  - @crab-dev/rc-line-edit@0.1.1
  - @crab-dev/rc-hooks@0.1.1
  - @crab-dev/rc-button@1.0.1
  - @crab-dev/rc-spin@0.1.1

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 补齐选择、导航和浮层的三体系规格、公开示例与包内 Playwright 状态矩阵，覆盖真实键盘、Portal 配置与草稿保留。颜色面板的轨道、宽度与操作间距归入组件令牌，窄屏操作区支持换行，强制颜色下保留清晰的触发器焦点边界。
  
  恢复颜色选择器公开的 showEyeDropper 屏幕取色入口，按所属浏览器能力显示，取消或拒绝不改值，卸载中止原生取色会话。
  
  补充水平与折叠菜单真实展开、Dialog 确认/取消 pending 动态场景，以及 Drawer 包公开的 iframe/Shadow DOM 组合示例；分别记录共享底层回归与真实浏览器验收范围，保留未运行、未复审部分。

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Restore focus after an accepted keyboard tab close, position Select popups outside their own supporting text, preserve design-specific disabled placeholders, and keep menu focus and color trigger feedback visible. Fix the appointment dialog example to retain Form's grid layout.
  
  Register dropdown Escape layers when delayed Portal elements actually mount, and preserve explicit close reasons and native events through consumer dispatch.
  
  Use the date placeholder for the appointment form's empty state instead of presenting a fake selected value.
- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-dropdown-container@0.1.0
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-tag@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-checkbox@0.1.0
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-line-edit@0.1.0
  - @crab-dev/rc-spin@0.1.0
  - @crab-dev/rc-token-semantic@1.0.0
  - @crab-dev/rc-virtual@0.2.0

## 0.0.5

### Patch Changes

- [`3a32293`](https://github.com/hotlif/crab-dev/commit/3a32293c30ac0e77d5f0a6fa0e2173e9293cd462) Thanks [@hotlif](https://github.com/hotlif)! - Use cached axis metrics, binary-search range lookup, configurable overscan, and animation-frame coalescing to reduce virtual scrolling work.

- [`01b9bde`](https://github.com/hotlif/crab-dev/commit/01b9bde4201bf08eced59f222a53bb3d018460e3) Thanks [@hotlif](https://github.com/hotlif)! - Remove the extra leading line box before the first virtualized select option.
- Updated dependencies [[`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0), [`3a32293`](https://github.com/hotlif/crab-dev/commit/3a32293c30ac0e77d5f0a6fa0e2173e9293cd462), [`f991b0e`](https://github.com/hotlif/crab-dev/commit/f991b0eede1ead4d70534302bd51f47b0a4ab143)]:
  - @crab-dev/rc-button@0.0.3
  - @crab-dev/rc-virtual@0.1.4
  - @crab-dev/rc-dropdown-container@0.0.5
  - @crab-dev/rc-line-edit@0.0.5
  - @crab-dev/rc-spin@0.0.4
  - @crab-dev/rc-checkbox@0.0.4
  - @crab-dev/rc-config-provider@0.0.2
  - @crab-dev/rc-tag@0.0.3
