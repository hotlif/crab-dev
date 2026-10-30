/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系导航矩阵",
        "description": "垂直、内嵌、水平和折叠导航，共用密度、选中与键盘协议。",
        "learning": {
            "components": [
                "Menu"
            ],
            "props": [
                "aria-label",
                "data-collapsed",
                "mode",
                "inlineCollapsed",
                "items",
                "selectedKeys",
                "onSelectedKeysChange"
            ],
            "events": [
                "onSelectedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState, type Key } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Menu, { MenuItemType } from \"@crab-dev/rc-menu\";\n\nexport const meta = { title: \"三体系导航矩阵\", description: \"垂直、内嵌、水平和折叠导航，共用密度、选中与键盘协议。\" };\nconst layout = css`padding: ${token.space['section-gap']}; display: grid; gap: ${token.space['section-gap']}; min-height: 24rem; align-content: start; min-width: 0;`;\nconst menu = css`width: min(100%, 28rem); min-width: 0; &[data-collapsed=\"true\"] { width: ${token.size[64]}; }`;\nconst items = [\n    { type: MenuItemType.Item, key: \"overview\", title: \"总览 Overview\" },\n    { type: MenuItemType.Item, key: \"projects\", title: \"项目 Projects\", children: [\n        { type: MenuItemType.Item, key: \"active\", title: \"进行中 Active\" },\n        { type: MenuItemType.Item, key: \"archived\", title: \"归档 Archived\" },\n    ] },\n    { type: MenuItemType.Item, key: \"long\", title: \"跨团队交付与维护规范 Long workspace navigation label\" },\n];\nexport default function VisualMatrixDemo() {\n    const [mode, setMode] = useState\u003c\"vertical\" | \"inline\" | \"horizontal\">(\"vertical\");\n    const [collapsed, setCollapsed] = useState(false);\n    const [selected, setSelected] = useState\u003cKey[]>([]);\n    return \u003csection aria-label=\"Menu visual matrix\" className={layout}>\n        \u003clabel>验收模式\u003cselect aria-label=\"验收模式\" value={mode} onChange={event => setMode(event.target.value as typeof mode)}>\u003coption>vertical\u003c/option>\u003coption>inline\u003c/option>\u003coption>horizontal\u003c/option>\u003c/select>\u003c/label>\n        \u003clabel>\u003cinput type=\"checkbox\" aria-label=\"折叠导航\" checked={collapsed} onChange={event => setCollapsed(event.target.checked)} />折叠导航\u003c/label>\n        \u003cMenu className={menu} aria-label=\"项目导航\" data-collapsed={collapsed} mode={mode} inlineCollapsed={collapsed} items={items} selectedKeys={selected} onSelectedKeysChange={setSelected} />\n        \u003coutput aria-label=\"已选导航\">{selected.join(\",\")}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "规格验收"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "基础的垂直菜单，支持展开/收起子菜单和选中菜单项",
        "learning": {
            "components": [
                "RcMenu"
            ],
            "props": [
                "mode",
                "selectedKeys",
                "onSelectedKeysChange",
                "openKeys",
                "onOpenKeysChange",
                "items"
            ],
            "events": [
                "onSelectedKeysChange",
                "onOpenKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"基础用法\",\n    description: \"基础的垂直菜单，支持展开/收起子菜单和选中菜单项\",\n};\n\nimport { Key, useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport RcMenu, { MenuItemType } from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([]);\n    const [openKeys, setOpenKeys] = useState\u003cKey[]>([1]);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                gap: 1rem;\n            `}\n        >\n            \u003cRcMenu\n                style={{ width: 250 }}\n                mode=\"vertical\"\n                selectedKeys={selectKeys}\n                onSelectedKeysChange={(selectedKeys) => {\n                    setSelectKeys(selectedKeys);\n                }}\n                openKeys={openKeys}\n                onOpenKeysChange={setOpenKeys}\n                items={[\n                    {\n                        type: MenuItemType.Item,\n                        key: 1,\n                        title: \"人员信息\",\n                        children: [\n                            {\n                                type: MenuItemType.Item,\n                                key: 21,\n                                title: \"用户调整\",\n                            },\n                            {\n                                type: MenuItemType.Item,\n                                key: 22,\n                                title: \"用户删除\",\n                            },\n                        ],\n                    },\n                    {\n                        type: MenuItemType.Item,\n                        key: 11,\n                        title: \"系统管理\",\n                        children: [\n                            {\n                                type: MenuItemType.Item,\n                                key: 12,\n                                title: \"菜单维护\",\n                            },\n                            {\n                                type: MenuItemType.Item,\n                                key: 13,\n                                title: \"数据字典维护\",\n                            },\n                        ],\n                    },\n                ]}\n            />\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "分组菜单",
        "description": "使用 `ItemGroup` 类型对菜单项进行分组",
        "learning": {
            "components": [
                "RcMenu"
            ],
            "props": [
                "mode",
                "selectedKeys",
                "onSelectedKeysChange",
                "openKeys",
                "onOpenKeysChange",
                "items"
            ],
            "events": [
                "onSelectedKeysChange",
                "onOpenKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"分组菜单\",\n    description: \"使用 `ItemGroup` 类型对菜单项进行分组\",\n};\n\nimport { Key, useState } from \"react\";\nimport RcMenu, { MenuItemType } from \"../../src/index.js\";\n\nconst GroupDemo = () => {\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([]);\n    const [openKeys, setOpenKeys] = useState\u003cKey[]>([1, 11]);\n\n    return (\n        \u003cRcMenu\n            style={{ width: 250 }}\n            mode=\"vertical\"\n            selectedKeys={selectKeys}\n            onSelectedKeysChange={(selectedKeys) => {\n                setSelectKeys(selectedKeys);\n            }}\n            openKeys={openKeys}\n            onOpenKeysChange={setOpenKeys}\n            items={[\n                {\n                    type: MenuItemType.Item,\n                    key: 1,\n                    title: \"人员信息\",\n                    children: [\n                        {\n                            type: MenuItemType.ItemGroup,\n                            key: 2,\n                            title: \"用户管理\",\n                            children: [\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 21,\n                                    title: \"用户调整\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 22,\n                                    title: \"用户删除\",\n                                },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.ItemGroup,\n                            key: 3,\n                            title: \"角色管理\",\n                            children: [\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 31,\n                                    title: \"人员角色\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 32,\n                                    title: \"系统角色\",\n                                },\n                            ],\n                        },\n                    ],\n                },\n                {\n                    type: MenuItemType.Item,\n                    key: 11,\n                    title: \"系统管理\",\n                    children: [\n                        {\n                            type: MenuItemType.Item,\n                            key: 12,\n                            title: \"菜单维护\",\n                            children: [\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 121,\n                                    title: \"菜单新增\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 122,\n                                    title: \"菜单编辑\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 123,\n                                    title: \"菜单删除\",\n                                },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 13,\n                            title: \"数据字典维护\",\n                        },\n                    ],\n                },\n            ]}\n        />\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/horizontal.demo.tsx",
        "title": "水平模式",
        "description": "水平菜单支持图标与子菜单分组；切换方向后，图标间距与分组缩进跟随文字起点。",
        "learning": {
            "components": [
                "RcMenu"
            ],
            "props": [
                "mode",
                "selectedKeys",
                "onSelectedKeysChange",
                "openKeys",
                "onOpenKeysChange",
                "items"
            ],
            "events": [
                "onSelectedKeysChange",
                "onOpenKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"水平模式\",\n    description: \"水平菜单支持图标与子菜单分组；切换方向后，图标间距与分组缩进跟随文字起点。\",\n};\n\nimport { Key, useState } from \"react\";\nimport RcMenu, { MenuItemType } from \"../../src/index.js\";\n\nconst NavigationIcon = () => (\n    \u003csvg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.5\" aria-hidden=\"true\">\n        \u003crect x=\"4\" y=\"4\" width=\"6\" height=\"6\" rx=\"1\" />\n        \u003crect x=\"14\" y=\"4\" width=\"6\" height=\"6\" rx=\"1\" />\n        \u003crect x=\"4\" y=\"14\" width=\"6\" height=\"6\" rx=\"1\" />\n        \u003crect x=\"14\" y=\"14\" width=\"6\" height=\"6\" rx=\"1\" />\n    \u003c/svg>\n);\n\nconst HorizontalDemo = () => {\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([]);\n    const [openKeys, setOpenKeys] = useState\u003cKey[]>([]);\n\n    return (\n        \u003cRcMenu\n            mode=\"horizontal\"\n            selectedKeys={selectKeys}\n            onSelectedKeysChange={(selectedKeys) => {\n                setSelectKeys(selectedKeys);\n            }}\n            openKeys={openKeys}\n            onOpenKeysChange={setOpenKeys}\n            items={[\n                {\n                    type: MenuItemType.Item,\n                    key: 1,\n                    title: \"首页\",\n                    icon: \u003cNavigationIcon />,\n                },\n                {\n                    type: MenuItemType.Item,\n                    key: 2,\n                    title: \"用户管理\",\n                    icon: \u003cNavigationIcon />,\n                    children: [\n                        {\n                            type: MenuItemType.ItemGroup,\n                            key: 'accounts',\n                            title: \"账户管理\",\n                            icon: \u003cNavigationIcon />,\n                            children: [\n                                { type: MenuItemType.Item, key: 21, title: \"用户列表\", icon: \u003cNavigationIcon /> },\n                                { type: MenuItemType.Item, key: 22, title: \"角色管理\", icon: \u003cNavigationIcon /> },\n                            ],\n                        },\n                    ],\n                },\n                {\n                    type: MenuItemType.Item,\n                    key: 3,\n                    title: \"系统设置\",\n                    icon: \u003cNavigationIcon />,\n                    children: [\n                        {\n                            type: MenuItemType.Item,\n                            key: 31,\n                            title: \"菜单维护\",\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 32,\n                            title: \"数据字典\",\n                        },\n                    ],\n                },\n            ]}\n        />\n    );\n};\n\nexport default HorizontalDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fhorizontal.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fhorizontal.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/collapsed.demo.tsx",
        "title": "收起内嵌菜单",
        "description": "通过 inlineCollapsed 收起为图标栏，分别保存内联展开记忆与临时浮层状态；切换模式关闭浮层，展开时恢复原有分支。",
        "learning": {
            "components": [
                "Button",
                "RcMenu"
            ],
            "props": [
                "onClick",
                "aria-pressed",
                "mode",
                "inlineCollapsed",
                "selectedKeys",
                "onSelectedKeysChange",
                "openKeys",
                "onOpenKeysChange",
                "items"
            ],
            "events": [
                "onClick",
                "onSelectedKeysChange",
                "onOpenKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"收起内嵌菜单\",\n    description: \"通过 inlineCollapsed 收起为图标栏，分别保存内联展开记忆与临时浮层状态；切换模式关闭浮层，展开时恢复原有分支。\",\n};\n\nimport { Key, useState } from \"react\";\nimport { css, cx } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport RcMenu, { MenuItemType } from \"@crab-dev/rc-menu\";\n\nconst containerStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"stack-gap\"]};\n    align-items: flex-start;\n`;\n\nconst menuShellStyle = css`\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.shape.card};\n    background: ${token.color.surface.content};\n    padding: ${token.space[\"inline-gap\"]};\n    box-sizing: border-box;\n    width: calc(${token.size[\"touch-target\"]} * 5);\n    max-width: 100%;\n    transition: width ${token.motion.interaction};\n    @media (prefers-reduced-motion: reduce) { transition: none; }\n`;\n\nconst collapsedShellStyle = css`width: calc(${token.size[\"touch-target\"]} + ${token.size.icon});`;\n\nconst Dot = () => (\n    \u003cspan\n        aria-hidden\n        className={css`\n            display: inline-block;\n            width: ${token.size.icon};\n            height: ${token.size.icon};\n            border-radius: ${token.shape.full};\n            background: currentColor;\n        `}\n    />\n);\n\nconst CollapsedDemo = () => {\n    const [collapsed, setCollapsed] = useState(false);\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([21]);\n    const [inlineOpenKeys, setInlineOpenKeys] = useState\u003cKey[]>([1]);\n    const [popupOpenKeys, setPopupOpenKeys] = useState\u003cKey[]>([]);\n\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cButton\n                onClick={() => {\n                    setPopupOpenKeys([]);\n                    setCollapsed((v) => !v);\n                }}\n                aria-pressed={collapsed}\n            >\n                {collapsed ? \"展开菜单\" : \"收起菜单\"}\n            \u003c/Button>\n\n            \u003cdiv\n                className={cx(menuShellStyle, collapsed && collapsedShellStyle)}\n            >\n                \u003cRcMenu\n                    mode=\"vertical\"\n                    inlineCollapsed={collapsed}\n                    selectedKeys={selectKeys}\n                    onSelectedKeysChange={(selectedKeys) => setSelectKeys(selectedKeys)}\n                    openKeys={collapsed ? popupOpenKeys : inlineOpenKeys}\n                    onOpenKeysChange={collapsed ? setPopupOpenKeys : setInlineOpenKeys}\n                    items={[\n                        {\n                            type: MenuItemType.Item,\n                            key: 1,\n                            title: \"人员信息\",\n                            icon: \u003cDot />,\n                            children: [\n                                { type: MenuItemType.Item, key: 21, title: \"用户调整\" },\n                                { type: MenuItemType.Item, key: 22, title: \"用户删除\" },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 11,\n                            title: \"系统管理\",\n                            icon: \u003cDot />,\n                            children: [\n                                { type: MenuItemType.Item, key: 12, title: \"菜单维护\" },\n                                { type: MenuItemType.Item, key: 13, title: \"数据字典维护\" },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 30,\n                            title: \"工作台\",\n                            icon: \u003cDot />,\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 31,\n                            title: \"消息中心\",\n                            icon: \u003cDot />,\n                        },\n                    ]}\n                />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CollapsedDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fcollapsed.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fcollapsed.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    }
] as const satisfies readonly ComponentDemoRecord[];
