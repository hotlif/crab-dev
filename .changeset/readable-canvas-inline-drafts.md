---
"@crab-dev/rc-canvas": patch
---

Keep longer inline text drafts readable by using the declared text width and fitting the native editor height to its content within the available canvas. Preserve the same editor, selection, focus and draft during theme changes, and retain internal scrolling for longer content. Paint the paired editing background in its container so Chromium keeps surrounding WebGL shapes visible behind the transparent native textarea. Restore focus through the editor's actual Document or ShadowRoot when committing or cancelling.
