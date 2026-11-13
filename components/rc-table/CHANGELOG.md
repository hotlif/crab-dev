# @crab-dev/rc-table

## 0.2.0

### Minor Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 校准 macOS Tahoe 桌面工作区的公共视觉尺度：正文采用 13px 系统字体，单行字段改为 28/32/36px，控件统一 8px 轮廓；标题和数据表头降低字重。表格默认保留水平分隔，减少正文纵向网格。调整结构分隔线、字段内阴影、按钮高光和导航/浮层玻璃材质，避免固定斜向高光和厚重的灰色面板。
  
  这些规则通过公共主题与令牌应用到相关组件及组合控件。字段公开尺寸档位的实际高度会变小；使用显式 TokenVars 定制几何的消费方需重新核对自己的布局。粗指针目标、焦点、系统高对比度以及尺寸和密度的独立契约保持有效。
  
  Table 新增 `rowSelection.showColumn`，允许专业列表隐藏内置选择列、保留选中行语义，并通过现有行点击和 Enter 入口更新受控选择。默认仍显示选择列。

- [`f15301a`](https://github.com/hotlif/crab-dev/commit/f15301a7391d7304420f3d7532a4f55b3500ec36) Thanks [@hotlif](https://github.com/hotlif)! - 为 Table 和 TablePro 的 React 19 ref 增加 scrollToRow(rowId, options) 与 focus()。定位按当前视图中的行 ID 查找，支持 nearest/start/center/end 对齐，保留横向滚动、查询、选择和展开状态；Promise 等虚拟滚动提交后返回是否找到目标，被替代或卸载时以 AbortError 拒绝。TablePro 支持刷新完成后立即定位新数据。focus 恢复有效的内部焦点或表格入口，不修改选择或滚动位置。

### Patch Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 继续修正 macOS Tahoe 26 控件独立设计：移除 Tabs、Segmented、Checkbox、Radio、Card 和可选标签残留的 Material 状态遮罩、光圈与形变；补充桌面选择边缘、上下数字步进器、单选菜单前置勾选与活动行、浮动侧栏和分组玻璃工具栏。工作区账户及标签页菜单应用独立玻璃材质；内联 Alert 保持中性正文，Dialog 和日期时间浮层使用桌面主次操作，PDF 缩略图以边框标记选中。
  
  深色主操作与实色状态使用饱和底色配白字；今天日期、排序序号与站点强调文字使用独立文字颜色角色。各设计边界实际应用自己的字体，避免字段、菜单或 Tabs 继承浏览器默认衬线字体。
  
  macOS TimePicker 默认使用数字输入；需要旧表盘扩展时显式传入 `panelProps={{ defaultMode: 'dial' }}`。已进入编辑的模式、焦点及未完成输入在切换设计体系时保持。
  
  修复 Tabs 默认只保留面板容器、却卸载其内容的问题。工程工作台切换任务后保留未保存的编辑草稿；显式开启 `destroyInactiveTabPane` 时仍销毁内容。
- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-button@1.0.3
  - @crab-dev/rc-checkbox@0.1.1
  - @crab-dev/rc-radio@0.1.2
  - @crab-dev/rc-config-provider@1.0.0
  - @crab-dev/rc-empty@0.1.1

## 0.1.2

### Patch Changes

- [`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a) Thanks [@hotlif](https://github.com/hotlif)! - MD3 默认采用紧凑桌面几何与上置标签：继承尺寸的按钮为 32/36/40px，单行字段为 32/40/48px，Tab 为 32/36/40px。显式 Button Expressive 五档保持不变；多行内容仍由 rows/autoSize 决定高度，触控目标至少 48px，并在粗指针布局中预留空间以避免相邻操作重叠。
  
  修正三主题字段标签宽度和 MD3 桌面 Switch 留白。公共 props、值与事件语义保持一致；依赖旧浮动标签、轮廓缺口或固定高度的自定义 CSS 需按迁移指南调整。
- Updated dependencies [[`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a)]:
  - @crab-dev/rc-button@1.0.2

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Keep nested tree checkboxes and editors in control of their own keyboard events while retaining arrow navigation from node actions. Let table editors consume their own keys before grid navigation or row activation, preserving native action activation, combobox selection and input-method drafts. Recover grid focus when a cell editor is removed without another focus destination, including iframe tables. Give coarse-pointer table selection columns a 48px minimum hit area, consistent with row expansion controls.
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`cb1361d`](https://github.com/hotlif/crab-dev/commit/cb1361d1e5fec7f6f73a10b48883d698aad729bd), [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-config-provider@0.1.1
  - @crab-dev/rc-hooks@0.1.1
  - @crab-dev/rc-button@1.0.1
  - @crab-dev/rc-radio@0.1.1

## 0.1.0

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

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 集中维护设计身份、几何、形状、排版与动效合同，Theme 负责边界映射。数据行的 compact / standard / comfortable 默认高度调整为 28 / 36 / 44px，表头调整为 32 / 36 / 44px。尺寸仍独立于密度；粗指针下自动行高的 48px 下限及显式行高覆盖保留。依赖旧默认几何的界面应显式指定行高或按迁移指南核对布局，因此语义令牌按不兼容变更发布。
  
  输入字段共用无障碍关联逻辑；Table 拆分公共类型、静态样式、扩展行、虚拟占位与测量和焦点恢复，交互所有权按 Document 隔离。保留现有包入口和公共 Props。
  
  修复 Tree 真实编辑示例缺少 CSS 变量回退时焦点环向外溢出的情况，并继续遵循宿主的令牌覆盖。
  
  开发类型检查统一到官方 TypeScript 6.0.2，移除自构建编译器及 Go 准备流程；编辑器使用 Yarn SDK。文档通过官方类型 API 提取继承、泛型与联合类型，展示配置回到各组件的 docs/presentation.json。

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Preserve selected row text in forced colors with a local system foreground/background pair that prevents automatic text backplates. Add required actual-screenshot regressions for ordinary and fixed selected cells in both text directions.
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-checkbox@0.1.0
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-empty@0.1.0
  - @crab-dev/rc-radio@0.1.0
  - @crab-dev/rc-virtual@0.2.0

## 0.0.3

### Patch Changes

- [`7b3b40e`](https://github.com/hotlif/crab-dev/commit/7b3b40e6318be339f5ea5e16fe85e9be76477696) Thanks [@hotlif](https://github.com/hotlif)! - Reduce virtual table rendering and lookup work, preserve editing and interaction state across reorders, improve grid semantics, and fix spacer sizing under inherited line heights.
- Updated dependencies [[`3a32293`](https://github.com/hotlif/crab-dev/commit/3a32293c30ac0e77d5f0a6fa0e2173e9293cd462)]:
  - @crab-dev/rc-virtual@0.1.4
  - @crab-dev/rc-checkbox@0.0.4
  - @crab-dev/rc-config-provider@0.0.2
  - @crab-dev/rc-empty@0.0.3
  - @crab-dev/rc-radio@0.0.4
