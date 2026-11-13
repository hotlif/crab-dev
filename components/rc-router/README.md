# Router

通过对象式路由表管理页面、嵌套布局和浏览器导航。

## 特性

- 单个 `<Router routes={routes} />` 入口，无需创建额外 router 实例。
- 支持 `element` 和 `Component` 两种互斥的页面声明方式。
- 提供 `Link`、`NavLink`、`Navigate`、`Outlet` 与常用路由 Hooks。
- 通过 `id`、`handle` 和 `useMatches` 读取完整命中链，支持布局与面包屑元数据。
- 路由 `ErrorBoundary` 隔离渲染或懒加载失败，导航后自动恢复。
- `useBlocker` 管理 SPA 离开确认，`useBeforeUnload` 请求刷新或关闭文档时的浏览器确认。
- `Link` 保留真实 `href`，兼容新窗口、下载、外链和修饰键点击。
- 无运行时依赖，不依赖 `react-router` 或路径匹配库。

## 基础用法

```tsx
import Router, { Link, Outlet, useParams } from '@crab-dev/rc-router';
import type { RouteObject } from '@crab-dev/rc-router';

function Layout() {
    return (
        <>
            <Link to="/users/42">用户</Link>
            <Outlet />
        </>
    );
}

function User() {
    const { id } = useParams<'id'>();
    return <h1>用户 {id}</h1>;
}

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Layout,
        children: [
            { index: true, element: <h1>首页</h1> },
            { path: 'users/:id', Component: User },
            { path: '*', element: <h1>页面不存在</h1> },
        ],
    },
];

export default function App() {
    return <Router routes={routes} />;
}
```

## 路径规则

- `users/:id`：必选动态参数。
- `:language?/docs`：可选动态参数。
- `files/*`：捕获剩余路径，`*` 必须位于末尾。
- 无 `path` 的路由：不消费 URL 的布局层。
- `index: true`：只匹配父路由的精确路径，不能包含 `path` 或 `children`。
- 相对子路由默认基于父路由；以 `/` 开头的绝对子路由必须以父路径开头。

## 范围

当前版本仅支持浏览器 SPA。loader、action、路由模块 `lazy`、Hash/Memory/SSR Router 和滚动恢复不在当前范围内。页面拆分使用模块顶层的 `React.lazy`，布局中组合 `Suspense` 和路由 `ErrorBoundary`。

导航阻断覆盖 Router 管理的同文档 PUSH、REPLACE 和 POP；一个 Window 只挂载一个 Router。不要绕过 Router 直接调用原生 pushState/replaceState 创建历史条目，这类条目和跨文档导航不保证可撤销。刷新或关闭文档使用 `useBeforeUnload`，异步保存仍由应用负责。IDE 会话缓存、Wake frontmatter 解析和服务器 SPA 回退配置属于应用集成层。

## 文档

- [使用说明与 API](./docs/index.mdx)
- [示例源码](./docs/demos/)

在当前包目录运行 `yarn start` 可打开组件工作台，查看交互示例。
