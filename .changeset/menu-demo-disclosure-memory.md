---
"@crab-dev/rc-menu": patch
---

Separate the collapsed Menu example's temporary popup state from its remembered inline branches. Switching modes clears popups while restoring inline expansion and preserving the shared selection. Add regression coverage that imports the actual example; Menu's controlled `openKeys` contract is unchanged.
