/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "真实 PDF 工作区矩阵",
        "description": "自包含双页 PDF，使用实际 Worker/WASM；验证文档编辑、错误、只读、工具栏和配置切换，不上传文件。",
        "learning": {
            "components": [
                "Button",
                "Checkbox",
                "PdfEditor"
            ],
            "props": [
                "appearance",
                "onClick",
                "checked",
                "onCheckedChange",
                "ref",
                "runtime",
                "initialDocument",
                "readOnly",
                "onStateChange"
            ],
            "events": [
                "onClick",
                "onCheckedChange",
                "onStateChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useRef, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport PdfEditor, { type PdfDocumentInput, type PdfEditorRef, type PdfEditorState } from '@crab-dev/rc-pdf-editor';\nimport Button from '@crab-dev/rc-button';\nimport Checkbox from '@crab-dev/rc-checkbox';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '真实 PDF 工作区矩阵', description: '自包含双页 PDF，使用实际 Worker/WASM；验证文档编辑、错误、只读、工具栏和配置切换，不上传文件。' };\nconst runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };\nconst sceneStyle = css`padding: ${token.space['component-gap']}; max-inline-size: 100%; background: ${token.color.surface.content};`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;\n\n// An ASCII fixture is generated in the demo so this example remains independently copyable.\nfunction createDocument(): PdfDocumentInput {\n    const streams = [\n        'BT /F1 24 Tf 36 250 Td (Crab professional workspace) Tj 0 -42 Td /F1 16 Tf (Editable local document - Page 1) Tj ET',\n        'BT /F1 24 Tf 36 250 Td (Second page) Tj 0 -42 Td /F1 16 Tf (Stable content for scrolling and selection) Tj ET',\n    ];\n    const objects = ['\u003c\u003c /Type /Catalog /Pages 2 0 R >>', '\u003c\u003c /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>'];\n    streams.forEach((stream, index) => objects.push(`\u003c\u003c /Type /Page /Parent 2 0 R /MediaBox [0 0 600 320] /Resources \u003c\u003c /Font \u003c\u003c /F1 7 0 R >> >> /Contents ${4 + index * 2} 0 R >>`, `\u003c\u003c /Length ${stream.length} >>\\nstream\\n${stream}\\nendstream`));\n    objects.push('\u003c\u003c /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');\n    let pdf = '%PDF-1.4\\n';\n    const offsets = objects.map((object, index) => { const offset = pdf.length; pdf += `${index + 1} 0 obj\\n${object}\\nendobj\\n`; return offset; });\n    const xref = pdf.length;\n    pdf += `xref\\n0 ${objects.length + 1}\\n0000000000 65535 f \\n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \\n`).join('')}trailer\\n\u003c\u003c /Size ${objects.length + 1} /Root 1 0 R >>\\nstartxref\\n${xref}\\n%%EOF\\n`;\n    return { id: 'professional-visual', fileName: 'professional-visual.pdf', source: new TextEncoder().encode(pdf) };\n}\n\nexport default function VisualMatrixDemo() {\n    // Command handle: editor sessions stay live through host configuration changes.\n    const editor = useRef\u003cPdfEditorRef>(null);\n    const [document] = useState(createDocument);\n    const [state, setState] = useState\u003cPdfEditorState>();\n    const [readOnly, setReadOnly] = useState(false);\n    const [commandError, setCommandError] = useState('');\n    async function run(command: (instance: PdfEditorRef) => Promise\u003cunknown>) {\n        const instance = editor.current;\n        if (!instance) return;\n        try { setCommandError(''); await command(instance); } catch (error) { setCommandError(error instanceof Error ? error.message : String(error)); }\n    }\n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003cButton appearance=\"outlined\" onClick={() => { void run(instance => instance.open(document)); }}>重新打开\u003c/Button>\n            \u003cButton appearance=\"outlined\" onClick={() => { void run(instance => instance.close()); }}>关闭文档\u003c/Button>\n            \u003cButton appearance=\"outlined\" onClick={() => { void run(instance => instance.open({ ...document, id: 'professional-long', fileName: '企业级专业文档工作区：国际服务与长期运营季度报告 Enterprise professional document workspace and long-term international operations.pdf' })); }}>打开长文件名\u003c/Button>\n            \u003cCheckbox checked={readOnly} onCheckedChange={setReadOnly}>只读模式\u003c/Checkbox>\n        \u003c/div>\n        {commandError && \u003cp role=\"alert\">{commandError}\u003c/p>}\n        \u003csection aria-label=\"PdfEditor visual matrix\" className={sceneStyle} data-status={state?.status ?? 'initializing'} data-document={state?.document?.id ?? ''} data-revision={state?.document?.revision ?? 0} data-dirty={String(state?.document?.dirty ?? false)} data-page={state?.document?.currentPageIndex ?? 0}>\n            \u003cPdfEditor ref={editor} runtime={runtime} initialDocument={document} readOnly={readOnly} onStateChange={setState} />\n        \u003c/section>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "三体系视觉与交互矩阵"
    },
    {
        "id": "docs/demos/professional-actions.demo.tsx",
        "title": "真实资源、编辑与专业动作",
        "description": "同源PDF、完整Liberation TTF及PNG夹具；使用公开文字/图片编辑、历史、保存、工具栏与区域插件，不上传文档。复制时部署public/fixtures及runtime资源。",
        "learning": {
            "components": [
                "Checkbox",
                "Button",
                "PdfEditor"
            ],
            "props": [
                "checked",
                "onCheckedChange",
                "appearance",
                "onClick",
                "disabled",
                "ref",
                "runtime",
                "initialDocument",
                "fonts",
                "onStateChange",
                "onSave",
                "plugins"
            ],
            "events": [
                "onCheckedChange",
                "onClick",
                "onStateChange",
                "onSave"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useRef, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport PdfEditor, { PDF_EDITOR_ACTIONS, createRegionOcrPlugin, type PdfEditorRef, type PdfEditorState, type PdfEditorPlugin, type PdfRegionImage, type PdfExportResult, type PdfFont } from '@crab-dev/rc-pdf-editor';\nimport Button from '@crab-dev/rc-button';\nimport Checkbox from '@crab-dev/rc-checkbox';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '真实资源、编辑与专业动作', description: '同源PDF、完整Liberation TTF及PNG夹具；使用公开文字/图片编辑、历史、保存、工具栏与区域插件，不上传文档。复制时部署public/fixtures及runtime资源。' };\nconst runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };\nconst document = { id: 'professional-rich', fileName: 'professional-rich.pdf', source: { url: './fixtures/visual-document.pdf', headers: { 'x-crab-visual': 'local-fixture' }, credentials: 'same-origin' as const } };\nconst fonts: readonly PdfFont[] = [{ id: 'liberation', family: 'Liberation Sans', source: './fixtures/LiberationSans-Regular.ttf' }];\nconst row = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;\nconst sceneStyle = css`padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; max-inline-size: 100%;`;\nconst imageStyle = css`display: block; max-inline-size: 100%; block-size: auto; border: 1px solid ${token.color.border.default};`;\nconst icon = \u003csvg viewBox=\"0 0 24 24\" fill=\"currentColor\" focusable=\"false\">\u003cpath d=\"M4 3h16v18H4V3zm2 2v14h12V5H6zm2 3h8v2H8V8zm0 4h8v2H8v-2z\" />\u003c/svg>;\n\nexport default function ProfessionalActionsDemo() {\n    const editor = useRef\u003cPdfEditorRef>(null);\n    const [state, setState] = useState\u003cPdfEditorState>();\n    const [showDrawing, setShowDrawing] = useState(true), [pluginEnabled, setPluginEnabled] = useState(true);\n    const [summary, setSummary] = useState(''), [failure, setFailure] = useState('');\n    const [pluginLife, setPluginLife] = useState({ installs: 0, cleanups: 0, aborts: 0 });\n    const [saved, setSaved] = useState\u003c{ name: string; bytes: number; valid: boolean }>();\n    const [exported, setExported] = useState\u003cPdfExportResult>(), [exportUrl, setExportUrl] = useState('');\n    const [region, setRegion] = useState\u003cPdfRegionImage>(), [regionUrl, setRegionUrl] = useState('');\n    const [regionPlugin] = useState\u003cPdfEditorPlugin>(() => {\n        const interactive = createRegionOcrPlugin({ id: 'professional-region', label: '交互区域捕获', scale: 1,\n            recognize: async (image, { signal }) => { signal.throwIfAborted(); return { pixels: image.width * image.height }; },\n            onResult: (_result, image) => setRegion(image),\n        });\n        return { ...interactive, setup({ signal }) {\n            setPluginLife(value => ({ ...value, installs: value.installs + 1 }));\n            signal.addEventListener('abort', () => setPluginLife(value => ({ ...value, aborts: value.aborts + 1 })), { once: true });\n            return () => setPluginLife(value => ({ ...value, cleanups: value.cleanups + 1 }));\n        }, actions: [...interactive.actions!, { id: 'cross-page', label: '跨页区域捕获', icon, placement: 'tools',\n            async onSelect({ getEditor, signal }) {\n                const instance = getEditor(), pages = instance.getPages();\n                const selection = instance.createRegionSelection([\n                    { pageIndex: 0, x: 0, y: pages[0].height - 80, width: pages[0].width, height: 80 },\n                    { pageIndex: 1, x: 0, y: 0, width: pages[1].width, height: 80 },\n                ]);\n                setRegion(await instance.captureRegion(selection, { scale: 1, signal }));\n            },\n        }] };\n    });\n    useEffect(() => { if (!region) return; const url = URL.createObjectURL(region.blob); setRegionUrl(url); return () => URL.revokeObjectURL(url); }, [region]);\n    useEffect(() => { if (!exported) return; const url = URL.createObjectURL(exported.blob); setExportUrl(url); return () => URL.revokeObjectURL(url); }, [exported]);\n    async function run(command: (instance: PdfEditorRef) => Promise\u003cvoid>) {\n        if (!editor.current) return;\n        try { setFailure(''); await command(editor.current); } catch (error) { setFailure(error instanceof Error ? error.message : String(error)); }\n    }\n    async function savedDocument(result: PdfExportResult) {\n        setSaved({ name: result.fileName, bytes: result.blob.size, valid: (await result.blob.slice(0, 4).text()) === '%PDF' });\n    }\n    const visibility = Object.fromEntries(PDF_EDITOR_ACTIONS.filter(action => action.group === 'drawing').map(action => [action.id, showDrawing]));\n    return \u003csection aria-label=\"PdfEditor visual matrix\" className={sceneStyle} data-status={state?.status ?? 'initializing'} data-document={state?.document?.id ?? ''} data-page-count={state?.document?.pageCount ?? 0} data-revision={state?.document?.revision ?? 0} data-dirty={String(state?.document?.dirty ?? false)}>\n        \u003cdiv className={row}>\n            \u003cCheckbox checked={showDrawing} onCheckedChange={setShowDrawing}>显示绘图工具\u003c/Checkbox>\n            \u003cCheckbox checked={pluginEnabled} onCheckedChange={setPluginEnabled}>启用区域插件\u003c/Checkbox>\n            \u003cButton appearance=\"outlined\" onClick={() => { void run(async instance => setExported(await instance.exportPdf())); }}>导出当前 PDF\u003c/Button>\n            \u003cButton appearance=\"outlined\" onClick={() => { void run(async instance => setExported(await instance.extractPages([0]))); }}>提取第一页\u003c/Button>\n            \u003cButton appearance=\"outlined\" disabled={!exported} onClick={() => { void run(async instance => { if (exported) await instance.open({ id: 'professional-reopened', fileName: exported.fileName, source: exported.blob }); }); }}>重新打开导出 PDF\u003c/Button>\n            \u003cButton appearance=\"outlined\" onClick={() => { void run(async instance => {\n                const page = instance.getPages()[instance.getState().document!.currentPageIndex];\n                setRegion(await instance.captureRegion(instance.createRegionSelection([{ pageIndex: page.index, x: 0, y: 0, width: page.width, height: page.height }]), { scale: 1 }));\n            }); }}>捕获当前页\u003c/Button>\n        \u003c/div>\n        \u003cp>图片夹具：\u003ca href=\"./fixtures/visual-image.png\" download>蓝红图片\u003c/a> · \u003ca href=\"./fixtures/visual-image-replacement.png\" download>绿黄替换图片\u003c/a>。文档与字体均来自当前站点。\u003c/p>\n        {failure && \u003cp role=\"alert\">{failure}\u003c/p>}\n        \u003cPdfEditor ref={editor} runtime={runtime} initialDocument={document} fonts={fonts} onStateChange={setState} onSave={savedDocument}\n            plugins={pluginEnabled ? [regionPlugin] : []} toolbar={{ visibility, extraActions: [{ id: 'professional-summary', label: '文档摘要', icon, placement: 'main', disabled: current => !current.document,\n                onSelect(instance) { const current = instance.getState().document; setSummary(current ? `${current.fileName} · ${current.pageCount}页` : ''); },\n            }] }} />\n        \u003coutput aria-label=\"文档摘要结果\">{summary}\u003c/output>\n        \u003coutput aria-label=\"区域插件状态\" data-installs={pluginLife.installs} data-cleanups={pluginLife.cleanups} data-aborts={pluginLife.aborts}>{pluginEnabled ? '区域插件已启用' : '区域插件已卸载'}\u003c/output>\n        {saved && \u003cp aria-label=\"保存结果\" data-bytes={saved.bytes} data-valid-pdf={String(saved.valid)}>{saved.name} 已保存\u003c/p>}\n        {exportUrl && \u003ca href={exportUrl} download={exported!.fileName} aria-label=\"下载导出 PDF\">下载 {exported!.fileName}\u003c/a>}\n        {regionUrl && \u003cfigure data-region-parts={region!.parts.length} data-region-width={region!.width} data-region-height={region!.height}>\u003cimg className={imageStyle} src={regionUrl} alt=\"实际 PDF 区域像素\" />\u003cfigcaption>文档区域快照 · 版本 {region!.selection.revision}\u003c/figcaption>\u003c/figure>}\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Fprofessional-actions.demo.tsx",
        "workbenchPath": "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Fprofessional-actions.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "三体系视觉与交互矩阵"
    },
    {
        "id": "docs/demos/web-component-runtime.demo.tsx",
        "title": "独立 Web Component 与远程文档",
        "description": "加载实际独立JS产物，内部生产React/CSS/Worker/WASM保持隔离；八项配置显式传入真实元素，同源PDF与字体通过网络加载。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "appearance",
                "disabled",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useEffectEvent, useRef, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport type { PdfEditorElement, PdfEditorState, PdfExportResult } from '@crab-dev/rc-pdf-editor';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '独立 Web Component 与远程文档', description: '加载实际独立JS产物，内部生产React/CSS/Worker/WASM保持隔离；八项配置显式传入真实元素，同源PDF与字体通过网络加载。' };\nconst sceneStyle = css`padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; max-inline-size: 100%;`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;\nconst mountStyle = css`display: block; min-inline-size: 0; max-inline-size: 100%;`;\n\nexport default function WebComponentRuntimeDemo() {\n    const config = useConfig(), mount = useRef\u003cHTMLDivElement>(null), element = useRef\u003cPdfEditorElement>(null);\n    const [state, setState] = useState\u003cPdfEditorState>(), [failure, setFailure] = useState('');\n    const [saved, setSaved] = useState(false), [exported, setExported] = useState\u003cPdfExportResult>(), [url, setUrl] = useState('');\n    const applyConfiguration = useEffectEvent((editor: PdfEditorElement) => {\n        editor.designSystem = config.designSystem; editor.colorMode = config.colorMode;\n        editor.size = config.size; editor.density = config.density; editor.brandColor = config.brandColor;\n        editor.locale = config.locale; editor.direction = config.direction;\n        if (config.nonce === undefined) editor.removeAttribute('nonce'); else editor.nonce = config.nonce;\n    });\n    useEffect(() => {\n        let cancelled = false, instance: PdfEditorElement | undefined;\n        const script = globalThis.document.createElement('script');\n        script.src = new URL('./runtime/pdf-editor.js', globalThis.document.baseURI).href;\n        const loaded = new Promise\u003cvoid>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('独立 PDF 产物加载失败')); });\n        globalThis.document.head.append(script);\n        const receive = (event: Event) => setState((event as CustomEvent\u003cPdfEditorState>).detail);\n        const receiveError = (event: Event) => setFailure((event as CustomEvent\u003cError>).detail.message);\n        void loaded.then(async () => {\n            await globalThis.customElements.whenDefined('crab-pdf-editor');\n            if (cancelled || !mount.current) return;\n            instance = globalThis.document.createElement('crab-pdf-editor');\n            instance.fonts = [{ id: 'liberation', family: 'Liberation Sans', source: new URL('./fixtures/LiberationSans-Regular.ttf', globalThis.document.baseURI) }];\n            instance.initialDocument = { id: 'professional-web-component', fileName: 'professional-web-component.pdf', source: new URL('./fixtures/visual-document.pdf', globalThis.document.baseURI) };\n            instance.onSave = () => { setSaved(true); };\n            instance.addEventListener('crab-state-change', receive);\n            instance.addEventListener('crab-error', receiveError);\n            applyConfiguration(instance); element.current = instance; mount.current.append(instance);\n            await instance.ready(); if (!cancelled) setState(instance.getState());\n        }).catch(error => { if (!cancelled) setFailure(error instanceof Error ? error.message : String(error)); });\n        return () => { cancelled = true; script.remove(); if (instance) { instance.removeEventListener('crab-state-change', receive); instance.removeEventListener('crab-error', receiveError); instance.remove(); } element.current = null; };\n    }, []);\n    useEffect(() => { if (element.current) applyConfiguration(element.current); }, [config]);\n    useEffect(() => { if (!exported) return; const next = URL.createObjectURL(exported.blob); setUrl(next); return () => URL.revokeObjectURL(next); }, [exported]);\n    return \u003csection className={sceneStyle} aria-label=\"PdfEditor visual matrix\" data-status={state?.status ?? 'initializing'} data-document={state?.document?.id ?? ''} data-revision={state?.document?.revision ?? 0} data-dirty={String(state?.document?.dirty ?? false)}>\n        \u003cdiv className={rowStyle}>\u003cButton appearance=\"outlined\" disabled={!state?.document} onClick={() => { if (element.current) void element.current.exportPdf().then(setExported, error => setFailure(String(error))); }}>导出 Web Component PDF\u003c/Button>\u003c/div>\n        {failure && \u003cp role=\"alert\">{failure}\u003c/p>}\n        \u003cdiv className={mountStyle} ref={mount} />\n        {saved && \u003cp role=\"status\">Web Component 文档已保存\u003c/p>}\n        {url && \u003ca href={url} download={exported!.fileName} aria-label=\"下载 Web Component PDF\">下载 {exported!.fileName}\u003c/a>}\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Fweb-component-runtime.demo.tsx",
        "workbenchPath": "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Fweb-component-runtime.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "三体系视觉与交互矩阵"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "本地编辑",
        "description": "打开 PDF，上传项目提供的 TTF 字体后修改文字；图片与页面操作无需额外字体。",
        "learning": {
            "components": [
                "Button",
                "PdfEditor"
            ],
            "props": [
                "onClick",
                "runtime",
                "fonts"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useRef, useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport PdfEditor, { type PdfFont } from '@crab-dev/rc-pdf-editor';\n\nexport const meta = { title: '本地编辑', description: '打开 PDF，上传项目提供的 TTF 字体后修改文字；图片与页面操作无需额外字体。' };\nconst runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };\n\nexport default function BasicDemo() {\n    const [fonts, setFonts] = useState\u003cPdfFont[]>([]);\n    // 可变实例状态：只用于触发系统字体文件选择器。\n    const input = useRef\u003cHTMLInputElement>(null);\n    return \u003c>\n        \u003cButton onClick={() => input.current?.click()}>配置 TTF 字体{fonts.length ? `：${fonts[0].family}` : ''}\u003c/Button>\n        \u003cinput ref={input} type=\"file\" accept=\".ttf,font/ttf\" hidden onChange={event => {\n            const file = event.target.files?.[0]; event.target.value = '';\n            if (file) void file.arrayBuffer().then(source => setFonts([{ id: 'project-font', family: file.name, source }]));\n        }} />\n        \u003cPdfEditor runtime={runtime} fonts={fonts} />\n    \u003c/>;\n}\n",
        "previewPath": "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/readonly.demo.tsx",
        "title": "只读浏览",
        "description": "保留打开、翻页、缩放、对象查看、提取和导出，禁用编辑。",
        "learning": {
            "components": [
                "PdfEditor"
            ],
            "props": [
                "runtime",
                "readOnly"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import PdfEditor from '@crab-dev/rc-pdf-editor';\n\nexport const meta = { title: '只读浏览', description: '保留打开、翻页、缩放、对象查看、提取和导出，禁用编辑。' };\nconst runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };\n\nexport default function ReadOnlyDemo() {\n    return \u003cPdfEditor runtime={runtime} readOnly />;\n}\n",
        "previewPath": "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Freadonly.demo.tsx",
        "workbenchPath": "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Freadonly.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/region-ocr.demo.tsx",
        "title": "跨页区域与 OCR 插件",
        "description": "框选相邻页交界区域，按页面坐标裁切并拼接为真实 PNG；通过 recognize 回调接入自己的 OCR 引擎。示例适配器只展示输入图像，不执行文字识别。",
        "learning": {
            "components": [
                "Checkbox",
                "PdfEditor"
            ],
            "props": [
                "checked",
                "onCheckedChange",
                "runtime",
                "initialDocument",
                "readOnly",
                "plugins"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport Checkbox from '@crab-dev/rc-checkbox';\nimport PdfEditor, { createRegionOcrPlugin, type PdfEditorPlugin, type PdfRegionImage } from '@crab-dev/rc-pdf-editor';\nimport token from '@crab-dev/rc-token-semantic';\n\nconst regionDocument = { id: 'region-demo', fileName: 'cross-page-region.pdf', source: './fixtures/visual-document.pdf' };\n\nexport const meta = { title: '跨页区域与 OCR 插件', description: '框选相邻页交界区域，按页面坐标裁切并拼接为真实 PNG；通过 recognize 回调接入自己的 OCR 引擎。示例适配器只展示输入图像，不执行文字识别。' };\nconst runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };\nconst sectionStyle = css`display: flex; flex-direction: column; gap: ${token.space['stack-gap']}; min-width: 0;`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center;`;\nconst hintStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.caption['font-size']};`;\nconst imageStyle = css`display: block; max-width: 100%; height: auto; border: 1px solid ${token.color.border.default};`;\nconst codeStyle = css`overflow: auto; padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; border-radius: ${token.shape.control};`;\n\nexport default function RegionOcrDemo() {\n    const [installed, setInstalled] = useState(true);\n    const [image, setImage] = useState\u003cPdfRegionImage>();\n    const [imageUrl, setImageUrl] = useState\u003cstring>();\n    const [plugin] = useState\u003cPdfEditorPlugin>(() => {\n        const ocr = createRegionOcrPlugin({\n            id: 'demo.region-ocr', label: '框选跨页区域',\n            // 替换此适配器即可对接项目的 OCR；默认演示不上传文档，也不伪造识别文本。\n            recognize: async (input, { signal }) => {\n                signal.throwIfAborted();\n                return { receivedPixels: input.width * input.height };\n            },\n            onResult: (_result, input) => setImage(input),\n        });\n        return { ...ocr, actions: [...ocr.actions!, {\n            id: 'boundary-example', label: '采集两页交界样例', placement: 'tools',\n            icon: \u003csvg viewBox=\"0 0 24 24\" fill=\"currentColor\" focusable=\"false\">\u003cpath d=\"M4 3h16v7H4V3zm2 2v3h12V5H6zM4 14h16v7H4v-7zm2 2v3h12v-3H6zM2 11h20v2H2z\" />\u003c/svg>,\n            disabled: state => (state.document?.pageCount ?? 0) \u003c 2,\n            async onSelect({ getEditor, signal }) {\n                const editor = getEditor(), pages = editor.getPages();\n                const selection = editor.createRegionSelection([\n                    { pageIndex: 0, x: 0, y: pages[0].height - Math.min(80, pages[0].height), width: pages[0].width, height: Math.min(80, pages[0].height) },\n                    { pageIndex: 1, x: 0, y: 0, width: pages[1].width, height: Math.min(80, pages[1].height) },\n                ]);\n                const result = await editor.captureRegion(selection, { signal, scale: 2 });\n                signal.throwIfAborted(); setImage(result);\n            },\n        }] };\n    });\n    useEffect(() => {\n        if (!image) return;\n        const url = URL.createObjectURL(image.blob); setImageUrl(url);\n        return () => URL.revokeObjectURL(url);\n    }, [image]);\n    return \u003cdiv className={sectionStyle}>\n        \u003cdiv className={rowStyle}>\u003cCheckbox checked={installed} onCheckedChange={setInstalled}>安装区域 OCR 插件\u003c/Checkbox>\u003c/div>\n        \u003cp className={hintStyle}>先点击绘图栏末尾“采集两页交界样例”查看拼接结果。手动选择时，可先调低缩放并滚到页间交界，再点击“框选跨页区域”；选区支持滚轮翻页、键盘操作和取消。当前编辑器为只读，区域采集仍可使用。\u003c/p>\n        \u003cPdfEditor runtime={runtime} initialDocument={regionDocument} readOnly plugins={installed ? [plugin] : []} />\n        \u003cp role=\"status\">{image ? `已采集 ${image.parts.length} 页区域，PNG ${image.width} × ${image.height} px。演示适配器已收到图像；尚未接入 OCR 识别引擎。` : '选择区域后，这里显示去掉页间留白的真实图像和坐标映射。'}\u003c/p>\n        {imageUrl && \u003cimg className={imageStyle} src={imageUrl} alt=\"跨页选区拼接图像，作为 OCR 输入\" />}\n        {image && \u003cdetails>\u003csummary>查看页坐标与拼接图像坐标\u003c/summary>\u003cpre className={codeStyle}>{JSON.stringify({ selection: image.selection, parts: image.parts }, null, 2)}\u003c/pre>\u003c/details>}\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Fregion-ocr.demo.tsx",
        "workbenchPath": "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Fregion-ocr.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/toolbar.demo.tsx",
        "title": "图标显隐与动作扩展",
        "description": "逐项或分组控制全部内置图标，实时预览配置，并追加一个业务动作。隐藏入口不会限制快捷键和 ref。",
        "learning": {
            "components": [
                "Checkbox",
                "Button",
                "PdfEditor"
            ],
            "props": [
                "checked",
                "indeterminate",
                "onCheckedChange",
                "onClick",
                "runtime",
                "initialDocument",
                "readOnly",
                "toolbar"
            ],
            "events": [
                "onCheckedChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport Checkbox from '@crab-dev/rc-checkbox';\nimport PdfEditor, { PDF_EDITOR_ACTIONS, type PdfEditorActionGroup, type PdfEditorActionVisibility, type PdfEditorToolbarAction } from '@crab-dev/rc-pdf-editor';\nimport token from '@crab-dev/rc-token-semantic';\n\nconst sampleDocument = { id: 'toolbar-demo', fileName: 'toolbar-demo.pdf', source: './fixtures/visual-document.pdf' };\n\nexport const meta = { title: '图标显隐与动作扩展', description: '逐项或分组控制全部内置图标，实时预览配置，并追加一个业务动作。隐藏入口不会限制快捷键和 ref。' };\nconst runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };\nconst groupLabels: Record\u003cPdfEditorActionGroup, string> = {\n    file: '文件', history: '历史', insert: '插入对象', pages: '页面管理', output: '输出',\n    navigation: '画布工具', drawing: '绘图工具', panels: '侧栏图标', view: '视图',\n};\nconst groups = [...new Set(PDF_EDITOR_ACTIONS.map(action => action.group))];\nconst sectionStyle = css`display: flex; flex-direction: column; gap: ${token.space['stack-gap']}; min-width: 0;`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']};`;\nconst gridStyle = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: ${token.space['stack-gap']};`;\nconst fieldStyle = css`border: 0; padding: 0; margin: 0; min-width: 0; & legend { margin-bottom: ${token.space['component-gap']}; }`;\nconst noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.caption['font-size']};`;\nconst codeStyle = css`margin: 0; padding: ${token.space['card-padding']}; overflow: auto; background: ${token.color.surface.content}; border-radius: ${token.shape.control};`;\n\nexport default function ToolbarDemo() {\n    const [visibility, setVisibility] = useState\u003cPdfEditorActionVisibility>({});\n    const [readOnly, setReadOnly] = useState(false);\n    const [showSummary, setShowSummary] = useState(true);\n    const [summary, setSummary] = useState('点击工具栏末尾的“文档摘要”查看业务动作结果。');\n    const shownCount = PDF_EDITOR_ACTIONS.filter(action => visibility[action.id] !== false).length;\n    const extraActions: readonly PdfEditorToolbarAction[] = [{\n        id: 'demo.document-summary', label: '文档摘要', placement: 'main', visible: showSummary,\n        icon: \u003csvg viewBox=\"0 0 24 24\" fill=\"currentColor\" focusable=\"false\">\u003cpath d=\"M11 17h2v-6h-2v6zm0-8h2V7h-2v2zm1-7a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z\" />\u003c/svg>,\n        disabled: state => !state.document,\n        onSelect(editor) {\n            const document = editor.getState().document;\n            if (document) setSummary(`${document.fileName} · ${document.pageCount} 页 · 版本 ${document.revision}${document.dirty ? ' · 未保存' : ' · 已保存'}`);\n        },\n    }];\n    return \u003cdiv className={sectionStyle}>\n        \u003cdiv className={rowStyle}>\n            \u003cCheckbox checked={shownCount === PDF_EDITOR_ACTIONS.length} indeterminate={shownCount > 0 && shownCount \u003c PDF_EDITOR_ACTIONS.length}\n                onCheckedChange={checked => setVisibility(Object.fromEntries(PDF_EDITOR_ACTIONS.map(action => [action.id, checked])))}>全部内置图标（{shownCount}/{PDF_EDITOR_ACTIONS.length}）\u003c/Checkbox>\n            \u003cButton onClick={() => setVisibility({})}>恢复默认\u003c/Button>\n            \u003cCheckbox checked={readOnly} onCheckedChange={setReadOnly}>只读模式\u003c/Checkbox>\n            \u003cCheckbox checked={showSummary} onCheckedChange={setShowSummary}>扩展：文档摘要\u003c/Checkbox>\n        \u003c/div>\n        \u003cdetails>\n            \u003csummary>逐项配置 {PDF_EDITOR_ACTIONS.length} 个内置图标\u003c/summary>\n            \u003cdiv className={gridStyle}>\n                {groups.map(group => {\n                    const actions = PDF_EDITOR_ACTIONS.filter(action => action.group === group);\n                    const count = actions.filter(action => visibility[action.id] !== false).length;\n                    return \u003cfieldset className={fieldStyle} key={group}>\n                        \u003clegend>\u003cCheckbox checked={count === actions.length} indeterminate={count > 0 && count \u003c actions.length}\n                            onCheckedChange={checked => setVisibility(previous => ({ ...previous, ...Object.fromEntries(actions.map(action => [action.id, checked])) }))}>{groupLabels[group]}\u003c/Checkbox>\u003c/legend>\n                        \u003cdiv className={sectionStyle}>{actions.map(action => \u003cCheckbox key={action.id} checked={visibility[action.id] !== false}\n                            onCheckedChange={checked => setVisibility(previous => ({ ...previous, [action.id]: checked }))}>{action.label}\u003c/Checkbox>)}\u003c/div>\n                    \u003c/fieldset>;\n                })}\n            \u003c/div>\n        \u003c/details>\n        \u003cp className={noteStyle}>显隐只改变入口；只读模式决定能否编辑。侧栏开关和收起按钮可分别隐藏，面板本身保持当前状态。示例未配置 TTF，“添加文字”显示但不可用。\u003c/p>\n        \u003coutput aria-live=\"polite\">{summary}\u003c/output>\n        \u003cPdfEditor runtime={runtime} initialDocument={sampleDocument} readOnly={readOnly} toolbar={{ visibility, extraActions }} />\n        \u003cdetails>\u003csummary>查看当前显隐配置\u003c/summary>\u003cpre className={codeStyle}>{JSON.stringify({ toolbar: { visibility } }, null, 2)}\u003c/pre>\u003c/details>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-pdf-editor/workbench/?__wake_demo=docs%2Fdemos%2Ftoolbar.demo.tsx",
        "workbenchPath": "/components/rc-pdf-editor/workbench/#/components/docs%2Fdemos%2Ftoolbar.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "能力与集成示例"
    }
] as const satisfies readonly ComponentDemoRecord[];
