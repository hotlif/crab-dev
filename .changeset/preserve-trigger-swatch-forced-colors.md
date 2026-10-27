---
"@crab-dev/rc-color-picker": patch
---

Preserve the trigger swatch's RGB and alpha data in forced-colors mode while keeping surrounding text, borders and focus in system colors. Avoid fading disabled swatches through parent opacity, retaining their disabled semantics and GrayText boundary. Transparent swatches continue to composite against the actual Canvas surface.
