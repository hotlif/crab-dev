# @crab-dev/rc-pdf-editor

React 19 PDF 编辑器。PDF 操作仅使用 `@embedpdf/pdfium@2.15.1`；文字、图片、图形绘制预览、选择和变换使用 `@crab-dev/rc-canvas`，交互控件均来自 crab-dev 工作区。

## 接入

无框架 HTML / 单 JS 接入见 [Web Component 适配](./WEB-COMPONENT.md)。

图标显隐与业务按钮扩展见 [工具栏架构与配置](./TOOLBAR.md)，工作台“图标显隐与动作扩展”提供逐项勾选和实时预览。

通过 `plugins` 接入带生命周期和取消能力的业务插件。跨页区域识别见 [插件与跨页区域 API](./PLUGINS.md)，工作台“跨页区域与 OCR 插件”展示相邻两页交界的裁切拼接，以及注入 OCR 引擎的接口。

```tsx
import PdfEditor from '@crab-dev/rc-pdf-editor';

const runtime = {
    workerUrl: '/pdf-runtime/pdf-editor.worker.js',
    wasmUrl: '/pdf-runtime/pdfium.wasm',
};
const fonts = [{ id: 'body', family: '项目中文字体', source: '/fonts/body.ttf' }];

export default function Example() {
    return <PdfEditor runtime={runtime} fonts={fonts}
        initialDocument={{ id: 'example', source: '/documents/example.pdf', fileName: 'example.pdf' }} />;
}
```

使用项目静态资源构建步骤复制运行时文件。例如 Node ESM 脚本：

```js
import { createRequire } from 'node:module';
import { mkdir, copyFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
await mkdir('public/pdf-runtime', { recursive: true });
await copyFile(require.resolve('@crab-dev/rc-pdf-editor/worker'), 'public/pdf-runtime/pdf-editor.worker.js');
await copyFile(require.resolve('@crab-dev/rc-pdf-editor/wasm'), 'public/pdf-runtime/pdfium.wasm');
await mkdir('public/pdf-runtime/licenses', { recursive: true });
for (const name of ['LICENSE.embedpdf', 'LICENSE.pdfium']) {
    await copyFile(require.resolve(`@crab-dev/rc-pdf-editor/licenses/${name}`), `public/pdf-runtime/licenses/${name}`);
}
```

Worker 必须同源部署，允许 CSP 的 `worker-src` 和 WASM 执行；服务器应正确返回 JavaScript 与 `application/wasm`。`runtime` 的 WASM 配置互斥：`{ workerUrl, wasmUrl }` 或 `{ workerUrl, wasmBinary: ArrayBuffer }`。没有默认公共 CDN。`runtime` 与 `initialDocument` 仅在挂载时读取，父级重渲染不会重建 Worker 或重载文档；更换运行时使用 React `key` 显式重建实例。组件卸载时终止 Worker；文档成功切换后清理旧句柄和历史，失败时保留原文档。

本仓库执行 `yarn workspace @crab-dev/rc-pdf-editor build:runtime` 生成 Worker、WASM 以及工作台静态资源。发布包包含 `dist`，不包含测试资源。文档站构建会预先执行该命令。

## 公开接口

| 属性 | 行为 |
| --- | --- |
| `initialDocument` | 挂载时的 `{ id, source, fileName?, password? }`；省略时显示打开入口，之后用 `ref.open` 切换 |
| `runtime` | 必填的 Worker 与 WASM 初始配置 |
| `fonts` | `{ id, family, source }[]`，source 为 TTF 资源；保持数组引用稳定，更换数组会重新注册字体 |
| `readOnly` | 禁用对象和页面修改，保留浏览、提取与导出 |
| `toolbar` | 内置动作显隐和简单业务按钮扩展，不改变文档权限 |
| `plugins` | 安装、替换、卸载带生命周期的业务插件，支持动作、状态订阅和区域服务 |
| `beforeDocumentChange` | 打开/关闭前接收 `{ reason, current, next, signal }`，返回 `false` 取消；可先 `await ref.save()` 再允许切换 |
| `onDocumentLoad` | 文档成功提交时的 `PdfDocumentState`；不代表像素已呈现 |
| `onStateChange` | 初始化、队列、空状态、文档、页索引、只读能力发生变化时的不可变快照 |
| `onSave` | 持久化 `PdfExportResult`；第二个参数包含取消信号，拒绝时保留修改；省略时发起下载 |
| `onSaved` | 保存回调成功或下载已发起后的通知，结果绑定导出时的文档与版本 |
| `onError` | 内置 UI 和初始化错误；命令式调用通过 Promise 拒绝返回错误，不重复通知 |

