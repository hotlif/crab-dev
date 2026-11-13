# @crab-dev/rc-badge

## 0.1.2

### Patch Changes

- Updated dependencies [[`72dc727`](https://github.com/hotlif/crab-dev/commit/72dc7270f90eefe393ccf20af0bcbdc3485dc4a9)]:
  - @crab-dev/rc-config-provider@1.0.0

## 0.1.1

### Patch Changes

- [#22](https://github.com/hotlif/crab-dev/pull/22) [`20064d5`](https://github.com/hotlif/crab-dev/commit/20064d52b3442bda7eef16ca9045d9746cb28fce) Thanks [@hotlif](https://github.com/hotlif)! - 精修三体系控件反馈：浮动标签、分段标记及文字位置连续过渡，分离开关各部件与滑块光晕的空间和颜色反馈，将零散时序集中到组件令牌。保留开关 root.transition 覆盖，减少动画时保留必要的焦点、选中与加载反馈。
- Updated dependencies [[`8f0ac0d`](https://github.com/hotlif/crab-dev/commit/8f0ac0dada263e35783626524c69509c64e39d96)]:
  - @crab-dev/rc-config-provider@0.1.1

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Keep built-in numeric Badge expressions in their original order in RTL layouts while preserving logical positioning and custom content direction.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Anchor wrapped badges to the actual DOM inline end so RTL avatar groups keep their overflow counts on the outer corner. Preserve physical offsets, CSS calc values, native direction overrides, and explicit indicator styles. Keep count text visible in forced colors with a local system foreground/background pair.
  
  Place AvatarGroup summaries fully outside the last member so long custom labels remain unobscured without changing stacking order. Preserve readable initials in forced colors with local system-color pairs while leaving photos unchanged.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Document three-system display and feedback specifications and add package-owned Playwright matrices with real interaction, persistent feedback, and natural motion evidence. Keep Empty geometry on shared typography/spacing roles and map Alert close controls through the public Button state tokens. Separate Notification and Empty styles from behavior without changing their public APIs.
  
  Reuse the public SpinIndicator for Message loading so design selection and reduced motion share one implementation. Keep narrow inline feedback within its container, and let Card descriptions and footer actions wrap without clipping long content.
  
  Keep Alert's close glyph aligned to its first content line while reusing Button's public 48px coarse-pointer hit layer. Center close content in its own flex container so inline SVG baseline spacing does not raise the glyph above the first line, preserving custom content dimensions. Correct error feedback and translate the companion alerts in the visual demonstration.
  
  Keep interactive Avatar surfaces at their actual visual size in grid and flex layouts while mapping the public Button touch layer to the existing 48px target roles. Keep wrapped Badge indicators anchored to their actual child boundary and let long status labels wrap within constrained hosts.
- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-config-provider@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @crab-dev/rc-config-provider@0.0.2
