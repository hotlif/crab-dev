+++
title = "Tree"
index = true
+++


# Tree

一个多功能且可定制的树形组件，用于 React 应用程序，提供高效的渲染和拖放功能。


## 何时使用

例如文件夹、组织架构、生物分类、国家地区等。使用树控件可以完整展现这些层级关系，并提供展开、收起、选择等交互功能。


## 代码演示

<Demos path="/docs/demos" />

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
|onDragEnd           | 拖拽结束事件  | `(event: DragOverEvent, context: Context) => void;`  | -

### Tree Node

| 参数      |说明         |类型        |默认值
|-------    |--------    |--------    |------------
|parent  |父节点信息     | `Node \| null` | -
|loadState   | 加载状态     | `LoadStateType`       | -
|type     |当前节点类型   | `NodeType`        | -
|title   |节点标题  | `ReactNode`       | -
|id    |节点的唯一标识      | `UniqueIdentifier` | -
|disabled | 节点是否被禁用   | `boolean` | -
|height   |  节点高度 | `number` | `24px`
