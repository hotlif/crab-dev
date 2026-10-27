---
"@crab-dev/rc-tabs": patch
---

Remove the card tab's unnecessary negative bottom margin so its scrolling bar contains the full tab height. Reserve a contained scroll-end pixel so native scroll-range quantization cannot clip a fractional-width RTL tab's leading border. Keep fitting lists free of phantom overflow. Verify native scrolling and keyboard navigation through published ESM/CSS across all designs, color modes, directions and sizes.
