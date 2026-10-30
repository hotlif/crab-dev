/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系边缘面板矩阵",
        "description": "四个方向、长内容、焦点与保留草稿。",
        "learning": {
            "components": [
                "Button",
                "Drawer"
            ],
            "props": [
                "onClick",
                "title",
                "open",
                "onOpenChange",
                "placement",
                "shouldResetContent",
                "footer"
            ],
            "events": [
                "onClick",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Drawer, { type DrawerPlacement } from \"@crab-dev/rc-drawer\";\nimport Button from \"@crab-dev/rc-button\";\n\nexport const meta = { title: \"三体系边缘面板矩阵\", description: \"四个方向、长内容、焦点与保留草稿。\" };\nconst layout = css`padding: ${token.space['section-gap']}; min-height: 20rem;`;\nconst content = css`display: grid; gap: ${token.space['component-gap']}; overflow-wrap: anywhere;`;\nexport default function VisualMatrixDemo() {\n    const [open, setOpen] = useState(false);\n    const [placement, setPlacement] = useState\u003cDrawerPlacement>(\"right\");\n    const [long, setLong] = useState(false);\n    return \u003csection aria-label=\"Drawer visual matrix\" className={layout}>\n        \u003clabel>验收方向\u003cselect aria-label=\"验收方向\" value={placement} onChange={event => setPlacement(event.target.value as DrawerPlacement)}>{[\"right\", \"left\", \"top\", \"bottom\"].map(value => \u003coption key={value}>{value}\u003c/option>)}\u003c/select>\u003c/label>\n        \u003clabel>\u003cinput type=\"checkbox\" checked={long} onChange={event => setLong(event.target.checked)} />长内容\u003c/label>\n        \u003cButton onClick={() => setOpen(true)}>打开验收抽屉\u003c/Button>\n        \u003cDrawer title=\"项目详情 Project details\" open={open} onOpenChange={setOpen} placement={placement} shouldResetContent={false} footer={\u003cButton onClick={() => setOpen(false)}>保存草稿\u003c/Button>}>\n            \u003cdiv className={content}>\u003cp>边缘面板保持页面上下文。\u003c/p>\u003clabel>项目备注\u003cinput aria-label=\"项目备注\" defaultValue=\"本地草稿\" />\u003c/label>\n                {long && Array.from({ length: 30 }, (_, index) => \u003cp key={index}>第 {index + 1} 项：跨团队协作记录 LongWorkspaceIdentifier_0123456789。\u003c/p>)}\n            \u003c/div>\n        \u003c/Drawer>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "规格验收"
    },
    {
        "id": "docs/demos/document-boundaries.demo.tsx",
        "title": "跨文档浮层与嵌套边界",
        "description": "同一公开组合在真实 iframe 和 Shadow DOM 中检查选择、父子浮层、抽屉堆叠与返回焦点。",
        "learning": {
            "components": [
                "Button",
                "ConfigBoundary",
                "Select",
                "DropdownContainer",
                "Drawer",
                "ConfigProvider"
            ],
            "props": [
                "ref",
                "aria-haspopup",
                "aria-expanded",
                "onClick",
                "role",
                "aria-label",
                "label",
                "options",
                "defaultValue",
                "closeOnFocusOut",
                "overlay",
                "title"
            ],
            "events": [
                "onClick",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useRef, useState, type ReactNode } from \"react\";\nimport { createPortal } from \"react-dom\";\nimport { css } from \"@crab-dev/css\";\nimport token, { designSystemRegistry } from \"@crab-dev/rc-token-semantic\";\nimport ConfigProvider, { ConfigBoundary, useConfig } from \"@crab-dev/rc-config-provider\";\nimport Button from \"@crab-dev/rc-button\";\nimport Select from \"@crab-dev/rc-select\";\nimport DropdownContainer, { useDropdownContext } from \"@crab-dev/rc-dropdown-container\";\nimport Drawer from \"@crab-dev/rc-drawer\";\n\nexport const meta = { title: \"跨文档浮层与嵌套边界\", description: \"同一公开组合在真实 iframe 和 Shadow DOM 中检查选择、父子浮层、抽屉堆叠与返回焦点。\" };\nconst layout = css`display: grid; gap: ${token.space['section-gap']}; padding: ${token.space['section-gap']}; min-width: 0; color: ${token.color.text.primary}; background: ${token.color.background.surface};`;\nconst embedded = css`box-sizing: border-box; width: 100%; height: 560px; border: 1px solid ${token.color.border.default};`;\nconst content = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['section-gap']}; overflow-wrap: anywhere; min-width: 0;`;\nconst editor = css`box-sizing: border-box; max-width: 100%; min-width: 0; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\n\n// Context and actual CSS must both cross a Document/ShadowRoot boundary. These\n// are copies of the application's real stylesheet resources, not state mocks.\nfunction installStyles(source: Document, target: Document | ShadowRoot) {\n    const container = target.nodeType === 9 ? (target as Document).head : target;\n    const pending: Promise\u003cvoid>[] = [];\n    const copies = [...source.head.querySelectorAll(\"link[rel='stylesheet'], style\")].map(sheet => {\n        const copy = sheet.cloneNode(true) as HTMLElement;\n        if (sheet.tagName === \"LINK\") {\n            (copy as HTMLLinkElement).href = (sheet as HTMLLinkElement).href;\n            pending.push(new Promise\u003cvoid>((resolve, reject) => { copy.addEventListener(\"load\", () => resolve(), { once: true }); copy.addEventListener(\"error\", () => reject(new Error(\"Unable to load the application's stylesheet\")), { once: true }); }));\n        }\n        container.append(copy); return copy;\n    });\n    return { ready: Promise.all(pending), dispose: () => { for (const copy of copies) copy.remove(); } };\n}\n\nfunction Trigger({ children }: { children: ReactNode }) {\n    const { refs, state, dispatch } = useDropdownContext\u003cHTMLButtonElement>();\n    return \u003cButton ref={refs.setReference} aria-haspopup=\"dialog\" aria-expanded={state.open} onClick={event => dispatch({ type: \"setOpen\", payload: !state.open, details: { reason: \"trigger\", event: event.nativeEvent } })}>{children}\u003c/Button>;\n}\n\nfunction Interactions({ name }: { name: string }) {\n    const config = useConfig();\n    const [draft, setDraft] = useState(\"跨文档草稿 Draft\");\n    const [drawer, setDrawer] = useState(false);\n    const [nested, setNested] = useState(false);\n    return \u003cConfigBoundary role=\"region\" aria-label={name} className={layout}>\n        \u003coutput aria-label=\"最近完整配置\">{JSON.stringify(config)}\u003c/output>\n        \u003cSelect aria-label=\"跨文档团队\" label=\"团队 Team\" options={[{ label: \"设计 Design\", value: \"design\" }, { label: \"工程 Engineering\", value: \"engineering\" }]} defaultValue=\"design\" />\n        \u003cDropdownContainer closeOnFocusOut overlay={\u003cdiv role=\"dialog\" aria-label=\"跨文档外层\" className={content}>\n            \u003clabel>外层草稿\u003cinput className={editor} aria-label=\"外层草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n            \u003cDropdownContainer closeOnFocusOut overlay={\u003cdiv role=\"dialog\" aria-label=\"跨文档内层\" className={content}>\u003cButton>内部浮层操作\u003c/Button>\u003c/div>}>\u003cTrigger>打开内部浮层\u003c/Trigger>\u003c/DropdownContainer>\n        \u003c/div>}>\u003cTrigger>打开跨文档浮层\u003c/Trigger>\u003c/DropdownContainer>\n        \u003cButton onClick={() => setDrawer(true)}>打开跨文档抽屉\u003c/Button>\n        \u003cDrawer title=\"跨文档详情\" open={drawer} onOpenChange={setDrawer} shouldResetContent={false} footer={\u003cButton onClick={() => setDrawer(false)}>保存跨文档草稿\u003c/Button>}>\n            \u003cdiv className={content}>\u003clabel>抽屉草稿\u003cinput className={editor} aria-label=\"抽屉草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\u003cButton onClick={() => setNested(true)}>打开嵌套抽屉\u003c/Button>\u003c/div>\n            \u003cDrawer title=\"嵌套详情\" open={nested} onOpenChange={setNested} shouldResetContent={false}>\u003cButton>嵌套抽屉操作\u003c/Button>\u003c/Drawer>\n        \u003c/Drawer>\n    \u003c/ConfigBoundary>;\n}\n\nexport default function DocumentBoundariesDemo() {\n    const config = useConfig();\n    const [kind, setKind] = useState(\"iframe\");\n    const [shadow, setShadow] = useState\u003cHTMLElement | null>(null);\n    const [frameTarget, setFrameTarget] = useState\u003cHTMLElement | null>(null);\n    const [error, setError] = useState(\"\");\n    const shadowHost = useRef\u003cHTMLDivElement>(null);\n    const frameCleanup = useRef\u003c(() => void) | null>(null);\n    useEffect(() => {\n        const host = shadowHost.current;\n        if (!host) return;\n        const root = host.shadowRoot ?? host.attachShadow({ mode: \"open\" });\n        const styles = installStyles(host.ownerDocument, root), target = host.ownerDocument.createElement(\"div\"); root.append(target);\n        let active = true;\n        styles.ready.then(() => { if (active) setShadow(target); }).catch(reason => { if (active) setError(String(reason)); });\n        return () => { active = false; target.remove(); styles.dispose(); };\n    }, []);\n    useEffect(() => () => { frameCleanup.current?.(); }, []);\n    const otherDesign = Object.keys(designSystemRegistry).find(value => value !== config.designSystem) as typeof config.designSystem;\n    return \u003csection aria-label=\"Overlay document boundaries\" className={layout}>\n        \u003clabel>承载边界\u003cselect aria-label=\"承载边界\" value={kind} onChange={event => setKind(event.currentTarget.value)}>\u003coption>iframe\u003c/option>\u003coption>shadow\u003c/option>\u003c/select>\u003c/label>\n        {error && \u003cp role=\"alert\">{error}\u003c/p>}\n        \u003cConfigProvider designSystem={otherDesign} colorMode={config.colorMode === \"light\" ? \"dark\" : \"light\"}>\n            \u003cConfigProvider {...config} size=\"small\" density=\"compact\" locale=\"en-US\" direction=\"rtl\" brandColor=\"#0e7490\" nonce=\"overlay-documents\">\n                \u003ciframe title=\"Overlay document iframe\" className={embedded} hidden={kind !== \"iframe\"} srcDoc=\"\u003c!doctype html>\u003chtml>\u003chead>\u003cmeta charset='utf-8'>\u003c/head>\u003cbody>\u003c/body>\u003c/html>\" onLoad={event => {\n                    const iframe = event.currentTarget, owner = iframe.contentDocument;\n                    if (!owner || owner.body.dataset.initialized) return;\n                    owner.body.dataset.initialized = \"true\"; frameCleanup.current?.();\n                    const styles = installStyles(iframe.ownerDocument, owner), target = owner.createElement(\"div\"); owner.body.append(target);\n                    frameCleanup.current = () => { target.remove(); styles.dispose(); };\n                    styles.ready.then(() => { if (iframe.isConnected) setFrameTarget(target); }).catch(reason => { if (iframe.isConnected) setError(String(reason)); });\n                }} />\n                \u003cdiv ref={shadowHost} data-overlay-document=\"shadow\" hidden={kind !== \"shadow\"} />\n                {kind === \"iframe\" && frameTarget && createPortal(\u003cInteractions name=\"iframe interactions\" />, frameTarget)}\n                {kind === \"shadow\" && shadow && createPortal(\u003cInteractions name=\"shadow interactions\" />, shadow)}\n            \u003c/ConfigProvider>\n        \u003c/ConfigProvider>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fdocument-boundaries.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fdocument-boundaries.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "规格验收"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 `open` 控制显示；点击遮罩、关闭按钮或按 `Esc` 均可关闭。",
        "learning": {
            "components": [
                "Button",
                "Drawer"
            ],
            "props": [
                "onClick",
                "open",
                "onOpenChange",
                "title"
            ],
            "events": [
                "onClick",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过 `open` 控制显示；点击遮罩、关闭按钮或按 `Esc` 均可关闭。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Drawer from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [open, setOpen] = useState(false);\n    return (\n        \u003c>\n            \u003cButton onClick={() => setOpen(true)}>打开抽屉\u003c/Button>\n            \u003cDrawer open={open} onOpenChange={setOpen} title=\"基本信息\">\n                \u003cp>这里是抽屉的主体内容，可承载任意 React 节点。\u003c/p>\n                \u003cp>内容区自带滚动，超出部分会在内部滚动而不影响底部页面。\u003c/p>\n            \u003c/Drawer>\n        \u003c/>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/placement.demo.tsx",
        "title": "四个方向",
        "description": "通过 `placement` 控制滑出方向；关闭时沿原方向退出。RTL 示例将逻辑起点映射到右侧，并演示旧时长变量的兼容。",
        "learning": {
            "components": [
                "Button",
                "Drawer"
            ],
            "props": [
                "onClick",
                "dir",
                "open",
                "onOpenChange",
                "placement",
                "title"
            ],
            "events": [
                "onClick",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"四个方向\",\n    description: \"通过 `placement` 控制滑出方向；关闭时沿原方向退出。RTL 示例将逻辑起点映射到右侧，并演示旧时长变量的兼容。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport Drawer, { type DrawerPlacement } from \"../../src/index.js\";\n\nconst buttonRowStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space['component-gap']};\n`;\nconst customMotionStyle = css`--drawer-panel-animation-duration: ${token.motion.sheet['exit-duration']};`;\n\nconst PlacementDemo = () => {\n    const [placement, setPlacement] = useState\u003cDrawerPlacement>(\"right\");\n    const [open, setOpen] = useState(false);\n    const [rtl, setRtl] = useState(false);\n    const openAt = (nextPlacement: DrawerPlacement, nextRtl = false) => {\n        setRtl(nextRtl);\n        setPlacement(nextPlacement);\n        setOpen(true);\n    };\n    return (\n        \u003c>\n            \u003cdiv className={buttonRowStyle}>\n                \u003cButton onClick={() => openAt(\"left\")}>从左侧\u003c/Button>\n                \u003cButton onClick={() => openAt(\"right\")}>从右侧\u003c/Button>\n                \u003cButton onClick={() => openAt(\"top\")}>从顶部\u003c/Button>\n                \u003cButton onClick={() => openAt(\"bottom\")}>从底部\u003c/Button>\n                \u003cButton onClick={() => openAt(\"left\", true)}>RTL 逻辑起点\u003c/Button>\n                \u003cButton onClick={() => openAt(\"right\", true)}>RTL 逻辑终点\u003c/Button>\n            \u003c/div>\n            \u003cDrawer\n                dir={rtl ? \"rtl\" : \"ltr\"}\n                className={rtl ? customMotionStyle : undefined}\n                open={open}\n                onOpenChange={setOpen}\n                placement={placement}\n                title={`Placement: ${placement}`}\n            >\n                \u003cp>当前位置：{placement}\u003c/p>\n            \u003c/Drawer>\n        \u003c/>\n    );\n};\n\nexport default PlacementDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fplacement.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fplacement.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/nested.demo.tsx",
        "title": "嵌套打开",
        "description": "支持层层嵌套打开（示例共 10 层）；每层独立维护开关状态，关闭后不影响下层。",
        "learning": {
            "components": [
                "Drawer",
                "Button"
            ],
            "props": [
                "open",
                "onOpenChange",
                "title",
                "size",
                "footer",
                "onClick",
                "appearance"
            ],
            "events": [
                "onOpenChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"嵌套打开\",\n    description: \"支持层层嵌套打开（示例共 10 层）；每层独立维护开关状态，关闭后不影响下层。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Drawer, { type DrawerSize } from \"../../src/index.js\";\n\nconst TOTAL_LEVELS = 10;\n\nconst getSize = (level: number): DrawerSize => {\n    if (level \u003c= 3) return \"large\";\n    if (level \u003c= 6) return \"medium\";\n    return \"small\";\n};\n\ninterface LevelDrawerProps {\n    level: number;\n    open: boolean;\n    onOpenChange: (open: boolean) => void;\n}\n\nconst LevelDrawer = ({ level, open, onOpenChange }: LevelDrawerProps) => {\n    const [childOpen, setChildOpen] = useState(false);\n    const hasChild = level \u003c TOTAL_LEVELS;\n    return (\n        \u003c>\n            \u003cDrawer\n                open={open}\n                onOpenChange={onOpenChange}\n                title={`第 ${level} 层抽屉`}\n                size={getSize(level)}\n                footer={\n                    \u003c>\n                        \u003cButton onClick={() => onOpenChange(false)}>关闭当前层\u003c/Button>\n                        {hasChild && (\n                            \u003cButton appearance=\"primary\" onClick={() => setChildOpen(true)}>\n                                打开第 {level + 1} 层\n                            \u003c/Button>\n                        )}\n                    \u003c/>\n                }\n            >\n                \u003cp>当前层级：{level} / {TOTAL_LEVELS}\u003c/p>\n                \u003cp>\n                    {hasChild\n                        ? \"点击底部按钮可以继续在此之上叠加一层抽屉。\"\n                        : \"已到达最深一层，关闭后将逐级回到上一层。\"}\n                \u003c/p>\n            \u003c/Drawer>\n            {hasChild && (\n                \u003cLevelDrawer\n                    level={level + 1}\n                    open={childOpen}\n                    onOpenChange={setChildOpen}\n                />\n            )}\n        \u003c/>\n    );\n};\n\nconst NestedDemo = () => {\n    const [rootOpen, setRootOpen] = useState(false);\n    return (\n        \u003c>\n            \u003cButton onClick={() => setRootOpen(true)}>打开第 1 层\u003c/Button>\n            \u003cLevelDrawer level={1} open={rootOpen} onOpenChange={setRootOpen} />\n        \u003c/>\n    );\n};\n\nexport default NestedDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fnested.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fnested.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/with-footer.demo.tsx",
        "title": "底部操作区",
        "description": "通过 `footer` 传入操作按钮，适合承载表单提交场景。",
        "learning": {
            "components": [
                "Button",
                "Drawer"
            ],
            "props": [
                "onClick",
                "open",
                "onOpenChange",
                "title",
                "size",
                "footer",
                "appearance"
            ],
            "events": [
                "onClick",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"底部操作区\",\n    description: \"通过 `footer` 传入操作按钮，适合承载表单提交场景。\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Drawer from \"../../src/index.js\";\n\nconst WithFooterDemo = () => {\n    const [open, setOpen] = useState(false);\n    return (\n        \u003c>\n            \u003cButton onClick={() => setOpen(true)}>提交表单\u003c/Button>\n            \u003cDrawer\n                open={open}\n                onOpenChange={setOpen}\n                title=\"编辑信息\"\n                size=\"large\"\n                footer={\n                    \u003c>\n                        \u003cButton onClick={() => setOpen(false)}>取消\u003c/Button>\n                        \u003cButton appearance=\"primary\" onClick={() => setOpen(false)}>\n                            保存\n                        \u003c/Button>\n                    \u003c/>\n                }\n            >\n                \u003cp>将表单内容放在这里。底部操作区会贴合抽屉下沿，始终可见。\u003c/p>\n            \u003c/Drawer>\n        \u003c/>\n    );\n};\n\nexport default WithFooterDemo;\n",
        "previewPath": "/components/rc-drawer/workbench/?__wake_demo=docs%2Fdemos%2Fwith-footer.demo.tsx",
        "workbenchPath": "/components/rc-drawer/workbench/#/components/docs%2Fdemos%2Fwith-footer.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    }
] as const satisfies readonly ComponentDemoRecord[];
