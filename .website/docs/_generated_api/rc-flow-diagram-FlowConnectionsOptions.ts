// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type EdgeRoutes = DocsTypePlaceholder;
type FlowConnectionChange = DocsTypePlaceholder;
type FlowConnectionEdge = DocsTypePlaceholder;
type FlowEndpoint = DocsTypePlaceholder;
type FlowInteraction = DocsTypePlaceholder;
type FlowPort = DocsTypePlaceholder;
type HTMLElement = DocsTypePlaceholder;
type InteractionEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Pt = DocsTypePlaceholder;
type Record<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type RefObject<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type RoutingRect = DocsTypePlaceholder;
type ViewportState = DocsTypePlaceholder;

export interface FlowConnectionsOptions {
    /**
     * 暂无说明。
     */
    "ports": readonly FlowPort[];

    /**
     * 暂无说明。
     */
    "edges": readonly FlowConnectionEdge[];

    /**
     * 暂无说明。
     */
    "routes": EdgeRoutes;

    /**
     * 用于节点区域内吸附最近端口；更细的字段行吸附可提供 resolvePort。
     */
    "nodeRects"?: Record<string, RoutingRect>;

    /**
     * 暂无说明。
     */
    "selectedEdgeId"?: string | null;

    /**
     * 暂无说明。
     */
    "containerRef": RefObject<HTMLElement | null>;

    /**
     * 暂无说明。
     */
    "viewport": ViewportState;

    /**
     * 暂无说明。
     */
    "revision": string | number | object;

    /**
     * 暂无说明。
     */
    "disabled"?: boolean;

    /**
     * 暂无说明。
     */
    "active"?: boolean;

    /**
     * 接收世界坐标，返回稳定端口引用。返回 null 时不吸附。
     */
    "resolvePort"?: (point: Pt, moving: 'source' | 'target') => FlowEndpoint | null;

    /**
     * 返回错误说明表示拒绝；null / undefined / 空字符串表示允许。提交时再次校验。
     */
    "validateConnection"?: (change: FlowConnectionChange) => string | null | undefined;

    /**
     * 暂无说明。
     */
    "onConnect"?: (change: FlowConnectionChange) => void;

    /**
     * 暂无说明。
     */
    "onRouteChange"?: (change: { edgeId: string; points: Pt[] | null; }) => void;

    /**
     * 暂无说明。
     */
    "onInteractionChange"?: (event: InteractionEvent<FlowInteraction>) => void;

    /**
     * 命中半径、拖动阈值均为屏幕 CSS 像素。
     */
    "hitRadius"?: number;

    /**
     * 暂无说明。
     */
    "dragThreshold"?: number;
}
