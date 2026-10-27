---
"@crab-dev/rc-tabs": patch
---

Keep selected pill-tab labels visible in forced-colors mode by preserving the system Highlight/HighlightText pair on the selected tab and its text. Add a required published CSS regression that checks actual screenshot foreground and background pixels across all three designs, both color modes, and LTR/RTL.
