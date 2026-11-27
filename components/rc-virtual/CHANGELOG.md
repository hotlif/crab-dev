# @crab-dev/rc-virtual

## 0.3.0

### Minor Changes

- [#84](https://github.com/hotlif/crab-dev/pull/84) [`4d81ab3`](https://github.com/hotlif/crab-dev/commit/4d81ab3202ae3091a64aabfea503e795e831464d) Thanks [@hotlif](https://github.com/hotlif)! - Virtual 新增 `renderWindow`，支持直接设置占位节点尺寸。Table 与 TablePro 使用它减少滚动时的样式计算和同步布局，并在边界将滚轮交还给外层页面。TablePro 会合并快速跨越多个远程数据块时的请求，停稳后加载目标视口。

- [#123](https://github.com/hotlif/crab-dev/pull/123) [`a4491e9`](https://github.com/hotlif/crab-dev/commit/a4491e94a39060b64c9777bf419f55ed54bc0457) Thanks [@hotlif](https://github.com/hotlif)! - 等高行和等宽列支持通过 `gap` 设置条目间距，虚拟窗口、滚动条和末项定位都按实际间距计算。
  
  新增 `nativeVerticalScroll` 选项，触屏用户可以在内容区纵向滑动，滚动位置同步到虚拟窗口与自定义滚动条。

### Patch Changes

- [#84](https://github.com/hotlif/crab-dev/pull/84) [`4d81ab3`](https://github.com/hotlif/crab-dev/commit/4d81ab3202ae3091a64aabfea503e795e831464d) Thanks [@hotlif](https://github.com/hotlif)! - 减少 Table 和 TablePro 横向滚动补列时的开销。普通单元格减少一层 DOM，固定数组下标的列路径使用缓存的直接读取器，保留的单元格复用已有渲染。Virtual 的横向滚动条滑块使用变换更新位置，减少滚动时的布局工作。
  
  横向溢出的直接渲染窗口使用滚动位置提示，让浏览器提前准备绘制。Table 集中提供树形按钮的本地化标签，减少普通单元格的上下文订阅。
  
  Virtual 在已挂载列覆盖视口时复用列窗口。在纯横向输入需要补列且滚动范围稳定时，先对齐原生滚动位置，再提交新列，减少补列时的同步布局和绘制开销。
  
  普通文本单元格直接渲染单个字符串或数字，不可排序的表头省去隐藏图标。在没有固定右列和行编辑控件的表格中省掉横向尾部占位，减少每次补列时挂载和更新的 DOM 节点。
  
  补列时为窗口内的非固定列各生成一次 React key 和宽度，再由数据行复用。未配置合并单元格时跳过坐标键和合并查询，减少构建单元格时的重复工作。

## 0.2.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

## 0.1.4

### Patch Changes

- [`3a32293`](https://github.com/hotlif/crab-dev/commit/3a32293c30ac0e77d5f0a6fa0e2173e9293cd462) Thanks [@hotlif](https://github.com/hotlif)! - Use cached axis metrics, binary-search range lookup, configurable overscan, and animation-frame coalescing to reduce virtual scrolling work.
