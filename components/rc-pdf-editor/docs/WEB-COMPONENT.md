# PDF 编辑器 Web Component

`<crab-pdf-editor>` 是现有 React 19 PDF 编辑器的浏览器适配。独立产物 `dist/pdf-editor.js` 自动注册元素，并包含生产 React/React DOM、组件 CSS、主题、PDFium WASM 和 Worker。使用方不需要 npm、React、CSS 引入或 Worker 地址配置。

## 最小接入

```html
<script src="./pdf-editor.js" defer></script>
<crab-pdf-editor></crab-pdf-editor>
```

用户点击“打开 PDF”即可选择本地文件。也可以声明初始文件：

```html
<crab-pdf-editor src="./example.pdf" file-name="示例.pdf" readonly theme="dark"></crab-pdf-editor>
```

`src` 按页面 base URL 解析，仅在挂载时读取；`file-name` 同样属于初始配置。之后切换文档使用 `open()` / `close()`。`readonly` 遵循 HTML 布尔属性语义：`readonly="false"` 仍然为真，取消时应移除属性或设置 `element.readOnly = false`。

## 命令与事件

```html
<script src="./pdf-editor.js" defer></script>
<crab-pdf-editor id="editor"></crab-pdf-editor>
<script type="module">
    await customElements.whenDefined('crab-pdf-editor');
    const editor = document.getElementById('editor');

    editor.addEventListener('crab-document-load', event => {
        console.log(event.detail.id, event.detail.pageCount);
    });
    editor.addEventListener('crab-error', event => {
        console.error(event.detail.code, event.detail.message);
    });

    await editor.ready();
    await editor.open({ id: 'contract', source: './contract.pdf', fileName: 'contract.pdf' });
    const result = await editor.exportPdf();
    // result.blob 是 PDF；导出本身不会下载或清除 dirty。
</script>
```

实例实现 `PdfEditorRef` 的全部命令：`ready`、`getState`、`subscribe`、`getPages`、`open`、`close`、`exportPdf`、`extractPages`、`save`、`undo`、`redo`、`goToPage`、`fitToPage`、`selectRegion`、`createRegionSelection`、`captureRegion`。参数、取消信号、返回值和错误码与 [React API](./README.md) 一致。同步命令应在 `ready()` 后调用；异步命令自动等待元素提交和运行时初始化。

`ready()` 与 `crab-ready` 只表示 Worker/WASM 就绪，不保证初始 PDF 已打开或页面像素已绘制。文档提交完成请等待 `open()` 或监听 `crab-document-load`。命令错误通过 Promise 拒绝；内置 UI 和初始化错误通过 `crab-error` 通知，避免重复报告。

| 事件 | `event.detail` |
| --- | --- |
| `crab-ready` | 无 |
| `crab-document-load` | `PdfDocumentState` |
| `crab-state-change` | `PdfEditorState` |
| `crab-saved` | `PdfExportResult` |
| `crab-error` | `PdfEditorError` |

事件均冒泡并设置 `composed: true`。事件监听应尽量在连接元素前设置；已错过 ready 事件的调用者仍可调用 `ready()`。

## 配置

| Property | 说明 |
| --- | --- |
| `initialDocument` | 挂载前设置的 `PdfDocumentInput`，优先于 `src` |
| `runtime` | 可选的挂载前配置；覆盖独立文件内置的 Worker/WASM |
| `fonts` | 可实时更新的 `PdfFont[]`，修改 PDF 文字时按原组件要求提供完整 TTF 字体 |
| `readOnly` | 与 `readonly` 属性双向对应 |
| `theme` | `light` / `dark`，与同名属性双向对应 |
| `toolbar` | `{ visibility: { actionId: boolean } }`，支持实时配置内置动作显隐 |
| `beforeDocumentChange` | 原组件的异步文档切换守卫 |
| `onSave` | 原组件的异步持久化处理器；未设置时由原组件发起下载 |

本试点不将 React 专用的 `toolbar.extraActions`、`plugins` 或 ReactNode 转成 HTML API。它们继续通过 React 入口使用；原生宿主可通过上述命令、状态订阅、区域截图和 DOM 事件组合自己的功能。普通属性更新不重建文档；更换运行时或初始文档应先真正移除元素，等待卸载后再设置并重新插入。

脚本定义前设置的这些 properties 会在元素升级时接管。多实例具有独立会话；同一任务内的 DOM 移动保留会话，真正移除时销毁 React root、终止 Worker、取消任务并撤销 Worker Blob URL。再次插入会创建新会话，未导出的修改不会在真正卸载后恢复。

## 样式与运行环境

组件使用 open Shadow DOM，样式由 Wake Library 产物收集并共享，不向宿主文档注入全局 CSS。主题变量沿用 Crab L1/L2/L3 契约，组件尺寸等可通过宿主的组件级 CSS 变量定制。字体、外部 PDF URL 和宿主自己的网络请求不包含在 JS 中；跨域 PDF 仍需服务端提供 CORS。

内嵌 Worker 使用 Blob URL，部署 CSP 需要允许 `worker-src blob:`；PDFium 初始化需要允许 WebAssembly 编译。不要求外部 Worker/WASM 请求。本次自动化与视觉检查使用 Chromium；尚未分别验证 Firefox 和 Safari。

提示层在 Shadow DOM 的主题容器内渲染，模态 dialog 内的提示仍优先放在 dialog 子树中。本次复用原组件视觉，没有重新设计控件；核对范围为样式加载、主题隔离、键盘聚焦后的提示和 PDF 页面绘制，不代表对原 PDF 编辑器全部 M3 状态重新认证。

参考：[M3 Dialog 无障碍](https://m3.material.io/components/dialogs/accessibility)、[Material Web Dialog 文档与示例](https://material-web.dev/components/dialog/)、[Material Web Dialog 实现](https://github.com/material-components/material-web/blob/main/dialog/internal/dialog.ts)、[Custom Elements 生命周期](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)、[React root 生命周期](https://react.dev/reference/react-dom/client/createRoot)。

## 构建与验证

从仓库根目录首次构建完整依赖链：

```powershell
corepack yarn turbo run build:library --filter=@crab-dev/rc-pdf-editor...
```

依赖已构建后，在组件包内执行：

```powershell
corepack yarn build:library
corepack yarn lint
corepack yarn typecheck
corepack yarn test
corepack yarn test:web-component
corepack yarn preview:web-component
```

预览地址是 `http://127.0.0.1:4174`。`dist/index.html` 只引入一个 JS，可直接用来检查无框架接入。npm 子路径 `@crab-dev/rc-pdf-editor/web-component` 指向自动注册的浏览器脚本，不适用于 SSR 执行。需要自行提供 CSS/运行时的构建工具用户可从主包具名导入 `definePdfEditor`，类型为 `PdfEditorElement`；仅导入主包不会自动注册元素或访问 `HTMLElement`。

不需要修改 Wake 源码，也没有引入其他构建器。`scripts/web-component/wake.config.toml` 通过 Wake 的 `define` 配置显式选择生产 React；不影响现有 Docs 和组件测试。打包脚本会拒绝开发 React、未展开的 CSS import 和缺失的已声明 CSS，最终产物测试在独立 iframe 中运行真实脚本、内嵌 Worker 和 WASM。

`test:web-component` 检查生产产物的初始化、PDF 绘制和导出、重复加载、双实例主题隔离及 Tooltip 边界。产物在独立页面运行，其 coverage 不计入源码覆盖率；源码行为覆盖由 `src/__tests__/web-component.test.tsx` 提供。
