# @crab-dev/rc-notification

## 0.1.2

### Patch Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 将 apple 设计体系更名为 macos，并固定以 macOS Tahoe 26 Liquid Glass 为基准。更新桌面控件轮廓、导航与浮层材质、浅深色高光和背景模糊，内容区域保持实色。提供减少透明度、高对比度和不支持滤镜的退化。
  
  迁移：将 designSystem、data-crab-design 与 iframe 配置中的 apple 改为 macos；appleColorContract 导出改为 macosColorContract。旧浏览器偏好自动迁移，公共接口不保留旧别名。
  
  macOS Button 使用独立 push/tint/glass/plain 样式与反馈，xs/s/m 保持圆角矩形、l/xl 为胶囊；共享 API 不再意味着复用 Material 状态层。
  
  macOS Switch 和 Slider 在交互时使用玻璃滑块，Slider 采用连续圆头轨道，并保留键盘、拖动和辅助显示设置下的反馈。
- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-button@1.0.3
  - @crab-dev/rc-config-provider@1.0.0

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Keep notification cards within narrow grid containers and leave the workbench's notification controls accessible while its persistent portal is open.
  
  Balance wrapped titles within the available header space so narrow cards avoid a single trailing character while preserving the close control's room and focus indicator.

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`ab93160`](https://github.com/hotlif/crab-dev/commit/ab93160f53925f875c66bfabf871766e9e919af3) Thanks [@hotlif](https://github.com/hotlif)! - 协调三体系弹层与布局动效：快速重开保留内容和有效焦点，浮层在定位就绪后按实际方向入场，退出完整结束后释放资源。缩短弹层退出、收敛消息位移，侧栏与菜单跟随宿主实际宽度过渡并支持连续反转和减少动画。
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`cb1361d`](https://github.com/hotlif/crab-dev/commit/cb1361d1e5fec7f6f73a10b48883d698aad729bd), [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-config-provider@0.1.1
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

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Document three-system display and feedback specifications and add package-owned Playwright matrices with real interaction, persistent feedback, and natural motion evidence. Keep Empty geometry on shared typography/spacing roles and map Alert close controls through the public Button state tokens. Separate Notification and Empty styles from behavior without changing their public APIs.
  
  Reuse the public SpinIndicator for Message loading so design selection and reduced motion share one implementation. Keep narrow inline feedback within its container, and let Card descriptions and footer actions wrap without clipping long content.
  
  Keep Alert's close glyph aligned to its first content line while reusing Button's public 48px coarse-pointer hit layer. Center close content in its own flex container so inline SVG baseline spacing does not raise the glyph above the first line, preserving custom content dimensions. Correct error feedback and translate the companion alerts in the visual demonstration.
  
  Keep interactive Avatar surfaces at their actual visual size in grid and flex layouts while mapping the public Button touch layer to the existing 48px target roles. Keep wrapped Badge indicators anchored to their actual child boundary and let long status labels wrap within constrained hosts.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep Tag close feedback proportional to the tag while retaining its touch target. Pair opaque hexadecimal custom tag backgrounds with the more readable black or white foreground, preserving explicit caller colors.
  
  Keep Notification close controls and their focus feedback fully opaque with local semantic colors. Preserve a neutral current-page marker when Pagination is disabled without enabling navigation.
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-config-provider@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies [[`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0)]:
  - @crab-dev/rc-button@0.0.3
