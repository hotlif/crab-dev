---
"@crab-dev/rc-pdf-editor": patch
---

Return focus to the matching panel toggle when the PDF workspace collapses a focused sidebar, with a visible outline until blur or pointer interaction. Resolve close-panel focus inside the actual editor so standalone ShadowRoot and iframe instances retain valid focus, with the canvas as fallback when a toggle is unavailable. Keep document and draft state unchanged. Clear the native nonce value when the standalone example resets its configuration.

Use the public square Button shape for document thumbnails so selected and unselected pages keep matching rectangular corners, including in forced colors.

Restore canvas focus within the actual editor after region selection completes or is cancelled, including standalone ShadowRoot instances.

Keep sidebar and toolbar button keystrokes from moving or deleting the selected canvas object; retain canvas editing and toolbar arrow navigation.

Keep the properties heading and close button mounted across object selection, drawing modes and document history changes, preserving valid keyboard focus in standalone editors.
