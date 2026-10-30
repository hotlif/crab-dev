# @crab-dev/rc-card

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Add an optional `loadingContent` slot for complete, explicitly sized loading layouts while preserving the default skeleton, busy state, loading fill overrides, and disabled card activation. Let Card.Meta's text column fill its remaining row so percentage-based placeholders share the final content width.
  
  Declare the callable Card type and all five compound children explicitly so published declarations preserve `Card.Cover`, `Card.Header`, `Card.Body`, `Card.Footer` and `Card.Meta` alongside the loading content API.
  
  Update the real loading demo to use matching Cover, Body, Meta, avatar, and text-line structures in both states. Add repeated loading/loaded browser layout checks for all three designs in light and dark modes at 320px and 216px container widths.
  
  Keep each loading text line in its final line-height slot while centering a shorter placeholder inside it, so adjacent lines remain visibly separated without moving the card or surrounding content. Verify actual placeholder insets and inter-line gaps during every loading cycle.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.

### Patch Changes

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Keep the Card content surface and text in the same theme palette during configuration changes. Remove the content background fade while retaining hover, focus, and pressed state layers, transforms, shadows, and border feedback.

- [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da) Thanks [@hotlif](https://github.com/hotlif)! - Document three-system display and feedback specifications and add package-owned Playwright matrices with real interaction, persistent feedback, and natural motion evidence. Keep Empty geometry on shared typography/spacing roles and map Alert close controls through the public Button state tokens. Separate Notification and Empty styles from behavior without changing their public APIs.
  
  Reuse the public SpinIndicator for Message loading so design selection and reduced motion share one implementation. Keep narrow inline feedback within its container, and let Card descriptions and footer actions wrap without clipping long content.
  
  Keep Alert's close glyph aligned to its first content line while reusing Button's public 48px coarse-pointer hit layer. Center close content in its own flex container so inline SVG baseline spacing does not raise the glyph above the first line, preserving custom content dimensions. Correct error feedback and translate the companion alerts in the visual demonstration.
  
  Keep interactive Avatar surfaces at their actual visual size in grid and flex layouts while mapping the public Button touch layer to the existing 48px target roles. Keep wrapped Badge indicators anchored to their actual child boundary and let long status labels wrap within constrained hosts.

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Give Card loading placeholders a local translucent fill that remains visible against default, elevated, outlined, and filled surfaces in all three design systems. Preserve Skeleton pulse motion, consumer token overrides, and normal Skeleton styling after loading ends.
- Updated dependencies [[`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903), [`ec1f759`](https://github.com/hotlif/crab-dev/commit/ec1f759d51a83a456b4eb7f608f2e4908d4d46da)]:
  - @crab-dev/rc-config-provider@0.1.0
  - @crab-dev/rc-skeleton@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @crab-dev/rc-config-provider@0.0.2
  - @crab-dev/rc-skeleton@0.0.3
