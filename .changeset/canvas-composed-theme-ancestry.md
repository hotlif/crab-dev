---
"@crab-dev/rc-hooks": patch
"@crab-dev/rc-canvas": patch
---

统一组件内部的组合树父元素查找，保留实际 slot、普通父元素与跨文档 Shadow host。修复 iframe 内 Shadow 画布遗漏最近主题祖先、主题切换后未重绘的问题，复用相同工具保护浮层焦点恢复；新增保留显式 DPR、草稿与图元坐标的公开示例和真实像素回归场景。
