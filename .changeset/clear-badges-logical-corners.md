---
"@crab-dev/rc-badge": patch
"@crab-dev/rc-avatar": patch
---

Anchor wrapped badges to the actual DOM inline end so RTL avatar groups keep their overflow counts on the outer corner. Preserve physical offsets, CSS calc values, native direction overrides, and explicit indicator styles. Keep count text visible in forced colors with a local system foreground/background pair.

Place AvatarGroup summaries fully outside the last member so long custom labels remain unobscured without changing stacking order. Preserve readable initials in forced colors with local system-color pairs while leaving photos unchanged.
