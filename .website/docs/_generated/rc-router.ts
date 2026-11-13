/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

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
        "sourceCode": "import { useState } from 'react';\nimport Router, {\n    NavLink,\n    Outlet,\n    useNavigate,\n    useLocation,\n    useParams,\n    useSearchParams,\n} from '@crab-dev/rc-router';\nimport type { RouteObject } from '@crab-dev/rc-router';\n\nfunction Layout() {\n    const navigate = useNavigate();\n    const location = useLocation();\n    return (\n        \u003csection>\n            \u003cnav aria-label=\"示例导航\">\n                \u003cNavLink to=\"/\" end>\n                    首页\n                \u003c/NavLink>{' '}\n                \u003cNavLink to=\"/users/42\">用户\u003c/NavLink>{' '}\n                \u003cNavLink to=\"/search\">搜索参数\u003c/NavLink>\n            \u003c/nav>\n            \u003cbutton type=\"button\" disabled={location.key === 'default'} onClick={() => navigate(-1)}>\n                后退\n            \u003c/button>\n            \u003cOutlet context=\"来自布局的上下文\" />\n        \u003c/section>\n    );\n}\n\nfunction UserPage() {\n    const { id } = useParams\u003c'id'>();\n    return \u003cp>当前用户：{id}\u003c/p>;\n}\n\nfunction SearchPage() {\n    const [params, setParams] = useSearchParams({ tab: 'overview' });\n    return (\n        \u003cp>\n            当前标签：{params.get('tab') ?? 'overview'}{' '}\n            \u003cbutton type=\"button\" onClick={() => setParams({ tab: 'activity' })}>\n                切换到活动\n            \u003c/button>\n        \u003c/p>\n    );\n}\n\nconst routes: RouteObject[] = [\n    {\n        path: '/',\n        Component: Layout,\n        children: [\n            { index: true, element: \u003cp>请选择一个示例页面。\u003c/p> },\n            { path: 'users/:id', Component: UserPage },\n            { path: 'search', Component: SearchPage },\n            { path: '*', element: \u003cp>页面不存在，返回首页。\u003c/p> },\n        ],\n    },\n];\n\nfunction BasicDemo() {\n    const [routerWindow, setRouterWindow] = useState\u003cWindow | null>(null);\n\n    return (\n        \u003c>\n            \u003ciframe\n                hidden\n                title=\"Router 示例的独立 History\"\n                src=\"./history-frame.html\"\n                onLoad={(event) => {\n                    const target = event.currentTarget.contentWindow;\n                    if (!target) return;\n                    // Wake copies public/history-frame.html into the workbench.\n                    // A loaded same-origin HTTP document preserves same-document\n                    // history traversal; about:blank and document.open do not.\n                    target.history.replaceState(null, '', '/');\n                    setRouterWindow(target);\n                }}\n            />\n            {routerWindow === null ? null : (\n                \u003cRouter routes={routes} window={routerWindow} />\n            )}\n        \u003c/>\n    );\n}\n\nexport const meta = {\n    title: \"嵌套路由\",\n    description: \"使用独立的 iframe History 演示嵌套页面、动态参数、搜索参数与后退导航\",\n    group: \"navigation\",\n    component: \"Router 路由\",\n    order: 10,\n    args: {},\n};\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-router/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-router/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/workflow.demo.tsx",
        "title": "工作区离开确认与错误恢复",
        "description": "父布局读取页面元数据，保存失败保留草稿，错误页面不影响导航",
        "learning": {
            "components": [
                "Link",
                "Outlet",
                "LineEdit",
                "Button",
                "Router"
            ],
            "props": [
                "to",
                "aria-label",
                "value",
                "onValueChange",
                "disabled",
                "onClick",
                "routes",
                "window"
            ],
            "events": [
                "onValueChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport LineEdit from '@crab-dev/rc-line-edit';\nimport Router, { Link, Outlet, useBlocker, useMatches, useSearchParams } from '@crab-dev/rc-router';\nimport type { RouteErrorBoundaryProps, RouteObject } from '@crab-dev/rc-router';\n\ninterface PageHandle { title: string }\n\nfunction Layout() {\n    const matches = useMatches\u003cPageHandle>();\n    return \u003csection>\n        \u003ch3>{matches.at(-1)?.handle?.title ?? '工作区'}\u003c/h3>\n        \u003cnav aria-label=\"工作区导航\">\u003cLink to=\"/\">概览\u003c/Link>{' '}\u003cLink to=\"/edit?workspace=demo\">编辑草稿\u003c/Link>{' '}\u003cLink to=\"/broken\">失败页面\u003c/Link>\u003c/nav>\n        \u003cOutlet />\n    \u003c/section>;\n}\n\nfunction Editor() {\n    const [draft, setDraft] = useState('初始草稿');\n    const [saved, setSaved] = useState('初始草稿');\n    const [error, setError] = useState('');\n    const [saving, setSaving] = useState(false);\n    const [params] = useSearchParams();\n    const blocker = useBlocker(({ currentLocation, nextLocation }) =>\n        draft !== saved && currentLocation.pathname !== nextLocation.pathname,\n    );\n    async function saveAndLeave(fail: boolean) {\n        setSaving(true);\n        setError('');\n        try {\n            // This self-contained demo simulates a save; replace with the app API.\n            await Promise.resolve();\n            if (fail) throw new Error('保存失败，草稿仍保留，可重试或取消离开。');\n            setSaved(draft);\n            if (blocker.state === 'blocked') blocker.proceed();\n        } catch (reason) {\n            setError(reason instanceof Error ? reason.message : '保存失败');\n        } finally {\n            setSaving(false);\n        }\n    }\n    return \u003csection>\n        \u003cp>工作区：{params.get('workspace')}。修改草稿后点击概览，检查离开确认。\u003c/p>\n        \u003cLineEdit aria-label=\"工作区草稿\" value={draft} onValueChange={setDraft} />\n        {error && \u003cp role=\"alert\">{error}\u003c/p>}\n        {blocker.state === 'blocked' && \u003csection aria-label=\"未保存草稿\" aria-live=\"polite\">\n            \u003cp>草稿未保存，即将前往 {blocker.location.pathname}。\u003c/p>\n            \u003cButton disabled={saving} onClick={blocker.reset}>继续编辑\u003c/Button>{' '}\n            \u003cButton disabled={saving} onClick={() => saveAndLeave(true)}>模拟保存失败\u003c/Button>{' '}\n            \u003cButton disabled={saving} onClick={() => saveAndLeave(false)}>保存并离开\u003c/Button>\n        \u003c/section>}\n    \u003c/section>;\n}\n\nfunction BrokenPage(): never { throw new Error('示例页面发生渲染错误。'); }\nfunction PageError({ error }: RouteErrorBoundaryProps) {\n    return \u003csection role=\"alert\">\u003cp>{error instanceof Error ? error.message : '页面失败'}\u003c/p>\n        \u003cp>导航仍可使用，返回概览后可继续编辑。\u003c/p>\u003cLink to=\"/\">返回概览\u003c/Link>\u003c/section>;\n}\n\nconst routes: RouteObject\u003cPageHandle>[] = [{\n    id: 'workspace', Component: Layout, children: [\n        { id: 'home', path: '/', handle: { title: '工作区概览' }, element: \u003cp>编辑草稿演示导航阻断；失败页面演示局部错误恢复。\u003c/p> },\n        { id: 'editor', path: '/edit', handle: { title: '编辑器' }, Component: Editor },\n        { id: 'broken', path: '/broken', handle: { title: '错误隔离' }, Component: BrokenPage, ErrorBoundary: PageError },\n    ],\n}];\n\nexport default function WorkflowDemo() {\n    const [routerWindow, setRouterWindow] = useState\u003cWindow | null>(null);\n    return \u003c>\n        \u003ciframe hidden title=\"工作区示例的独立 History\" src=\"./history-frame.html\" onLoad={event => {\n            const target = event.currentTarget.contentWindow;\n            if (!target) return;\n            target.history.replaceState(null, '', '/');\n            setRouterWindow(target);\n        }} />\n        {routerWindow && \u003cRouter routes={routes} window={routerWindow} />}\n    \u003c/>;\n}\n\nexport const meta = {\n    title: '工作区离开确认与错误恢复',\n    description: '父布局读取页面元数据，保存失败保留草稿，错误页面不影响导航',\n    group: 'navigation', component: 'Router 路由', order: 20, args: {},\n};\n",
        "previewPath": "/components/rc-router/workbench/?__wake_demo=docs%2Fdemos%2Fworkflow.demo.tsx",
        "workbenchPath": "/components/rc-router/workbench/#/components/docs%2Fdemos%2Fworkflow.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "将页面位置与导航目的地关联，路由逻辑本身不定义色调或形状。",
        "usage": "目的地选中反馈由导航组件呈现，页面变化后保持明确的内容位置。",
        "exampleDescription": "在示例内部切换路径，观察内容变化与当前导航状态的对应。",
        "demos": [
            "basic.demo.tsx",
            "workflow.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/navigation-drawer/overview",
            "https://material-web.dev/components/tabs/",
            "https://github.com/material-components/material-web/tree/main/tabs"
        ]
    },
    "macos": {
        "summary": "为桌面工作区关联页面地址与当前内容，路由状态和窗口布局分别管理。",
        "usage": "页签或侧栏变化应对应可预测路径，独立示例使用自己的历史记录。",
        "exampleDescription": "切换工作区中的示例路径，检查返回操作与当前内容保持一致。",
        "demos": [
            "basic.demo.tsx",
            "workflow.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "为简洁导航界面提供路径匹配与内容切换，保持路由与外观职责分离。",
        "usage": "导航链接需要真实目标，页面内容与当前位置不能仅靠样式推断。",
        "exampleDescription": "跟随链接切换内容，再返回上一位置，检查路径与显示结果。",
        "demos": [
            "basic.demo.tsx",
            "workflow.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Router 把 URL、路由配置和页面组件连接起来，处理匹配、参数、嵌套页面与导航。它让地址成为可分享、可返回的应用状态，而不是只在内存中切换视图。",
    "useWhen": [
        "应用有多个可直接访问的页面或嵌套路由。",
        "浏览器前进后退、深链接和当前导航状态必须一致。"
    ],
    "avoidWhen": [
        "组件内部的局部视图切换使用状态或 Tabs；不要为一个弹层创建难以理解的伪页面。"
    ],
    "essentials": [
        "路由表从具体到通用组织，并为未知地址提供明确兜底。",
        "导航使用链接语义，编程式跳转只用于提交后等业务结果。",
        "页面参数来自 URL 时需要解析、校验并处理缺失值。"
    ],
    "accessibility": [
        "路由切换后更新页面标题，并把焦点或阅读起点移到新内容的合理位置。",
        "链接能用浏览器标准方式打开和复制，当前导航项使用 aria-current。"
    ]
} as const;
