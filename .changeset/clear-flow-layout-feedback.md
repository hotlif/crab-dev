---
"@crab-dev/rc-flow-diagram": patch
---

Explain empty and failed layouts in the workbench while retaining the existing graph. Keep original engine diagnostics in keyboard-accessible expandable details, with wrapping that respects the available width in every theme.

Wrap node labels within their declared width. Keep workbench controls and feedback within the local viewport while the graph retains its own world coordinates and scrolling.

Keep node click and drag handling on the same hit region so selection handlers do not block dragging the node.

Retain the selected node control's paired system colors in high contrast mode so the browser's text backplate does not obscure its label.