通过普通 `ref` 获取 `PdfEditorRef`：`ready()`、`getState()`、`open(document, options?)`、`close(options?)`、`exportPdf(options?)`、`extractPages(indices, options?)`、`save(options?)`、`undo(options?)`、`redo(options?)`、`goToPage(index)`、`fitToPage()`。页索引均从 0 开始。所有公开类型从包入口具名导出，不暴露 Worker 协议或 PDFium 指针。

扩展服务包括 `subscribe(listener)`、`getPages()`、`selectRegion(options?)`、`createRegionSelection(regions)`、`captureRegion(selection, options?)`。区域服务只读、绑定文档会话和版本，返回逐页 pt 坐标及真实 PNG 的坐标映射；完整生命周期、预算和坐标契约见 [PLUGINS.md](./PLUGINS.md)。

`PdfEditorState` 包含 `status`（initializing / ready / failed / disposed）、可空的 `document`、`pendingOperations`、`readOnly` 和 `canEdit`。文档状态包含业务 `id`、每次打开唯一的 `sessionId`、`fileName`、`revision`、`pageCount`、`currentPageIndex`、`dirty`、`canUndo`、`canRedo`、`editable`。`editable` 表示文档修改权限；`canEdit` 进一步考虑运行时和 `readOnly`，不承诺每个对象均可编辑或字体已就绪。翻页不改变文档版本；撤销可能回到较早版本，因此不要将 `revision` 当作永远递增的事件序号。

`PdfSource` 接受 URL 字符串、URL、File、Blob、ArrayBuffer、Uint8Array，也接受 `{ url, headers?, credentials? }`。输入二进制始终复制；不会转移或清空调用方的缓冲区。`id` 是宿主提供的非空业务标识，内置文件选择器会生成标识。更换文件名时应通过新的文档输入打开，不存在与当前文档身份脱离的顶层 `fileName`。

导出和提取返回 `{ blob, fileName, documentId, sessionId, revision }`，不下载、不清除 `dirty`。提取页按原文档顺序输出并去重，空数组或越界索引拒绝。`save()` 与工具栏共用同一保存流程，持久化成功只确认导出快照的版本；期间发生新编辑仍保持未保存，切换到其他文档后也不会清除新文档的修改。重复保存以 `busy` 拒绝，调用方可等待当前保存再重试。默认下载的“成功”仅表示已发起浏览器下载，无法确认用户是否写入磁盘；需要服务器持久化确认时提供 `onSave` 并检查 HTTP 状态。

异步方法均返回 Promise，调用方必须处理拒绝。`ready()` 只等待运行时，不等待初始文档或字体。`open()` 完成表示文档已提交；`goToPage()` 只发出导航请求，页面绘制由内部异步完成。没有文档时导航、历史、导出均报错；页索引无效时报错。`fitToPage()` 在容器尚未测量时返回 `false`，成功时返回 `true`。`getState()` 可在命令完成后立即读取最新结果。

所有文档异步命令接受 `{ signal }`。取消在进入 Worker 前生效；已提交的文档变更不会伪装为回滚。等待中的守卫、资源加载与保存回调会在取消或卸载后结束等待，但外部已写入的内容无法自动撤销。守卫之外的文档命令按进入事务队列的顺序执行；异步守卫或文件读取期间如果当前文档身份或版本发生变化，该次替换以 `cancelled` 拒绝，避免旧确认丢弃新编辑。并发替换不承诺“最后调用必定覆盖”，业务切换应 `await open()` 或主动取消旧请求。

