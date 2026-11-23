---
"@crab-dev/rc-virtual": minor
"@crab-dev/rc-table": patch
"@crab-dev/rc-table-pro": patch
---

Virtual 新增 `renderWindow`，支持直接设置占位节点尺寸。Table 与 TablePro 使用它减少滚动时的样式计算和同步布局，并在边界将滚轮交还给外层页面。TablePro 会合并快速跨越多个远程数据块时的请求，停稳后加载目标视口。
