/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最基本的树形组件用法，展示节点的展开、收起和选择功能。",
        "learning": {
            "components": [
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "disableHeight",
                "height",
                "width",
                "treeData",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "onSelectedKeysChange",
                "onExpandedKeysChange",
                "loadData"
            ],
            "events": [
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport { treeMeasureStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"基础用法\",\n    description: \"最基本的树形组件用法，展示节点的展开、收起和选择功能。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, useTreeData } from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData] = useTreeData();\n\n    const loadData = (parentNode: Node | null) => {\n        if (parentNode === null) {\n            const nodes: Node[] = [];\n            for (let i = 1; i \u003c= 5; i += 1) {\n                nodes.push({\n                    id: i,\n                    type: NodeType.FOLDER,\n                    title: `节点 ${i}`,\n                    parent: null,\n                    loadState: LoadStateType.UNLOADED,\n                });\n            }\n            return Promise.resolve(nodes);\n        }\n\n        return new Promise\u003cNode[]>((resolve) => {\n            setTimeout(() => {\n                const children: Node[] = [];\n                for (let i = 0; i \u003c 3; i += 1) {\n                    children.push({\n                        id: `${parentNode.id}-${i}`,\n                        type: i === 0 ? NodeType.FOLDER : NodeType.FOLDER,\n                        title: `子节点 ${parentNode.id}-${i}`,\n                        parent: parentNode,\n                        loadState: LoadStateType.UNLOADED,\n                    });\n                }\n                resolve(children);\n            }, 300);\n        });\n    };\n\n    return (\n        \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n            {({ width }) => (\n                \u003cRcTree\n                    height={300}\n                    width={Math.min(width, 400)}\n                    treeData={treeData}\n                    onTreeNodeChange={setTreeData}\n                    expandedKeys={expandedKeys}\n                    selectedKeys={selectedKeys}\n                    onSelectedKeysChange={(selectedKeys: Key[]) => {\n                        setSelectedKeys(selectedKeys);\n                    }}\n                    onExpandedKeysChange={setExpandedKeys}\n                    loadData={loadData}\n                />\n            )}\n        \u003c/AutoSizer>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "基础展示"
    },
    {
        "id": "docs/demos/expand-all.demo.tsx",
        "title": "全部展开 / 折叠",
        "description": "通过 `TreeDataUtil` 提供的 `expandAll` 与 `collapseAll` 方法，一键展开或折叠所有 FOLDER 节点。",
        "learning": {
            "components": [
                "Button",
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "onClick",
                "disableHeight",
                "height",
                "width",
                "treeData",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "events": [
                "onClick",
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport Button from \"@crab-dev/rc-button\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { treeMeasureStyle, demoStackStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"全部展开 / 折叠\",\n    description: \"通过 `TreeDataUtil` 提供的 `expandAll` 与 `collapseAll` 方法，一键展开或折叠所有 FOLDER 节点。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, useTreeData } from \"../../src/index.js\";\n\nconst buildNodes = (): Node[] => {\n    const fe: Node = { id: \"fe\", type: NodeType.FOLDER, title: \"前端\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n    const be: Node = { id: \"be\", type: NodeType.FOLDER, title: \"后端\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const react: Node = { id: \"react\", type: NodeType.FOLDER, title: \"React\", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };\n    const vue: Node = { id: \"vue\", type: NodeType.FOLDER, title: \"Vue\", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const node: Node = { id: \"node\", type: NodeType.FOLDER, title: \"Node.js\", parent: be, loadState: LoadStateType.LOADING_COMPLETED };\n    const go: Node = { id: \"go\", type: NodeType.FOLDER, title: \"Go\", parent: be, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const hooks: Node = { id: \"hooks\", type: NodeType.FOLDER, title: \"Hooks\", parent: react, loadState: LoadStateType.LOADING_COMPLETED };\n    const components: Node = { id: \"components\", type: NodeType.FOLDER, title: \"Components\", parent: react, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const useState_: Node = { id: \"useState\", type: NodeType.FILE, title: \"useState.ts\", parent: hooks, loadState: LoadStateType.LOADING_COMPLETED };\n    const useEffect_: Node = { id: \"useEffect\", type: NodeType.FILE, title: \"useEffect.ts\", parent: hooks, loadState: LoadStateType.LOADING_COMPLETED };\n    const button: Node = { id: \"button\", type: NodeType.FILE, title: \"Button.tsx\", parent: components, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const composable: Node = { id: \"composable\", type: NodeType.FOLDER, title: \"Composables\", parent: vue, loadState: LoadStateType.LOADING_COMPLETED };\n    const ref_: Node = { id: \"ref\", type: NodeType.FILE, title: \"ref.ts\", parent: composable, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const koa: Node = { id: \"koa\", type: NodeType.FILE, title: \"koa.ts\", parent: node, loadState: LoadStateType.LOADING_COMPLETED };\n    const gin: Node = { id: \"gin\", type: NodeType.FILE, title: \"gin.go\", parent: go, loadState: LoadStateType.LOADING_COMPLETED };\n\n    return [fe, be, react, vue, node, go, hooks, components, composable, useState_, useEffect_, button, ref_, koa, gin];\n};\n\nconst ExpandAllDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());\n\n    return (\n        \u003cdiv className={demoStackStyle}>\n            \u003cdiv className={css`display: flex; gap: ${token.space[\"component-gap\"]}; flex-wrap: wrap;`}>\n                \u003cButton onClick={() => treeDataUtils.expandAll(keys => setExpandedKeys(keys))}>\n                    展开全部\n                \u003c/Button>\n                \u003cButton onClick={() => treeDataUtils.collapseAll(keys => setExpandedKeys(keys))}>\n                    折叠全部\n                \u003c/Button>\n            \u003c/div>\n            \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n                {({ width }) => (\n                    \u003cRcTree\n                        height={320}\n                        width={Math.min(width, 400)}\n                        treeData={treeData}\n                        onTreeNodeChange={setTreeData}\n                        expandedKeys={expandedKeys}\n                        selectedKeys={selectedKeys}\n                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}\n                        onExpandedKeysChange={setExpandedKeys}\n                    />\n                )}\n            \u003c/AutoSizer>\n        \u003c/div>\n    );\n};\n\nexport default ExpandAllDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fexpand-all.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fexpand-all.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "基础展示"
    },
    {
        "id": "docs/demos/show-line.demo.tsx",
        "title": "显示连接线",
        "description": "通过 `showLine` 属性展示树节点之间的连接线。",
        "learning": {
            "components": [
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "disableHeight",
                "height",
                "width",
                "showLine",
                "treeData",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "onSelectedKeysChange",
                "onExpandedKeysChange",
                "loadData"
            ],
            "events": [
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport { treeMeasureStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"显示连接线\",\n    description: \"通过 `showLine` 属性展示树节点之间的连接线。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, useTreeData } from \"../../src/index.js\";\n\nconst ShowLineDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData] = useTreeData();\n\n    const loadData = (parentNode: Node | null) => {\n        if (parentNode === null) {\n            const nodes: Node[] = [];\n            for (let i = 1; i \u003c= 4; i += 1) {\n                nodes.push({\n                    id: i,\n                    type: NodeType.FOLDER,\n                    title: `节点 ${i}`,\n                    parent: null,\n                    loadState: LoadStateType.UNLOADED,\n                });\n            }\n            return Promise.resolve(nodes);\n        }\n\n        return new Promise\u003cNode[]>((resolve) => {\n            setTimeout(() => {\n                const children: Node[] = [];\n                for (let i = 0; i \u003c 3; i += 1) {\n                    children.push({\n                        id: `${parentNode.id}-${i}`,\n                        type: NodeType.FOLDER,\n                        title: `子节点 ${parentNode.id}-${i}`,\n                        parent: parentNode,\n                        loadState: LoadStateType.UNLOADED,\n                    });\n                }\n                resolve(children);\n            }, 300);\n        });\n    };\n\n    return (\n        \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n            {({ width }) => (\n                \u003cRcTree\n                    height={300}\n                    width={Math.min(width, 400)}\n                    showLine\n                    treeData={treeData}\n                    onTreeNodeChange={setTreeData}\n                    expandedKeys={expandedKeys}\n                    selectedKeys={selectedKeys}\n                    onSelectedKeysChange={(selectedKeys: Key[]) => {\n                        setSelectedKeys(selectedKeys);\n                    }}\n                    onExpandedKeysChange={setExpandedKeys}\n                    loadData={loadData}\n                />\n            )}\n        \u003c/AutoSizer>\n    );\n};\n\nexport default ShowLineDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fshow-line.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fshow-line.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "基础展示"
    },
    {
        "id": "docs/demos/icon-and-disabled.demo.tsx",
        "title": "图标插槽与禁用节点",
        "description": "通过 `icon` 字段为节点设置前置图标；`disabled` 字段禁用节点，禁用节点不可点击、不可拖拽、样式置灰。",
        "learning": {
            "components": [
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "disableHeight",
                "height",
                "width",
                "treeData",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "events": [
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport { treeMeasureStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"图标插槽与禁用节点\",\n    description: \"通过 `icon` 字段为节点设置前置图标；`disabled` 字段禁用节点，禁用节点不可点击、不可拖拽、样式置灰。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, useTreeData } from \"../../src/index.js\";\n\nconst folderIcon = (\n    \u003csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"\n        fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpath d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\" />\n    \u003c/svg>\n);\n\nconst fileIcon = (\n    \u003csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"\n        fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003cpath d=\"M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z\" />\n        \u003cpolyline points=\"13 2 13 9 20 9\" />\n    \u003c/svg>\n);\n\nconst lockIcon = (\n    \u003csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"\n        fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n        \u003crect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\" />\n        \u003cpath d=\"M7 11V7a5 5 0 0 1 10 0v4\" />\n    \u003c/svg>\n);\n\nconst buildNodes = (): Node[] => {\n    const root1: Node = { id: \"src\", type: NodeType.FOLDER, title: \"src\", parent: null, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon };\n    const root2: Node = { id: \"public\", type: NodeType.FOLDER, title: \"public（禁用）\", parent: null, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon, disabled: true };\n\n    const components: Node = { id: \"components\", type: NodeType.FOLDER, title: \"components\", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon };\n    const utils: Node = { id: \"utils\", type: NodeType.FOLDER, title: \"utils（禁用）\", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon, disabled: true };\n\n    const appFile: Node = { id: \"app.tsx\", type: NodeType.FILE, title: \"App.tsx\", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };\n    const indexFile: Node = { id: \"index.ts\", type: NodeType.FILE, title: \"index.ts\", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };\n    const secretFile: Node = { id: \"secret.ts\", type: NodeType.FILE, title: \"secret.ts（禁用）\", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: lockIcon, disabled: true };\n\n    const btnFile: Node = { id: \"button.tsx\", type: NodeType.FILE, title: \"Button.tsx\", parent: components, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };\n    const inputFile: Node = { id: \"input.tsx\", type: NodeType.FILE, title: \"Input.tsx\", parent: components, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };\n\n    return [root1, root2, components, utils, appFile, indexFile, secretFile, btnFile, inputFile];\n};\n\nconst IconAndDisabledDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([\"src\", \"components\"]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData] = useTreeData(buildNodes());\n\n    return (\n        \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n            {({ width }) => (\n                \u003cRcTree\n                    height={320}\n                    width={Math.min(width, 400)}\n                    treeData={treeData}\n                    onTreeNodeChange={setTreeData}\n                    expandedKeys={expandedKeys}\n                    selectedKeys={selectedKeys}\n                    onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}\n                    onExpandedKeysChange={setExpandedKeys}\n                />\n            )}\n        \u003c/AutoSizer>\n    );\n};\n\nexport default IconAndDisabledDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Ficon-and-disabled.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Ficon-and-disabled.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "基础展示"
    },
    {
        "id": "docs/demos/checkable.demo.tsx",
        "title": "复选框 checkable",
        "description": "通过 `checkable` 开启复选框模式。选中父节点自动级联选中所有子节点；取消选中子节点时，父节点自动变为半选状态。`checkedKeys` 与 `onCheckedKeysChange` 实现受控。",
        "learning": {
            "components": [
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "disableHeight",
                "height",
                "width",
                "treeData",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "checkable",
                "checkedKeys",
                "onCheckedKeysChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "events": [
                "onTreeNodeChange",
                "onCheckedKeysChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport { treeMeasureStyle, checkableLayoutStyle, checkedSummaryStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"复选框 checkable\",\n    description: \"通过 `checkable` 开启复选框模式。选中父节点自动级联选中所有子节点；取消选中子节点时，父节点自动变为半选状态。`checkedKeys` 与 `onCheckedKeysChange` 实现受控。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, useTreeData } from \"../../src/index.js\";\n\nconst buildNodes = (): Node[] => {\n    const fe: Node = { id: \"fe\", type: NodeType.FOLDER, title: \"前端技术\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n    const be: Node = { id: \"be\", type: NodeType.FOLDER, title: \"后端技术\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const react: Node = { id: \"react\", type: NodeType.FOLDER, title: \"React 生态\", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };\n    const css: Node = { id: \"css\", type: NodeType.FOLDER, title: \"CSS 方案\", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const spring: Node = { id: \"spring\", type: NodeType.FOLDER, title: \"Spring 生态\", parent: be, loadState: LoadStateType.LOADING_COMPLETED };\n    const node: Node = { id: \"node\", type: NodeType.FOLDER, title: \"Node.js\", parent: be, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const rReact: Node = { id: \"r-react\", type: NodeType.FILE, title: \"React\", parent: react, loadState: LoadStateType.LOADING_COMPLETED };\n    const rRouter: Node = { id: \"r-router\", type: NodeType.FILE, title: \"React Router\", parent: react, loadState: LoadStateType.LOADING_COMPLETED };\n    const rQuery: Node = { id: \"r-query\", type: NodeType.FILE, title: \"TanStack Query\", parent: react, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const cCrabCss: Node = { id: \"c-crab-css\", type: NodeType.FILE, title: \"Crab CSS\", parent: css, loadState: LoadStateType.LOADING_COMPLETED };\n    const cTailwind: Node = { id: \"c-tailwind\", type: NodeType.FILE, title: \"Tailwind CSS\", parent: css, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const sBoot: Node = { id: \"s-boot\", type: NodeType.FILE, title: \"Spring Boot\", parent: spring, loadState: LoadStateType.LOADING_COMPLETED };\n    const sCloud: Node = { id: \"s-cloud\", type: NodeType.FILE, title: \"Spring Cloud\", parent: spring, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const nKoa: Node = { id: \"n-koa\", type: NodeType.FILE, title: \"Koa\", parent: node, loadState: LoadStateType.LOADING_COMPLETED };\n    const nNestjs: Node = { id: \"n-nestjs\", type: NodeType.FILE, title: \"NestJS\", parent: node, loadState: LoadStateType.LOADING_COMPLETED };\n\n    return [fe, be, react, css, spring, node, rReact, rRouter, rQuery, cCrabCss, cTailwind, sBoot, sCloud, nKoa, nNestjs];\n};\n\nconst CheckableDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([\"fe\", \"be\", \"react\", \"css\"]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [checkedKeys, setCheckedKeys] = useState\u003cKey[]>([]);\n    const [halfCheckedKeys, setHalfCheckedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData] = useTreeData(buildNodes());\n\n    return (\n        \u003cdiv className={checkableLayoutStyle}>\n            \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n                {({ width }) => (\n                    \u003cRcTree\n                        height={320}\n                        width={Math.min(width, 320)}\n                        treeData={treeData}\n                        onTreeNodeChange={setTreeData}\n                        expandedKeys={expandedKeys}\n                        selectedKeys={selectedKeys}\n                        checkable\n                        checkedKeys={checkedKeys}\n                        onCheckedKeysChange={(keys, { halfCheckedKeys: half }) => {\n                            setCheckedKeys(keys);\n                            setHalfCheckedKeys(half);\n                        }}\n                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}\n                        onExpandedKeysChange={setExpandedKeys}\n                    />\n                )}\n            \u003c/AutoSizer>\n            \u003cdiv className={checkedSummaryStyle} aria-live=\"polite\">\n                \u003cdiv>\u003cstrong>已选中（{checkedKeys.length}）：\u003c/strong>\u003c/div>\n                {checkedKeys.length === 0\n                    ? \u003cdiv>无\u003c/div>\n                    : checkedKeys.map(k => \u003cdiv key={String(k)}>· {k}\u003c/div>)\n                }\n                {halfCheckedKeys.length > 0 && (\n                    \u003c>\n                        \u003cdiv style={{ marginTop: \"0.5rem\" }}>\u003cstrong>半选（{halfCheckedKeys.length}）：\u003c/strong>\u003c/div>\n                        {halfCheckedKeys.map(k => \u003cdiv key={String(k)}>· {k}\u003c/div>)}\n                    \u003c/>\n                )}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CheckableDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fcheckable.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fcheckable.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "选择与筛选"
    },
    {
        "id": "docs/demos/filter.demo.tsx",
        "title": "搜索过滤 filterTreeNode",
        "description": "通过 `filterTreeNode` prop 过滤节点。返回 `true` 的节点及其所有祖先节点均会保留显示，其余节点被隐藏。结合展开所有匹配路径，可实现完整的搜索体验。",
        "learning": {
            "components": [
                "LineEdit",
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "label",
                "type",
                "placeholder",
                "value",
                "onValueChange",
                "disableHeight",
                "height",
                "width",
                "treeData",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys"
            ],
            "events": [
                "onValueChange",
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport { treeMeasureStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"搜索过滤 filterTreeNode\",\n    description: \"通过 `filterTreeNode` prop 过滤节点。返回 `true` 的节点及其所有祖先节点均会保留显示，其余节点被隐藏。结合展开所有匹配路径，可实现完整的搜索体验。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport semanticToken from \"@crab-dev/rc-token-semantic\";\nimport { type Key, useEffect, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, useTreeData } from \"../../src/index.js\";\n\nconst demoStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${semanticToken.space[\"stack-gap\"]};\n`;\n\nconst searchGroupStyle = css`\n    display: flex;\n    flex-direction: column;\n    align-items: stretch;\n    gap: ${semanticToken.space[\"inline-gap\"]};\n    width: min(calc(${semanticToken.size[\"touch-target\"]} * 6), 100%);\n`;\n\nconst buildNodes = (): Node[] => {\n    const fe: Node = { id: \"fe\", type: NodeType.FOLDER, title: \"前端\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n    const be: Node = { id: \"be\", type: NodeType.FOLDER, title: \"后端\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n    const mobile: Node = { id: \"mobile\", type: NodeType.FOLDER, title: \"移动端\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const react: Node = { id: \"react\", type: NodeType.FOLDER, title: \"React\", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };\n    const vue: Node = { id: \"vue\", type: NodeType.FOLDER, title: \"Vue\", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };\n    const angular: Node = { id: \"angular\", type: NodeType.FOLDER, title: \"Angular\", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const node: Node = { id: \"node\", type: NodeType.FOLDER, title: \"Node.js\", parent: be, loadState: LoadStateType.LOADING_COMPLETED };\n    const spring: Node = { id: \"spring\", type: NodeType.FOLDER, title: \"Spring Boot\", parent: be, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const ios: Node = { id: \"ios\", type: NodeType.FOLDER, title: \"iOS\", parent: mobile, loadState: LoadStateType.LOADING_COMPLETED };\n    const android: Node = { id: \"android\", type: NodeType.FOLDER, title: \"Android\", parent: mobile, loadState: LoadStateType.LOADING_COMPLETED };\n    const rn: Node = { id: \"rn\", type: NodeType.FOLDER, title: \"React Native\", parent: mobile, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const reactHooks: Node = { id: \"hooks\", type: NodeType.FILE, title: \"Hooks 指南.md\", parent: react, loadState: LoadStateType.LOADING_COMPLETED };\n    const reactRouter: Node = { id: \"router\", type: NodeType.FILE, title: \"React Router.md\", parent: react, loadState: LoadStateType.LOADING_COMPLETED };\n    const vueComposable: Node = { id: \"composable\", type: NodeType.FILE, title: \"Composable API.md\", parent: vue, loadState: LoadStateType.LOADING_COMPLETED };\n    const koa: Node = { id: \"koa\", type: NodeType.FILE, title: \"Koa 中间件.md\", parent: node, loadState: LoadStateType.LOADING_COMPLETED };\n    const jpa: Node = { id: \"jpa\", type: NodeType.FILE, title: \"Spring Data JPA.md\", parent: spring, loadState: LoadStateType.LOADING_COMPLETED };\n    const swift: Node = { id: \"swift\", type: NodeType.FILE, title: \"Swift 基础.md\", parent: ios, loadState: LoadStateType.LOADING_COMPLETED };\n    const kotlin: Node = { id: \"kotlin\", type: NodeType.FILE, title: \"Kotlin 入门.md\", parent: android, loadState: LoadStateType.LOADING_COMPLETED };\n    const rnNav: Node = { id: \"rn-nav\", type: NodeType.FILE, title: \"Navigation.md\", parent: rn, loadState: LoadStateType.LOADING_COMPLETED };\n\n    return [fe, be, mobile, react, vue, angular, node, spring, ios, android, rn,\n        reactHooks, reactRouter, vueComposable, koa, jpa, swift, kotlin, rnNav];\n};\n\nconst ALL_NODES = buildNodes();\n\nconst FilterDemo = () => {\n    const [keyword, setKeyword] = useState(\"\");\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData] = useTreeData(ALL_NODES);\n\n    const filterFn = keyword.trim()\n        ? (node: Node) => {\n            const title = typeof node.title === \"string\" ? node.title : \"\";\n            return title.toLowerCase().includes(keyword.trim().toLowerCase());\n        }\n        : undefined;\n\n    useEffect(() => {\n        if (!keyword.trim()) {\n            setExpandedKeys([]);\n            return;\n        }\n        const matched = ALL_NODES.filter(n => {\n            const title = typeof n.title === \"string\" ? n.title : \"\";\n            return title.toLowerCase().includes(keyword.trim().toLowerCase());\n        });\n        const ancestorIds = new Set\u003cKey>();\n        matched.forEach(n => {\n            let p: Node | null = n.parent;\n            while (p) {\n                ancestorIds.add(p.id);\n                p = p.parent;\n            }\n        });\n        setExpandedKeys([...ancestorIds]);\n    }, [keyword]);\n\n    return (\n        \u003cdiv className={demoStyle}>\n            \u003cdiv className={searchGroupStyle}>\n                \u003cLineEdit\n                    label=\"搜索树节点\"\n                    type=\"search\"\n                    placeholder=\"输入节点名称\"\n                    value={keyword}\n                    onValueChange={next => setKeyword(next)}\n                />\n            \u003c/div>\n            \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n                {({ width }) => (\n                    \u003cRcTree\n                        height={300}\n                        width={Math.min(width, 400)}\n                        treeData={treeData}\n                        onTreeNodeChange={setTreeData}\n                        expandedKeys={expandedKeys}\n                        selectedKeys={selectedKeys}\n                        filterTreeNode={filterFn}\n                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}\n                        onExpandedKeysChange={setExpandedKeys}\n                    />\n                )}\n            \u003c/AutoSizer>\n        \u003c/div>\n    );\n};\n\nexport default FilterDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Ffilter.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Ffilter.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "选择与筛选"
    },
    {
        "id": "docs/demos/draggable.demo.tsx",
        "title": "拖拽排序",
        "description": "通过 `draggable` 属性启用拖拽功能，支持节点的拖拽排序和层级调整。",
        "learning": {
            "components": [
                "AutoSizer",
                "RcTree",
                "Button"
            ],
            "props": [
                "disableHeight",
                "height",
                "width",
                "treeData",
                "draggable",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "onSelectedKeysChange",
                "rendererContextMenu",
                "onDragEnd",
                "onExpandedKeysChange"
            ],
            "events": [
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onDragEnd",
                "onExpandedKeysChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport Button from \"@crab-dev/rc-button\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { treeMeasureStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"拖拽排序\",\n    description: \"通过 `draggable` 属性启用拖拽功能，支持节点的拖拽排序和层级调整。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, getTreeNodeDepth, useTreeData } from \"../../src/index.js\";\n\nconst contextActionsStyle = css`\n    display: flex;\n    flex-direction: column;\n    align-items: stretch;\n    gap: ${token.space[\"inline-gap\"]};\n    min-width: calc(${token.size[\"touch-target\"]} * 4);\n    padding: ${token.space[\"component-gap\"]};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.shape.card};\n    background: ${token.color.surface.overlay};\n    color: ${token.color.text.primary};\n    box-shadow: ${token.shadow.overlay};\n`;\n\nconst DraggableDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData, treeDataUtils] = useTreeData();\n\n    const loadData = (parentNode: Node | null) => {\n        if (parentNode === null) {\n            const nodes: Node[] = [];\n            for (let i = 1; i \u003c 2; i += 1) {\n                nodes.push({\n                    id: i,\n                    type: NodeType.FOLDER,\n                    title: `节点 ${i}`,\n                    parent: null,\n                    loadState: LoadStateType.UNLOADED,\n                });\n            }\n            return new Promise\u003cNode[]>((resolve) => {\n                resolve(nodes);\n            });\n        } else {\n            const depth = getTreeNodeDepth(parentNode);\n            if (depth \u003c= 10) {\n                return new Promise\u003cNode[]>((resolve) => {\n                    setTimeout(() => {\n                        const data: Node[] = [];\n                        for (let i = 0; i \u003c 2065; i += 1) {\n                            if (i % 9 === 0) {\n                                data.push({\n                                    id: `${parentNode.id}-${i}`,\n                                    type: NodeType.FOLDER,\n                                    title: `节点 - ${parentNode.id} - ${i} 这是一个非常非常非常长的节点信息`,\n                                    parent: parentNode,\n                                    loadState: LoadStateType.UNLOADED,\n                                });\n                            } else {\n                                data.push({\n                                    id: `${parentNode.id}-${i}`,\n                                    type: NodeType.FOLDER,\n                                    title: `节点 - ${parentNode.id} - ${i}`,\n                                    parent: parentNode,\n                                    loadState: LoadStateType.UNLOADED,\n                                });\n                            }\n                        }\n                        resolve(data);\n                    }, 0);\n                });\n            }\n            return new Promise\u003cNode[]>((resolve) => {\n                resolve([]);\n            });\n        }\n    };\n\n    return (\n        \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n            {({ width }) => (\n                \u003cRcTree\n                    height={400}\n                    width={Math.min(width, 300)}\n                    treeData={treeData}\n                    draggable\n                    onTreeNodeChange={setTreeData}\n                    expandedKeys={expandedKeys}\n                    selectedKeys={selectedKeys}\n                    onSelectedKeysChange={(selectedKeys: Key[]) => {\n                        setSelectedKeys(selectedKeys);\n                    }}\n                    rendererContextMenu={({ node, hide }: { node: Node | null, hide: () => void }) => (\n                        \u003cdiv className={contextActionsStyle} role=\"group\" aria-label=\"节点操作\">\n                            \u003cButton appearance=\"text\" disabled title=\"本示例仅演示删除和刷新\">添加\u003c/Button>\n                            \u003cButton appearance=\"text\" danger disabled={node === null} onClick={() => {\n                                if (node !== null) treeDataUtils.delete(node.id);\n                                hide();\n                            }}>删除\u003c/Button>\n                            \u003cButton appearance=\"text\" onClick={() => {\n                                treeDataUtils.reloadChildrenByParent({ parent: node, loadData, expandedKeys });\n                                hide();\n                            }}>{node === null ? \"刷新所有节点\" : \"刷新子节点数据\"}\u003c/Button>\n                        \u003c/div>\n                    )}\n                    // wake-lint-disable-next-line ts/no-explicit-any -- Existing test mock boundary.\n                    onDragEnd={(event: any, context: any) => {\n                        const over = event.over;\n                        const active = event.active;\n                        if (context.overState?.state != null) {\n                            treeDataUtils.moveNodeOnDrag(active!.id, over!.id, context.overState.state);\n                        }\n                    }}\n                    onExpandedKeysChange={setExpandedKeys}\n                    loadData={loadData}\n                />\n            )}\n        \u003c/AutoSizer>\n    );\n};\n\nexport default DraggableDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fdraggable.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fdraggable.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/allow-drop.demo.tsx",
        "title": "拖拽限制 allowDrop",
        "description": "通过 `allowDrop` 回调控制节点的放置规则。本示例只允许同级排序：禁止 INSIDE（移入子节点），也禁止跨层级的 DOWN/UPWARD（那样会改变父节点）。",
        "learning": {
            "components": [
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "disableHeight",
                "height",
                "width",
                "treeData",
                "draggable",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "allowDrop",
                "onSelectedKeysChange",
                "onExpandedKeysChange",
                "onDragEnd"
            ],
            "events": [
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange",
                "onDragEnd"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport { treeMeasureStyle, demoStackStyle, demoNoteStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"拖拽限制 allowDrop\",\n    description: \"通过 `allowDrop` 回调控制节点的放置规则。本示例只允许同级排序：禁止 INSIDE（移入子节点），也禁止跨层级的 DOWN/UPWARD（那样会改变父节点）。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, OverStateEnum, type Node, type TreeProps, useTreeData } from \"../../src/index.js\";\n\nconst buildNodes = (): Node[] => {\n    const nodes: Node[] = [];\n    for (let i = 1; i \u003c= 5; i++) {\n        const folder: Node = {\n            id: `folder-${i}`,\n            type: NodeType.FOLDER,\n            title: `文件夹 ${i}`,\n            parent: null,\n            loadState: LoadStateType.LOADING_COMPLETED,\n            priority: i,\n        };\n        nodes.push(folder);\n        for (let j = 1; j \u003c= 3; j++) {\n            nodes.push({\n                id: `file-${i}-${j}`,\n                type: NodeType.FILE,\n                title: `文件 ${i}-${j}`,\n                parent: folder,\n                loadState: LoadStateType.LOADING_COMPLETED,\n                priority: j,\n            });\n        }\n    }\n    return nodes;\n};\n\nconst AllowDropDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([\"folder-1\", \"folder-2\"]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());\n\n    return (\n        \u003cdiv className={demoStackStyle}>\n            \u003cp className={demoNoteStyle}>\n                当前规则：只允许同级排序，禁止跨层级移动（拖入文件夹或移出文件夹）。\n            \u003c/p>\n            \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n                {({ width }) => (\n                    \u003cRcTree\n                        height={360}\n                        width={Math.min(width, 400)}\n                        treeData={treeData}\n                        draggable\n                        onTreeNodeChange={setTreeData}\n                        expandedKeys={expandedKeys}\n                        selectedKeys={selectedKeys}\n                        allowDrop={({ position, dragNode, targetNode }) => {\n                            if (position === OverStateEnum.INSIDE) return false;\n                            // DOWN/UPWARD 会把 dragNode.parent 设为 targetNode.parent\n                            // 只有同层级（相同 parent）才允许排序，避免跨文件夹移动\n                            const dragParentId = dragNode.parent?.id ?? null;\n                            const targetParentId = targetNode.parent?.id ?? null;\n                            return dragParentId === targetParentId;\n                        }}\n                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}\n                        onExpandedKeysChange={setExpandedKeys}\n                        onDragEnd={((event, context) => {\n                            if (context.overState?.state != null && event.over) {\n                                treeDataUtils.moveNodeOnDrag(event.active.id, event.over.id, context.overState.state);\n                            }\n                        }) as TreeProps[\"onDragEnd\"]}\n                    />\n                )}\n            \u003c/AutoSizer>\n        \u003c/div>\n    );\n};\n\nexport default AllowDropDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fallow-drop.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fallow-drop.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/default-editor.demo.tsx",
        "title": "默认节点编辑器",
        "description": "使用 Tree 自带编辑器重命名节点，展示提交与取消回调次数。Enter 保存、Escape 取消；输入法组合期间继续输入，键盘结束后由 Tree 恢复焦点。",
        "learning": {
            "components": [
                "AutoSizer",
                "Tree",
                "Button"
            ],
            "props": [
                "disableHeight",
                "aria-label",
                "width",
                "height",
                "treeData",
                "onTreeNodeChange",
                "defaultExpandedKeys",
                "selectedKeys",
                "onSelectedKeysChange",
                "draggable",
                "onNodeDoubleClick",
                "onEditEnd"
            ],
            "events": [
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onNodeDoubleClick",
                "onEditEnd",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { type Key, useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport Button from \"@crab-dev/rc-button\";\nimport Tree, { LoadStateType, NodeEditStateType, NodeType, type Node } from \"@crab-dev/rc-tree\";\n\nexport const meta = {\n    title: \"默认节点编辑器\",\n    description: \"使用 Tree 自带编辑器重命名节点，展示提交与取消回调次数。Enter 保存、Escape 取消；输入法组合期间继续输入，键盘结束后由 Tree 恢复焦点。\",\n};\n\nconst documentId = \"default-editor-document\";\nconst richDocumentId = \"default-editor-rich-title\";\nconst createNodes = (): Node[] => {\n    const folder: Node = {\n        id: \"default-editor-folder\",\n        title: \"示例文件\",\n        parent: null,\n        type: NodeType.FOLDER,\n        loadState: LoadStateType.LOADING_COMPLETED,\n    };\n    return [folder, {\n        id: documentId,\n        title: \"默认编辑文档.md\",\n        parent: folder,\n        type: NodeType.FILE,\n        loadState: LoadStateType.LOADING_COMPLETED,\n    }, {\n        id: richDocumentId,\n        title: \u003cspan>\u003cspan aria-hidden=\"true\">装饰图标\u003c/span>\u003cstrong>使用指南\u003c/strong>\u003c/span>,\n        parent: folder,\n        type: NodeType.FILE,\n        loadState: LoadStateType.LOADING_COMPLETED,\n    }];\n};\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"stack-gap\"]};\n    min-width: 0;\n`;\nconst measureStyle = css`width: 100%; min-width: 0; max-width: 100%; height: auto;`;\nconst noteStyle = css`\n    margin: 0;\n    color: ${token.color.text.secondary};\n    font-size: ${token.font.size.body};\n    line-height: ${token.font[\"line-height\"].body};\n    overflow-wrap: anywhere;\n`;\nconst actionStyle = css`align-self: flex-start;`;\n\nconst DefaultEditorDemo = () => {\n    const [nodes, setNodes] = useState(createNodes);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [counts, setCounts] = useState({ commits: 0, cancels: 0 });\n    const [lastAction, setLastAction] = useState(\"尚未编辑。\");\n\n    const finishEdit = (node: Node, value: string, cancelled: boolean) => {\n        setNodes(current => current.map(item => item.id === node.id\n            ? { ...item, title: cancelled ? item.title : value, editState: undefined }\n            : item));\n        setCounts(current => ({\n            commits: current.commits + (cancelled ? 0 : 1),\n            cancels: current.cancels + (cancelled ? 1 : 0),\n        }));\n        setLastAction(cancelled ? \"最近操作：取消。\" : `最近提交：${value}。`);\n    };\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cp className={noteStyle}>\n                双击“默认编辑文档.md”重命名。Enter 保存，Escape 取消；输入法组合期间不会结束编辑。\n                点击树外控件会提交当前文字并保留新焦点；键盘保存或取消后由默认编辑器返回树。\n                另一个“使用指南”节点展示富文本名称：装饰文字标记为 aria-hidden；编辑器名称应仅为“使用指南”，初始输入为空，Escape 保留原富文本标题。\n            \u003c/p>\n            \u003cAutoSizer disableHeight className={measureStyle}>\n                {({ width }) => (\n                    \u003cTree\n                        aria-label=\"默认编辑器文件树\"\n                        width={Math.min(width, 460)}\n                        height={160}\n                        treeData={nodes}\n                        onTreeNodeChange={setNodes}\n                        defaultExpandedKeys={[\"default-editor-folder\"]}\n                        selectedKeys={selectedKeys}\n                        onSelectedKeysChange={setSelectedKeys}\n                        draggable={false}\n                        onNodeDoubleClick={node => {\n                            if (node.id !== documentId && node.id !== richDocumentId) return;\n                            setSelectedKeys([node.id]);\n                            setNodes(current => current.map(item => item.id === node.id\n                                ? { ...item, editState: NodeEditStateType.UPDATE }\n                                : item));\n                        }}\n                        onEditEnd={finishEdit}\n                    />\n                )}\n            \u003c/AutoSizer>\n            \u003cButton\n                className={actionStyle}\n                aria-label=\"查看默认节点名称\"\n                onClick={() => setLastAction(`当前名称：${nodes.find(node => node.id === documentId)?.title ?? \"\"}。`)}\n            >\n                查看当前名称\n            \u003c/Button>\n            \u003cp\n                className={noteStyle}\n                role=\"status\"\n                aria-label=\"默认编辑器回调\"\n                data-commit-count={counts.commits}\n                data-cancel-count={counts.cancels}\n            >\n                提交 {counts.commits} 次，取消 {counts.cancels} 次。{lastAction}\n            \u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default DefaultEditorDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fdefault-editor.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fdefault-editor.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/inline-edit.demo.tsx",
        "title": "Inline 节点编辑",
        "description": "双击节点标题进入 inline 编辑模式。本例通过 renderEditInput 复用 LineEdit，演示字数限制与实时校验。onCommit(value) 提交，onCancel() 取消。",
        "learning": {
            "components": [
                "LineEdit",
                "Button",
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "ref",
                "bordered",
                "aria-label",
                "aria-invalid",
                "status",
                "value",
                "onValueChange",
                "onKeyDown",
                "onBlur",
                "onClick",
                "disableHeight",
                "height"
            ],
            "events": [
                "onValueChange",
                "onKeyDown",
                "onBlur",
                "onClick",
                "onTreeNodeChange",
                "onSelectedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit, { TokenVars as lineEditVars } from \"@crab-dev/rc-line-edit\";\nimport { css, cx } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { treeMeasureStyle, demoStackStyle, demoNoteStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"Inline 节点编辑\",\n    description: \"双击节点标题进入 inline 编辑模式。本例通过 renderEditInput 复用 LineEdit，演示字数限制与实时校验。onCommit(value) 提交，onCancel() 取消。\",\n};\n\nimport { type Key, useState, useRef, useEffect, useLayoutEffect } from \"react\";\nimport RcTree, { LoadStateType, NodeType, NodeEditStateType, TokenVars as treeVars, type Node, useTreeData } from \"@crab-dev/rc-tree\";\n\n/** Private example helper: a custom editor owns focus after keyboard completion. */\nexport function useKeyboardEditFocus() {\n    const [attempt, setAttempt] = useState\u003csymbol | null>(null);\n    // Mutable ownership lasts only until this attempt's first React commit.\n    const pendingFocus = useRef\u003c{\n        attempt: symbol;\n        input: HTMLInputElement;\n        row: HTMLElement;\n        tree: HTMLElement;\n        moved: boolean;\n        cleanup: () => void;\n    } | null>(null);\n    useLayoutEffect(() => {\n        const pending = pendingFocus.current;\n        if (!pending || pending.attempt !== attempt) return;\n        pendingFocus.current = null;\n        pending.cleanup();\n        const document = pending.input.ownerDocument;\n        if (!pending.moved && !pending.input.isConnected && pending.row.isConnected\n            && pending.tree.contains(pending.row)\n            && (document.activeElement === document.body || document.activeElement === null)) {\n            pending.tree.focus({ preventScroll: true });\n        }\n    });\n    useLayoutEffect(() => () => {\n        pendingFocus.current?.cleanup();\n        pendingFocus.current = null;\n    }, []);\n\n    return (input: HTMLInputElement, finish: () => void) => {\n        const row = input.closest\u003cHTMLElement>('[role=\"treeitem\"]');\n        const tree = row?.closest\u003cHTMLElement>('[role=\"tree\"]');\n        const document = input.ownerDocument;\n        pendingFocus.current?.cleanup();\n        pendingFocus.current = null;\n        if (row && tree && document.activeElement === input) {\n            const pending = { attempt: Symbol('custom-tree-edit-end'), input, row, tree, moved: false, cleanup: () => {\n                document.removeEventListener('focusin', onFocus);\n            } };\n            const onFocus = (event: Event) => { if (event.target !== input) pending.moved = true; };\n            document.addEventListener('focusin', onFocus);\n            pendingFocus.current = pending;\n            // Also commit when a controlled owner rejects completion. Never let\n            // a later, unrelated removal reuse this keyboard focus request.\n            setAttempt(pending.attempt);\n        }\n        const request = pendingFocus.current;\n        finish();\n        // Respect an explicit synchronous blur while the editor still exists.\n        // A native removal may emit blur before isConnected changes, so observing\n        // blur itself cannot distinguish removal from a consumer's decision.\n        if (request && pendingFocus.current === request && input.isConnected\n            && document.activeElement !== input) {\n            request.moved = true;\n        }\n    };\n}\n\nlet nextId = 100;\n\nconst buildNodes = (): Node[] => {\n    const root: Node = { id: \"docs\", type: NodeType.FOLDER, title: \"文档\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n    const n1: Node = { id: \"guide\", type: NodeType.FOLDER, title: \"使用指南\", parent: root, loadState: LoadStateType.LOADING_COMPLETED };\n    const n2: Node = { id: \"api\", type: NodeType.FOLDER, title: \"API 参考\", parent: root, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const f1: Node = { id: \"quick-start\", type: NodeType.FILE, title: \"快速开始.md\", parent: n1, loadState: LoadStateType.LOADING_COMPLETED };\n    const f2: Node = { id: \"install\", type: NodeType.FILE, title: \"安装说明.md\", parent: n1, loadState: LoadStateType.LOADING_COMPLETED };\n    const f3: Node = { id: \"tree-api\", type: NodeType.FILE, title: \"Tree.md\", parent: n2, loadState: LoadStateType.LOADING_COMPLETED };\n    const f4: Node = { id: \"button-api\", type: NodeType.FILE, title: \"Button.md\", parent: n2, loadState: LoadStateType.LOADING_COMPLETED };\n\n    return [root, n1, n2, f1, f2, f3, f4];\n};\n\nconst MAX_LEN = 20;\n\nconst editorStyle = css`\n    display: flex;\n    align-items: center;\n    gap: ${token.space[\"inline-gap\"]};\n    flex: 1 1 auto;\n    min-width: 0;\n    height: 100%;\n    min-height: 0;\n`;\nconst inputStyle = css`\n    /* Same embedded contract as Tree's default editor. The real row supplies\n       its resolved height; standalone MD3 fields retain their 56px minimum. */\n    ${lineEditVars['root.touch.min-height']}: 0px;\n    ${lineEditVars['root.outline-color-focus']}: currentColor;\n    ${lineEditVars['root.outline-width-focus']}: var(${treeVars['root.outline-width-focus']});\n    ${lineEditVars['root.outline-offset-focus']}: calc(-1 * var(${treeVars['root.outline-width-focus']}));\n    flex: 1 1 auto;\n    min-width: 0;\n    font-size: inherit;\n    line-height: inherit;\n    && {\n        height: 100%;\n        max-height: 100%;\n        padding-inline: 0.375rem;\n        border-radius: var(${treeVars['root.border-radius']});\n        color: inherit;\n    }\n    /* A borderless editor still has a visible invalid state, paired with its\n       own background instead of error text on an arbitrary selected row. */\n    &&[data-status=\"error\"] {\n        color: ${token.color.feedback.error.text};\n        background-color: ${token.color.feedback.error.background};\n    }\n`;\n/* The selected row owns ordinary text; errors own both sides of their pair. */\nconst countStyle = css`font-size: ${token.font.size.caption}; flex-shrink: 0; color: inherit;`;\nconst errorCountStyle = css`\n    color: ${token.color.feedback.error.text};\n    background-color: ${token.color.feedback.error.background};\n`;\nconst createButtonStyle = css`align-self: flex-start;`;\n\ninterface CustomInputProps {\n    defaultValue: string;\n    onCommit: (value: string) => void;\n    onCancel: () => void;\n    onKeyboardEnd: (input: HTMLInputElement, finish: () => void) => void;\n}\n\n// Exported only by this example so the published-demo regression uses the same editor.\nexport const CustomInput = ({ defaultValue, onCommit, onCancel, onKeyboardEnd }: CustomInputProps) => {\n    // 可变实例状态：编辑器挂载时聚焦并选择文本。\n    const inputRef = useRef\u003cHTMLInputElement>(null);\n    const [value, setValue] = useState(defaultValue);\n    // 可变实例状态：Enter 后的 blur 不能重复提交同一次编辑。\n    const committed = useRef(false);\n\n    useEffect(() => {\n        inputRef.current?.focus();\n        inputRef.current?.select();\n    }, []);\n\n    const commit = (v: string) => {\n        if (committed.current) return;\n        committed.current = true;\n        onCommit(v);\n    };\n\n    const cancel = () => {\n        if (committed.current) return;\n        committed.current = true;\n        onCancel();\n    };\n\n    const isError = value.trim() === \"\" || value.length > MAX_LEN;\n\n    return (\n        \u003cdiv\n            className={editorStyle}\n            onClick={(e) => e.stopPropagation()}\n        >\n            \u003cLineEdit\n                ref={inputRef}\n                bordered={false}\n                aria-label=\"节点名称\"\n                aria-invalid={isError}\n                status={isError ? \"error\" : undefined}\n                className={inputStyle}\n                value={value}\n                onValueChange={(next) => setValue(next)}\n                onKeyDown={(e) => {\n                    e.stopPropagation();\n                    if (e.nativeEvent.isComposing || e.keyCode === 229) return;\n                    if (e.key === \"Enter\" && !isError) {\n                        e.preventDefault();\n                        onKeyboardEnd(e.currentTarget, () => commit(value.trim()));\n                    } else if (e.key === \"Escape\") {\n                        e.preventDefault();\n                        onKeyboardEnd(e.currentTarget, cancel);\n                    } else if (e.key === \"Enter\") {\n                        e.preventDefault();\n                    }\n                }}\n                onBlur={() => {\n                    if (!isError) {\n                        commit(value.trim());\n                    } else {\n                        cancel();\n                    }\n                }}\n            />\n            \u003cspan data-node-editor-count=\"\" className={cx(countStyle, isError && errorCountStyle)}>\n                {value.length}/{MAX_LEN}\n            \u003c/span>\n        \u003c/div>\n    );\n};\n\nconst InlineEditDemo = () => {\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([\"docs\", \"guide\", \"api\"]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());\n    // 自定义编辑器负责焦点；拒绝、主动移焦或卸载会结束本次恢复所有权。\n    const finishKeyboardEdit = useKeyboardEditFocus();\n\n    const handleEditEnd = (node: Node, newTitle: string, cancelled: boolean) => {\n        if (cancelled || newTitle.trim() === \"\") {\n            treeDataUtils.update({ ...node, editState: undefined });\n        } else {\n            treeDataUtils.update({ ...node, title: newTitle.trim(), editState: undefined });\n        }\n    };\n\n    return (\n        \u003cdiv className={demoStackStyle}>\n            \u003cp className={demoNoteStyle}>\n                双击节点名称进入编辑，\u003ckbd>Enter\u003c/kbd> 保存，\u003ckbd>Esc\u003c/kbd> 取消。\n                自定义编辑器复用 LineEdit 的无边框嵌入模式，跟随当前树行高度，不改变虚拟列表测量。\n                字数限制为最多 {MAX_LEN} 字，超出或为空时失焦自动取消。\n                键盘保存或取消后返回树；校验失败保持输入焦点，点击其它控件退出时不抢回焦点。\n            \u003c/p>\n            \u003cButton\n                className={createButtonStyle}\n                onClick={() => {\n                    const newNode: Node = {\n                        id: `new-${nextId++}`,\n                        type: NodeType.FILE,\n                        title: \"新文件\",\n                        parent: null,\n                        loadState: LoadStateType.LOADING_COMPLETED,\n                        editState: NodeEditStateType.UPDATE,\n                    };\n                    setTreeData(prev => [...prev, newNode]);\n                    setSelectedKeys([newNode.id]);\n                }}\n            >\n                + 新建根节点（直接进入编辑）\n            \u003c/Button>\n            \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n                {({ width }) => (\n                    \u003cRcTree\n                        height={320}\n                        width={Math.min(width, 460)}\n                        treeData={treeData}\n                        onTreeNodeChange={setTreeData}\n                        expandedKeys={expandedKeys}\n                        selectedKeys={selectedKeys}\n                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}\n                        onExpandedKeysChange={setExpandedKeys}\n                        onNodeDoubleClick={(node) => {\n                            if (node.disabled) return;\n                            setSelectedKeys([node.id]);\n                            treeDataUtils.update({ ...node, editState: NodeEditStateType.UPDATE });\n                        }}\n                        onEditEnd={handleEditEnd}\n                        renderEditInput={({ defaultValue, onCommit, onCancel }) => (\n                            \u003cCustomInput\n                                defaultValue={defaultValue}\n                                onCommit={onCommit}\n                                onCancel={onCancel}\n                                onKeyboardEnd={finishKeyboardEdit}\n                            />\n                        )}\n                    />\n                )}\n            \u003c/AutoSizer>\n        \u003c/div>\n    );\n};\n\nexport default InlineEditDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Finline-edit.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Finline-edit.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/keyboard.demo.tsx",
        "title": "键盘导航",
        "description": "点击树组件后可使用键盘操作：`↑↓` 移动焦点，LTR 时 `→` 展开文件夹、`←` 折叠或跳转到父节点；RTL 时左右键交换。`Enter` 选中/取消选中当前节点。",
        "learning": {
            "components": [
                "AutoSizer",
                "RcTree"
            ],
            "props": [
                "disableHeight",
                "height",
                "width",
                "treeData",
                "onTreeNodeChange",
                "expandedKeys",
                "selectedKeys",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "events": [
                "onTreeNodeChange",
                "onSelectedKeysChange",
                "onExpandedKeysChange"
            ],
            "hasState": true
        },
        "sourceCode": "import AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport { treeMeasureStyle, demoStackStyle, demoNoteStyle, keyboardHelpStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"键盘导航\",\n    description: \"点击树组件后可使用键盘操作：`↑↓` 移动焦点，LTR 时 `→` 展开文件夹、`←` 折叠或跳转到父节点；RTL 时左右键交换。`Enter` 选中/取消选中当前节点。\",\n};\n\nimport { type Key, useState } from \"react\";\nimport RcTree, { LoadStateType, NodeType, type Node, useTreeData } from \"../../src/index.js\";\n\nconst buildNodes = (): Node[] => {\n    const root1: Node = { id: \"r1\", type: NodeType.FOLDER, title: \"文档\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n    const root2: Node = { id: \"r2\", type: NodeType.FOLDER, title: \"图片\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n    const root3: Node = { id: \"r3\", type: NodeType.FOLDER, title: \"视频\", parent: null, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const r1c1: Node = { id: \"r1c1\", type: NodeType.FOLDER, title: \"工作\", parent: root1, loadState: LoadStateType.LOADING_COMPLETED };\n    const r1c2: Node = { id: \"r1c2\", type: NodeType.FOLDER, title: \"学习\", parent: root1, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const r1c1f1: Node = { id: \"r1c1f1\", type: NodeType.FILE, title: \"季度报告.docx\", parent: r1c1, loadState: LoadStateType.LOADING_COMPLETED };\n    const r1c1f2: Node = { id: \"r1c1f2\", type: NodeType.FILE, title: \"项目计划.xlsx\", parent: r1c1, loadState: LoadStateType.LOADING_COMPLETED };\n    const r1c2f1: Node = { id: \"r1c2f1\", type: NodeType.FILE, title: \"React 笔记.md\", parent: r1c2, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const r2f1: Node = { id: \"r2f1\", type: NodeType.FILE, title: \"头像.png\", parent: root2, loadState: LoadStateType.LOADING_COMPLETED };\n    const r2f2: Node = { id: \"r2f2\", type: NodeType.FILE, title: \"封面.jpg\", parent: root2, loadState: LoadStateType.LOADING_COMPLETED };\n\n    const r3f1: Node = { id: \"r3f1\", type: NodeType.FILE, title: \"录屏.mp4\", parent: root3, loadState: LoadStateType.LOADING_COMPLETED };\n\n    return [root1, root2, root3, r1c1, r1c2, r1c1f1, r1c1f2, r1c2f1, r2f1, r2f2, r3f1];\n};\n\nconst KeyboardDemo = () => {\n    const { direction } = useConfig();\n    const [expandedKeys, setExpandedKeys] = useState\u003cKey[]>([]);\n    const [selectedKeys, setSelectedKeys] = useState\u003cKey[]>([]);\n    const [treeData, setTreeData] = useTreeData(buildNodes());\n\n    return (\n        \u003cdiv className={demoStackStyle}>\n            \u003cdiv className={keyboardHelpStyle}>\n                \u003cstrong>键盘快捷键：\u003c/strong>&nbsp;\n                \u003ckbd>↑\u003c/kbd>\u003ckbd>↓\u003c/kbd> 移动焦点 &nbsp;\n                \u003ckbd>{direction === 'rtl' ? '←' : '→'}\u003c/kbd> 展开 &nbsp;\n                \u003ckbd>{direction === 'rtl' ? '→' : '←'}\u003c/kbd> 折叠 / 跳父节点 &nbsp;\n                \u003ckbd>Enter\u003c/kbd> 选中\n            \u003c/div>\n            \u003cAutoSizer disableHeight className={treeMeasureStyle}>\n                {({ width }) => (\n                    \u003cRcTree\n                        height={300}\n                        width={Math.min(width, 400)}\n                        treeData={treeData}\n                        onTreeNodeChange={setTreeData}\n                        expandedKeys={expandedKeys}\n                        selectedKeys={selectedKeys}\n                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}\n                        onExpandedKeysChange={setExpandedKeys}\n                    />\n                )}\n            \u003c/AutoSizer>\n            {selectedKeys.length > 0 && (\n                \u003cp className={demoNoteStyle}>\n                    已选中：{selectedKeys.join(\", \")}\n                \u003c/p>\n            )}\n        \u003c/div>\n    );\n};\n\nexport default KeyboardDemo;\n",
        "previewPath": "/components/rc-tree/workbench/?__wake_demo=docs%2Fdemos%2Fkeyboard.demo.tsx",
        "workbenchPath": "/components/rc-tree/workbench/#/components/docs%2Fdemos%2Fkeyboard.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "编辑与交互"
    }
] as const satisfies readonly ComponentDemoRecord[];
