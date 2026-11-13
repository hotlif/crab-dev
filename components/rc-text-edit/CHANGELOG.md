# @crab-dev/rc-text-edit

## 0.1.3

### Patch Changes

- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9), [`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-token-semantic@2.0.0
  - @crab-dev/rc-button@1.0.3
  - @crab-dev/rc-config-provider@1.0.0

## 0.1.2

### Patch Changes

- [`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a) Thanks [@hotlif](https://github.com/hotlif)! - MD3 默认采用紧凑桌面几何与上置标签：继承尺寸的按钮为 32/36/40px，单行字段为 32/40/48px，Tab 为 32/36/40px。显式 Button Expressive 五档保持不变；多行内容仍由 rows/autoSize 决定高度，触控目标至少 48px，并在粗指针布局中预留空间以避免相邻操作重叠。
  
  修正三主题字段标签宽度和 MD3 桌面 Switch 留白。公共 props、值与事件语义保持一致；依赖旧浮动标签、轮廓缺口或固定高度的自定义 CSS 需按迁移指南调整。
- Updated dependencies [[`9802769`](https://github.com/hotlif/crab-dev/commit/9802769d96fe5cfb8de892dce00471b5e86d796a)]:
  - @crab-dev/rc-button@1.0.2
  - @crab-dev/rc-token-semantic@1.1.0

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce) Thanks [@hotlif](https://github.com/hotlif)! - 精修三体系控件反馈：浮动标签、分段标记及文字位置连续过渡，分离开关各部件与滑块光晕的空间和颜色反馈，将零散时序集中到组件令牌。保留开关 root.transition 覆盖，减少动画时保留必要的焦点、选中与加载反馈。
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`cb1361d`](https://github.com/hotlif/crab-dev/commit/cb1361d1e5fec7f6f73a10b48883d698aad729bd), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96), [`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-token-semantic@1.0.1
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

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 补齐输入、选择和加载控件的三体系规格、真实状态演示与 Playwright 验收矩阵。选项标签和多行字段字体跟随最近设计边界；数字字段与加载提示在窄容器内保持可收缩和换行，保留既有数值、草稿及受控协议。
  
  持续加载和长按步进保留视频与原始时间序列，像素候选及人工复审独立记录，未完成范围继续保持 partial。
  
  shadcn 浅色 Switch 关闭手柄消费共享语义边界，增加 1px 描边以提升桌面辨识；保持手柄外部尺寸、开启态和强制颜色的系统配色，并将这项 New York V4 项目扩展与实际浏览器几何断言一同记录。
  
  补足原生触控、字段两种外观各自的真实交互与截图，并检查实际标签、提示、输入和操作按钮的边界及文本滚动。分段标签只在具有可访问名、受约束且确实采用省略样式时允许截断；持续动画仍使用原生视频和自然帧序列复审。

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 集中维护设计身份、几何、形状、排版与动效合同，Theme 负责边界映射。数据行的 compact / standard / comfortable 默认高度调整为 28 / 36 / 44px，表头调整为 32 / 36 / 44px。尺寸仍独立于密度；粗指针下自动行高的 48px 下限及显式行高覆盖保留。依赖旧默认几何的界面应显式指定行高或按迁移指南核对布局，因此语义令牌按不兼容变更发布。
  
  输入字段共用无障碍关联逻辑；Table 拆分公共类型、静态样式、扩展行、虚拟占位与测量和焦点恢复，交互所有权按 Document 隔离。保留现有包入口和公共 Props。
  
  修复 Tree 真实编辑示例缺少 CSS 变量回退时焦点环向外溢出的情况，并继续遵循宿主的令牌覆盖。
  
  开发类型检查统一到官方 TypeScript 6.0.2，移除自构建编译器及 Go 准备流程；编辑器使用 Yarn SDK。文档通过官方类型 API 提取继承、泛型与联合类型，展示配置回到各组件的 docs/presentation.json。
- Updated dependencies [[`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-token-semantic@1.0.0

## 0.0.2

### Patch Changes

- Updated dependencies [[`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0)]:
  - @crab-dev/rc-button@0.0.3
  - @crab-dev/rc-config-provider@0.0.2
