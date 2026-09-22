# rc-pdf-editor API 审查与重设计

日期：2026-09-22。状态：已实施破坏性接口调整；不保留旧 Props 别名。下文保留第一阶段审查记录；后续图标配置见 [TOOLBAR.md](./TOOLBAR.md)，插件与跨页 OCR 服务见 [PLUGINS.md](./PLUGINS.md)。

本次以当前工作区的 `src/types.ts`、`pdf-editor.tsx`、`client.ts`、`engine.ts`、Worker 协议与真实浏览器测试为依据。审查的是 React 组件公开契约，不是 PDF 文件格式或编辑精度。

## 原接口的主要缺陷

| 优先级 | 原契约与实现证据 | 接入后果 | 本次处理 |
| --- | --- | --- | --- |
| P1 | `source?: PdfSource` 在 effect 中随引用变化加载；工具栏和 `ref.open(source)` 同时可以替换文档 | 父级状态可能还指向 A，内部已打开 B；新建二进制对象或更换 runtime 也会重新加载并清理历史 | `initialDocument` 和 `runtime` 明确为挂载配置；后续替换只有文档命令入口；runtime 更换通过 React key |
| P1 | `PdfEditorRef` 只有 `exportPdf(): Promise<Blob>`，实际 `save()` 是组件私有函数 | 宿主外部保存按钮无法复用保存与 dirty 确认，导出的 Blob 也无法自证所属文档和版本 | `save()`、`exportPdf()` 均返回带身份和版本的快照；内部与外部按钮共用保存方法 |
| P1 | `onSave({ blob, fileName })` 没有业务 ID、会话 ID 或 revision | 保存期间切换文件时，宿主容易按“当前业务记录”写错目标。原实现已有保存后的 session/revision 检查，本次保留其保护原则，不把它误报为已有跨文档清除 dirty 的确定缺陷 | 输入要求非空 `id`；每次打开生成 `sessionId`；结果提供 `documentId/sessionId/revision`，按快照归属持久化 |
| P1 | `pending` 只包围内置 UI 的 `perform()`；ref 直接调用 open、history、export | 宿主命令与 UI 操作存在两套协调规则，React 闭包中的 info 不能代表排队命令真正执行时的版本 | 新增内部 `PdfSession`，串行处理文档事务；导出在队列中同时确定字节与版本；并发保存明确返回 busy |
| P1 | 打开入口直接替换文档，没有宿主可取消的切换钩子 | 应用无法统一接入未保存确认或“先保存再离开” | 所有 open/close 入口使用 `beforeDocumentChange`；守卫可以先保存；等待期间若文档已变化则拒绝过期替换 |
| P2 | `PdfEditorState` 仅有页数、页索引、dirty 和历史布尔值；`onChange` 仅在存在 info 时触发 | 无法区分未初始化、空文档、失败、已关闭；也无法观察命令忙碌状态与实际文档修改权限 | 新状态公开运行时状态、可空文档、pendingOperations、readOnly、canEdit；提供同步 getState |
| P2 | 没有 close，`source` 变成 undefined 只停止 effect，不释放已打开文档 | 宿主清空当前记录时仍显示上一个 PDF，只能卸载整个组件 | close 释放文档、历史和像素缓存，保留 Worker 与字体 |
| P2 | open 在运行时尚未建立时失败；goToPage 越界静默返回，history 无文档静默返回，export 却报错 | 调用者无法区分命令完成与命令被忽略，也难以安排初始化顺序 | ready；异步命令统一等待运行时；无文档/无效页索引明确报错；fitToPage 用 boolean 表示是否完成尺寸适配 |
| P2 | sourceBytes 固定 `fetch(source, { signal })`；公开命令没有 signal | 认证资源必须由宿主自行预取，路由切换时不能取消等待 | URL 描述符支持 headers/credentials，异步命令接受 signal；网络错误保留 source 分类与 cause |
| P2 | ref.open 密码失败同时设置内部密码对话框；提取页面直接下载 pages.pdf | 无界面宿主调用引发额外 UI；无法将提取结果上传或交给其他流程 | 命令式打开只拒绝 Promise；初始文档和文件选择器保留密码 UI；新增无下载副作用的 extractPages |

