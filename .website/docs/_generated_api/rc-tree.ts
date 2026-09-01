/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Array<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Context = DocsTypePlaceholder;
type Dispatch<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type DragAbortEvent = DocsTypePlaceholder;
type DragCancelEvent = DocsTypePlaceholder;
type DragEndEvent = DocsTypePlaceholder;
type DragMoveEvent = DocsTypePlaceholder;
type DragOverEvent = DocsTypePlaceholder;
type DragPendingEvent = DocsTypePlaceholder;
type DragStartEvent = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type HTMLSpanElement = DocsTypePlaceholder;
type Key = DocsTypePlaceholder;
type MouseEvent<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type Node = DocsTypePlaceholder;
type NodeItemProps = DocsTypePlaceholder;
type OverStateEnum = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type SetStateAction<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TreeProps = DocsTypePlaceholder;

export interface TreePropsSearchIndex {
    /**
     * 树组件的数据信息
     */
    "treeData": Array<Node>;

    /**
     * 高度
     */
    "height": number;

    /**
     * 宽度
     */
    "width": number;

    /**
     * 设置节点可拖拽
     */
    "draggable"?: boolean;

    /**
     * 拖拽放置前的校验回调，返回 false 则阻止此次放置。
     */
    "allowDrop"?: (param: { dragNode: Node; targetNode: Node; position: OverStateEnum; }) => boolean;

    /**
     * 展开指定的树节点
     */
    "expandedKeys"?: Key[];

    /**
     * 选择节点
     */
    "selectKeys"?: Key[];

    /**
     * 是否展示连接线
     */
    "showLine"?: boolean;

    /**
     * 默认节点高度
     */
    "defaultNodeHeight"?: number;

    /**
     * 加载节点信息
     */
    "loadData"?: (parentNode: Node | null) => Promise<Array<Node>>;

    /**
     * 渲染右键菜单
     */
    "rendererContextMenu"?: (param: { node: Node | null; hide: () => void; }) => ReactNode;

    /**
     * 展开节点的事件
     */
    "onExpanded"?: NodeItemProps["onExpanded"];

    /**
     * 选择节点事件
     */
    "onSelect"?: (param: { event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>; selectKeys: Key[]; node: Node; isSelect: boolean; }) => void;

    /**
     * 拖拽中止事件
     */
    "onDragAbort"?: (event: DragAbortEvent, context: Context) => void;

    /**
     * 拖拽待定事件
     */
    "onDragPending"?: (event: DragPendingEvent, context: Context) => void;

    /**
     * 拖拽开始事件
     */
    "onDragStart"?: (event: DragStartEvent, context: Context) => void;

    /**
     * 拖拽移动事件
     */
    "onDragMove"?: (event: DragMoveEvent, context: Context) => void;

    /**
     * 拖拽悬停事件
     */
    "onDragOver"?: (event: DragOverEvent, context: Context) => void;

    /**
     * 拖拽结束事件
     */
    "onDragEnd"?: (event: DragEndEvent, context: Context) => void;

    /**
     * 拖拽取消事件
     */
    "onDragCancel"?: (event: DragCancelEvent, context: Context) => void;

    /**
     * 右键点击的时候触发的事件
     */
    "onContextMenu"?: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, node: Node | null) => void;

    /**
     * 是否开启复选框
     */
    "checkable"?: boolean;

    /**
     * 受控的已选中节点 key 列表
     */
    "checkedKeys"?: Key[];

    /**
     * 复选框勾选/取消时触发。内部已完成级联计算，halfCheckedKeys 由组件自动计算。
     */
    "onCheck"?: (param: { checkedKeys: Key[]; halfCheckedKeys: Key[]; node: Node; checked: boolean; }) => void;

    /**
     * 过滤树节点。返回 true 则保留该节点（及其所有祖先）；返回 false 则隐藏。 不传时不过滤，显示全部可见节点。
     */
    "filterTreeNode"?: (node: Node) => boolean;

    /**
     * 双击节点标题行时触发。常用于进入 inline 编辑模式。
     */
    "onNodeDoubleClick"?: (node: Node, event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;

    /**
     * 节点 inline 编辑完成时触发。 cancelled=true 表示按 Esc 取消，此时 newTitle 无意义。 调用方应在此回调里更新标题并清除 editState。
     */
    "onEditEnd"?: (node: Node, newTitle: string, cancelled: boolean) => void;

    /**
     * 自定义编辑器渲染函数，替换默认 `<input>`。 消费方负责聚焦管理，调用 `onCommit(value)` 提交，`onCancel()` 取消。
     */
    "renderEditInput"?: NodeItemProps["renderEditInput"];

    /**
     * 拖拽位置 badge 文字，用于国际化覆盖。默认中文。
     */
    "dragBadgeLabels"?: NodeItemProps["dragBadgeLabels"];

    /**
     * 节点改变时触发的事件
     */
    "onTreeNodeChange": Dispatch<SetStateAction<TreeProps["treeData"]>>;
}
