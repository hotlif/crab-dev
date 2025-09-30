import DraggableTreeDemo from "./docs/src/demos/draggable.demo";

<div align="center">
	<h1>@crab-dev/rc-tree</h1>
	一个多功能且可定制的树形组件，用于 React 应用程序，提供高效的渲染和拖放功能。
</div>

## 何时使用 ?

例如文件夹、组织架构、生物分类、国家地区等。使用树控件可以完整展现这些层级关系，并提供展开、收起、选择等交互功能。

## 代码演示

<DraggableTreeDemo />


## API

### Tree props

| 参数      |说明         |类型        |默认值
|-------    |--------    |--------    |------------
|height     | 高度        | `number`   | -
|width      | 宽度        | `number`   | -
|draggable  | 设置节点可拖拽 | `boolean` | `false`
|expandedKeys | 展开指定的树节点 | `Key[]` | `[]`
|showLine     | 是否展示连接线   | `boolean` | `false`
|defaultNodeHeight | 默认节点高度 | `number` | -
|loadData          | 加载节点信息 | `(parentNode: Node \| null) => Promise<Node[]>` | -
|rendererContextMenu | 渲染右键菜单 | `rendererContextMenu?: (node: Node \| null) => ReactNode` | -
|selectKeys          | 选择节点     | `Key[]` | -
|onSelect            | 选择节点事件 | `(param: { event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, selectKeys: Key[], node: Node, isSelect: boolean }) => void` | -
|onExpanded          | 展开节点的事件 | `(param: {node: Node,event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent> }) => void`| -
|onDragAbort         | 拖拽中止事件  | `(event: DragAbortEvent, context: Context) => void;` | -
|onDragPending       | 拖拽待定事件  | `(event: DragAbortEvent, context: Context) => void;` | -
|onDragStart         | 拖拽开始事件  | `(event: DragAbortEvent, context: Context) => void;` | -
|onDragMove          | 拖拽移动事件  | `(event: DragMoveEvent, context: Context) => void;` | -
|onDragOver          | 拖拽悬停事件  | `(event: DragOverEvent, context: Context) => void;`  | -
|onDragEnd           | 拖拽结束事件  | `(event: DragOverEvent, context: Context) => void;`  | -
|onDragCancel        | 拖拽取消事件  | `(event: DragOverEvent, context: Context) => void;`  | -
|onContextMenu       | 右键树的时候触发的事件 | `(event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, node: Node \| null) => void;` | - 

### Tree Node

| 参数      |说明         |类型        |默认值
|-------    |--------    |--------    |------------
|editState  |状态     | `NodeEditStateType`     | - 
|parent  |父节点信息     | `Node \| null` | -
|loadState   | 加载状态     | `LoadStateType`       | - 
|type     |当前节点类型   | `NodeType`        | -
|title   |节点标题  | `ReactNode`       | -
|id    |节点的唯一标识      | `UniqueIdentifier` | -
|disabled | 节点是否被禁用   | `boolean` | -
|height   |  节点高度 | `number` | `24px`

## 主题变量

| 变量名称                               | 描述               | 默认值 
|------                                 |--------           |-------
|--crab-tree-indent-size                |节点缩进大小        | 24px
|--crab-tree-border-radius              |树节点边框半径      | 4px
|--crab-tree-node-draggable-icon-color  |树节点可拖动图标颜色 | rgba(0, 0, 0, 0.25)
|--crab-tree-node-draggable-border-width|树节点可拖动边框宽度 | 1px
|--crab-tree-node-draggable-border-style|树节点可拖动边框样式 | solid
|--crab-tree-node-draggable-border-color|树节点可拖动边框颜色 | #1677ff
|--crab-tree-node-icon-hover-bg-color   |树节点图标悬停背景颜色 | rgba(0, 0, 0, 0.06)
|--crab-tree-node-icon-loading-color    |树节点图标加载颜色 | #0088f0
|--crab-tree-node-title-hover-bg-color  |树节点标题悬停背景颜色 | rgba(0, 0, 0, 0.04)
|--crab-tree-node-title-select-bg-color |树节点标题选中背景颜色 | #e6f4ff

> 用户可以在 `body` 上设置对应的  [css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_propertieshttps://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), 即可覆覆盖对应的主题信息