原设计中合理的部分继续保留：PDFium 指针与 Worker 协议不作为公共 API；失败打开保留当前文档；编辑使用候选文档提交；`readOnly` 仍允许浏览、提取和输出；React 19 普通 ref；runtime 的 WASM 地址/二进制互斥联合类型。

## 新 API 分工

```ts
interface PdfDocumentInput {
    id: string;
    source: PdfSource;
    fileName?: string;
    password?: string;
}

interface PdfExportResult {
    readonly blob: Blob;
    readonly fileName: string;
    readonly documentId: string;
    readonly sessionId: string;
    readonly revision: number;
}
```

- Props 负责挂载资源、初始文档、字体、只读策略、切换守卫、持久化处理器和通知。
- ref 负责明确的命令：ready / open / close / exportPdf / extractPages / save / undo / redo / goToPage / fitToPage，并提供 getState。
- `onStateChange` 是状态快照通知，不是逐个命令的审计日志。React 可以合并同一轮状态更新；需要确认某次命令完成应等待其 Promise。
- `onDocumentLoad` 是文档提交成功通知，`onSaved` 是输出交付成功通知。两者不与“画面已经显示”混为一谈。
- `onSave` 是异步持久化处理器。它必须按 result.documentId 路由保存请求，并由业务服务决定写入是否成功。
- `onError` 处理内置 UI 和初始化失败；命令式调用只通过拒绝返回错误。宿主无需同时在两个入口显示同一次命令错误。

完整导出类型见 `src/types.ts`；用法与事件语义见 [README](./README.md)。本次没有直接导出 `EditCommand`、可变对象索引或 PDFium 客户端，避免把内部对象定位与坐标协议固化为公共 ABI。

## 并发、取消和生命周期

1. 编辑、历史、导出、提取、保存确认和文档提交通过同一个事务队列。历史连续调用读取队列执行时的状态；对象编辑仍检查发起时的 revision，避免操作过期对象索引。
2. 导出字节与文档身份/版本在同一事务内捕获。onSave 在队列之外运行，期间可通过命令切换文档或继续编辑。
3. 保存完成只确认快照版本。如果仍处于原会话但内容已变化，dirty 仍为 true；如果已切走，则不确认新文档。重复保存以 busy 拒绝，避免异步保存乱序覆盖确认点。
4. 守卫在队列之外等待，因此可以调用并等待 save。守卫和资源读取完成后再次校验原会话与原 revision，不能用过期确认覆盖新编辑。并发替换不承诺最后调用胜出，宿主应等待或取消旧请求。
5. signal 在进入 Worker 前取消；同步 PDFium 已开始的修改不能被 JavaScript 取消或回滚。保存/守卫取消只结束等待，不能撤销外部已完成的服务端写入。
6. close 关闭文档；组件卸载关闭整个运行时。卸载不等待异步守卫，路由离开策略属于宿主。
7. `initialDocument` 和 `runtime` 忽略挂载后的替换，避免普通重渲染影响当前编辑。更换文档调用 open，更换 runtime 使用 key 明确重建。
8. 公开状态快照与 document 均冻结；旧快照不会随新状态变化。revision 是内容版本标识，撤销时可以回到旧值，不能当作事件序号。

## 迁移表

