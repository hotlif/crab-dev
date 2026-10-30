---
"@crab-dev/rc-alert": patch
"@crab-dev/rc-avatar": patch
"@crab-dev/rc-badge": patch
"@crab-dev/rc-card": patch
"@crab-dev/rc-divider": patch
"@crab-dev/rc-empty": patch
"@crab-dev/rc-skeleton": patch
"@crab-dev/rc-message": patch
"@crab-dev/rc-notification": patch
---

Document three-system display and feedback specifications and add package-owned Playwright matrices with real interaction, persistent feedback, and natural motion evidence. Keep Empty geometry on shared typography/spacing roles and map Alert close controls through the public Button state tokens. Separate Notification and Empty styles from behavior without changing their public APIs.

Reuse the public SpinIndicator for Message loading so design selection and reduced motion share one implementation. Keep narrow inline feedback within its container, and let Card descriptions and footer actions wrap without clipping long content.

Keep Alert's close glyph aligned to its first content line while reusing Button's public 48px coarse-pointer hit layer. Center close content in its own flex container so inline SVG baseline spacing does not raise the glyph above the first line, preserving custom content dimensions. Correct error feedback and translate the companion alerts in the visual demonstration.

Keep interactive Avatar surfaces at their actual visual size in grid and flex layouts while mapping the public Button touch layer to the existing 48px target roles. Keep wrapped Badge indicators anchored to their actual child boundary and let long status labels wrap within constrained hosts.
