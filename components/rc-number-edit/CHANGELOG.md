# @crab-dev/rc-number-edit

## 0.1.3

### Patch Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 继续修正 macOS Tahoe 26 控件独立设计：移除 Tabs、Segmented、Checkbox、Radio、Card 和可选标签残留的 Material 状态遮罩、光圈与形变；补充桌面选择边缘、上下数字步进器、单选菜单前置勾选与活动行、浮动侧栏和分组玻璃工具栏。工作区账户及标签页菜单应用独立玻璃材质；内联 Alert 保持中性正文，Dialog 和日期时间浮层使用桌面主次操作，PDF 缩略图以边框标记选中。
  
  深色主操作与实色状态使用饱和底色配白字；今天日期、排序序号与站点强调文字使用独立文字颜色角色。各设计边界实际应用自己的字体，避免字段、菜单或 Tabs 继承浏览器默认衬线字体。
  
  macOS TimePicker 默认使用数字输入；需要旧表盘扩展时显式传入 `panelProps={{ defaultMode: 'dial' }}`。已进入编辑的模式、焦点及未完成输入在切换设计体系时保持。
  
  修复 Tabs 默认只保留面板容器、却卸载其内容的问题。工程工作台切换任务后保留未保存的编辑草稿；显式开启 `destroyInactiveTabPane` 时仍销毁内容。
- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-button@1.0.3
  - @crab-dev/rc-config-provider@1.0.0
  - @crab-dev/rc-line-edit@0.1.3

## 0.1.2

### Patch Changes

- [`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a) Thanks [@hotlif](https://github.com/hotlif)! - MD3 默认采用紧凑桌面几何与上置标签：继承尺寸的按钮为 32/36/40px，单行字段为 32/40/48px，Tab 为 32/36/40px。显式 Button Expressive 五档保持不变；多行内容仍由 rows/autoSize 决定高度，触控目标至少 48px，并在粗指针布局中预留空间以避免相邻操作重叠。
  
  修正三主题字段标签宽度和 MD3 桌面 Switch 留白。公共 props、值与事件语义保持一致；依赖旧浮动标签、轮廓缺口或固定高度的自定义 CSS 需按迁移指南调整。
- Updated dependencies [[`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a)]:
  - @crab-dev/rc-button@1.0.2
  - @crab-dev/rc-line-edit@0.1.2

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Keep Material floating labels within the actual text area so narrow fields avoid overlapping prefixes, units, clear actions and steppers. Preserve the full accessible label, input identity, selection and draft across theme and layout changes.

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Keep numeric focus formatting in sync with native selection so select-all and immediate replacement retain the user's intended text. Preserve native numeric events and commit semantics. Share wheel intent handling between number fields and sliders, allowing horizontal scrolling and modified browser zoom gestures without changing values.
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`cb1361d`](https://github.com/hotlif/crab-dev/commit/cb1361d1e5fec7f6f73a10b48883d698aad729bd), [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-config-provider@0.1.1
  - @crab-dev/rc-line-edit@0.1.1
  - @crab-dev/rc-hooks@0.1.1
  - @crab-dev/rc-button@1.0.1

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 补齐输入、选择和加载控件的三体系规格、真实状态演示与 Playwright 验收矩阵。选项标签和多行字段字体跟随最近设计边界；数字字段与加载提示在窄容器内保持可收缩和换行，保留既有数值、草稿及受控协议。
  
  持续加载和长按步进保留视频与原始时间序列，像素候选及人工复审独立记录，未完成范围继续保持 partial。
  
  shadcn 浅色 Switch 关闭手柄消费共享语义边界，增加 1px 描边以提升桌面辨识；保持手柄外部尺寸、开启态和强制颜色的系统配色，并将这项 New York V4 项目扩展与实际浏览器几何断言一同记录。
  
  补足原生触控、字段两种外观各自的真实交互与截图，并检查实际标签、提示、输入和操作按钮的边界及文本滚动。分段标签只在具有可访问名、受约束且确实采用省略样式时允许截断；持续动画仍使用原生视频和自然帧序列复审。

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Align scientific exponents within the input content line using flex layout and an independent natural line height, replacing native superscript positioning. Preserve the semantic sup element, existing exponent font size, main text baseline, public props, and numeric value behavior.
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-line-edit@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies [[`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0)]:
  - @crab-dev/rc-button@0.0.3
  - @crab-dev/rc-line-edit@0.0.5
  - @crab-dev/rc-config-provider@0.0.2
