---
"@crab-dev/rc-button": major
"@crab-dev/rc-token-semantic": minor
"@crab-dev/rc-theme": patch
"@crab-dev/rc-line-edit": patch
---

Rebuild Button geometry around explicit design-system action roles. MD3 Expressive
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