命令式 `open()` 遇到加密文档只返回 `password` 错误，宿主可收集密码后用同一个输入重试；初始文档及内置文件选择器保留密码对话框。所有打开/关闭入口共用 `beforeDocumentChange`，未提供守卫时直接允许切换。React 卸载和显式 `key` 重建无法等待异步守卫，宿主需在路由离开或重建前自行处理未保存状态。

外部保存示例（`uploadDocument` 为业务服务，不是组件导出）：

```tsx
import { useRef } from 'react';
import Button from '@crab-dev/rc-button';
import PdfEditor, { type PdfEditorRef, type PdfExportResult } from '@crab-dev/rc-pdf-editor';

async function uploadDocument(result: PdfExportResult, signal?: AbortSignal) {
    const response = await fetch(`/api/documents/${encodeURIComponent(result.documentId)}`, {
        method: 'PUT', body: result.blob, signal,
    });
    if (!response.ok) throw new Error('保存失败');
}

function Editor({ onError }: { onError: (error: unknown) => void }) {
    // 可变实例状态：宿主按钮调用编辑器命令，不参与渲染。
    const editor = useRef<PdfEditorRef>(null);
    return <>
        <Button onClick={async () => { try { await editor.current?.save(); } catch (error) { onError(error); } }}>保存</Button>
        <PdfEditor ref={editor} runtime={runtime}
            initialDocument={{ id: 'invoice-42', source: '/invoice.pdf', fileName: 'invoice.pdf' }}
            onSave={(result, { signal }) => uploadDocument(result, signal)} onError={onError} />
    </>;
}
```

破坏性变更、缺陷证据及迁移表见 [API 审查与重设计](./API-REDESIGN.md)。

## 编辑与历史

- 绘图工具栏提供选择、抓手平移、矩形边框、圆形/椭圆、直线、箭头和自由手绘。选中绘图工具后在页面内按下并拖动鼠标，松开完成一笔，可连续绘制。
- 按住 Shift 绘制正方形/正圆，或将直线与箭头约束为 45° 的整数倍；Esc 取消当前笔并退出绘图。移出页面时端点限制在页面内，取消指针或切换工具会丢弃未完成的一笔。
- 绘制前可设置描边颜色（含透明度）、线宽、实线/虚线；矩形和椭圆可选填充颜色。绘制后从对象树选择图形，可修改样式、移动、缩放、旋转或删除。图形使用 PDF 原生路径并记录类型，保存后重新打开仍可编辑。外部 PDF 的任意矢量路径仍按不可编辑对象保留。
- 每次“应用修改”和完整拖拽各记录一步；默认保留最多 50 步且历史总量不超过 128 MiB，先淘汰最旧记录。超大文档的一步可能超过上限，因此不能撤销该步。
- 修改在候选文档中完成，生成内容并成功保存后才替换当前状态。失败不产生半成品历史，导出失败或 `onSave` 拒绝时保留修改。
- 原有对象矩阵、文字、图片和其他页面内容保留为 PDF 对象；不会将整个文档转为位图。显示时由 PDFium 渲染页面，编辑时分离前景、选中对象和背景来保留绘制顺序。
- 主页面和缩略图复用两块缓冲画布；等待 PDFium、位图解码及纹理上传时保留上一张完整画面，新场景实际绘制完成后才整体替换并释放旧资源。绘图松开鼠标后保留本次预览，直到新页面接管；失败时恢复已提交内容。页面渲染失败提供重试入口。
- 已选对象拖拽或应用属性期间只暂停交互，完整保留变换预览、选中框与控制点；下一张缓冲画面预先绘制控制点再接替，解锁交互不再补绘选区，避免矩形放大后提交时闪动。
- 拖拽松手时立即记录最终变换，以文档、页面版本和对象绑定提交预览；自动提交期间回传的旧尺寸不再覆盖画面。成功后等新版本实际绘制完成再交接，避免再次套用旋转；失败或切换对象时解除提交锁定，可继续调整。
- 缩略图滚出虚拟窗口后释放其 WebGL 上下文，避免反复滚动累积已卸载画布并挤占主画布配额；浏览器恢复意外丢失的上下文后，`rc-canvas` 重建现有页面纹理并恢复画面。回归验证覆盖长文档往返滚动后的上下文状态、实际页面像素及模拟上下文丢失后的恢复。
- 每页使用稳定标识与内容版本，排序复用原缩略图，编辑只刷新受影响页面。缩略图像素缓存采用 16 MiB 上限的 LRU；Worker 优先处理文档操作和当前页，再处理缩略图，过期的排队请求会取消，慢响应不会覆盖新画面。
- 字体仅接受 TrueType TTF；不支持 WOFF、CFF/OTF 和字体集合。字体同时用于浏览器预览和 PDF 嵌入，新增及修改内容前校验 Unicode 覆盖。原文字保留原字体时仍可改变字号、颜色和几何变换。
- 文字内容修改采用接入方配置字体；没有字体仍可浏览、管理页面、处理图片和变换原对象。手动换行创建独立行对象，不做段落重排。
- 转曲、嵌套组合、含裁剪路径和非填充模式文字只显示；没有可靠 Unicode 的文字不开放修改。原文复杂字距与新字体度量可能不同，提交后以 PDFium 渲染为准。
- 页面坐标以旋转及 CropBox 后的页面左上角为原点，单位 pt。旋转属性为本次操作的增量。PNG、JPEG、WebP 解码限制为 1600 万像素；显示位图长边限制为 4096 像素，PDF 内容精度不受影响。
- 首版不提供 OCR、批注创建、表单填写、数字签名、全文搜索和打印。面向支持 WebGL 2、Worker、ImageBitmap、FontFace 的现代桌面浏览器。

