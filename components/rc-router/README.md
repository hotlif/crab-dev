# Router

`@crab-dev/rc-router` 是面向 React 19 浏览器应用的轻量对象式路由。它使用浏览器 History API，支持嵌套布局、索引路由、动态参数、可选参数、通配路由与相对导航，不包含数据加载和服务端路由能力。

## 特性

- 单个 `<Router routes={routes} />` 入口，无需创建额外 router 实例。
- 支持 `element` 和 `Component` 两种互斥的页面声明方式。
- 提供 `Link`、`NavLink`、`Navigate`、`Outlet` 与常用路由 Hooks。
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

当前版本仅支持浏览器 SPA。loader、action、lazy route、错误边界、Hash/Memory/SSR Router、导航阻断和滚动恢复不在首版范围内。
