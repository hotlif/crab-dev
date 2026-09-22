# 插件与跨页区域 API

编辑器提供文档能力和交互宿主，业务插件负责识别、校验、结果展示与持久化。OCR 是通用选区、图像采集接口的一个组合示例，组件不绑定识别厂商，也不包含 OCR 模型。

## 为什么需要独立的插件契约

原来的 `toolbar.extraActions` 能追加按钮，但没有安装/卸载生命周期、文档任务取消、跨页选区和图像服务。仅追加 `onOcr` 会把特定业务写入主组件；直接截取屏幕 Canvas 又会受到缩放、可见页、页间留白与预览分辨率影响。

本次分为三层：

| 层 | 公开入口 | 职责 |
| --- | --- | --- |
| 插件宿主 | `plugins`、`PdfEditorPlugin` | 注册动作、安装/清理、忙碌反馈、取消、错误归并；每个编辑器独立管理实例 |
| 编辑器服务 | `PdfEditorRef` | 状态订阅、页面几何、交互选区、按坐标创建选区、PDF 原始内容采集 |
| 业务适配器 | `createRegionOcrPlugin({ recognize, onResult })` | 将图像交给自有浏览器模型或服务端 OCR，交付结果 |

简单按钮仍可使用 `toolbar.extraActions`。有资源、订阅、异步识别或卸载需求的能力使用 `plugins`。两者通过同一套工具栏展示，均不公开 PDFium 指针、Worker 协议或内部对象索引。

## 最小 OCR 接入

下面的 `/api/ocr/region` 是宿主提供的示例服务：接收 PNG 文件并返回纯文本。组件不会自动创建该服务。

```tsx
import { useState } from 'react';
import PdfEditor, { createRegionOcrPlugin } from '@crab-dev/rc-pdf-editor';

const runtime = {
    workerUrl: '/pdf-runtime/pdf-editor.worker.js',
    wasmUrl: '/pdf-runtime/pdfium.wasm',
};

export default function InvoiceEditor() {
    const [text, setText] = useState('');
    const [ocr] = useState(() => createRegionOcrPlugin({
        id: 'invoice.region-ocr',
        label: '识别交界区域',
        scale: 2,
        async recognize(image, { signal }) {
            const body = new FormData();
            body.append('image', image.blob, 'region.png');
            const response = await fetch('/api/ocr/region', {
                method: 'POST', body, signal,
            });
            if (!response.ok) throw new Error(`识别失败：${response.status}`);
            return response.text();
        },
        onResult: result => setText(result),
    }));
    return <>
        <PdfEditor runtime={runtime} plugins={[ocr]}
            initialDocument={{ id: 'invoice-42', source: '/invoice.pdf' }} />
        <pre>{text}</pre>
    </>;
}
```

动作依次执行 `selectRegion` → `captureRegion` → `recognize` → `onResult`；`onResult(result, image, { signal })` 可以返回 Promise，宿主等待完成并统一报告失败。用户可框选同一 PDF 相邻两页的交界区域；返回的 PNG 去掉页面之间的界面空隙。选区和截图同样适用于只读编辑器，不修改文档、不进入历史、不改变 `dirty`。

Demo“跨页区域与 OCR 插件”提供两页示例 PDF、安装开关、手动框选、固定交界样例、真实拼接 PNG 和坐标映射。默认适配器只演示接入流程，不上传文件，也不伪造识别文字。原有“图标显隐与动作扩展”Demo 继续用于逐项控制 25 个内置图标。

## 插件生命周期

```tsx
import type { PdfEditorPlugin } from '@crab-dev/rc-pdf-editor';

const auditPlugin: PdfEditorPlugin = {
    id: 'app.audit',
    setup({ getEditor, signal }) {
        const unsubscribe = getEditor().subscribe(() => {
            if (!signal.aborted) console.log(getEditor().getState().document);
        });
        return unsubscribe;
    },
    actions: [{
        id: 'export', label: '导出审核文件', icon: <ExportIcon />,
        placement: 'main',
        async onSelect({ getEditor, signal }) {
            const result = await getEditor().exportPdf({ signal });
            signal.throwIfAborted();
            // 在这里交给宿主的结果面板或持久化流程。
            console.log(result.documentId, result.blob);
        },
    }],
};
```