| 旧用法 | 新用法 |
| --- | --- |
| `<PdfEditor source={source} fileName="a.pdf" />` | `<PdfEditor initialDocument={{ id: 'a', source, fileName: 'a.pdf' }} />` |
| 修改 source prop 切换文件 | `await ref.open({ id, source, fileName })` |
| source 设为 undefined 期望清空 | `await ref.close()` |
| `ref.open(source, password)` | `ref.open({ id, source, password }, { signal })` |
| `onLoad(state)` | `onDocumentLoad(document)` |
| `onChange(state)` | `onStateChange(state)`，文档信息读取 state.document，先判断 null |
| `state.currentPage` | `state.document?.currentPageIndex` |
| `const blob = await ref.exportPdf()` | `const { blob, documentId, revision } = await ref.exportPdf()` |
| 宿主导出后自行上传，但无法清除 dirty | 提供 onSave 持久化处理器，再调用 `await ref.save()` |
| 通过 DOM 点击提取按钮 | `await ref.extractPages([0, 2])`，宿主处理返回的 blob |
| 修改 runtime prop 重新创建 Worker | 更换 React key；重建前处理当前未保存状态 |

包版本仍为 0.0.1；此处没有执行版本提交或发布。发布本轮改动时必须按项目约定单独安排版本变更，不应把“允许破坏性变更”解释成自动发布授权。

## 明确的能力边界

- 这是带内置工具栏的对象编辑器。后续已增加 `toolbar` 图标配置、插件生命周期和区域 OCR 接入接口；不内置 OCR 模型，未新增全文搜索、批注、任意底层编辑脚本或通用面板插槽。
- fonts 仍通过稳定数组引用注册；不承诺频繁重建同内容字体数组零成本。canEdit 不等于字体已经可用，也不等于所有 PDF 对象都支持修改。
- 默认下载完成的通知表示浏览器下载已发起；浏览器没有提供确认文件实际落盘的通用能力。
- ready / open / goToPage 不等待像素呈现。画面仍使用既有缓冲与异步纹理交接，保留渲染期间的忙碌保护。
- 第一阶段会话 API 重设计未改变视觉；后续工具栏和选区变更的设计依据及核对范围见 TOOLBAR、PLUGINS 和 QA。密码弹窗继续复用现有 rc-dialog，命令式 API 不自动弹窗。

## 参考与验证

会话通过 React 的外部存储订阅接入渲染，遵循缓存不可变快照及稳定订阅要求：[React useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)。

现有密码对话框的行为参考已查阅的 [Material Web Dialogs 文档与示例](https://material-web.dev/components/dialog/) 和 [dialog.ts 实现](https://github.com/material-components/material-web/blob/main/dialog/internal/dialog.ts)。本轮访问 M3 [使用指南](https://m3.material.io/components/dialogs/guidelines)、[视觉规格](https://m3.material.io/components/dialogs/specs)、[无障碍](https://m3.material.io/components/dialogs/accessibility) 时，文本抓取仅返回 JavaScript 提示，因此不把这些页面计为完成了新的视觉核验；现有视觉来源和既有验收见 README 与 QA。

验证包括真实 PDFium Worker 的会话测试和编辑器集成测试：初始输入不重复加载、状态通知、打开/关闭、密码与只读权限、外部保存、保存并发、版本归属、提取回读、守卫内保存、取消和卸载、认证请求、历史命令连续调用、关闭时取消尚未完成的初始加载，以及原有绘图、拖拽、页面缓存、缩放和键盘交互。

2026-09-22，Windows / Node 22.15.0 / Corepack Yarn 4.18.0：

| 检查 | 结果 |
| --- | --- |
| 包内 `yarn lint` | 0 errors，0 warnings |
| 包内 `yarn typecheck` | 通过 |
| 包内 `yarn test` | 7 个套件，64 项全部通过，无 act 告警或资源泄漏报告 |
| 最后导航调整后的 `yarn test src/__tests__/pdf-editor.test.tsx` | 24 项全部通过 |
| 包内 `yarn build:library` | 通过，包含令牌生成、ESM/CJS、声明和 Worker/WASM 资源 |
| 包内 `yarn generate:docgen` | 通过，由命令刷新 public/docgen.json |
| 文档站 `generate:docs`、`check:docs`、`typecheck` | 通过 |

站点生成器同时同步了工作区已有 Button/Canvas 文档输入对应的产物；本轮没有修改这些组件的文档源或实现。没有执行全仓测试、重新进行全站视觉验收或发布。
