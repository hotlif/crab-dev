---
"@crab-dev/rc-canvas": patch
---

Render bitmap and SDF text through the owning document's 2D canvas when a browser
does not implement OffscreenCanvas. This fixes Canvas text and dependent charts
failing to mount in WebKit environments without that API. Worker rendering keeps
its OffscreenCanvas path; glyph geometry and texture formats stay unchanged.
