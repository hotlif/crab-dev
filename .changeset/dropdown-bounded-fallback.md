---
"@crab-dev/rc-dropdown-container": patch
---

Keep dropdown frames inside the viewport by considering lateral placements only when their real clipping bounds can contain the floating width. Preserve best-fit vertical space, the existing height limit and scrolling, and picker label clearance; cover real navigation and confirmation in published browser regressions.
