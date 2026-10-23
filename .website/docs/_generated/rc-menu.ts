/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
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
                "onSelectItem",
                "openKeys",
                "onOpenChange",
                "items"
            ],
            "events": [
                "onSelectItem",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"基础用法\",\n    description: \"基础的垂直菜单，支持展开/收起子菜单和选中菜单项\",\n};\n\nimport { Key, useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport RcMenu, { MenuItemType } from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([]);\n    const [openKeys, setOpenKeys] = useState\u003cKey[]>([1]);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                gap: 1rem;\n            `}\n        >\n            \u003cRcMenu\n                style={{ width: 250 }}\n                mode=\"vertical\"\n                selectedKeys={selectKeys}\n                onSelectItem={({ selectedKeys }) => {\n                    setSelectKeys(selectedKeys);\n                }}\n                openKeys={openKeys}\n                onOpenChange={setOpenKeys}\n                items={[\n                    {\n                        type: MenuItemType.Item,\n                        key: 1,\n                        title: \"人员信息\",\n                        children: [\n                            {\n                                type: MenuItemType.Item,\n                                key: 21,\n                                title: \"用户调整\",\n                            },\n                            {\n                                type: MenuItemType.Item,\n                                key: 22,\n                                title: \"用户删除\",\n                            },\n                        ],\n                    },\n                    {\n                        type: MenuItemType.Item,\n                        key: 11,\n                        title: \"系统管理\",\n                        children: [\n                            {\n                                type: MenuItemType.Item,\n                                key: 12,\n                                title: \"菜单维护\",\n                            },\n                            {\n                                type: MenuItemType.Item,\n                                key: 13,\n                                title: \"数据字典维护\",\n                            },\n                        ],\n                    },\n                ]}\n            />\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/collapsed.demo.tsx",
        "title": "收起内嵌菜单",
        "description": "通过 inlineCollapsed 控制菜单的收起与展开。收起时仅显示图标，悬停显示 Tooltip 或浮层子菜单。",
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
                "onSelectItem",
                "openKeys",
                "onOpenChange",
                "items"
            ],
            "events": [
                "onClick",
                "onSelectItem",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"收起内嵌菜单\",\n    description: \"通过 inlineCollapsed 控制菜单的收起与展开。收起时仅显示图标，悬停显示 Tooltip 或浮层子菜单。\",\n};\n\nimport { Key, useState } from \"react\";\nimport { css, cx } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport RcMenu, { MenuItemType } from \"../../src/index.js\";\n\nconst containerStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"stack-gap\"]};\n    align-items: flex-start;\n`;\n\nconst menuShellStyle = css`\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.shape.card};\n    background: ${token.color.surface.content};\n    padding: ${token.space[\"inline-gap\"]};\n    box-sizing: border-box;\n    width: calc(${token.size[\"touch-target\"]} * 5);\n    max-width: 100%;\n    transition: width ${token.motion.interaction};\n    @media (prefers-reduced-motion: reduce) { transition: none; }\n`;\n\nconst collapsedShellStyle = css`width: calc(${token.size[\"touch-target\"]} + ${token.size.icon});`;\n\nconst Dot = () => (\n    \u003cspan\n        aria-hidden\n        className={css`\n            display: inline-block;\n            width: ${token.size.icon};\n            height: ${token.size.icon};\n            border-radius: ${token.shape.full};\n            background: currentColor;\n        `}\n    />\n);\n\nconst CollapsedDemo = () => {\n    const [collapsed, setCollapsed] = useState(false);\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([21]);\n    const [openKeys, setOpenKeys] = useState\u003cKey[]>([1]);\n\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cButton\n                onClick={() => setCollapsed((v) => !v)}\n                aria-pressed={collapsed}\n            >\n                {collapsed ? \"展开菜单\" : \"收起菜单\"}\n            \u003c/Button>\n\n            \u003cdiv\n                className={cx(menuShellStyle, collapsed && collapsedShellStyle)}\n            >\n                \u003cRcMenu\n                    mode=\"vertical\"\n                    inlineCollapsed={collapsed}\n                    selectedKeys={selectKeys}\n                    onSelectItem={({ selectedKeys }) => setSelectKeys(selectedKeys)}\n                    openKeys={openKeys}\n                    onOpenChange={setOpenKeys}\n                    items={[\n                        {\n                            type: MenuItemType.Item,\n                            key: 1,\n                            title: \"人员信息\",\n                            icon: \u003cDot />,\n                            children: [\n                                { type: MenuItemType.Item, key: 21, title: \"用户调整\" },\n                                { type: MenuItemType.Item, key: 22, title: \"用户删除\" },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 11,\n                            title: \"系统管理\",\n                            icon: \u003cDot />,\n                            children: [\n                                { type: MenuItemType.Item, key: 12, title: \"菜单维护\" },\n                                { type: MenuItemType.Item, key: 13, title: \"数据字典维护\" },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 30,\n                            title: \"工作台\",\n                            icon: \u003cDot />,\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 31,\n                            title: \"消息中心\",\n                            icon: \u003cDot />,\n                        },\n                    ]}\n                />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CollapsedDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fcollapsed.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fcollapsed.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
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
                "onSelectItem",
                "openKeys",
                "onOpenChange",
                "items"
            ],
            "events": [
                "onSelectItem",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"分组菜单\",\n    description: \"使用 `ItemGroup` 类型对菜单项进行分组\",\n};\n\nimport { Key, useState } from \"react\";\nimport RcMenu, { MenuItemType } from \"../../src/index.js\";\n\nconst GroupDemo = () => {\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([]);\n    const [openKeys, setOpenKeys] = useState\u003cKey[]>([1, 11]);\n\n    return (\n        \u003cRcMenu\n            style={{ width: 250 }}\n            mode=\"vertical\"\n            selectedKeys={selectKeys}\n            onSelectItem={({ selectedKeys }) => {\n                setSelectKeys(selectedKeys);\n            }}\n            openKeys={openKeys}\n            onOpenChange={setOpenKeys}\n            items={[\n                {\n                    type: MenuItemType.Item,\n                    key: 1,\n                    title: \"人员信息\",\n                    children: [\n                        {\n                            type: MenuItemType.ItemGroup,\n                            key: 2,\n                            title: \"用户管理\",\n                            children: [\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 21,\n                                    title: \"用户调整\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 22,\n                                    title: \"用户删除\",\n                                },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.ItemGroup,\n                            key: 3,\n                            title: \"角色管理\",\n                            children: [\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 31,\n                                    title: \"人员角色\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 32,\n                                    title: \"系统角色\",\n                                },\n                            ],\n                        },\n                    ],\n                },\n                {\n                    type: MenuItemType.Item,\n                    key: 11,\n                    title: \"系统管理\",\n                    children: [\n                        {\n                            type: MenuItemType.Item,\n                            key: 12,\n                            title: \"菜单维护\",\n                            children: [\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 121,\n                                    title: \"菜单新增\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 122,\n                                    title: \"菜单编辑\",\n                                },\n                                {\n                                    type: MenuItemType.Item,\n                                    key: 123,\n                                    title: \"菜单删除\",\n                                },\n                            ],\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 13,\n                            title: \"数据字典维护\",\n                        },\n                    ],\n                },\n            ]}\n        />\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/horizontal.demo.tsx",
        "title": "水平模式",
        "description": "通过 `mode` 属性设置为 `horizontal` 来使用水平菜单",
        "learning": {
            "components": [
                "RcMenu"
            ],
            "props": [
                "mode",
                "selectedKeys",
                "onSelectItem",
                "openKeys",
                "onOpenChange",
                "items"
            ],
            "events": [
                "onSelectItem",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"水平模式\",\n    description: \"通过 `mode` 属性设置为 `horizontal` 来使用水平菜单\",\n};\n\nimport { Key, useState } from \"react\";\nimport RcMenu, { MenuItemType } from \"../../src/index.js\";\n\nconst HorizontalDemo = () => {\n    const [selectKeys, setSelectKeys] = useState\u003cKey[]>([]);\n    const [openKeys, setOpenKeys] = useState\u003cKey[]>([]);\n\n    return (\n        \u003cRcMenu\n            mode=\"horizontal\"\n            selectedKeys={selectKeys}\n            onSelectItem={({ selectedKeys }) => {\n                setSelectKeys(selectedKeys);\n            }}\n            openKeys={openKeys}\n            onOpenChange={setOpenKeys}\n            items={[\n                {\n                    type: MenuItemType.Item,\n                    key: 1,\n                    title: \"首页\",\n                },\n                {\n                    type: MenuItemType.Item,\n                    key: 2,\n                    title: \"用户管理\",\n                    children: [\n                        {\n                            type: MenuItemType.Item,\n                            key: 21,\n                            title: \"用户列表\",\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 22,\n                            title: \"角色管理\",\n                        },\n                    ],\n                },\n                {\n                    type: MenuItemType.Item,\n                    key: 3,\n                    title: \"系统设置\",\n                    children: [\n                        {\n                            type: MenuItemType.Item,\n                            key: 31,\n                            title: \"菜单维护\",\n                        },\n                        {\n                            type: MenuItemType.Item,\n                            key: 32,\n                            title: \"数据字典\",\n                        },\n                    ],\n                },\n            ]}\n        />\n    );\n};\n\nexport default HorizontalDemo;\n",
        "previewPath": "/components/rc-menu/workbench/?__wake_demo=docs%2Fdemos%2Fhorizontal.demo.tsx",
        "workbenchPath": "/components/rc-menu/workbench/#/components/docs%2Fdemos%2Fhorizontal.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
