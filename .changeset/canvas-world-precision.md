---
"@crab-dev/rc-canvas": patch
---

Use high precision for world and projection geometry in vertex shaders. WebKit's mediump implementation overflows the squared length of line spans from 256px, collapsing long chart grid and reference lines while reporting no GL error. Keep public coordinates and fragment colors unchanged, and add real GPU pixel regression across the boundary.
