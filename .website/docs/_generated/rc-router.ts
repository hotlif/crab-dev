/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "嵌套路由",
        "description": "使用独立的 iframe History 演示嵌套页面、动态参数、搜索参数与后退导航",
        "learning": {
            "components": [
                "NavLink",
                "Outlet",
                "Router"
            ],
            "props": [
                "to",
                "end",
                "context",
                "routes",
                "window"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport Router, {\n    NavLink,\n    Outlet,\n    useNavigate,\n    useLocation,\n    useParams,\n    useSearchParams,\n} from '../../src/index.js';\nimport type { RouteObject } from '../../src/index.js';\n\nfunction Layout() {\n    const navigate = useNavigate();\n    const location = useLocation();\n    return (\n        \u003csection>\n            \u003cnav aria-label=\"示例导航\">\n                \u003cNavLink to=\"/\" end>\n                    首页\n                \u003c/NavLink>{' '}\n                \u003cNavLink to=\"/users/42\">用户\u003c/NavLink>{' '}\n                \u003cNavLink to=\"/search\">搜索参数\u003c/NavLink>\n            \u003c/nav>\n            \u003cbutton type=\"button\" disabled={location.key === 'default'} onClick={() => navigate(-1)}>\n                后退\n            \u003c/button>\n            \u003cOutlet context=\"来自布局的上下文\" />\n        \u003c/section>\n    );\n}\n\nfunction UserPage() {\n    const { id } = useParams\u003c'id'>();\n    return \u003cp>当前用户：{id}\u003c/p>;\n}\n\nfunction SearchPage() {\n    const [params, setParams] = useSearchParams({ tab: 'overview' });\n    return (\n        \u003cp>\n            当前标签：{params.get('tab') ?? 'overview'}{' '}\n            \u003cbutton type=\"button\" onClick={() => setParams({ tab: 'activity' })}>\n                切换到活动\n            \u003c/button>\n        \u003c/p>\n    );\n}\n\nconst routes: RouteObject[] = [\n    {\n        path: '/',\n        Component: Layout,\n        children: [\n            { index: true, element: \u003cp>请选择一个示例页面。\u003c/p> },\n            { path: 'users/:id', Component: UserPage },\n            { path: 'search', Component: SearchPage },\n            { path: '*', element: \u003cp>页面不存在，返回首页。\u003c/p> },\n        ],\n    },\n];\n\nfunction BasicDemo() {\n    const [routerWindow, setRouterWindow] = useState\u003cWindow | null>(null);\n\n    return (\n        \u003c>\n            \u003ciframe\n                hidden\n                title=\"Router 示例的独立 History\"\n                src=\"./history-frame.html\"\n                onLoad={(event) => {\n                    const target = event.currentTarget.contentWindow;\n                    if (!target) return;\n                    // Wake copies public/history-frame.html into the workbench.\n                    // A loaded same-origin HTTP document preserves same-document\n                    // history traversal; about:blank and document.open do not.\n                    target.history.replaceState(null, '', '/');\n                    setRouterWindow(target);\n                }}\n            />\n            {routerWindow === null ? null : (\n                \u003cRouter routes={routes} window={routerWindow} />\n            )}\n        \u003c/>\n    );\n}\n\nexport const meta = {\n    title: \"嵌套路由\",\n    description: \"使用独立的 iframe History 演示嵌套页面、动态参数、搜索参数与后退导航\",\n    group: \"navigation\",\n    component: \"Router 路由\",\n    order: 10,\n    args: {},\n};\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-router/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-router/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