- 插件 `id` 在编辑器内唯一，动作 `id` 在各自插件内唯一；不同插件可使用相同动作 ID。`label` 必填，提供按钮可访问名称与 Tooltip；图标不可嵌套交互控件。
- 插件对象应保持引用稳定，例如模块常量或 `useState` 初始化。重新创建同 ID 对象表示替换插件，会取消旧任务并重新安装；仅调整数组顺序不会重新安装。`setup` 应同步返回清理函数，不能返回 Promise；异步资源初始化需自行监听 `signal`。
- 移除插件、替换对象或卸载编辑器会先取消插件寿命信号，再调用清理函数。一个定义可传给多个编辑器，资源应在 `setup` 内创建，不能写入共享定义。React 开发模式可能安装、清理、再安装，清理应完整对称。
- `getEditor()` 获取最近一次 React 提交对应的命令接口。长期回调应再次调用它，避免保存带旧宿主回调的 API 对象。取消后调用它以 `cancelled` 拒绝。
- `setup` 的信号代表插件寿命；`onSelect` 的信号代表当前任务，会在任务结束、手动取消、插件卸载时取消。默认 `scope: 'document'` 要求已打开 PDF，文档会话或版本变化时取消；翻页、只读状态变化不改变文档版本。需要打开文档等跨文档操作时显式使用 `scope: 'editor'`。
- 每个编辑器同时执行一个插件动作；未就绪或有文档事务时禁止启动，任务期间显示取消入口。外部 ref 仍可发起命令，文档变化会使默认作用域任务失效。`scope` 是取消策略，不是权限隔离；所有修改命令仍受 `readOnly` 和文档权限约束。
- `visible`、`disabled`、`placement` 与扩展按钮一致。按插件和动作数组顺序追加，支持 `main`、`tools`、`status`；内置 `toolbar.visibility` 不包含插件 ID，插件自己的入口使用 `action.visible`。
- 安装、清理和动作错误由编辑器界面及 `onError` 接收；主动取消静默。配置 ID 无效时拒绝本次配置更新，保留已经安装的配置；某个插件 `setup` 失败时不安装它，其他有效插件可以继续安装。命令式服务本身通过 Promise 拒绝返回错误。
- 取消结束宿主等待，无法终止任意第三方 JavaScript 或撤销已发送的外部写入。插件必须将 `signal` 传给请求，并在交付结果前检查它；内置 OCR 工厂已经保护迟到的 `onResult`。插件是宿主代码，不是沙箱。

## 页面与选区服务

| API | 契约 |
| --- | --- |
| `subscribe(listener)` | 同步状态变更通知，返回取消订阅函数；回调内用 `getState()` 读取不可变快照。只覆盖文档/运行时状态，不是工具栏或选区事件总线 |
| `getPages()` | 当前 PDF 的只读 `{ index, width, height, rotation }[]`；没有文档时抛错 |
| `selectRegion({ signal }?)` | 请求一次交互框选，返回 `Promise<PdfRegionSelection>`；同时只能有一个请求，无文档、忙碌、取消均明确拒绝 |
| `createRegionSelection(regions)` | 同步校验页面矩形，并绑定当前文档身份和版本；适合固定模板或已知坐标 |
| `captureRegion(selection, { scale, signal }?)` | 串行文档事务中从 PDF 内容渲染并返回 PNG；过期选区以 `stale` 拒绝，绝不静默裁剪新文档 |

所有 `pageIndex` 从 0 开始。矩形 `{ pageIndex, x, y, width, height }` 的坐标原点为**显示页面的左上角**，单位为 pt（1/72 英寸），已考虑页面 rotation 和 CropBox，不能直接混用 PDF 原始底部原点坐标或屏幕 CSS 像素。`getPages()` 返回同一坐标系的尺寸，`rotation` 为顺时针角度（0、90、180、270），不是内部 PDFium 的四分之一圈枚举。

