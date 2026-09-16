import { useState } from 'react';
import Router, {
    NavLink,
    Outlet,
    useNavigate,
    useLocation,
    useParams,
    useSearchParams,
} from '../../src/index.js';
import type { RouteObject } from '../../src/index.js';

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <section>
            <nav aria-label="示例导航">
                <NavLink to="/" end>
                    首页
                </NavLink>{' '}
                <NavLink to="/users/42">用户</NavLink>{' '}
                <NavLink to="/search">搜索参数</NavLink>
            </nav>
            <button type="button" disabled={location.key === 'default'} onClick={() => navigate(-1)}>
                后退
            </button>
            <Outlet context="来自布局的上下文" />
        </section>
    );
}

function UserPage() {
    const { id } = useParams<'id'>();
    return <p>当前用户：{id}</p>;
}

function SearchPage() {
    const [params, setParams] = useSearchParams({ tab: 'overview' });
    return (
        <p>
            当前标签：{params.get('tab') ?? 'overview'}{' '}
            <button type="button" onClick={() => setParams({ tab: 'activity' })}>
                切换到活动
            </button>
        </p>
    );
}

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Layout,
        children: [
            { index: true, element: <p>请选择一个示例页面。</p> },
            { path: 'users/:id', Component: UserPage },
            { path: 'search', Component: SearchPage },
            { path: '*', element: <p>页面不存在，返回首页。</p> },
        ],
    },
];

function BasicDemo() {
    const [routerWindow, setRouterWindow] = useState<Window | null>(null);

    return (
        <>
            <iframe
                hidden
                title="Router 示例的独立 History"
                src="./history-frame.html"
                onLoad={(event) => {
                    const target = event.currentTarget.contentWindow;
                    if (!target) return;
                    // Wake copies public/history-frame.html into the workbench.
                    // A loaded same-origin HTTP document preserves same-document
                    // history traversal; about:blank and document.open do not.
                    target.history.replaceState(null, '', '/');
                    setRouterWindow(target);
                }}
            />
            {routerWindow === null ? null : (
                <Router routes={routes} window={routerWindow} />
            )}
        </>
    );
}

export const meta = {
    title: "嵌套路由",
    description: "使用独立的 iframe History 演示嵌套页面、动态参数、搜索参数与后退导航",
    group: "navigation",
    component: "Router 路由",
    order: 10,
    args: {},
};
export default BasicDemo;
