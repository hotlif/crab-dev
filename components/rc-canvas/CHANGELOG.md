# @crab-dev/rc-canvas

## 0.3.1

### Patch Changes

- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-config-provider@1.0.0

## 0.3.0

### Minor Changes

- [`cf076ee`](https://github.com/hotlif/crab-dev/commit/cf076ee5793f74c862434f9edf577242c1ae96fe) Thanks [@hotlif](https://github.com/hotlif)! - 增加可选的最小屏幕字号与跟随视口的 CanvasOverlay。FlowNode 可配置完整、精简、概览标签，并通过支持悬停和键盘焦点的详情入口保留完整信息。默认绘制不变；DOM 可读标签不包含在 PNG 导出内。

### Patch Changes

- [`dfbd519`](https://github.com/hotlif/crab-dev/commit/dfbd5198ac1e605023990fa81c6f34fd6c2468c2) Thanks [@hotlif](https://github.com/hotlif)! - 修复 auto 文字在小数缩放下因纹理取整后再次缩放而产生的额外模糊。排版与命中尺寸保持稳定，光栅绘制尺寸单独对齐物理像素；增加 25%、50%、75% 缩放和多 DPR 的逐像素回归。

## 0.2.0

### Minor Changes

- [`bc001d2`](https://github.com/hotlif/crab-dev/commit/bc001d2d46306cc9e8bd612cce58e8721b95bcaf) Thanks [@hotlif](https://github.com/hotlif)! - 新增 Text 自动文字模式：小字号按视图缩放和 DPR 更新清晰位图，保持换行与世界坐标尺寸稳定，并限制字形缓存与纹理分配。字体加载和 DPR 变化会刷新文字；新增 fontWeight 并同步内联编辑器。
  
  FlowNode 默认使用 auto，并透传 fontFamily、fontWeight、lineHeight 与 textMode。需要保留旧文字外观时设置 textMode="sdf"；直接使用 Text 的默认模式不变。

- [`bc001d2`](https://github.com/hotlif/crab-dev/commit/bc001d2d46306cc9e8bd612cce58e8721b95bcaf) Thanks [@hotlif](https://github.com/hotlif)! - 新增受控视口命令、稳定端口连线与改接、手动折线编辑和共享手势事务。拖动预览与最终提交分离，支持 Esc、失焦、隐藏、只读、非活动文档和修订变化时取消，便于宿主将一次手势记为一次撤销。
  
  FlowDiagram 支持手动布局和受控视口，已保存的节点位置不再等待 ELK 完成；布局与文档加载不会自动改变视口。保留现有 Canvas、FlowDiagram 和路由接口，新几何工具支持恢复旧的手动路线。

### Patch Changes

- [`57b12c4`](https://github.com/hotlif/crab-dev/commit/57b12c4648999271e90b21f8912c3af2caba107f) Thanks [@hotlif](https://github.com/hotlif)! - 修复默认 SDF 文字丢失灰度边缘、轮廓外扩导致的小字号笔画失真，并保护平坦距离场区域的抗锯齿计算。

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96) Thanks [@hotlif](https://github.com/hotlif)! - Keep longer inline text drafts readable by using the declared text width and fitting the native editor height to its content within the available canvas. Preserve the same editor, selection, focus and draft during theme changes, and retain internal scrolling for longer content. Paint the paired editing background in its container so Chromium keeps surrounding WebGL shapes visible behind the transparent native textarea. Restore focus through the editor's actual Document or ShadowRoot when committing or cancelling.
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`cb1361d`](https://github.com/hotlif/crab-dev/commit/cb1361d1e5fec7f6f73a10b48883d698aad729bd), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-config-provider@0.1.1
  - @crab-dev/rc-hooks@0.1.1

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 统一组件内部的组合树父元素查找，保留实际 slot、普通父元素与跨文档 Shadow host。修复 iframe 内 Shadow 画布遗漏最近主题祖先、主题切换后未重绘的问题，复用相同工具保护浮层焦点恢复；新增保留显式 DPR、草稿与图元坐标的公开示例和真实像素回归场景。

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Keep fixed-size Canvas bitmaps in sync with real browser zoom and display resolution changes. A shared internal hook observes the owning document's window, rearms resolution queries and releases listeners; explicit dpr continues to take priority. Drawing coordinates and component sizes remain independent of raster resolution.
  
  Keep the internal observation flag optional and explicitly typed in published declarations. The strict independent PnP consumer checks omitted, boolean and invalid string arguments against the packed entrypoint.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Render bitmap and SDF text through the owning document's 2D canvas when a browser
  does not implement OffscreenCanvas. This fixes Canvas text and dependent charts
  failing to mount in WebKit environments without that API. Worker rendering keeps
  its OffscreenCanvas path; glyph geometry and texture formats stay unchanged.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Use high precision for world and projection geometry in vertex shaders. WebKit's mediump implementation overflows the squared length of line spans from 256px, collapsing long chart grid and reference lines while reporting no GL error. Keep public coordinates and fragment colors unchanged, and add real GPU pixel regression across the boundary.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep PDF thumbnail focus outlines inside the virtual column without changing its row geometry, including selected pages and RTL. Share outline width and offset with the row's reserved space.
  
  Use theme-aware semantic text and edge colors in Canvas and FlowDiagram examples. Start the Transformer example with all shapes visible and retain viewport changes while selecting and transforming shapes.
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-config-provider@0.1.0