## 键盘与布局

工具栏、页面按钮、对象列表和属性输入可通过键盘访问。Ctrl/Cmd+Z 撤销，Ctrl/Cmd+Shift+Z 或 Ctrl/Cmd+Y 重做；Delete/Backspace 删除选中对象，方向键移动 1 pt，Shift+方向键移动 10 pt；Escape 取消选择。在输入框或中文输入法组合期间不拦截编辑快捷键。只读模式仍可选择对象查看属性。

插入空白页、合并 PDF、旋转、删除、页面前后移动、提取，以及撤销/重做、添加文字和图片都直接显示在顶部工具栏，以图标和中文提示表示。窄屏时图标换行，不再收进“更多操作”弹窗。

拖拽松手后的自动提交不会把整组工具栏按钮切换为禁用外观。工具栏通过 `aria-busy` 表示等待，点击捕获和快捷键校验阻止重复操作，保留按钮、SVG 与键盘焦点；提交成功或失败后恢复操作。只读、没有可撤销记录、未配置字体及页面边界等实际不可用条件仍使用原有禁用样式。此处只分离编辑任务的忙碌状态与按钮能力状态，沿用下方 Material Web 图标按钮实现、样式与令牌，不修改配色、形状或状态层。

页面与属性面板的开关集中在绘图工具栏右侧，底栏只显示页码、状态和缩放。开关采用 M3 小尺寸 Tonal toggle icon button：左右分栏图标对应两侧面板，展开时填充对应图标区域，并复用 `rc-button` 的 secondary / on-secondary 选中配色，收起时使用 secondary-container / on-secondary-container。40px 可见按钮保留至少 48px 操作区域，悬停提示当前展开或收起动作，`aria-expanded` 与 `aria-controls` 关联面板。两栏标题旁均有方向明确的收起图标，收起后焦点回到顶部开关；桌面两栏独立开关，窄屏只同时展开一栏，判断依据与侧栏 CSS 断点一致。沿用标准圆形按钮，不采用 Expressive 的选中形状变换；Material Web 无 PDF 侧栏组件，布局为工作区扩展，按钮状态对照其图标按钮实现。

页面缩略图直接点击选择，按住 Ctrl（macOS 为 Command）点击可增选或取消选择，不显示复选框。拖动缩略图可调整顺序，拖动已选页会同时移动全部选页，并保持它们原有的先后顺序；列表边缘支持自动滚动，插入线显示放置位置。松开鼠标提交一次修改，Esc、移到列表外松开或取消指针会取消拖动；原地放置不记录历史。页面旋转、删除、前后移动和提取使用当前选页，未选择页面时禁用；插入和合并仍以当前查看页为位置。

