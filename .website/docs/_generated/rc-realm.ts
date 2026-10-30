/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "远程协议视觉矩阵",
        "description": "真实容器 Promise 保持待定，完成、失败和重试均通过公开协议；含保留草稿的 React 远程和 Shadow DOM mount 远程。",
        "learning": {
            "components": [
                "Button",
                "Realm"
            ],
            "props": [
                "appearance",
                "onClick",
                "disabled",
                "protocol",
                "sandbox",
                "styleSheets"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useId, useRef, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport Realm, { clearRemoteCache, type MountLifecycle, type RemoteContainer } from '@crab-dev/rc-realm';\nimport Button from '@crab-dev/rc-button';\nimport { useLocale } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '远程协议视觉矩阵', description: '真实容器 Promise 保持待定，完成、失败和重试均通过公开协议；含保留草稿的 React 远程和 Shadow DOM mount 远程。' };\nconst stackStyle = css`display: flex; flex-direction: column; gap: ${token.space['stack-gap']};`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;\nconst sceneStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.default}; min-block-size: 160px; overflow-wrap: anywhere;`;\nconst fieldStyle = css`display: block; margin-block: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; font: inherit; max-inline-size: 100%; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; }`;\nconst entry = '/virtual/professional-visual/remoteEntry.js';\ntype Request = { resolve: (factory: () => unknown) => void; reject: (error: Error) => void };\n\nfunction RemoteContent() {\n    const { locale } = useLocale();\n    const [draft, setDraft] = useState('CRAB-2026');\n    return \u003cdiv data-remote-ready=\"component\">\n        \u003cp>{locale === 'en-US' ? 'Remote content is ready. The host owns configuration.' : '远程内容已就绪，配置由最近宿主边界提供。'}\u003c/p>\n        \u003clabel>Remote draft\u003cinput className={fieldStyle} value={draft} onChange={event => setDraft(event.target.value)} />\u003c/label>\n    \u003c/div>;\n}\n\nconst shadowStyles = [`label { display: block; padding: ${token.space['component-gap']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; font-family: ${token.font.family.body}; } input { display: block; max-width: 100%; font: inherit; color: inherit; background: inherit; border: 1px solid ${token.color.border.default}; padding: ${token.space['component-gap']}; } input:focus-visible { outline: 2px solid ${token.color.focus.ring}; }`];\nconst sandboxLifecycle: MountLifecycle = {\n    mount(container) {\n        const label = container.ownerDocument.createElement('label');\n        label.textContent = 'Shadow draft';\n        const input = container.ownerDocument.createElement('input');\n        input.value = 'Shadow CRAB-2026';\n        label.append(input); container.append(label);\n        return () => label.remove();\n    },\n};\n\nexport default function VisualMatrixDemo() {\n    const id = useId(), scope = `crabProfessionalRealm${id}`;\n    const [registered, setRegistered] = useState(false);\n    const [waiting, setWaiting] = useState(false);\n    const [attempt, setAttempt] = useState(0);\n    const [protocol, setProtocol] = useState\u003c'component' | 'mount'>('component');\n    // Transport instance: only effects and events touch the active protocol requests.\n    const pending = useRef(new Set\u003cRequest>());\n    useEffect(() => {\n        const requests = pending.current;\n        const container: RemoteContainer = { init: () => undefined, get: () => {\n            setWaiting(true);\n            return new Promise((resolve, reject) => requests.add({ resolve, reject }));\n        } };\n        const registry = globalThis as Record\u003cstring, unknown>;\n        registry[scope] = container; setRegistered(true);\n        return () => {\n            for (const request of requests) request.reject(new Error('Remote demo unmounted'));\n            requests.clear(); clearRemoteCache(entry, scope);\n            if (registry[scope] === container) delete registry[scope];\n        };\n    }, [scope]);\n    function finish(failure: boolean) {\n        for (const request of pending.current) {\n            if (failure) request.reject(new Error('Deliberate remote transport failure'));\n            else request.resolve(() => ({ default: protocol === 'mount' ? sandboxLifecycle : RemoteContent }));\n        }\n        pending.current.clear(); setWaiting(false);\n    }\n    function restart(nextProtocol = protocol) {\n        finish(true); clearRemoteCache(entry, scope); setProtocol(nextProtocol); setAttempt(value => value + 1);\n    }\n    const common = { entry, scope, module: './VisualMatrix', delay: 0, timeout: 600000 };\n    return \u003cdiv className={stackStyle}>\n        \u003cdiv className={rowStyle}>\n            \u003cButton appearance=\"outlined\" onClick={() => restart()}>重新请求\u003c/Button>\n            \u003cButton appearance=\"outlined\" disabled={!waiting} onClick={() => finish(false)}>完成请求\u003c/Button>\n            \u003cButton appearance=\"outlined\" disabled={!waiting} onClick={() => finish(true)}>请求失败\u003c/Button>\n            \u003cButton appearance=\"outlined\" onClick={() => restart(protocol === 'mount' ? 'component' : 'mount')}>切换协议\u003c/Button>\n        \u003c/div>\n        \u003csection className={sceneStyle} aria-label=\"Realm visual matrix\" data-protocol={protocol}>\n            {registered && (protocol === 'component' ? \u003cRealm key={attempt} {...common} /> : \u003cRealm key={attempt} {...common} protocol=\"mount\" sandbox styleSheets={shadowStyles} />)}\n        \u003c/section>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "三体系视觉与交互矩阵"
    },
    {
        "id": "docs/demos/network-web-component.demo.tsx",
        "title": "网络入口与真实 Web Component",
        "description": "本机 public/remote 资源通过 Realm 的真实 script 或 ESM 入口加载；远程注册自定义元素并维护独立 Shadow DOM 草稿，未预注册容器。",
        "learning": {
            "components": [
                "Button",
                "Realm"
            ],
            "props": [
                "appearance",
                "disabled",
                "onClick",
                "entry",
                "scope",
                "module",
                "entryType",
                "protocol",
                "remoteProps",
                "onReady",
                "onError"
            ],
            "events": [
                "onClick",
                "onReady",
                "onError"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useId, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport Realm from '@crab-dev/rc-realm';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '网络入口与真实 Web Component', description: '本机 public/remote 资源通过 Realm 的真实 script 或 ESM 入口加载；远程注册自定义元素并维护独立 Shadow DOM 草稿，未预注册容器。' };\nconst sceneStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.default}; overflow-wrap: anywhere;`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;\nconst remoteStyles = `:host { display: block; color: ${token.color.text.primary}; font-family: ${token.font.family.body}; } p { margin-block: 0 ${token.space['stack-gap']}; } label { display: block; } input { display: block; box-sizing: border-box; max-inline-size: 100%; margin-block-start: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; color: inherit; font: inherit; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; } input:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\n\nexport default function NetworkWebComponentDemo() {\n    const instanceId = useId();\n    const [remoteBase, setRemoteBase] = useState('');\n    const [entryType, setEntryType] = useState\u003c'var' | 'module'>('var');\n    const [mounted, setMounted] = useState(false);\n    const [status, setStatus] = useState('idle');\n    const [caption, setCaption] = useState('A real network-loaded Web Component');\n    useEffect(() => { setRemoteBase(new URL('./remote/', document.baseURI).href); }, []);\n    const entry = `${remoteBase}web-component-entry.${entryType === 'var' ? 'js' : 'mjs'}`;\n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003clabel>远程入口格式 \u003cselect aria-label=\"远程入口格式\" value={entryType} disabled={mounted} onChange={event => setEntryType(event.target.value as 'var' | 'module')}>\u003coption value=\"var\">script / var\u003c/option>\u003coption value=\"module\">ES module\u003c/option>\u003c/select>\u003c/label>\n            \u003cButton appearance=\"outlined\" disabled={!remoteBase || mounted} onClick={() => { setStatus('loading'); setMounted(true); }}>加载远程 Web Component\u003c/Button>\n            \u003cButton appearance=\"outlined\" disabled={!mounted} onClick={() => { setMounted(false); setStatus('idle'); }}>卸载远程内容\u003c/Button>\n            \u003cButton appearance=\"outlined\" disabled={status !== 'ready'} onClick={() => setCaption('Updated through the mount lifecycle')}>更新远程属性\u003c/Button>\n        \u003c/div>\n        \u003csection className={sceneStyle} aria-label=\"Realm network Web Component\" data-entry-type={entryType} data-status={status}>\n            {mounted && \u003cRealm entry={entry} scope=\"crabRealmNetworkDemo\" module=\"./WebComponent\" entryType={entryType} protocol=\"mount\"\n                remoteProps={{ instanceId, caption, styleText: remoteStyles }} onReady={() => setStatus('ready')} onError={() => setStatus('error')} />}\n        \u003c/section>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fnetwork-web-component.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fnetwork-web-component.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "三体系视觉与交互矩阵"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "component 协议加载远程 React 组件：远程与宿主共享同一 React 实例, remoteProps 实时透传, 与本地组件表现无异。此例通过预注册容器演示（globalThis[scope] 已存在时跳过 script 注入, 零网络）。",
        "learning": {
            "components": [
                "Button",
                "Realm"
            ],
            "props": [
                "onClick",
                "entry",
                "scope",
                "module",
                "remoteProps"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nexport const meta = {\n    title: \"基础用法\",\n    description:\n        \"component 协议加载远程 React 组件：远程与宿主共享同一 React 实例, remoteProps 实时透传, 与本地组件表现无异。此例通过预注册容器演示（globalThis[scope] 已存在时跳过 script 注入, 零网络）。\",\n};\n\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport Realm from '../../src/index.js';\nimport type { RemoteContainer } from '../../src/index.js';\n\nconst RemoteCounter = ({ message }: { message?: unknown }) => {\n    const [count, setCount] = useState(0);\n    return (\n        \u003cdiv className={css`padding: ${token.space[\"card-padding\"]}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; color: ${token.color.text.primary};`}>\n            \u003cp>我是「远程」组件：宿主消息 = {String(message)}\u003c/p>\n            \u003cButton onClick={() => setCount((current) => current + 1)}>\n                远程内部状态 {count}\n            \u003c/Button>\n        \u003c/div>\n    );\n};\n\n// 预注册 MF 容器：真实场景由 remoteEntry.js 注册, demo 里手工注册以便离线运行\nconst container: RemoteContainer = {\n    init: () => undefined,\n    get: (moduleId) =>\n        moduleId === './Counter'\n            ? Promise.resolve(() => ({ default: RemoteCounter }))\n            : Promise.reject(new Error(`unknown module: ${moduleId}`)),\n};\n(globalThis as Record\u003cstring, unknown>).crabRealmBasic ??= container;\n\nconst BasicDemo = () => {\n    const [message, setMessage] = useState('hello');\n    return (\n        \u003cdiv>\n            \u003cButton onClick={() => setMessage(message === 'hello' ? 'world' : 'hello')}>\n                切换宿主消息（当前 {message}）\n            \u003c/Button>\n            \u003cRealm\n                entry=\"/virtual/remoteEntry.js\"\n                scope=\"crabRealmBasic\"\n                module=\"./Counter\"\n                remoteProps={{ message }}\n            />\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/error-retry.demo.tsx",
        "title": "错误态与重试",
        "description": "远程模块首次加载必然失败（模拟弱网）：Realm 渲染 rc-alert 错误态并就近提供重试按钮；失败已自动使缓存失效, 点击重试即重走加载链路, 第二次成功。",
        "learning": {
            "components": [
                "Realm"
            ],
            "props": [
                "entry",
                "scope",
                "module"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nexport const meta = {\n    title: \"错误态与重试\",\n    description:\n        \"远程模块首次加载必然失败（模拟弱网）：Realm 渲染 rc-alert 错误态并就近提供重试按钮；失败已自动使缓存失效, 点击重试即重走加载链路, 第二次成功。\",\n};\n\nimport Realm from '../../src/index.js';\nimport type { RemoteContainer } from '../../src/index.js';\n\nconst RemoteWidget = () => (\n    \u003cdiv className={css`padding: ${token.space[\"card-padding\"]}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; color: ${token.color.text.primary};`}>重试成功, 远程内容已就绪。\u003c/div>\n);\n\nlet attempts = 0;\nconst container: RemoteContainer = {\n    init: () => undefined,\n    get: () => {\n        attempts += 1;\n        if (attempts === 1) {\n            return Promise.reject(new Error('模拟网络失败（首次必败, 请点击重试）'));\n        }\n        return Promise.resolve(() => ({ default: RemoteWidget }));\n    },\n};\n(globalThis as Record\u003cstring, unknown>).crabRealmFlaky ??= container;\n\nconst ErrorRetryDemo = () => (\n    \u003cRealm entry=\"/virtual/remoteEntry.js\" scope=\"crabRealmFlaky\" module=\"./Widget\" />\n);\n\nexport default ErrorRetryDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Ferror-retry.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Ferror-retry.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/mount-sandbox.demo.tsx",
        "title": "mount 协议 + Shadow DOM 沙箱",
        "description": "mount 协议适配跨框架 / 不同 React 版本的远程, 可开启 sandbox 做样式隔离：下方宿主与远程各有一个 .sandbox-demo-title 元素——远程标题被 styleSheets 染色, 宿主标题不受影响；主题令牌 CSS 变量仍穿透沙箱。",
        "learning": {
            "components": [
                "Realm"
            ],
            "props": [
                "entry",
                "scope",
                "module",
                "protocol",
                "sandbox",
                "styleSheets",
                "remoteProps"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"mount 协议 + Shadow DOM 沙箱\",\n    description:\n        \"mount 协议适配跨框架 / 不同 React 版本的远程, 可开启 sandbox 做样式隔离：下方宿主与远程各有一个 .sandbox-demo-title 元素——远程标题被 styleSheets 染色, 宿主标题不受影响；主题令牌 CSS 变量仍穿透沙箱。\",\n};\n\nimport Realm from '../../src/index.js';\nimport type { MountLifecycle, RemoteContainer } from '../../src/index.js';\n\nconst lifecycle: MountLifecycle = {\n    mount: (container, props) => {\n        const title = document.createElement('p');\n        title.className = 'sandbox-demo-title';\n        title.textContent = `沙箱内的远程标题（message = ${String(props.message)}）`;\n        container.append(title);\n        return () => title.remove();\n    },\n};\n\nconst container: RemoteContainer = {\n    init: () => undefined,\n    get: () => Promise.resolve(() => ({ default: lifecycle })),\n};\n(globalThis as Record\u003cstring, unknown>).crabRealmSandbox ??= container;\n\nconst MountSandboxDemo = () => (\n    \u003cdiv>\n        \u003cp className=\"sandbox-demo-title\">宿主的标题：不受沙箱内样式影响, 保持默认颜色\u003c/p>\n        \u003cRealm\n            entry=\"/virtual/remoteEntry.js\"\n            scope=\"crabRealmSandbox\"\n            module=\"./Title\"\n            protocol=\"mount\"\n            sandbox\n            styleSheets={[\n                '.sandbox-demo-title { color: var(--token-semantic-color-brand-primary, oklch(0.55 0.2 260)); font-weight: 600; }',\n            ]}\n            remoteProps={{ message: '隔离生效' }}\n        />\n    \u003c/div>\n);\n\nexport default MountSandboxDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fmount-sandbox.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fmount-sandbox.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/script-entry.demo.tsx",
        "title": "真实 script 注入链路",
        "description": "从 URL 加载 remoteEntry.js（本包 public/remote/ 下的手写 var 格式容器）：script 注入 → init 收到含宿主 React 的 share scope → get('./Widget') → 渲染。远程组件用 init 时注入的宿主 React 实例创建元素, 端到端验证共享机制。",
        "learning": {
            "components": [
                "Realm"
            ],
            "props": [
                "entry",
                "scope",
                "module",
                "remoteProps"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"真实 script 注入链路\",\n    description:\n        \"从 URL 加载 remoteEntry.js（本包 public/remote/ 下的手写 var 格式容器）：script 注入 → init 收到含宿主 React 的 share scope → get('./Widget') → 渲染。远程组件用 init 时注入的宿主 React 实例创建元素, 端到端验证共享机制。\",\n};\n\nimport Realm from '../../src/index.js';\n\nconst ScriptEntryDemo = () => (\n    \u003cRealm\n        entry=\"/remote/remoteEntry.js\"\n        scope=\"crabRealmDemo\"\n        module=\"./Widget\"\n        remoteProps={{ message: '来自宿主的问候' }}\n    />\n);\n\nexport default ScriptEntryDemo;\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fscript-entry.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fscript-entry.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/visual-states.demo.tsx",
        "title": "可重放的加载与错误",
        "description": "使用预注册的真实远程容器协议，将模块 Promise 保持待定。通过按钮完成或拒绝请求；Realm 自己显示加载、默认错误与重试。每次重放清除本实例缓存，不依赖网络或短暂计时窗口。",
        "learning": {
            "components": [
                "Button",
                "Realm"
            ],
            "props": [
                "appearance",
                "onClick",
                "disabled",
                "entry",
                "scope",
                "module",
                "delay",
                "timeout"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useId, useRef, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Button from '@crab-dev/rc-button';\nimport Realm, { clearRemoteCache, type RemoteContainer } from '@crab-dev/rc-realm';\n\nexport const meta = {\n    title: '可重放的加载与错误',\n    description: '使用预注册的真实远程容器协议，将模块 Promise 保持待定。通过按钮完成或拒绝请求；Realm 自己显示加载、默认错误与重试。每次重放清除本实例缓存，不依赖网络或短暂计时窗口。',\n};\n\ntype PendingModule = { resolve: (factory: () => unknown) => void; reject: (error: Error) => void };\nconst controlsStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;\nconst contentStyle = css`padding: ${token.space['card-padding']}; min-block-size: 100px; border: 1px solid ${token.color.border.default};`;\nconst entry = '/virtual/visual-states/remoteEntry.js';\n\nfunction RemoteContent() {\n    return \u003cdiv className={contentStyle}>远程内容已加载 Ready。主题、语言和方向继续由宿主配置继承。\u003c/div>;\n}\n\nexport default function VisualStatesDemo() {\n    const id = useId();\n    const scope = `crabRealmVisual${id}`;\n    const [registered, setRegistered] = useState(false);\n    const [waiting, setWaiting] = useState(false);\n    const [replay, setReplay] = useState(0);\n    // 可变传输实例：保存未完成的模块请求，仅在 effect/事件中增删，卸载时拒绝并清理。\n    const pending = useRef(new Set\u003cPendingModule>());\n\n    useEffect(() => {\n        const requests = pending.current;\n        let disposed = false;\n        const container: RemoteContainer = {\n            init: () => undefined,\n            get: () => {\n                if (disposed) return Promise.reject(new Error('该演示实例已经卸载'));\n                setWaiting(true);\n                return new Promise((resolve, reject) => { requests.add({ resolve, reject }); });\n            },\n        };\n        const registry = globalThis as Record\u003cstring, unknown>;\n        registry[scope] = container;\n        setRegistered(true);\n        return () => {\n            disposed = true;\n            for (const request of requests) request.reject(new Error('演示已卸载，取消等待请求'));\n            requests.clear();\n            clearRemoteCache(entry, scope);\n            if (registry[scope] === container) delete registry[scope];\n        };\n    }, [scope]);\n\n    const finish = (failure: boolean) => {\n        for (const request of pending.current) {\n            if (failure) request.reject(new Error('可重放的模块加载错误'));\n            else request.resolve(() => ({ default: RemoteContent }));\n        }\n        pending.current.clear();\n        setWaiting(false);\n    };\n    const restart = () => {\n        finish(true);\n        clearRemoteCache(entry, scope);\n        setReplay(value => value + 1);\n    };\n\n    return \u003csection aria-label=\"远程模块请求状态\">\n        \u003cdiv className={controlsStyle}>\n            \u003cButton appearance=\"outlined\" onClick={restart}>重新加载\u003c/Button>\n            \u003cButton appearance=\"outlined\" disabled={!waiting} onClick={() => finish(true)}>返回错误\u003c/Button>\n            \u003cButton appearance=\"outlined\" disabled={!waiting} onClick={() => finish(false)}>完成加载\u003c/Button>\n        \u003c/div>\n        {registered && \u003cRealm key={replay} entry={entry} scope={scope} module=\"./VisualState\" delay={0} timeout={600000} />}\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-realm/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-states.demo.tsx",
        "workbenchPath": "/components/rc-realm/workbench/#/components/docs%2Fdemos%2Fvisual-states.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    }
] as const satisfies readonly ComponentDemoRecord[];
