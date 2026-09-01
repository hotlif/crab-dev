/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type ElkLayoutEdge = DocsTypePlaceholder;
type ElkLayoutNode = DocsTypePlaceholder;
type FlowDiagramRenderContext = DocsTypePlaceholder;
type ManualRoute = DocsTypePlaceholder;
type Omit<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type ReactNode = DocsTypePlaceholder;
type Record<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type UseEdgeRoutingOptions = DocsTypePlaceholder;

export interface FlowDiagramPropsSearchIndex {
    /**
     * render prop：在画布上下文中渲染流程图内容
     */
    "children": (ctx: FlowDiagramRenderContext) => ReactNode;

    /**
     * ELK 布局输入边
     */
    "edges": ElkLayoutEdge[];

    /**
     * ELK 布局算法选项，默认 layered + RIGHT
     */
    "elkOptions"?: Record<string, string>;

    /**
     * 暂无说明。
     */
    "gridBaseSpacing"?: number;

    /**
     * 无限网格颜色，默认 #eceef3
     */
    "gridColor"?: string;

    /**
     * 暂无说明。
     */
    "gridSubdivisions"?: number;

    /**
     * 暂无说明。
     */
    "height"?: number;

    /**
     * 手动走线覆盖（draw.io 风格）：`edgeId → ManualRoute`。 提供后对应边按此固定走线，不再自动避让。
     */
    "manualRoutes"?: Record<string, ManualRoute>;

    /**
     * 节点位置覆盖：`nodeId → { x, y }`。 用于拖拽后实时更新节点位置并触发路由重算， 未覆盖的节点取 ELK 布局结果。
     */
    "nodePositions"?: Record<string, { x: number; y: number }>;

    /**
     * ELK 布局输入节点（需提供稳定 id 与宽高）
     */
    "nodes": ElkLayoutNode[];

    /**
     * 点击空白区域时触发
     */
    "onEmptyClick"?: () => void;

    /**
     * 路由选项（不含 manualRoutes，单独由 manualRoutes prop 控制）
     */
    "routingOptions"?: Omit<UseEdgeRoutingOptions, 'manualRoutes'>;

    /**
     * 暂无说明。
     */
    "style"?: CSSProperties;

    /**
     * 暂无说明。
     */
    "width"?: number;
}