页面列表内上下方向键、Home/End 浏览并选择页面，按住 Ctrl/Command 时只移动焦点；空格切换选中状态，Ctrl/Command+A 全选，Esc 取消多选并保留当前页。工具栏的页面前移/后移可作为拖拽的键盘替代。只读模式允许多选和提取，禁用排序与页面修改。

中央采用连续页面预览，不显示底部分页。滚轮或滚动条上下浏览整个文档，放大后可横向滚动；抓手拖动也移动整个文档。点击左侧缩略图或调用 `goToPage` 定位页面，滚动时同步当前页、对象树及页码状态。PageUp/PageDown、Home/End 可滚动浏览，底部保留缩放和适应页面，只读模式同样可用。各页共用缩放倍率，滚动不会自动重置缩放。

在预览区按住 Ctrl（macOS 也可使用 Command）滚动滚轮，以鼠标位置为中心缩放；触控板通过 Ctrl 滚轮事件提供的捏合缩放同样适用。普通滚轮只滚动文档，缩放百分比输入框仍可精确设定倍率。首次打开文档自动适应页面；选择对象、显示属性、收起侧栏、翻页和调整窗口大小均保持当前倍率，只有再次打开文档或主动点击“适应页面”才重新适应。缩放和滚动均不进入文档编辑历史。

底栏使用 72 × 32px 的紧凑百分比字段，适应页面使用四角框图标按钮，悬停或键盘聚焦可查看中文提示。数值字段复用 `rc-number-edit` / `rc-line-edit`，仅在编辑器内通过 L3 令牌调整桌面密度；这是针对状态栏的尺寸扩展，区别于 Material Web 的默认 56px 文本字段。边框、焦点和禁用态仍由自有字段提供，粗指针下保留至少 48px 的输入目标。图标按钮采用 M3 标准无背景外观，24px 图标、40px 可见按钮及至少 48px 操作区域，底栏上下留白为 4px。

连续预览复用 `rc-virtual` 的滚动窗口，仅为可见及相邻页准备图像，并共用一张背景 Canvas；当前页的文字和图形仍使用双缓冲编辑画布。背景预览与当前页复用完整页面帧及进行中的请求，往返滚动命中缓存时无需重新调用 PDFium；页面像素缓存采用 64 MiB、最多 24 页的 LRU，按页面标识、内容版本和渲染倍率区分。页面排序复用缓存，编辑后使用新版本，成功切换文档或关闭编辑器释放缓存。Worker 转移临时像素缓冲区，避免重复复制；短于 150ms 的页面准备不显示加载动画。页面数量增加不会为每页创建 WebGL 上下文。M3 与 Material Web 未直接定义 PDF 连续阅读器，此处沿用现有工作区、表面颜色、间距及自有滚动条。

页面对象使用 `rc-tree`，按 PDF 原有绘制顺序显示叶节点，以自绘图标区分文字、图片、绘制的图形和其他对象；长标题可通过悬停查看全文。树内方向键浏览对象，Enter 切换选择，不触发画布对象移动。不可编辑对象仍可选择并查看原因。

跨页滚动的帧准备状态仅限制画布和对象编辑，不切换文档操作、绘图工具按钮的禁用外观。对象树保留上一份内容与焦点，用 `aria-busy` 表示更新，事件捕获和回调校验阻止操作旧对象；新页画面与对象数据就绪后一起接替，避免连续变灰、恢复及误选旧页对象。实际编辑任务、权限和页面边界仍按原规则限制操作。

矩形、椭圆、文字和图片的属性字段、对象操作按钮及绘图设置同样区分暂时忙碌与只读。提交期间保留控件、焦点、选中状态和滚动位置，阻止输入、粘贴、数值滚轮步进及重复提交，仍可滚动面板、Tab 切换焦点或复制字段内容。底部保留页码与选页信息，复用 `rc-spin` 的 150ms 延迟反馈，短任务不再替换状态文字或闪出加载图标；长任务仍有加载反馈。只读、无字体及不支持编辑的对象继续使用原有权限限制，不改变现有 M3 字段和按钮样式。

