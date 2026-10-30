# @crab-dev/rc-token-semantic

## 1.0.0

### Major Changes

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - 集中维护设计身份、几何、形状、排版与动效合同，Theme 负责边界映射。数据行的 compact / standard / comfortable 默认高度调整为 28 / 36 / 44px，表头调整为 32 / 36 / 44px。尺寸仍独立于密度；粗指针下自动行高的 48px 下限及显式行高覆盖保留。依赖旧默认几何的界面应显式指定行高或按迁移指南核对布局，因此语义令牌按不兼容变更发布。
  
  输入字段共用无障碍关联逻辑；Table 拆分公共类型、静态样式、扩展行、虚拟占位与测量和焦点恢复，交互所有权按 Document 隔离。保留现有包入口和公共 Props。
  
  修复 Tree 真实编辑示例缺少 CSS 变量回退时焦点环向外溢出的情况，并继续遵循宿主的令牌覆盖。
  
  开发类型检查统一到官方 TypeScript 6.0.2，移除自构建编译器及 Go 准备流程；编辑器使用 Yarn SDK。文档通过官方类型 API 提取继承、泛型与联合类型，展示配置回到各组件的 docs/presentation.json。

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

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

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Add one semantic time-input geometry contract for the MD3 baseline and compact Apple/shadcn Web extensions, with explicit nested-boundary resets. Add localized screen-color-picker action copy. Keep control sizes, collection density and drawing coordinates independent.
  
  Introduce package-owned Playwright visual matrices and explicit cross-engine subsets. Local candidate captures, automated geometry checks, manual review and canonical Linux pixel baselines remain separate evidence stages.
  
  Exercise nearest-boundary configuration, real stylesheet installation and retained drafts across same-origin iframe and open Shadow DOM previews. Keep environment screenshots aligned with their declared configuration after retention exercises.

### Patch Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Restore focus after an accepted keyboard tab close, position Select popups outside their own supporting text, preserve design-specific disabled placeholders, and keep menu focus and color trigger feedback visible. Fix the appointment dialog example to retain Form's grid layout.
  
  Register dropdown Escape layers when delayed Portal elements actually mount, and preserve explicit close reasons and native events through consumer dispatch.
  
  Use the date placeholder for the appointment form's empty state instead of presenting a fake selected value.
- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903)]:
  - @crab-dev/rc-token-global@0.1.0

## 0.0.4

### Patch Changes

- [`7b3b40e`](https://github.com/hotlif/crab-dev/commit/7b3b40e6318be339f5ea5e16fe85e9be76477696) Thanks [@hotlif](https://github.com/hotlif)! - Reduce virtual table rendering and lookup work, preserve editing and interaction state across reorders, improve grid semantics, and fix spacer sizing under inherited line heights.
