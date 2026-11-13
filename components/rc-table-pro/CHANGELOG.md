# @crab-dev/rc-table-pro

## 0.3.0

### Minor Changes

- [`f15301a`](https://github.com/hotlif/crab-dev/commit/f15301a7391d7304420f3d7532a4f55b3500ec36) Thanks [@hotlif](https://github.com/hotlif)! - 新增 React 19 ref 接口 TableProHandle.refresh()，由组件重新请求当前分页、筛选和排序下的数据，保留已有数据与表格实例。Promise 支持等待刷新及页码越界后的回退请求；加载失败时拒绝并报告 onError，被后续请求替代或卸载时以 AbortError 拒绝。内置刷新、自动刷新与数据重试共用请求链路，不新增 refreshKey 属性。

- [`f15301a`](https://github.com/hotlif/crab-dev/commit/f15301a7391d7304420f3d7532a4f55b3500ec36) Thanks [@hotlif](https://github.com/hotlif)! - 为 Table 和 TablePro 的 React 19 ref 增加 scrollToRow(rowId, options) 与 focus()。定位按当前视图中的行 ID 查找，支持 nearest/start/center/end 对齐，保留横向滚动、查询、选择和展开状态；Promise 等虚拟滚动提交后返回是否找到目标，被替代或卸载时以 AbortError 拒绝。TablePro 支持刷新完成后立即定位新数据。focus 恢复有效的内部焦点或表格入口，不修改选择或滚动位置。

### Patch Changes

- [`f15301a`](https://github.com/hotlif/crab-dev/commit/f15301a7391d7304420f3d7532a4f55b3500ec36) Thanks [@hotlif](https://github.com/hotlif)! - 修复 TablePro 侧边工具栏统一使用大尺寸圆形按钮的问题，按 MD3、macOS 和 shadcn 的按钮尺寸、形状与语义选中颜色呈现，并保留触屏命中区域和 RTL 分隔边界。
  
  进一步收紧桌面侧栏：工具按钮采用 24–28px 视觉尺寸和 2px 间距，压缩面板首尾操作区，触屏仍保留 48px 命中空间。
- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`f15301a`](https://github.com/hotlif/crab-dev/commit/f15301a7391d7304420f3d7532a4f55b3500ec36)]:
  - @crab-dev/rc-button@1.0.3
  - @crab-dev/rc-table@0.2.0
  - @crab-dev/rc-checkbox@0.1.1
  - @crab-dev/rc-date-picker@0.1.2
  - @crab-dev/rc-config-provider@1.0.0
  - @crab-dev/rc-dropdown-container@0.1.2
  - @crab-dev/rc-line-edit@0.1.3
  - @crab-dev/rc-pagination@0.1.2
  - @crab-dev/rc-spin@0.1.2
  - @crab-dev/rc-tree@0.2.2

## 0.2.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Render the search bar when pagination is enabled, including top, bottom and both placements. Preserve search state and input identity across design, color mode and locale changes.
- Updated dependencies [[`ab93160`](https://github.com/hotlif/crab-dev/commit/ab93160f53925f875c66bfabf871766e9e919af3), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-dropdown-container@0.1.1
  - @crab-dev/rc-config-provider@0.1.1
  - @crab-dev/rc-line-edit@0.1.1
  - @crab-dev/rc-button@1.0.1
  - @crab-dev/rc-pagination@0.1.1
  - @crab-dev/rc-spin@0.1.1
  - @crab-dev/rc-tree@0.2.1
  - @crab-dev/rc-table@0.1.1

## 0.2.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep the Table grid focus indicator inside its viewport and above sticky cells without changing virtual geometry. Hide conflicting empty content while TablePro requests load or fail, retaining existing rows during refresh. Make Masonry's default gutter follow density using the same resolved CSS value for visual spacing and measured layout; explicit gutters remain authoritative.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 为数据、排版与工作区组件提供固定数据的三体系验收示例、尺寸/密度/状态规格和 Playwright 场景。专业表格的列请求及数据请求错误现在以可被辅助技术通告的 alert 呈现，保留已有数据与重试能力。澄清 Prose invert 使用当前主题的 inverse 配对色。
  
  补齐真实可点击行的悬停、专业表格公开编辑器、列错误与完整刷新/失败重试场景。虚拟滚动同时检查后续内容进入视口和渲染范围非空、有界，避免仅首项消失就误判通过。

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Contain table paint layers so fixed-column shadows, focus outlines and virtual scrollbars stay beneath an open narrow-container sidebar.
- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-dropdown-container@0.1.0
  - @crab-dev/rc-auto-sizer@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-checkbox@0.1.0
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-date-picker@0.1.0
  - @crab-dev/rc-line-edit@0.1.0
  - @crab-dev/rc-pagination@0.1.0
  - @crab-dev/rc-spin@0.1.0
  - @crab-dev/rc-table@0.1.0
  - @crab-dev/rc-tree@0.2.0

## 0.1.3

### Patch Changes

- Updated dependencies [[`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0), [`7b3b40e`](https://github.com/hotlif/crab-dev/commit/7b3b40e6318be339f5ea5e16fe85e9be76477696)]:
  - @crab-dev/rc-button@0.0.3
  - @crab-dev/rc-table@0.0.3
  - @crab-dev/rc-date-picker@0.0.4
  - @crab-dev/rc-line-edit@0.0.5
  - @crab-dev/rc-spin@0.0.4
  - @crab-dev/rc-pagination@0.0.3
  - @crab-dev/rc-checkbox@0.0.4
  - @crab-dev/rc-config-provider@0.0.2
  - @crab-dev/rc-tree@0.1.4
