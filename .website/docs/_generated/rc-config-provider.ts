/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/nested.demo.tsx",
        "title": "嵌套设计风格与主题边界",
        "description": "内层分别切换为 shadcn 浅色与 Apple 深色风格，未指定的主题、语言和尺寸继续继承父级。",
        "learning": {
            "components": [
                "ConfigProvider"
            ],
            "props": [
                "designSystem",
                "colorMode",
                "locale",
                "size",
                "density"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\n\nexport const meta = {\n    title: '嵌套设计风格与主题边界',\n    description: '内层分别切换为 shadcn 浅色与 Apple 深色风格，未指定的主题、语言和尺寸继续继承父级。',\n};\n\nconst panelStyle = css`\n    padding: ${token.space['card-padding']};\n    color: ${token.color.text.primary};\n    background: ${token.color.background.surface};\n    border-radius: ${token.radius.md};\n`;\n\nfunction Summary() {\n    const config = useConfig();\n    const { designSystem, colorMode, locale, size, density } = config;\n    return \u003cp className={panelStyle} data-resolved-config={JSON.stringify(config)}>{designSystem} / {colorMode} / {locale} / {size} / {density}\u003c/p>;\n}\n\nexport default function NestedDemo() {\n    return (\n        \u003cConfigProvider designSystem=\"md3\" colorMode=\"dark\" locale=\"en-US\" size=\"large\" density=\"compact\">\n            \u003cSummary />\n            \u003cConfigProvider designSystem=\"shadcn\" colorMode=\"light\">\u003cSummary />\u003c/ConfigProvider>\n            \u003cConfigProvider designSystem=\"apple\">\u003cSummary />\u003c/ConfigProvider>\n            \u003cSummary />\n        \u003c/ConfigProvider>\n    );\n}\n",
        "previewPath": "/components/rc-config-provider/workbench/?__wake_demo=docs%2Fdemos%2Fnested.demo.tsx",
        "workbenchPath": "/components/rc-config-provider/workbench/#/components/docs%2Fdemos%2Fnested.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "继承、品牌与 Portal",
        "description": "同一输入保留草稿；嵌套边界与实际 Portal 分别输出最近配置。",
        "learning": {
            "components": [
                "ConfigProvider",
                "ConfigBoundary"
            ],
            "props": [
                "brandColor",
                "nonce",
                "designSystem",
                "colorMode",
                "size",
                "role",
                "aria-label"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useState } from 'react';\nimport { createPortal } from 'react-dom';\nimport { css } from '@crab-dev/css';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\nimport ConfigProvider, { ConfigBoundary, useConfig } from '@crab-dev/rc-config-provider';\n\nexport const meta = { title: '继承、品牌与 Portal', description: '同一输入保留草稿；嵌套边界与实际 Portal 分别输出最近配置。' };\nconst frame = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere;`;\nconst panel = css`padding: ${token.space['component-gap']}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; background: ${token.color.background.surface}; color: ${token.color.text.primary};`;\nconst editor = css`box-sizing: border-box; width: 100%; min-width: 0; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\nconst accent = css`padding: ${token.space['control-padding-y']}; color: ${token.color.brand['on-container']}; background: ${token.color.brand.container}; border: 1px solid ${token.color.brand.primary};`;\n\nfunction Summary({ name }: { name: string }) {\n    const config = useConfig();\n    return \u003csection aria-label={name} className={panel}>\u003cstrong>{name}\u003c/strong>\u003cp data-config-summary>{config.designSystem} / {config.colorMode} / {config.size} / {config.density} / {config.locale} / {config.direction}\u003c/p>\u003cspan className={accent}>品牌与表面 · Brand and surface\u003c/span>\u003c/section>;\n}\n\nexport default function VisualMatrixDemo() {\n    const config = useConfig();\n    const [state, setState] = useState('default');\n    const [draft, setDraft] = useState('保留草稿 · Retained draft');\n    const [portal, setPortal] = useState\u003cHTMLElement | null>(null);\n    useEffect(() => { setPortal(globalThis.document.body); }, []);\n    const nextDesign = Object.keys(designSystemRegistry).find(value => value !== config.designSystem) as typeof config.designSystem;\n    return \u003csection className={frame} aria-label=\"ConfigProvider visual matrix\">\n        \u003clabel>验收状态 \u003cselect value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'brand', 'portal'].map(value => \u003coption key={value}>{value}\u003c/option>)}\u003c/select>\u003c/label>\n        \u003cConfigProvider brandColor={state === 'brand' ? '#0e7490' : undefined} nonce=\"visual-boundary\">\n            \u003clabel>业务草稿 \u003cinput className={editor} value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n            \u003cSummary name=\"Inherited boundary\" />\n            \u003cConfigProvider designSystem={nextDesign} colorMode={config.colorMode === 'light' ? 'dark' : 'light'} size=\"small\">\u003cSummary name=\"Nested boundary\" />\u003c/ConfigProvider>\n            {state === 'portal' && portal && createPortal(\u003cConfigBoundary className={frame} role=\"region\" aria-label=\"Portal boundary\">\u003cSummary name=\"Portal content\" />\u003clabel>Portal draft \u003cinput className={editor} value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\u003c/ConfigBoundary>, portal)}\n        \u003c/ConfigProvider>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-config-provider/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-config-provider/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    },
    {
        "id": "docs/demos/config-documents.demo.tsx",
        "title": "iframe 与 Shadow DOM 配置边界",
        "description": "向目标文档安装真实样式，Portal 延续最近配置；跨文档输入共享草稿。",
        "learning": {
            "components": [
                "ConfigBoundary",
                "ConfigProvider"
            ],
            "props": [
                "role",
                "aria-label",
                "designSystem",
                "colorMode",
                "size",
                "brandColor",
                "locale",
                "direction",
                "nonce"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useRef, useState } from 'react';\nimport { createPortal } from 'react-dom';\nimport { css } from '@crab-dev/css';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\nimport ConfigProvider, { ConfigBoundary, useConfig } from '@crab-dev/rc-config-provider';\n\nexport const meta = { title: 'iframe 与 Shadow DOM 配置边界', description: '向目标文档安装真实样式，Portal 延续最近配置；跨文档输入共享草稿。' };\nconst frame = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere; min-inline-size: 0;`;\nconst editor = css`box-sizing: border-box; inline-size: 100%; min-inline-size: 0; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\nconst embedded = css`box-sizing: border-box; inline-size: 100%; block-size: 320px; border: 1px solid ${token.color.border.default}; min-inline-size: 0;`;\n\n// A Document/ShadowRoot needs the application's actual stylesheets. Context\n// inheritance alone cannot install CSS across either boundary. Copy only this\n// workbench's stylesheet resources; no generated or simulated state styles.\nfunction installStyles(source: Document, target: Document | ShadowRoot): () => void {\n    const container = target.nodeType === 9 ? (target as Document).head : target;\n    const copies = [...source.head.querySelectorAll('link[rel=\"stylesheet\"], style')].map(sheet => {\n        const copy = sheet.cloneNode(true) as HTMLElement;\n        if (sheet.tagName === 'LINK') (copy as HTMLLinkElement).href = (sheet as HTMLLinkElement).href;\n        container.append(copy);\n        return copy;\n    });\n    return () => { for (const copy of copies) copy.remove(); };\n}\n\nfunction BoundaryContent({ name, draft, onChange }: { name: string; draft: string; onChange: (value: string) => void }) {\n    const config = useConfig();\n    return \u003cConfigBoundary role=\"region\" aria-label={name} className={frame}>\n        \u003cstrong>{name}\u003c/strong>\n        \u003coutput data-resolved-config>{JSON.stringify(config)}\u003c/output>\n        \u003clabel>跨文档草稿\u003cinput className={editor} value={draft} onChange={event => onChange(event.currentTarget.value)} />\u003c/label>\n    \u003c/ConfigBoundary>;\n}\n\nexport default function ConfigDocumentsDemo() {\n    const config = useConfig();\n    const shadowHost = useRef\u003cHTMLDivElement>(null);\n    const [shadow, setShadow] = useState\u003cHTMLElement | null>(null);\n    const [documentTarget, setDocumentTarget] = useState\u003cHTMLElement | null>(null);\n    const [draft, setDraft] = useState('保留跨文档草稿 · Retained across documents');\n    useEffect(() => {\n        const host = shadowHost.current;\n        if (!host) return;\n        const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });\n        const removeStyles = installStyles(host.ownerDocument, root);\n        const target = host.ownerDocument.createElement('div');\n        root.append(target); setShadow(target);\n        return () => { target.remove(); removeStyles(); };\n    }, []);\n    const nextDesign = Object.keys(designSystemRegistry).find(value => value !== config.designSystem) as typeof config.designSystem;\n    return \u003csection className={frame} role=\"region\" aria-label=\"ConfigProvider document boundaries\">\n        \u003clabel>业务草稿\u003cinput className={editor} value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        \u003cConfigProvider designSystem={nextDesign} colorMode={config.colorMode === 'light' ? 'dark' : 'light'} size=\"small\" brandColor=\"#0e7490\" locale=\"en-US\" direction=\"rtl\" nonce=\"documents-boundary\">\n            \u003ciframe title=\"ConfigProvider iframe\" className={embedded} srcDoc=\"\u003c!doctype html>\u003chtml>\u003chead>\u003cmeta charset='utf-8'>\u003c/head>\u003cbody>\u003c/body>\u003c/html>\" onLoad={event => {\n                const target = event.currentTarget.contentDocument;\n                if (!target || target.body.dataset.initialized) return;\n                target.body.dataset.initialized = 'true';\n                installStyles(event.currentTarget.ownerDocument, target);\n                setDocumentTarget(target.body);\n            }} />\n            \u003cdiv ref={shadowHost} data-document-boundary=\"shadow\" />\n            {documentTarget && createPortal(\u003cBoundaryContent name=\"iframe boundary\" draft={draft} onChange={setDraft} />, documentTarget)}\n            {shadow && createPortal(\u003cBoundaryContent name=\"Shadow boundary\" draft={draft} onChange={setDraft} />, shadow)}\n        \u003c/ConfigProvider>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-config-provider/workbench/?__wake_demo=docs%2Fdemos%2Fconfig-documents.demo.tsx",
        "workbenchPath": "/components/rc-config-provider/workbench/#/components/docs%2Fdemos%2Fconfig-documents.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];