右侧属性区位于上方并独立滚动，页面对象位于下方，对象区最多占侧栏高度的 40%，树的目标高度为 160px。对象树采用桌面紧凑密度：40px 行高、14px 文字与 16px 图标；粗指针环境由 `rc-tree` 保留至少 48px 行高。该密度是基于 M3 单行列表的桌面工具面板扩展，区别于 Material Web 默认列表尺寸，复用已有焦点、选中和禁用状态，不修改通用树组件。

属性字段使用原生纵向滚动，桌面显示细滚动条并预留稳定的滚动槽；字段与两列几何输入可收缩到面板宽度，留出浮动标签和焦点轮廓的空间，不产生横向滚动。文字颜色与色块同行；应用、替换和删除操作常驻字段区下方，滚动到边界不会带动外层页面。保留原有字段尺寸、Tab 焦点自动滚入、粗指针滚动条及高对比模式，避免虚拟化表单导致输入丢失。M3 与 Material Web 未直接定义属性检查器的滚动条，此处是基于 outlined text field 自适应宽度和原生浏览器滚动的工作区扩展；字段的外观与交互仍由自有组件提供。

标准配色的顶部工具栏参考 M3 桌面停靠布局，操作使用 `rc-button` 圆形图标按钮和 `rc-tooltip` 中文提示。普通操作采用标准无背景外观，保存采用填充外观；每个按钮都有中文可访问名称。侧栏由页面和属性按钮切换。控件复用自有组件的焦点、状态层、禁用态及主题令牌。Material Web 没有对应 Toolbar 或 Tree 组件：工具栏容器依据 M3 扩展，对象树采用 M3 单行列表的图标、内容和选中背景规则，去除树默认的额外左侧选中竖线。未引入 Material Web 运行时。

页面缩略图为 M3 带图列表的扩展，采用自有 `rc-button` 和 `rc-virtual`。Material Web List 没有 PDF 多页拖拽实现；此处扩展缩略图高度和拖放插入提示，复用控件的选中背景、焦点与状态层，并使用多选 listbox 语义及状态播报。

实际设计参考：

- [M3 Toolbar 指南](https://m3.material.io/components/toolbars/guidelines)、[视觉规格](https://m3.material.io/components/toolbars/specs)、[无障碍](https://m3.material.io/components/toolbars/accessibility)
- [M3 Icon buttons 指南](https://m3.material.io/components/icon-buttons/guidelines)、[视觉规格](https://m3.material.io/components/icon-buttons/specs)、[无障碍](https://m3.material.io/components/icon-buttons/accessibility)、[M3 Lists 指南](https://m3.material.io/components/lists/guidelines)
- [Material Web Button 文档](https://material-web.dev/components/button/)、[Icon button 文档与示例](https://material-web.dev/components/icon-button/)
- [Icon button 实现](https://github.com/material-components/material-web/blob/main/iconbutton/internal/icon-button.ts)、[样式](https://github.com/material-components/material-web/blob/main/iconbutton/internal/_icon-button.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-icon-button.scss)
- 紧凑数值字段对照：[M3 Text fields 指南](https://m3.material.io/components/text-fields/guidelines)、[规格](https://m3.material.io/components/text-fields/specs)、[无障碍](https://m3.material.io/components/text-fields/accessibility)、[Material Web 示例](https://material-web.dev/components/text-field/)、[实现](https://github.com/material-components/material-web/blob/main/textfield/internal/text-field.ts)、[Outlined 样式](https://github.com/material-components/material-web/blob/main/textfield/internal/_outlined-text-field.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-outlined-text-field.scss)。32px 是本编辑器状态栏的桌面密度扩展，未修改公共字段组件的默认尺寸。
- [M3 Lists 规格](https://m3.material.io/components/lists/specs)、[无障碍](https://m3.material.io/components/lists/accessibility)、[Material Web List 文档与示例](https://material-web.dev/components/list/)
- [List 实现](https://github.com/material-components/material-web/blob/main/list/internal/list.ts)、[列表样式](https://github.com/material-components/material-web/blob/main/list/internal/_list.scss)、[列表项样式](https://github.com/material-components/material-web/blob/main/list/internal/listitem/_list-item.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-list.scss)、[WAI-ARIA Listbox 键盘规范](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [PDFium 初始化与资源管理](https://www.embedpdf.com/docs/pdfium/getting-started)
