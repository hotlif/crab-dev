# @crab-dev/rc-token-global

## 0.2.0

### Minor Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 将 apple 设计体系更名为 macos，并固定以 macOS Tahoe 26 Liquid Glass 为基准。更新桌面控件轮廓、导航与浮层材质、浅深色高光和背景模糊，内容区域保持实色。提供减少透明度、高对比度和不支持滤镜的退化。
  
  迁移：将 designSystem、data-crab-design 与 iframe 配置中的 apple 改为 macos；appleColorContract 导出改为 macosColorContract。旧浏览器偏好自动迁移，公共接口不保留旧别名。
  
  macOS Button 使用独立 push/tint/glass/plain 样式与反馈，xs/s/m 保持圆角矩形、l/xl 为胶囊；共享 API 不再意味着复用 Material 状态层。
  
  macOS Switch 和 Slider 在交互时使用玻璃滑块，Slider 采用连续圆头轨道，并保留键盘、拖动和辅助显示设置下的反馈。

### Patch Changes

- [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9) Thanks [@hotlif](https://github.com/hotlif)! - 校准 macOS Tahoe 桌面工作区的公共视觉尺度：正文采用 13px 系统字体，单行字段改为 28/32/36px，控件统一 8px 轮廓；标题和数据表头降低字重。表格默认保留水平分隔，减少正文纵向网格。调整结构分隔线、字段内阴影、按钮高光和导航/浮层玻璃材质，避免固定斜向高光和厚重的灰色面板。
  
  这些规则通过公共主题与令牌应用到相关组件及组合控件。字段公开尺寸档位的实际高度会变小；使用显式 TokenVars 定制几何的消费方需重新核对自己的布局。粗指针目标、焦点、系统高对比度以及尺寸和密度的独立契约保持有效。
  
  Table 新增 `rowSelection.showColumn`，允许专业列表隐藏内置选择列、保留选中行语义，并通过现有行点击和 Enter 入口更新受控选择。默认仍显示选择列。

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.