选区包含 `documentId`、`sessionId`、`revision` 和冻结的 `regions`。每页最多一个有限、正尺寸、位于页内的矩形，按页码升序输出，最多 32 页。保存这些数值不能绕过过期校验；需要重新打开文档后应用模板，应重新调用 `createRegionSelection` 绑定当时的会话。`revision` 是内容版本，撤销可能返回原版本，不是单调递增序号。

手动框选把连续文档矩形裁切成逐页矩形，排除页间空隙；支持反向拖动、按住指针时滚轮滚动、方向键移动起点、Shift + 方向键扩选、Enter 完成、Escape 取消，Ctrl/Command + 方向键为 1pt 精调。选择期间缩放入口暂停，视口布局变化会清除当前手势，文档变化会取消请求。

固定采集第 1 页底部和第 2 页顶部：

```ts
const pages = editor.getPages();
if (pages.length < 2) throw new Error('至少需要两页');
const tail = Math.min(80, pages[0].height);
const selection = editor.createRegionSelection([
    { pageIndex: 0, x: 0, y: pages[0].height - tail,
        width: pages[0].width, height: tail },
    { pageIndex: 1, x: 0, y: 0,
        width: pages[1].width, height: Math.min(80, pages[1].height) },
]);
const image = await editor.captureRegion(selection, { scale: 2, signal });
```

## 图像与 OCR 坐标回映

`PdfRegionImage` 包含 `{ selection, blob, width, height, parts }`。PNG 以白色为纸张背景，按页码从上到下直接拼接，保持页面在连续视图中的居中水平关系；仅去除页间界面空隙，不自动去除 PDF 页面内容中的空白。也支持程序化选取不相邻的页，含义仍是按文档顺序拼接指定区域。

`scale` 默认 2，即约 144dpi，允许 0.25–8。采集从 PDFium 独立渲染，与当前显示缩放、虚拟滚动和预览清晰度无关。每块及合成图最大边长 8192px，最多 16,777,216 像素，超预算在分配像素前拒绝。PDFium 正在进行的同步渲染不能抢占，取消会阻止后续采集和结果交付。

每个 part 包含页索引、`sourceBounds`（实际采集的页面 pt 矩形）和 `imageBounds`（PNG 内像素矩形）。渲染会向外取整到像素，因此回映应使用 `sourceBounds`，不能用原请求矩形计算比例。对于属于某个 part 的 OCR 像素点：

```ts
const pageX = part.sourceBounds.x +
    (imageX - part.imageBounds.x) * part.sourceBounds.width / part.imageBounds.width;
const pageY = part.sourceBounds.y +
    (imageY - part.imageBounds.y) * part.sourceBounds.height / part.imageBounds.height;
```

先将 OCR 框与各个 `imageBounds` 求交，再逐块映射；跨拼接边界的框可能对应两页，不能归为一个页面矩形。PNG 左右补白不属于任何 part。此版本提供坐标元数据，不包含识别框覆盖层、任意内容面板插槽或 OCR 结果写回 PDF 的 API。

## 视觉与交互依据

插件动作延续已有 M3 standard icon button；取消入口复用本库 Button 的 text 变体；安装开关复用 Checkbox。相关 M3 指南/规格/无障碍以及 Material Web 文档、实现、样式和令牌见 [TOOLBAR.md](./TOOLBAR.md#demo-与设计依据)。新增取消按钮对照 [M3 Buttons 指南](https://m3.material.io/components/buttons/guidelines)、[规格](https://m3.material.io/components/buttons/specs)、[无障碍](https://m3.material.io/components/buttons/accessibility)，以及 [Material Web Button 示例](https://material-web.dev/components/button/)、[实现](https://github.com/material-components/material-web/blob/main/button/internal/button.ts)、[Text 样式](https://github.com/material-components/material-web/blob/main/button/internal/_text-button.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-text-button.scss)。

M3 和 Material Web 没有 PDF 跨页框选组件；选区是文档工具的扩展，使用已有 selection 色角色、焦点轮廓和 12% 透明填充显示几何范围，参考 [M3 States](https://m3.material.io/foundations/interaction/states/overview)。它不表示某个 M3 列表项的 selected 外观。没有引入 Material Web 运行时；具体核对范围与限制见 [QA.md](./QA.md)。
