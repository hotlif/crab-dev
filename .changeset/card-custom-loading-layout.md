---
"@crab-dev/rc-card": minor
---

Add an optional `loadingContent` slot for complete, explicitly sized loading layouts while preserving the default skeleton, busy state, loading fill overrides, and disabled card activation. Let Card.Meta's text column fill its remaining row so percentage-based placeholders share the final content width.

Declare the callable Card type and all five compound children explicitly so published declarations preserve `Card.Cover`, `Card.Header`, `Card.Body`, `Card.Footer` and `Card.Meta` alongside the loading content API.

Update the real loading demo to use matching Cover, Body, Meta, avatar, and text-line structures in both states. Add repeated loading/loaded browser layout checks for all three designs in light and dark modes at 320px and 216px container widths.

Keep each loading text line in its final line-height slot while centering a shorter placeholder inside it, so adjacent lines remain visibly separated without moving the card or surrounding content. Verify actual placeholder insets and inter-line gaps during every loading cycle.
