# @crab-dev/rc-date-picker

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 修复缺少原生 Temporal 的浏览器无法打开日期与时间选择器的问题。组件通过包内唯一入口选择原生实现或已经声明的官方 polyfill，不再要求消费方安装 Temporal 全局，也不修改宿主全局对象。常规示例使用公开 ISO 适配入口构造日期。
  
  新增具名 `toPickerDateTime`，将原生或官方 polyfill 的 ZonedDateTime 转换为现有公共日期值。适配只经过 ISO 字符串，不丢失日历、时区或纳秒；无需更改现有 Props、受控回调和 `setState` 类型。
  
  适配器声明接受 ISO 字符串或 `toString()` 的窄结构协议，不将 polyfill 的 Intl 类型扩展带入独立消费方；无原生 Temporal 的运行时仍使用包内已有的官方实现。常规示例直接使用 ISO 入口，显式官方实现仅作为可选互操作；文档记录其 0.5.1 Intl 声明与 TypeScript 6 严格消费的已知限制。
  
  将“现在”和今天标记统一为读取 Date.now 的毫秒精度 UI 时钟，并按业务时区转换；传入 ZonedDateTime 的微秒、纳秒、日历与时区信息保持不变。公共 Props 和受控值协议不变。

### Patch Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Position DatePicker, DateTimePicker and TimePicker popups outside their own labels and supporting or error text, including floating labels beyond the layout box and flipped placement, while preserving the input reference and clear/focus behavior. Allow virtual geometry through the existing internal Dropdown positioning seam without changing its public API.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 将表单、日期与计划选择及导航组件的三体系状态规格、可运行矩阵示例和 Playwright 场景放回所属包，分别覆盖适用尺寸、密度、交互与环境，保留原有公开属性和受控协议。初次截图仍作为待复审候选，不自动建立基准或提升覆盖状态。
  
  日期时间输入通过语义令牌分别采用 MD3 基线与 Apple/shadcn 的紧凑桌面扩展；表盘坐标和时间精度不变。面包屑动作沿用路径文字几何及中性反馈，避免动作尺寸变化撑高路径，并保留原生键盘与粗指针命中能力。纠正只读 Cron 示例文字，使其与“可展开查看、不可编辑”的既有行为一致。
  
  修复面包屑路径间距没有响应 density 的问题，统一引用现有 L2 density.gap。默认 standard 间距会增加，长路径可能更早折行；组件尺寸与导航协议保持兼容。浏览器同时检查计算间距与实际相邻项坐标，不以三档重复截图作为验收通过依据。

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Base DatePicker, DateTimePicker and TimePicker clear actions on their semantic value instead of formatted display text. Empty values with custom text no longer expose clear, while existing values formatted as an empty string remain clearable. Include the actual button event in clear details without synthesizing input events.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep clock labels readable by masking only the hand line without covering neighboring selection circles, preserve visible dotted-divider gaps at DPR 1, and keep circle/avatar skeletons square when only one dimension is supplied.
- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-dropdown-container@0.1.0
  - @crab-dev/rc-hooks@0.1.0
  - @crab-dev/rc-button@1.0.0
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-line-edit@0.1.0
  - @crab-dev/rc-number-edit@0.1.0
  - @crab-dev/rc-token-semantic@1.0.0

## 0.0.4

### Patch Changes

- Updated dependencies [[`35d5f5a`](https://github.com/hotlif/crab-dev/commit/35d5f5ab65b8e038d34e1c889de56e1aecad53d0), [`f991b0e`](https://github.com/hotlif/crab-dev/commit/f991b0eede1ead4d70534302bd51f47b0a4ab143)]:
  - @crab-dev/rc-button@0.0.3
  - @crab-dev/rc-dropdown-container@0.0.5
  - @crab-dev/rc-line-edit@0.0.5
  - @crab-dev/rc-number-edit@0.0.3
