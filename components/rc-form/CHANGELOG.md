# @crab-dev/rc-form

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Add explicit external group label semantics to Form.Item. Group editors can receive the visible field caption through aria-labelledby while keeping each option's own name and preserving explicit accessible names. Fix the CheckboxGroup/RadioGroup editor example and document the render-prop migration.
  
  Treat empty arrays as missing required values for collection fields. Preserve zero, false and all existing nonempty-value semantics, and verify CheckboxGroup selection and reset validation.

### Patch Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Give control-labeled fields a full-row slot and preserve each editor's own label, input, and supporting-text layout. This prevents wrapped editors such as DatePicker and Select from being squeezed into the external-label column and keeps Apple and shadcn field layouts consistent inside and outside Form. Use the existing `external` placement when Form should align labels across rows.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 将表单、日期与计划选择及导航组件的三体系状态规格、可运行矩阵示例和 Playwright 场景放回所属包，分别覆盖适用尺寸、密度、交互与环境，保留原有公开属性和受控协议。初次截图仍作为待复审候选，不自动建立基准或提升覆盖状态。
  
  日期时间输入通过语义令牌分别采用 MD3 基线与 Apple/shadcn 的紧凑桌面扩展；表盘坐标和时间精度不变。面包屑动作沿用路径文字几何及中性反馈，避免动作尺寸变化撑高路径，并保留原生键盘与粗指针命中能力。纠正只读 Cron 示例文字，使其与“可展开查看、不可编辑”的既有行为一致。
  
  修复面包屑路径间距没有响应 density 的问题，统一引用现有 L2 density.gap。默认 standard 间距会增加，长路径可能更早折行；组件尺寸与导航协议保持兼容。浏览器同时检查计算间距与实际相邻项坐标，不以三档重复截图作为验收通过依据。
- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-spin@0.1.0
  - @crab-dev/rc-token-semantic@1.0.0
  - @crab-dev/rc-tooltip@0.1.0

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @crab-dev/rc-spin@0.0.4
