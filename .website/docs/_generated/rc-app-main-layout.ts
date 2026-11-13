/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "工作区验收矩阵",
        "description": "固定账户与菜单数据，核对导航、标签、账户浮层和窄屏抽屉；切换配置与标签保留输入草稿。",
        "learning": {
            "components": [
                "LineEdit",
                "AppMainLayout",
                "AppMainLayoutProvider"
            ],
            "props": [
                "label",
                "placeholder",
                "sidebarTitle",
                "sidebarLogo",
                "sidebarLoadMenus",
                "headerLoadUser",
                "fullscreenable",
                "hasNotification",
                "contentLandmark",
                "onSwitchRole",
                "onLogout",
                "onSidebarMenuItemClick"
            ],
            "events": [
                "onSwitchRole",
                "onLogout",
                "onSidebarMenuItemClick"
            ],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport LineEdit from '@crab-dev/rc-line-edit';\nimport { MenuItemType, type MenuItem } from '@crab-dev/rc-menu';\nimport AppMainLayout, { AppMainLayoutProvider, useAppMainLayoutTabs, type TabItem } from '@crab-dev/rc-app-main-layout';\n\nexport const meta = {\n    title: '工作区验收矩阵',\n    description: '固定账户与菜单数据，核对导航、标签、账户浮层和窄屏抽屉；切换配置与标签保留输入草稿。',\n};\nconst frame = css`\n    width: 100%;\n    max-width: 1080px;\n    min-width: 0;\n    height: 480px;\n    padding: ${token.space['component-gap']};\n    box-sizing: border-box;\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n`;\nconst page = css`\n    padding: ${token.space['group-gap']};\n    min-width: 0;\n`;\nfunction DraftPage({ name }: { name: string }) {\n    return (\n        \u003cdiv className={page}>\n            \u003ch2>{name}\u003c/h2>\n            \u003cLineEdit label=\"工作备注\" placeholder=\"保留当前草稿 / Keep this draft\" />\n        \u003c/div>\n    );\n}\nconst tabs: TabItem[] = [\n    { key: 'overview', title: '概览 Overview', closable: false, children: \u003cDraftPage name=\"概览 Overview\" /> },\n    { key: 'orders', title: '订单 Orders', children: \u003cDraftPage name=\"订单 Orders\" /> },\n];\nconst menus: MenuItem[] = [\n    { key: 'overview', title: '概览 Overview', type: MenuItemType.Item },\n    { key: 'orders', title: '订单 Orders', type: MenuItemType.Item },\n];\nconst loadMenus = () => Promise.resolve(menus);\nconst loadUser = () => Promise.resolve({ name: '张维 / Wei Zhang', roleName: '系统管理员 / Administrator' });\nfunction Workspace() {\n    const { openTab } = useAppMainLayoutTabs();\n    return (\n        \u003cAppMainLayout\n            sidebarTitle=\"Crab 专业工作区\"\n            sidebarLogo={\u003cspan aria-hidden>◈\u003c/span>}\n            sidebarLoadMenus={loadMenus}\n            headerLoadUser={loadUser}\n            fullscreenable={false}\n            hasNotification\n            contentLandmark={{ role: 'region', 'aria-label': '工作区页面' }}\n            onSwitchRole={() => {}}\n            onLogout={() => {}}\n            onSidebarMenuItemClick={({ item }) =>\n                openTab({ key: item.key, title: item.title, children: \u003cDraftPage name={item.title ?? ''} /> })\n            }\n        />\n    );\n}\nexport default function VisualMatrixDemo() {\n    return (\n        \u003csection aria-label=\"AppMainLayout visual matrix\" className={frame}>\n            \u003cAppMainLayoutProvider initialTabs={tabs}>\n                \u003cWorkspace />\n            \u003c/AppMainLayoutProvider>\n        \u003c/section>\n    );\n}\n",
        "previewPath": "/components/rc-app-main-layout/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-app-main-layout/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "三体系验收"
    },
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基础用法",
        "description": "点击侧边栏菜单打开标签页，顶部展示路径面包屑",
        "learning": {
            "components": [
                "AppMainLayout",
                "LineEdit",
                "AppMainLayoutProvider"
            ],
            "props": [
                "sidebarLogo",
                "sidebarTitle",
                "headerLoadUser",
                "hasNotification",
                "onSwitchRole",
                "onLogout",
                "sidebarLoadMenus",
                "onSidebarMenuItemClick",
                "label",
                "placeholder",
                "initialTabs",
                "initialActiveTabKey"
            ],
            "events": [
                "onSwitchRole",
                "onLogout",
                "onSidebarMenuItemClick"
            ],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"点击侧边栏菜单打开标签页，顶部展示路径面包屑\",\n};\nimport { css } from \"@crab-dev/css\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport AppMainLayout, {\n    type TabItem,\n    AppMainLayoutProvider,\n    useAppMainLayoutTabs,\n} from \"../../src/index.js\";\nimport { MenuItemType, type MenuItem } from \"@crab-dev/rc-menu\";\nimport type { BreadcrumbsItem } from \"@crab-dev/rc-breadcrumbs\";\n\nconst pageStyle = css`padding: ${token.space[\"group-gap\"]};`;\n\nconst ShieldIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpath d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" />\n    \u003c/svg>\n);\n\nconst DashboardIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003crect x=\"3\" y=\"3\" width=\"7\" height=\"9\" />\n        \u003crect x=\"14\" y=\"3\" width=\"7\" height=\"5\" />\n        \u003crect x=\"14\" y=\"12\" width=\"7\" height=\"9\" />\n        \u003crect x=\"3\" y=\"16\" width=\"7\" height=\"5\" />\n    \u003c/svg>\n);\n\nconst UserIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpath d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\" />\n        \u003ccircle cx=\"12\" cy=\"7\" r=\"4\" />\n    \u003c/svg>\n);\n\nconst EditIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpath d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\" />\n        \u003cpath d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\" />\n    \u003c/svg>\n);\n\nconst TrashIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpolyline points=\"3 6 5 6 21 6\" />\n        \u003cpath d=\"M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6\" />\n        \u003cpath d=\"M10 11v6M14 11v6\" />\n        \u003cpath d=\"M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2\" />\n    \u003c/svg>\n);\n\nconst RoleIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpath d=\"M17 21v-2a4 4 0 0 0-3-3.87\" />\n        \u003cpath d=\"M7 21v-2a4 4 0 0 1 3-3.87\" />\n        \u003ccircle cx=\"12\" cy=\"7\" r=\"4\" />\n    \u003c/svg>\n);\n\nconst SettingsIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003ccircle cx=\"12\" cy=\"12\" r=\"3\" />\n        \u003cpath d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\" />\n    \u003c/svg>\n);\n\nconst MenuIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cline x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\" />\n        \u003cline x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" />\n        \u003cline x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\" />\n    \u003c/svg>\n);\n\nconst DictIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpath d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\" />\n        \u003cpath d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\" />\n    \u003c/svg>\n);\n\nconst Dashboard = () => {\n    const { activeTabKey, getReloadVersion } = useAppMainLayoutTabs();\n    return (\n        \u003cdiv className={pageStyle}>\n            \u003ch2>控制台\u003c/h2>\n            \u003cp>当前激活 key：{String(activeTabKey)}\u003c/p>\n            \u003cp>当前标签重载次数：{activeTabKey ? getReloadVersion(activeTabKey) : 0}\u003c/p>\n            \u003cp>点击左侧菜单可打开对应页面，顶部将展示路径。\u003c/p>\n        \u003c/div>\n    );\n};\n\nconst initialTabs: TabItem[] = [\n    {\n        key: \"dashboard\",\n        title: \"控制台\",\n        icon: \u003cDashboardIcon />,\n        closable: false,\n        breadcrumbs: [{ key: \"dashboard\", title: \"控制台\" }],\n        children: \u003cDashboard />,\n    },\n];\n\nconst menus: MenuItem[] = [\n    {\n        type: MenuItemType.Item,\n        key: \"user\",\n        title: \"人员信息\",\n        icon: \u003cUserIcon />,\n        children: [\n            {\n                type: MenuItemType.ItemGroup,\n                key: \"user-manage\",\n                title: \"用户管理\",\n                icon: \u003cUserIcon />,\n                children: [\n                    { type: MenuItemType.Item, key: \"user-edit\", title: \"用户调整\", icon: \u003cEditIcon /> },\n                    { type: MenuItemType.Item, key: \"user-delete\", title: \"用户删除\", icon: \u003cTrashIcon /> },\n                ],\n            },\n            {\n                type: MenuItemType.ItemGroup,\n                key: \"role-manage\",\n                title: \"角色管理\",\n                icon: \u003cRoleIcon />,\n                children: [\n                    { type: MenuItemType.Item, key: \"role-user\", title: \"人员角色\", icon: \u003cUserIcon /> },\n                    { type: MenuItemType.Item, key: \"role-system\", title: \"系统角色\", icon: \u003cRoleIcon /> },\n                ],\n            },\n        ],\n    },\n    {\n        type: MenuItemType.Item,\n        key: \"system\",\n        title: \"系统管理\",\n        icon: \u003cSettingsIcon />,\n        children: [\n            { type: MenuItemType.Item, key: \"menu-maintain\", title: \"菜单维护\", icon: \u003cMenuIcon /> },\n            { type: MenuItemType.Item, key: \"dict-maintain\", title: \"数据字典维护\", icon: \u003cDictIcon /> },\n        ],\n    },\n];\n\nconst isLeafMenu = (item: MenuItem) => item.type === MenuItemType.Item && !item.children?.length;\n\nconst toBreadcrumbs = (path: MenuItem[]): BreadcrumbsItem[] => path.map((m) => ({ key: String(m.key), title: m.title ?? \"\" }));\n\nconst sleep = (ms: number) => new Promise\u003cvoid>((resolve) => {\n    setTimeout(resolve, ms);\n});\n\nconst loadHeaderUser = async () => {\n    await sleep(1200);\n    return { name: \"Admin\", avatar: \"A\", roleName: \"系统管理员\" };\n};\nconst loadSidebarMenus = async () => {\n    await sleep(900);\n    return menus;\n};\nconst handleSwitchRole = () => {\n    // 示例：业务可在此打开角色选择弹窗或跳转角色页。\n    console.info(\"[rc-app-main-layout demo] switch role\");\n};\nconst handleLogout = () => {\n    // 示例：业务可在此清理登录态并跳转登录页。\n    console.info(\"[rc-app-main-layout demo] logout\");\n};\n\nconst SimpleFrame = () => {\n    const TabsBridge = () => {\n        const { openTab } = useAppMainLayoutTabs();\n        return (\n            \u003cAppMainLayout\n                className={css`body { margin: 0; }`}\n                sidebarLogo={\u003cShieldIcon />}\n                sidebarTitle=\"Crab Frame\"\n                headerLoadUser={loadHeaderUser}\n                hasNotification\n                onSwitchRole={handleSwitchRole}\n                onLogout={handleLogout}\n                sidebarLoadMenus={loadSidebarMenus}\n                onSidebarMenuItemClick={({ item, path }) => {\n                    if (!isLeafMenu(item)) return;\n                    openTab({\n                        key: item.key,\n                        title: item.title ?? \"\",\n                        icon: item.icon,\n                        breadcrumbs: toBreadcrumbs(path),\n                        children: (\n                            \u003cdiv className={pageStyle}>\n                                \u003ch2>{item.title}\u003c/h2>\n                                \u003cp>页面 key：{String(item.key)}\u003c/p>\n                                \u003cLineEdit label=\"页面备注\" placeholder=\"记录当前页面的工作备注\" />\n                            \u003c/div>\n                        ),\n                    });\n                }}\n            />\n        );\n    };\n\n    return (\n        \u003cAppMainLayoutProvider initialTabs={initialTabs} initialActiveTabKey=\"dashboard\">\n            \u003cTabsBridge />\n        \u003c/AppMainLayoutProvider>\n    );\n};\n\nexport default SimpleFrame;\n",
        "previewPath": "/components/rc-app-main-layout/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-app-main-layout/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "工作区与账户"
    },
    {
        "id": "docs/demos/long-account.demo.tsx",
        "title": "长账号信息",
        "description": "账号与角色文本在可用空间内省略，工具栏操作和头像保持可达。",
        "learning": {
            "components": [
                "AppMainLayoutProvider",
                "Layout"
            ],
            "props": [
                "initialTabs",
                "headerLoadUser",
                "contentLandmark"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '长账号信息',\n    description: '账号与角色文本在可用空间内省略，工具栏操作和头像保持可达。',\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Layout from '../../src/layout.js';\nimport AppMainLayoutProvider from '../../src/context.js';\n\nconst frameStyle = css`\n    width: 100%;\n    height: calc(${token.size['touch-target']} * 6);\n`;\n\nconst loadUser = async () => ({\n    name: 'administrator-with-a-long-account-name@example.com',\n    roleName: '企业资源与全局系统权限管理工作组管理员',\n});\n\nconst LongAccountDemo = () => \u003cdiv className={frameStyle}>\n    \u003cAppMainLayoutProvider initialTabs={[{ key: 'overview', title: '概览', children: '工作区内容' }]}>\n        \u003cLayout headerLoadUser={loadUser} contentLandmark={{ role: 'region', 'aria-label': '长账号工作区示例' }} />\n    \u003c/AppMainLayoutProvider>\n\u003c/div>;\n\nexport default LongAccountDemo;\n",
        "previewPath": "/components/rc-app-main-layout/workbench/?__wake_demo=docs%2Fdemos%2Flong-account.demo.tsx",
        "workbenchPath": "/components/rc-app-main-layout/workbench/#/components/docs%2Fdemos%2Flong-account.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "工作区与账户"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以色调导航区域和胶囊目的地组织桌面工作区，关键操作与阅读内容分层。",
        "usage": "先定义导航目的地，再组织页面页签；多工作页与账户编排是本库的组合能力。",
        "exampleDescription": "切换侧栏目的地与工作页，观察选中容器、内容区和主要操作的层级。",
        "demos": [
            "base.demo.tsx",
            "long-account.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/navigation-rail/overview",
            "https://material-web.dev/components/tabs/",
            "https://github.com/material-components/material-web/tree/main/tabs"
        ]
    },
    "macos": {
        "summary": "以桌面工具栏、轻量侧栏和独立内容区域建立工作窗口，导航材质与正文分离。",
        "usage": "让工具栏承载当前任务动作，侧栏承载位置；窄屏收起导航后仍保留回到内容的路径。",
        "exampleDescription": "查看长账户名称在桌面工具栏中的排列，再操作侧栏和工作页入口。",
        "demos": [
            "long-account.demo.tsx",
            "base.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以中性侧栏、细边界和紧凑导航组织管理工作区，页面内容保持清晰主体。",
        "usage": "将选中项和分组标题作为导航线索，避免给每个区域重复增加装饰表面。",
        "exampleDescription": "从基础布局切换页面，检查侧栏选中行、页签与内容边界是否清晰。",
        "demos": [
            "base.demo.tsx",
            "long-account.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "AppMainLayout 把应用标题区、主导航、页签和内容区组合成稳定的后台框架。它负责页面骨架和区域关系，不替业务页面决定具体数据、表单或路由。",
    "useWhen": [
        "企业后台需要长期存在的主导航、顶栏和可切换工作页。",
        "不同页面必须共享一致的响应式框架、焦点顺序和内容边界。"
    ],
    "avoidWhen": [
        "单页落地页或只有一条简单流程时，不要为了形式套入复杂后台骨架。"
    ],
    "essentials": [
        "先确定导航目的地，再把路由状态映射到选中项和当前页签。",
        "Header、Sidebar、TabBar 与 Content 各有职责，业务内容只放进内容区。",
        "窄屏不是把桌面布局等比缩小，而是按可用空间收起或转换导航。"
    ],
    "accessibility": [
        "为导航、页签和主内容提供清楚的 landmark 与名称，并保留唯一主内容入口。",
        "打开、关闭侧栏或页签后要把焦点放到可预测位置，键盘顺序应与视觉顺序一致。"
    ]
} as const;
