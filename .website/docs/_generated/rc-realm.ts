/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "component 协议加载远程 React 组件：远程与宿主共享同一 React 实例, remoteProps 实时透传, 与本地组件表现无异。此例通过预注册容器演示（globalThis[scope] 已存在时跳过 script 注入, 零网络）。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description:\n        \"component 协议加载远程 React 组件：远程与宿主共享同一 React 实例, remoteProps 实时透传, 与本地组件表现无异。此例通过预注册容器演示（globalThis[scope] 已存在时跳过 script 注入, 零网络）。\",\n};\n\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport Realm from '../../src/index.js';\nimport type { RemoteContainer } from '../../src/index.js';\n\nconst RemoteCounter = ({ message }: { message?: unknown }) => {\n    const [count, setCount] = useState(0);\n    return (\n        \u003cdiv style={{ padding: 12, border: '1px dashed currentColor' }}>\n            \u003cp>我是「远程」组件：宿主消息 = {String(message)}\u003c/p>\n            \u003cButton onClick={() => setCount((current) => current + 1)}>\n                远程内部状态 {count}\n            \u003c/Button>\n        \u003c/div>\n    );\n};\n\n// 预注册 MF 容器：真实场景由 remoteEntry.js 注册, demo 里手工注册以便离线运行\nconst container: RemoteContainer = {\n    init: () => undefined,\n    get: (moduleId) =>\n        moduleId === './Counter'\n            ? Promise.resolve(() => ({ default: RemoteCounter }))\n            : Promise.reject(new Error(`unknown module: ${moduleId}`)),\n};\n(globalThis as Record\u003cstring, unknown>).crabRealmBasic ??= container;\n\nconst BasicDemo = () => {\n    const [message, setMessage] = useState('hello');\n    return (\n        \u003cdiv>\n            \u003cButton onClick={() => setMessage(message === 'hello' ? 'world' : 'hello')}>\n                切换宿主消息（当前 {message}）\n            \u003c/Button>\n            \u003cRealm\n                entry=\"/virtual/remoteEntry.js\"\n                scope=\"crabRealmBasic\"\n                module=\"./Counter\"\n                remoteProps={{ message }}\n            />\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/error-retry.demo.tsx",
        "title": "错误态与重试",
        "description": "远程模块首次加载必然失败（模拟弱网）：Realm 渲染 rc-alert 错误态并就近提供重试按钮；失败已自动使缓存失效, 点击重试即重走加载链路, 第二次成功。",
        "sourceCode": "export const meta = {\n    title: \"错误态与重试\",\n    description:\n        \"远程模块首次加载必然失败（模拟弱网）：Realm 渲染 rc-alert 错误态并就近提供重试按钮；失败已自动使缓存失效, 点击重试即重走加载链路, 第二次成功。\",\n};\n\nimport Realm from '../../src/index.js';\nimport type { RemoteContainer } from '../../src/index.js';\n\nconst RemoteWidget = () => (\n    \u003cdiv style={{ padding: 12, border: '1px dashed currentColor' }}>重试成功, 远程内容已就绪。\u003c/div>\n);\n\nlet attempts = 0;\nconst container: RemoteContainer = {\n    init: () => undefined,\n    get: () => {\n        attempts += 1;\n        if (attempts === 1) {\n            return Promise.reject(new Error('模拟网络失败（首次必败, 请点击重试）'));\n        }\n        return Promise.resolve(() => ({ default: RemoteWidget }));\n    },\n};\n(globalThis as Record\u003cstring, unknown>).crabRealmFlaky ??= container;\n\nconst ErrorRetryDemo = () => (\n    \u003cRealm entry=\"/virtual/remoteEntry.js\" scope=\"crabRealmFlaky\" module=\"./Widget\" />\n);\n\nexport default ErrorRetryDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Ferror-retry.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Ferror-retry.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/mount-sandbox.demo.tsx",
        "title": "mount 协议 + Shadow DOM 沙箱",
        "description": "mount 协议适配跨框架 / 不同 React 版本的远程, 可开启 sandbox 做样式隔离：下方宿主与远程各有一个 .sandbox-demo-title 元素——远程标题被 styleSheets 染色, 宿主标题不受影响；主题令牌 CSS 变量仍穿透沙箱。",
        "sourceCode": "export const meta = {\n    title: \"mount 协议 + Shadow DOM 沙箱\",\n    description:\n        \"mount 协议适配跨框架 / 不同 React 版本的远程, 可开启 sandbox 做样式隔离：下方宿主与远程各有一个 .sandbox-demo-title 元素——远程标题被 styleSheets 染色, 宿主标题不受影响；主题令牌 CSS 变量仍穿透沙箱。\",\n};\n\nimport Realm from '../../src/index.js';\nimport type { MountLifecycle, RemoteContainer } from '../../src/index.js';\n\nconst lifecycle: MountLifecycle = {\n    mount: (container, props) => {\n        const title = document.createElement('p');\n        title.className = 'sandbox-demo-title';\n        title.textContent = `沙箱内的远程标题（message = ${String(props.message)}）`;\n        container.append(title);\n        return () => title.remove();\n    },\n};\n\nconst container: RemoteContainer = {\n    init: () => undefined,\n    get: () => Promise.resolve(() => ({ default: lifecycle })),\n};\n(globalThis as Record\u003cstring, unknown>).crabRealmSandbox ??= container;\n\nconst MountSandboxDemo = () => (\n    \u003cdiv>\n        \u003cp className=\"sandbox-demo-title\">宿主的标题：不受沙箱内样式影响, 保持默认颜色\u003c/p>\n        \u003cRealm\n            entry=\"/virtual/remoteEntry.js\"\n            scope=\"crabRealmSandbox\"\n            module=\"./Title\"\n            protocol=\"mount\"\n            sandbox\n            styleSheets={[\n                '.sandbox-demo-title { color: var(--token-semantic-color-brand-primary, oklch(0.55 0.2 260)); font-weight: 600; }',\n            ]}\n            remoteProps={{ message: '隔离生效' }}\n        />\n    \u003c/div>\n);\n\nexport default MountSandboxDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fmount-sandbox.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fmount-sandbox.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/script-entry.demo.tsx",
        "title": "真实 script 注入链路",
        "description": "从 URL 加载 remoteEntry.js（本包 public/remote/ 下的手写 var 格式容器）：script 注入 → init 收到含宿主 React 的 share scope → get('./Widget') → 渲染。远程组件用 init 时注入的宿主 React 实例创建元素, 端到端验证共享机制。",
        "sourceCode": "export const meta = {\n    title: \"真实 script 注入链路\",\n    description:\n        \"从 URL 加载 remoteEntry.js（本包 public/remote/ 下的手写 var 格式容器）：script 注入 → init 收到含宿主 React 的 share scope → get('./Widget') → 渲染。远程组件用 init 时注入的宿主 React 实例创建元素, 端到端验证共享机制。\",\n};\n\nimport Realm from '../../src/index.js';\n\nconst ScriptEntryDemo = () => (\n    \u003cRealm\n        entry=\"/remote/remoteEntry.js\"\n        scope=\"crabRealmDemo\"\n        module=\"./Widget\"\n        remoteProps={{ message: '来自宿主的问候' }}\n    />\n);\n\nexport default ScriptEntryDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fscript-entry.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fscript-entry.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Realm",
    "symbol": "RealmProps",
    "props": [
        {
            "name": "entry",
            "required": true,
            "description": "remoteEntry.js 完整 URL",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "scope",
            "required": true,
            "description": "MF 容器全局名（ModuleFederationPlugin 的 name）；module 型下仅作缓存键与错误信息",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "module",
            "required": true,
            "description": "exposes 键, 如 './Widget'",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "entryType",
            "required": false,
            "description": "remote 产物格式：'var'（默认, script 注入后取 globalThis[scope]）| 'module'（ESM, 经 import() 加载）",
            "typeText": "'var' | 'module'",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "exportName",
            "required": false,
            "description": "远程模块上的导出名, 默认 'default'",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "shared",
            "required": false,
            "description": "额外注入 share scope 的共享依赖",
            "typeText": "Record\u003cstring, SharedEntryConfig>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "timeout",
            "required": false,
            "description": "全程加载期限（毫秒, script → init → get 全覆盖）, 超时判失败并使缓存失效。默认 15000",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "delay",
            "required": false,
            "description": "透传 rc-spin 的 delay 防闪烁, 默认 300",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "tip",
            "required": false,
            "description": "透传 rc-spin 的 tip, 默认\"正在加载远程模块\"",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "fallback",
            "required": false,
            "description": "loading 期 Spin 包裹的占位内容（如 rc-skeleton）；默认 min-block-size 占位 div",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "errorFallback",
            "required": false,
            "description": "自定义错误态；缺省渲染 rc-alert(type=error) + 操作区 rc-button 重试",
            "typeText": "(error: RealmError, retry: () => void) => ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onReady",
            "required": false,
            "description": "远程内容就绪（已渲染 / 已 mount）回调",
            "typeText": "() => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onError",
            "required": false,
            "description": "任意阶段失败回调（含渲染期）。Base 已 Omit 原生 onError, 避免与 HTMLAttributes 冲突",
            "typeText": "(error: RealmError) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "ref",
            "required": false,
            "description": "ref 指向 Realm 容器 div",
            "typeText": "Ref\u003cHTMLDivElement>",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
