# 图标配置与动作扩展

`toolbar` 是可以随 React 状态更新的界面配置，不参与运行时初始化，不会重建 Worker 或重新打开 PDF。默认保留全部内置动作。

```tsx
import PdfEditor, { type PdfEditorToolbar } from '@crab-dev/rc-pdf-editor';

const toolbar: PdfEditorToolbar = {
    visibility: { addText: false, merge: false, deletePage: false },
};

<PdfEditor runtime={runtime} toolbar={toolbar} />;
```

## 架构与职责

| 层 | 职责 |
| --- | --- |
| `actions.ts` 动作目录 | 稳定业务 ID、默认名称、图标和分组的注册点；导出只读 `PDF_EDITOR_ACTIONS`，配置面板无需复制 ID 列表 |
| `toolbar.visibility` 展示配置 | `Partial<Record<PdfEditorActionId, boolean>>`；只有 `false` 隐藏，未配置和 `true` 显示 |
| `ActionButton` 展示适配 | 读取编辑器实例内的 Context，统一显隐、名称、Tooltip 和现有按钮状态；不会影响另一编辑器 |
| `toolbar.extraActions` 业务扩展 | 向主工具栏、绘图工具栏或状态栏追加按钮，复用无障碍包装、忙碌状态及错误处理 |
| `PdfEditorRef` / `PdfSession` | 执行文档命令及权限、事务、历史、保存约束；与展示配置独立 |

不增加逐个 `showXxx` 的顶层 prop，也不允许扩展替换内部 Worker、修改协议或覆盖内置执行器。宿主用公开命令组合业务功能；新增内置动作时注册描述并接入执行逻辑，类型、目录及配置 Demo 随之扩展。

## 内置动作 ID

| 分组 | ID |
| --- | --- |
| 文件 | `open` |
| 历史 | `undo`、`redo` |
| 插入对象 | `addText`、`addImage` |
| 页面管理 | `insertPage`、`merge`、`rotatePage`、`deletePage`、`pageUp`、`pageDown` |
| 输出 | `extract`、`save` |
| 画布工具 | `select`、`pan` |
| 绘图 | `rectangle`、`ellipse`、`line`、`arrow`、`freehand` |
| 侧栏 | `togglePages`、`toggleProperties`、`closePages`、`closeProperties` |
| 视图 | `fitPage` |

边界约定：

- 隐藏仅移除入口。快捷键、画布拖拽、ref 命令仍可使用；编辑权限由 `readOnly` 和 PDF 权限决定。显式显示也不能使被禁用的操作重新可用。
- `open: false` 同时移除空状态的选择文件按钮，宿主仍可通过 `initialDocument` 或 `ref.open()` 提供文档。
- 隐藏当前绘图或平移工具立即退回选择模式，再显示按钮不会重新激活旧工具。即便选择按钮被隐藏，选择模式和 Escape 仍可用。
- 侧栏开关和面板收起按钮分别配置；隐藏图标不会改变面板当前展开状态。隐藏开关后收起面板，焦点返回画布。若隐藏全部侧栏入口，宿主应确认保留当前面板状态符合业务需要。
- 空绘图工具栏、空侧栏按钮组和失去分组意义的分隔线自动移除。文件名和状态信息继续显示。
- 该接口控制编辑器动作图标，不控制通用输入框内部装饰、对象种类图标或属性面板文字按钮。

## 扩展业务动作

```tsx
import type { PdfEditorToolbarAction } from '@crab-dev/rc-pdf-editor';

const extraActions: readonly PdfEditorToolbarAction[] = [{
    id: 'app.save',
    label: '保存到业务系统',
    icon: <SaveIcon />,
    placement: 'main',
    disabled: state => !state.document,
    onSelect: async editor => { await editor.save(); },
}];

<PdfEditor runtime={runtime} onSave={persistDocument}
    toolbar={{ visibility: { save: false }, extraActions }} />;
```

`id` 在扩展数组内必须唯一且稳定，建议使用业务前缀。`label` 是必填的按钮可访问名称和 Tooltip；`icon` 必须是非交互 React 图标元素，以 `currentColor` 继承状态颜色，外层提供 24px 图标空间。不要在图标中嵌套按钮或链接。

`placement` 支持 `main`、`tools`、`status`，数组顺序就是对应区域的追加顺序。`visible: false` 隐藏扩展；`disabled` 接受布尔值或读取 `PdfEditorState` 的纯函数，渲染及点击前均评估。未就绪或正在处理操作时额外禁用扩展。

`onSelect(editor)` 可以同步执行或返回 Promise。异步执行纳入编辑器忙碌状态；失败通过统一错误区域和 `onError` 通知，取消错误沿用原有静默约定。调用参数与 ref 的能力相同，继续受只读、会话和保存守卫约束，无需获取 Worker 或内部状态。

需要安装/清理、任务取消、跨页 OCR 等能力时使用 `plugins`，见 [插件与跨页区域 API](./PLUGINS.md)。`extraActions` 保留简单按钮语义；插件动作拥有独立命名空间和生命周期，使用相同的展示位置与无障碍包装。

## Demo 与设计依据

工作台“图标显隐与动作扩展”默认加载本地示例 PDF：25 个图标均可单独或分组勾选，支持全选/半选、恢复默认、只读切换及“文档摘要”扩展，底部可查看实时配置。

配置面板参考 M3 Checkbox [使用指南](https://m3.material.io/components/checkbox/guidelines)、[规格](https://m3.material.io/components/checkbox/specs)、[无障碍](https://m3.material.io/components/checkbox/accessibility)：相关选项使用复选框，父项支持半选，选择立即生效。复用 `rc-checkbox` 的视觉、原生输入语义和键盘行为。

图标按钮延续标准按钮、原有侧栏 filled tonal toggle 和保存强调状态。参考 M3 Icon buttons [指南](https://m3.material.io/components/icon-buttons/guidelines)、[规格](https://m3.material.io/components/icon-buttons/specs)、[无障碍](https://m3.material.io/components/icon-buttons/accessibility)。

Material Web 对照：

- Checkbox [文档与示例](https://material-web.dev/components/checkbox/)、[实现](https://github.com/material-components/material-web/blob/main/checkbox/internal/checkbox.ts)、[样式](https://github.com/material-components/material-web/blob/main/checkbox/internal/_checkbox.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-checkbox.scss)。
- Icon button [文档与示例](https://material-web.dev/components/icon-button/)、[实现](https://github.com/material-components/material-web/blob/main/iconbutton/internal/icon-button.ts)、[样式](https://github.com/material-components/material-web/blob/main/iconbutton/internal/_icon-button.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-icon-button.scss)。

分组配置面板和 PDF 工作区属于组件组合扩展，没有引入 Material Web 运行时。验收范围与浏览器核对记录见 `QA.md`。
