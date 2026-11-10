# @crab-dev/rc-flow-diagram

## 0.2.0

### Minor Changes

- [`bc001d2`](https://github.com/hotlif/crab-dev/commit/bc001d2d46306cc9e8bd612cce58e8721b95bcaf) Thanks [@hotlif](https://github.com/hotlif)! - 新增 Text 自动文字模式：小字号按视图缩放和 DPR 更新清晰位图，保持换行与世界坐标尺寸稳定，并限制字形缓存与纹理分配。字体加载和 DPR 变化会刷新文字；新增 fontWeight 并同步内联编辑器。
  
  FlowNode 默认使用 auto，并透传 fontFamily、fontWeight、lineHeight 与 textMode。需要保留旧文字外观时设置 textMode="sdf"；直接使用 Text 的默认模式不变。

- [`bc001d2`](https://github.com/hotlif/crab-dev/commit/bc001d2d46306cc9e8bd612cce58e8721b95bcaf) Thanks [@hotlif](https://github.com/hotlif)! - 新增受控视口命令、稳定端口连线与改接、手动折线编辑和共享手势事务。拖动预览与最终提交分离，支持 Esc、失焦、隐藏、只读、非活动文档和修订变化时取消，便于宿主将一次手势记为一次撤销。
  
  FlowDiagram 支持手动布局和受控视口，已保存的节点位置不再等待 ELK 完成；布局与文档加载不会自动改变视口。保留现有 Canvas、FlowDiagram 和路由接口，新几何工具支持恢复旧的手动路线。

### Patch Changes

- Updated dependencies [[`bc001d2`](https://github.com/hotlif/crab-dev/commit/bc001d2d46306cc9e8bd612cce58e8721b95bcaf), [`57b12c4`](https://github.com/hotlif/crab-dev/commit/57b12c4648999271e90b21f8912c3af2caba107f), [`bc001d2`](https://github.com/hotlif/crab-dev/commit/bc001d2d46306cc9e8bd612cce58e8721b95bcaf)]:
  - @crab-dev/rc-canvas@0.2.0

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Explain empty and failed layouts in the workbench while retaining the existing graph. Keep original engine diagnostics in keyboard-accessible expandable details, with wrapping that respects the available width in every theme.
  
  Wrap node labels within their declared width. Keep workbench controls and feedback within the local viewport while the graph retains its own world coordinates and scrolling.
  
  Keep node click and drag handling on the same hit region so selection handlers do not block dragging the node.
  
  Retain the selected node control's paired system colors in high contrast mode so the browser's text backplate does not obscure its label.
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-canvas@0.1.1

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep PDF thumbnail focus outlines inside the virtual column without changing its row geometry, including selected pages and RTL. Share outline width and offset with the row's reserved space.
  
  Use theme-aware semantic text and edge colors in Canvas and FlowDiagram examples. Start the Transformer example with all shapes visible and retain viewport changes while selecting and transforming shapes.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 补充专业组件三体系的桌面扩展规格、公开入口 Demo 与 Playwright 状态矩阵。图表图例补齐真实按下反馈，提示使用三体系浮层边界；图例和提示间距通过 L3 令牌继承密度，Realm 的反馈样式与远程加载状态机分离。PDF 和流程图的领域坐标保持原有协议，并提供加载、失败、编辑、键盘及配置切换的实际引擎场景。
  
  Realm 新增同源 script / ESM 网络入口与真正 Web Component 示例，使用现有生产加载协议，核对远程属性更新、Shadow DOM 草稿、网络失败重试和卸载。预注册容器、网络入口和实际自定义元素分别记录覆盖；场景发现和默认测试不代替候选截图复审。
  
  修复 BarChart 图例与提示引用静态 space 导致三档密度相同的问题，改为消费 L2 density 节奏角色，保留 standard 间距及绘图坐标、柱宽和数据；增加真实浏览器几何不变量回归。
  
  补齐 Flow 真实画布呈现及公开 fit/pan/domain zoom/PNG 导出场景。PDF 增加带原许可的真实字体与固定文档/图片资源，覆盖实际文本、图像、变换历史、绘图、保存导出、工具栏和区域插件；独立 Web Component 继续使用同一生产产物与内嵌运行时，WASM loading 补齐三尺寸三密度自然动画矩阵。旧示例改用公开入口与公开资源，移除隐式 Demo helper 依赖。
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903)]:
  - @crab-dev/rc-canvas@0.1.0
