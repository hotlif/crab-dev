---
"@crab-dev/rc-dropdown-container": patch
---

Keep native Tab navigation within the trigger, floating panel and nested dropdown branch open. Use the actual blur destination before its focus event, and prevent Escape focus restoration from reopening a focus-triggered dropdown.
