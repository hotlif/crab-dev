# @crab-dev/rc-tooltip

## 0.1.1

### Patch Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 将 apple 设计体系更名为 macos，并固定以 macOS Tahoe 26 Liquid Glass 为基准。更新桌面控件轮廓、导航与浮层材质、浅深色高光和背景模糊，内容区域保持实色。提供减少透明度、高对比度和不支持滤镜的退化。
  
  迁移：将 designSystem、data-crab-design 与 iframe 配置中的 apple 改为 macos；appleColorContract 导出改为 macosColorContract。旧浏览器偏好自动迁移，公共接口不保留旧别名。
  
  macOS Button 使用独立 push/tint/glass/plain 样式与反馈，xs/s/m 保持圆角矩形、l/xl 为胶囊；共享 API 不再意味着复用 Material 状态层。
  
  macOS Switch 和 Slider 在交互时使用玻璃滑块，Slider 采用连续圆头轨道，并保留键盘、拖动和辅助显示设置下的反馈。
- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
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

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 补齐选择、导航和浮层的三体系规格、公开示例与包内 Playwright 状态矩阵，覆盖真实键盘、Portal 配置与草稿保留。颜色面板的轨道、宽度与操作间距归入组件令牌，窄屏操作区支持换行，强制颜色下保留清晰的触发器焦点边界。
  
  恢复颜色选择器公开的 showEyeDropper 屏幕取色入口，按所属浏览器能力显示，取消或拒绝不改值，卸载中止原生取色会话。
  
  补充水平与折叠菜单真实展开、Dialog 确认/取消 pending 动态场景，以及 Drawer 包公开的 iframe/Shadow DOM 组合示例；分别记录共享底层回归与真实浏览器验收范围，保留未运行、未复审部分。
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-config-provider@0.1.0
