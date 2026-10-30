---
"@crab-dev/rc-canvas": patch
"@crab-dev/rc-hooks": patch
---

Keep fixed-size Canvas bitmaps in sync with real browser zoom and display resolution changes. A shared internal hook observes the owning document's window, rearms resolution queries and releases listeners; explicit dpr continues to take priority. Drawing coordinates and component sizes remain independent of raster resolution.

Keep the internal observation flag optional and explicitly typed in published declarations. The strict independent PnP consumer checks omitted, boolean and invalid string arguments against the packed entrypoint.
