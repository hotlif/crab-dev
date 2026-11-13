# @crab-dev/rc-router

## 0.2.0

### Minor Changes

- [`2feace9`](https://github.com/hotlif/crab-dev/commit/2feace90f08d5f0978fab89ff4adf3753824e9fb) Thanks [@hotlif](https://github.com/hotlif)! - 新增路由 id、泛型 handle、完整命中链 useMatches，以及支持导航后恢复的路由 ErrorBoundary。新增 useBlocker 管理 PUSH、REPLACE 和同文档 POP 离开确认，支持取消、保存后继续与多个阻断器；useBeforeUnload 请求刷新和关闭文档时的浏览器确认。
  
  修复空 location.state 暴露内部 History 包装、多值默认查询参数丢失后续值，以及无路径布局提前匹配导致根子页面不渲染的问题。相同路由 id 保留共享布局，切换到不同 id 时重建该路由子树；动态路由表应显式声明稳定 id，不依赖不同页面间偶然的组件实例复用。
  
  导航阻断要求一个 Window 使用一个 Router，并通过 Router API 创建历史条目。跨文档导航和外部原生 History 写入不在可撤销范围内；错误边界 reset 不会清除 React.lazy 已缓存的加载失败。

## 0.1.0

### Minor Changes

- [`d11001f`](https://github.com/hotlif/crab-dev/commit/d11001fa35d4af4f53d0571c074de4b3e9806903) Thanks [@hotlif](https://github.com/hotlif)! - Rebuild the component library around a single package inventory, independent architecture and usage classifications, and three design systems: MD3 Expressive (md3), Apple (apple), and shadcn/ui (shadcn).
  
  This is a breaking pre-1.0 migration: unify controlled/uncontrolled values, selection callbacks, component APIs, sizes, and density contracts; replace legacy theme identifiers and remove old API aliases. Only stored browser appearance preferences are migrated automatically.
  
  Declare required React/ReactDOM ^19.2.0 peers through runtime dependency chains while retaining development dependencies. Correct runtime token dependencies, public/internal exports, strict declaration consumption, and independent offline PnP package verification.
  
  Correct RTL layout and overlay placement, field validation placement, embedded editor composition and focus, native virtual-scroll synchronization, and composed button feedback. Define independent multiline field geometry and preserve all eight configuration axes across controlled previews and PDF Web Components. Built-in error messages follow locale without replacing application-owned error data.
  
  Restore compiled focus and disabled styles by using valid CSS template comments, keep Tree focus indicators inside measured containers and above selected row backgrounds, accommodate localized color-channel labels, preserve physical Table column geometry with RTL content, and accept PDF byte sources from iframe realms without treating them as URLs. Respect reduced motion in the property-driven Canvas animation example and let the pill Tabs example inherit the configured size.
  
  Follow .website/docs/guides/migration.mdx before upgrading. All affected packages remain experimental; minor bumps represent the coordinated pre-1.0 breaking release and do not declare a stable 1.0 contract.
