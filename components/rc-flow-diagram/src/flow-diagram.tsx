import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Canvas, Viewport, InfiniteGrid, useCanvasControls } from '@crab-dev/rc-canvas';
import type { CanvasControls, Pt } from '@crab-dev/rc-canvas';
import { useElkLayout } from './hooks/useElkLayout.js';
import { useEdgeRouting } from './hooks/useEdgeRouting.js';
import { useEdgeCrossings } from './hooks/useEdgeCrossings.js';
import type { ElkLayoutNode, ElkLayoutEdge } from './hooks/useElkLayout.js';
import type { UseEdgeRoutingOptions, EdgeRoutes, ManualRoute } from './hooks/useEdgeRouting.js';

export type FlowDiagramControls = Pick<CanvasControls, 'fitView' | 'exportPNG' | 'zoomIn' | 'zoomOut'>;

export interface FlowNodeRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface FlowDiagramRenderContext {
    /** ELK 布局结果与用户位置覆盖合并后的节点矩形 */
    nodeRects: Record<string, FlowNodeRect>;
    /** 每条边的正交折线顶点（由 useEdgeRouting 计算） */
    routes: EdgeRoutes;
    /**
     * 每条边需要"让路"的交叉点（直接传给 `<FlowEdge crossings={crossings[e.id]} />`）。
     * 有值的边在交叉点处留缺口，字典序较小 id 的边从上方通过。
     */
    crossings: Record<string, Pt[]>;
    /** 当前视口缩放（用于屏幕像素稳定渲染） */
    zoom: number;
    /** ELK Worker 计算中 */
    loading: boolean;
    /** ELK 布局错误 */
    error: Error | null;
    /** 视口控制（fitView / zoomIn / zoomOut / exportPNG） */
    controls: FlowDiagramControls;
}

export interface FlowDiagramProps {
    /** ELK 布局输入节点（需提供稳定 id 与宽高） */
    nodes: ElkLayoutNode[];
    /** ELK 布局输入边 */
    edges: ElkLayoutEdge[];
    /** ELK 布局算法选项，默认 layered + RIGHT */
    elkOptions?: Record<string, string>;

    /**
     * 节点位置覆盖：`nodeId → { x, y }`。
     * 用于拖拽后实时更新节点位置并触发路由重算，
     * 未覆盖的节点取 ELK 布局结果。
     */
    nodePositions?: Record<string, { x: number; y: number }>;

    /**
     * 手动走线覆盖（draw.io 风格）：`edgeId → ManualRoute`。
     * 提供后对应边按此固定走线，不再自动避让。
     */
    manualRoutes?: Record<string, ManualRoute>;

    /** 路由选项（不含 manualRoutes，单独由 manualRoutes prop 控制） */
    routingOptions?: Omit<UseEdgeRoutingOptions, 'manualRoutes'>;

    width?: number;
    height?: number;
    style?: CSSProperties;

    /** 无限网格颜色，默认 #eceef3 */
    gridColor?: string;
    gridBaseSpacing?: number;
    gridSubdivisions?: number;

    /** 点击空白区域时触发 */
    onEmptyClick?: () => void;

    /** render prop：在画布上下文中渲染流程图内容 */
    children: (ctx: FlowDiagramRenderContext) => ReactNode;
}

// ── 内部组件：在 Canvas 上下文内调用 useCanvasControls，再注入 render prop ──

interface InnerProps {
    ctx: Omit<FlowDiagramRenderContext, 'controls'>;
    children: (ctx: FlowDiagramRenderContext) => ReactNode;
}

function FlowDiagramInner({ ctx, children }: InnerProps) {
    const controls = useCanvasControls();
    return <>{children({ ...ctx, controls })}</>;
}

// ── FlowDiagram ───────────────────────────────────────────────────────────────

export default function FlowDiagram({
    nodes,
    edges,
    elkOptions,
    nodePositions,
    manualRoutes,
    routingOptions,
    width = 800,
    height = 520,
    style,
    gridColor = '#eceef3',
    gridBaseSpacing = 64,
    gridSubdivisions = 4,
    onEmptyClick,
    children,
}: FlowDiagramProps) {
    const [zoom, setZoom] = useState(1);

    const { layout, loading, error } = useElkLayout(nodes, edges, elkOptions);

    // 合并 ELK 布局位置 + 用户拖拽覆盖
    const nodeRects = useMemo<Record<string, FlowNodeRect>>(() => {
        if (!layout) return {};
        const result: Record<string, FlowNodeRect> = {};
        for (const [id, rect] of Object.entries(layout.nodes)) {
            const override = nodePositions?.[id];
            result[id] = override ? { ...rect, x: override.x, y: override.y } : rect;
        }
        return result;
    }, [layout, nodePositions]);

    const routes = useEdgeRouting(nodeRects, edges, { ...routingOptions, manualRoutes });
    const crossings = useEdgeCrossings(routes);

    const ctx: Omit<FlowDiagramRenderContext, 'controls'> = {
        nodeRects,
        routes,
        crossings,
        zoom,
        loading,
        error,
    };

    return (
        <Canvas
            width={width}
            height={height}
            style={style}
            onEmptyClick={onEmptyClick}
        >
            <Viewport onViewportChange={v => setZoom(v.zoom)}>
                <InfiniteGrid
                    color={gridColor}
                    baseSpacing={gridBaseSpacing}
                    subdivisions={gridSubdivisions}
                />
                <FlowDiagramInner ctx={ctx}>
                    {children}
                </FlowDiagramInner>
            </Viewport>
        </Canvas>
    );
}
