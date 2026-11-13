---
"@crab-dev/rc-router": minor
---

新增路由 id、泛型 handle、完整命中链 useMatches，以及支持导航后恢复的路由 ErrorBoundary。新增 useBlocker 管理 PUSH、REPLACE 和同文档 POP 离开确认，支持取消、保存后继续与多个阻断器；useBeforeUnload 请求刷新和关闭文档时的浏览器确认。

修复空 location.state 暴露内部 History 包装、多值默认查询参数丢失后续值，以及无路径布局提前匹配导致根子页面不渲染的问题。相同路由 id 保留共享布局，切换到不同 id 时重建该路由子树；动态路由表应显式声明稳定 id，不依赖不同页面间偶然的组件实例复用。

导航阻断要求一个 Window 使用一个 Router，并通过 Router API 创建历史条目。跨文档导航和外部原生 History 写入不在可撤销范围内；错误边界 reset 不会清除 React.lazy 已缓存的加载失败。
