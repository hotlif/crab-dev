# @crab-dev/rc-menu

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

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Separate the collapsed Menu example's temporary popup state from its remembered inline branches. Switching modes clears popups while restoring inline expansion and preserving the shared selection. Add regression coverage that imports the actual example; Menu's controlled `openKeys` contract is unchanged.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep submenu chevrons visible in forced colors by painting their strokes with borders. Preserve the selected system foreground/background pair without a forced text backplate and use a neutral system color for the root separator. Add published CSS screenshot pixel regressions for selected and unselected arrows, paired selection colors, and horizontal items without spurious underlines in both text directions.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Apply the existing horizontal content spacing token to both logical ends of menu items. Keep submenu arrow slots inside this shared inset, and verify actual text-range clearance for selected/unselected parents and leaves in LTR/RTL with normal and forced-color published CSS.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Restore focus after an accepted keyboard tab close, position Select popups outside their own supporting text, preserve design-specific disabled placeholders, and keep menu focus and color trigger feedback visible. Fix the appointment dialog example to retain Form's grid layout.
  
  Register dropdown Escape layers when delayed Portal elements actually mount, and preserve explicit close reasons and native events through consumer dispatch.
  
  Use the date placeholder for the appointment form's empty state instead of presenting a fake selected value.
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-config-provider@0.1.0
