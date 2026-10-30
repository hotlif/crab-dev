# @crab-dev/rc-button

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
