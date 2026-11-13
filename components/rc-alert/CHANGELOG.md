# @crab-dev/rc-alert

## 0.1.1

### Patch Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 继续修正 macOS Tahoe 26 控件独立设计：移除 Tabs、Segmented、Checkbox、Radio、Card 和可选标签残留的 Material 状态遮罩、光圈与形变；补充桌面选择边缘、上下数字步进器、单选菜单前置勾选与活动行、浮动侧栏和分组玻璃工具栏。工作区账户及标签页菜单应用独立玻璃材质；内联 Alert 保持中性正文，Dialog 和日期时间浮层使用桌面主次操作，PDF 缩略图以边框标记选中。
  
  深色主操作与实色状态使用饱和底色配白字；今天日期、排序序号与站点强调文字使用独立文字颜色角色。各设计边界实际应用自己的字体，避免字段、菜单或 Tabs 继承浏览器默认衬线字体。
  
  macOS TimePicker 默认使用数字输入；需要旧表盘扩展时显式传入 `panelProps={{ defaultMode: 'dial' }}`。已进入编辑的模式、焦点及未完成输入在切换设计体系时保持。
  
  修复 Tabs 默认只保留面板容器、却卸载其内容的问题。工程工作台切换任务后保留未保存的编辑草稿；显式开启 `destroyInactiveTabPane` 时仍销毁内容。
- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-button@1.0.3
  - @crab-dev/rc-config-provider@1.0.0

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Document three-system display and feedback specifications and add package-owned Playwright matrices with real interaction, persistent feedback, and natural motion evidence. Keep Empty geometry on shared typography/spacing roles and map Alert close controls through the public Button state tokens. Separate Notification and Empty styles from behavior without changing their public APIs.
  
  Reuse the public SpinIndicator for Message loading so design selection and reduced motion share one implementation. Keep narrow inline feedback within its container, and let Card descriptions and footer actions wrap without clipping long content.
  
  Keep Alert's close glyph aligned to its first content line while reusing Button's public 48px coarse-pointer hit layer. Center close content in its own flex container so inline SVG baseline spacing does not raise the glyph above the first line, preserving custom content dimensions. Correct error feedback and translate the companion alerts in the visual demonstration.
  
  Keep interactive Avatar surfaces at their actual visual size in grid and flex layouts while mapping the public Button touch layer to the existing 48px target roles. Keep wrapped Badge indicators anchored to their actual child boundary and let long status labels wrap within constrained hosts.
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-config-provider@0.1.0
