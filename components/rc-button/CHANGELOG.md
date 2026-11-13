# @crab-dev/rc-button

## 1.0.3

### Patch Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 校准 macOS Tahoe 桌面工作区的公共视觉尺度：正文采用 13px 系统字体，单行字段改为 28/32/36px，控件统一 8px 轮廓；标题和数据表头降低字重。表格默认保留水平分隔，减少正文纵向网格。调整结构分隔线、字段内阴影、按钮高光和导航/浮层玻璃材质，避免固定斜向高光和厚重的灰色面板。
  
  这些规则通过公共主题与令牌应用到相关组件及组合控件。字段公开尺寸档位的实际高度会变小；使用显式 TokenVars 定制几何的消费方需重新核对自己的布局。粗指针目标、焦点、系统高对比度以及尺寸和密度的独立契约保持有效。
  
  Table 新增 `rowSelection.showColumn`，允许专业列表隐藏内置选择列、保留选中行语义，并通过现有行点击和 Enter 入口更新受控选择。默认仍显示选择列。

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 将 apple 设计体系更名为 macos，并固定以 macOS Tahoe 26 Liquid Glass 为基准。更新桌面控件轮廓、导航与浮层材质、浅深色高光和背景模糊，内容区域保持实色。提供减少透明度、高对比度和不支持滤镜的退化。
  
  迁移：将 designSystem、data-crab-design 与 iframe 配置中的 apple 改为 macos；appleColorContract 导出改为 macosColorContract。旧浏览器偏好自动迁移，公共接口不保留旧别名。
  
  macOS Button 使用独立 push/tint/glass/plain 样式与反馈，xs/s/m 保持圆角矩形、l/xl 为胶囊；共享 API 不再意味着复用 Material 状态层。
  
  macOS Switch 和 Slider 在交互时使用玻璃滑块，Slider 采用连续圆头轨道，并保留键盘、拖动和辅助显示设置下的反馈。
- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-config-provider@1.0.0
  - @crab-dev/rc-spin@0.1.2

## 1.0.2

### Patch Changes

- [`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a) Thanks [@hotlif](https://github.com/hotlif)! - MD3 默认采用紧凑桌面几何与上置标签：继承尺寸的按钮为 32/36/40px，单行字段为 32/40/48px，Tab 为 32/36/40px。显式 Button Expressive 五档保持不变；多行内容仍由 rows/autoSize 决定高度，触控目标至少 48px，并在粗指针布局中预留空间以避免相邻操作重叠。
  
  修正三主题字段标签宽度和 MD3 桌面 Switch 留白。公共 props、值与事件语义保持一致；依赖旧浮动标签、轮廓缺口或固定高度的自定义 CSS 需按迁移指南调整。

## 1.0.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce) Thanks [@hotlif](https://github.com/hotlif)! - 精修三体系控件反馈：浮动标签、分段标记及文字位置连续过渡，分离开关各部件与滑块光晕的空间和颜色反馈，将零散时序集中到组件令牌。保留开关 root.transition 覆盖，减少动画时保留必要的焦点、选中与加载反馈。
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce)]:
  - @crab-dev/rc-config-provider@0.1.1
  - @crab-dev/rc-spin@0.1.1

## 1.0.0

### Major Changes

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild Button geometry around explicit design-system action roles. MD3 Expressive
  now uses 32/40/56/96/136px heights, size-specific typography, icon spacing and
  pressed/selected corners. Apple uses a compact desktop scale; shadcn preserves
  its 32/36/40px reference scale and documents the larger Crab extensions.
  
  The default MD3 button grows from 36px to 40px. Existing explicit m/l/xl MD3
  buttons also grow; check fixed toolbars and action rows, and use xs/s for dense
  desktop actions. Props and Provider size mappings stay the same. Density remains
  independent. Nested MD3 boundaries restore their own roles inside other designs.
  
  Complete native visual interactions for every standard action appearance and
  both field surfaces, including clear actions, touch targets, retained drafts and
  long-value keyboard access. Keep legitimate empty values after clearing the
  filled field Demo. Public component props remain unchanged.
  
  Keep Button base and appearance declarations in one ordered style module and
  remove the competing base radius. Source workbenches and published ESM now use
  the same default shape, outlined border and surface regardless of bundle order.

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-spin@0.1.0

## 0.0.3

### Patch Changes

- [`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0) Thanks [@hotlif](https://github.com/hotlif)! - Add a configurable workbench demo and expose the button group and token variable types from stable public entry points.
- Updated dependencies []:
  - @crab-dev/rc-spin@0.0.4
  - @crab-dev/rc-config-provider@0.0.2
