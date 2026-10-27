---
"@crab-dev/rc-alert": minor
"@crab-dev/rc-app-main-layout": minor
"@crab-dev/rc-auto-sizer": minor
"@crab-dev/rc-avatar": minor
"@crab-dev/rc-badge": minor
"@crab-dev/rc-bar-chart": minor
"@crab-dev/rc-breadcrumbs": minor
"@crab-dev/rc-button": minor
"@crab-dev/rc-canvas": minor
"@crab-dev/rc-card": minor
"@crab-dev/rc-checkbox": minor
"@crab-dev/rc-color-picker": minor
"@crab-dev/rc-component-preview": minor
"@crab-dev/rc-config-provider": minor
"@crab-dev/rc-cron-picker": minor
"@crab-dev/rc-date-picker": minor
"@crab-dev/rc-dialog": minor
"@crab-dev/rc-divider": minor
"@crab-dev/rc-drawer": minor
"@crab-dev/rc-dropdown-container": minor
"@crab-dev/rc-empty": minor
"@crab-dev/rc-flow-diagram": minor
"@crab-dev/rc-form": minor
"@crab-dev/rc-hooks": minor
"@crab-dev/rc-line-edit": minor
"@crab-dev/rc-masonry": minor
"@crab-dev/rc-menu": minor
"@crab-dev/rc-message": minor
"@crab-dev/rc-notification": minor
"@crab-dev/rc-number-edit": minor
"@crab-dev/rc-pagination": minor
"@crab-dev/rc-pdf-editor": minor
"@crab-dev/rc-prose": minor
"@crab-dev/rc-radio": minor
"@crab-dev/rc-realm": minor
"@crab-dev/rc-router": minor
"@crab-dev/rc-segmented": minor
"@crab-dev/rc-select": minor
"@crab-dev/rc-skeleton": minor
"@crab-dev/rc-slider": minor
"@crab-dev/rc-spin": minor
"@crab-dev/rc-split-pane": minor
"@crab-dev/rc-switch": minor
"@crab-dev/rc-table": minor
"@crab-dev/rc-table-pro": minor
"@crab-dev/rc-tabs": minor
"@crab-dev/rc-tag": minor
"@crab-dev/rc-text-edit": minor
"@crab-dev/rc-theme": minor
"@crab-dev/rc-token-global": minor
"@crab-dev/rc-token-semantic": minor
"@crab-dev/rc-tooltip": minor
"@crab-dev/rc-tree": minor
"@crab-dev/rc-virtual": minor
---

Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).

This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.

Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.

Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.

Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.

Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.
