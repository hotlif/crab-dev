---
"@crab-dev/rc-line-edit": patch
---

Keep disabled LineEdit containers fully opaque in forced colors so the native input value retains the system GrayText color. Preserve disabled behavior, ordinary-color opacity and field geometry. Add a required published ESM/CSS screenshot regression for outlined and filled disabled values across all three design systems and both color modes, measuring the actual native input content region without a DOM text substitute.
