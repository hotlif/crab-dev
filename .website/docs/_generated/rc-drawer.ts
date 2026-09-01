/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 `open` 控制显示；点击遮罩、关闭按钮或按 `Esc` 均可关闭。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过 `open` 控制显示；点击遮罩、关闭按钮或按 `Esc` 均可关闭。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Drawer from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [open, setOpen] = useState(false);\n    return (\n        \u003c>\n            \u003cButton onClick={() => setOpen(true)}>打开抽屉\u003c/Button>\n            \u003cDrawer open={open} onOpenChange={setOpen} title=\"基本信息\">\n                \u003cp>这里是抽屉的主体内容，可承载任意 React 节点。\u003c/p>\n                \u003cp>内容区自带滚动，超出部分会在内部滚动而不影响底部页面。\u003c/p>\n            \u003c/Drawer>\n        \u003c/>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/nested.demo.tsx",
        "title": "嵌套打开",
        "description": "支持层层嵌套打开（示例共 10 层）；每层独立维护开关状态，关闭后不影响下层。",
        "sourceCode": "export const meta = {\n    title: \"嵌套打开\",\n    description: \"支持层层嵌套打开（示例共 10 层）；每层独立维护开关状态，关闭后不影响下层。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Drawer, { type DrawerSize } from \"../../src/index.js\";\n\nconst TOTAL_LEVELS = 10;\n\nconst getSize = (level: number): DrawerSize => {\n    if (level \u003c= 3) return \"large\";\n    if (level \u003c= 6) return \"medium\";\n    return \"small\";\n};\n\ninterface LevelDrawerProps {\n    level: number;\n    open: boolean;\n    onOpenChange: (open: boolean) => void;\n}\n\nconst LevelDrawer = ({ level, open, onOpenChange }: LevelDrawerProps) => {\n    const [childOpen, setChildOpen] = useState(false);\n    const hasChild = level \u003c TOTAL_LEVELS;\n    return (\n        \u003c>\n            \u003cDrawer\n                open={open}\n                onOpenChange={onOpenChange}\n                title={`第 ${level} 层抽屉`}\n                size={getSize(level)}\n                footer={\n                    \u003c>\n                        \u003cButton onClick={() => onOpenChange(false)}>关闭当前层\u003c/Button>\n                        {hasChild && (\n                            \u003cButton appearance=\"primary\" onClick={() => setChildOpen(true)}>\n                                打开第 {level + 1} 层\n                            \u003c/Button>\n                        )}\n                    \u003c/>\n                }\n            >\n                \u003cp>当前层级：{level} / {TOTAL_LEVELS}\u003c/p>\n                \u003cp>\n                    {hasChild\n                        ? \"点击底部按钮可以继续在此之上叠加一层抽屉。\"\n                        : \"已到达最深一层，关闭后将逐级回到上一层。\"}\n                \u003c/p>\n            \u003c/Drawer>\n            {hasChild && (\n                \u003cLevelDrawer\n                    level={level + 1}\n                    open={childOpen}\n                    onOpenChange={setChildOpen}\n                />\n            )}\n        \u003c/>\n    );\n};\n\nconst NestedDemo = () => {\n    const [rootOpen, setRootOpen] = useState(false);\n    return (\n        \u003c>\n            \u003cButton onClick={() => setRootOpen(true)}>打开第 1 层\u003c/Button>\n            \u003cLevelDrawer level={1} open={rootOpen} onOpenChange={setRootOpen} />\n        \u003c/>\n    );\n};\n\nexport default NestedDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fnested.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fnested.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/placement.demo.tsx",
        "title": "四个方向",
        "description": "通过 `placement` 控制抽屉从哪个方向滑出。",
        "sourceCode": "export const meta = {\n    title: \"四个方向\",\n    description: \"通过 `placement` 控制抽屉从哪个方向滑出。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport { css } from \"@crab-dev/css\";\n\nimport Drawer, { type DrawerPlacement } from \"../../src/index.js\";\n\nconst buttonRowStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: 8px;\n`;\n\nconst PlacementDemo = () => {\n    const [placement, setPlacement] = useState\u003cDrawerPlacement | null>(null);\n    return (\n        \u003c>\n            \u003cdiv className={buttonRowStyle}>\n                \u003cButton onClick={() => setPlacement(\"left\")}>从左侧\u003c/Button>\n                \u003cButton onClick={() => setPlacement(\"right\")}>从右侧\u003c/Button>\n                \u003cButton onClick={() => setPlacement(\"top\")}>从顶部\u003c/Button>\n                \u003cButton onClick={() => setPlacement(\"bottom\")}>从底部\u003c/Button>\n            \u003c/div>\n            \u003cDrawer\n                open={placement !== null}\n                onOpenChange={(next) => !next && setPlacement(null)}\n                placement={placement ?? \"right\"}\n                title={`Placement: ${placement ?? \"\"}`}\n            >\n                \u003cp>当前位置：{placement}\u003c/p>\n            \u003c/Drawer>\n        \u003c/>\n    );\n};\n\nexport default PlacementDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fplacement.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fplacement.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/with-footer.demo.tsx",
        "title": "底部操作区",
        "description": "通过 `footer` 传入操作按钮，适合承载表单提交场景。",
        "sourceCode": "export const meta = {\n    title: \"底部操作区\",\n    description: \"通过 `footer` 传入操作按钮，适合承载表单提交场景。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Drawer from \"../../src/index.js\";\n\nconst WithFooterDemo = () => {\n    const [open, setOpen] = useState(false);\n    return (\n        \u003c>\n            \u003cButton onClick={() => setOpen(true)}>提交表单\u003c/Button>\n            \u003cDrawer\n                open={open}\n                onOpenChange={setOpen}\n                title=\"编辑信息\"\n                size=\"large\"\n                footer={\n                    \u003c>\n                        \u003cButton onClick={() => setOpen(false)}>取消\u003c/Button>\n                        \u003cButton appearance=\"primary\" onClick={() => setOpen(false)}>\n                            保存\n                        \u003c/Button>\n                    \u003c/>\n                }\n            >\n                \u003cp>将表单内容放在这里。底部操作区会贴合抽屉下沿，始终可见。\u003c/p>\n            \u003c/Drawer>\n        \u003c/>\n    );\n};\n\nexport default WithFooterDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fwith-footer.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fwith-footer.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
