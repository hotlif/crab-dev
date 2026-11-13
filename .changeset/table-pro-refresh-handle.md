---
"@crab-dev/rc-table-pro": minor
---

新增 React 19 ref 接口 TableProHandle.refresh()，由组件重新请求当前分页、筛选和排序下的数据，保留已有数据与表格实例。Promise 支持等待刷新及页码越界后的回退请求；加载失败时拒绝并报告 onError，被后续请求替代或卸载时以 AbortError 拒绝。内置刷新、自动刷新与数据重试共用请求链路，不新增 refreshKey 属性。
