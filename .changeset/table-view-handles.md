---
"@crab-dev/rc-table": minor
"@crab-dev/rc-table-pro": minor
---

为 Table 和 TablePro 的 React 19 ref 增加 scrollToRow(rowId, options) 与 focus()。定位按当前视图中的行 ID 查找，支持 nearest/start/center/end 对齐，保留横向滚动、查询、选择和展开状态；Promise 等虚拟滚动提交后返回是否找到目标，被替代或卸载时以 AbortError 拒绝。TablePro 支持刷新完成后立即定位新数据。focus 恢复有效的内部焦点或表格入口，不修改选择或滚动位置。
