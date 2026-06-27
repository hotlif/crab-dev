/**
 * useEdgeRouting —— 与 useElkLayout 对偶的边走线 hook。
 *
 * useElkLayout 算"节点在哪"，useEdgeRouting 算"线怎么连"：
 * 输入节点矩形 + 边 → 输出每条边的正交折线，自动做端口分配与节点避让；
 * 传入 manualRoutes 可对个别边做"手动优先"覆盖（手动走线不避让）。
 *
 * 类型与 useElkLayout 对齐：nodes 形如 `ElkLayoutResult.nodes`，edges 可直接用
 * `ElkLayoutEdge[]`，返回值形如 `ElkLayoutResult.edges`（`{ [id]: { points } }`）。
 */

import { useMemo } from 'react';
import {
    type Pt, type Rect, type Side, type EdgeAnchor, type AvoidOptions, type RoutableEdge,
    anchorPoint, assignPorts, connectThroughWaypoints, withTerminalStubs, routeOrthogonal, routeEdge,
} from '../routing/index.js';

/** 端口锚点：所在边 + 边上参数 t∈[0,1]。 */
export interface PortAnchor {
    side: Side;
    t: number;
}

/**
 * 一条边的手动走线覆盖（draw.io 风格）：端口随节点走（存 side+t，可重连到任意节点），
 * 中间折点 waypoints 为世界绝对坐标。提供后该边按此固定走线、不再自动避让。
 */
export interface ManualRoute {
    source: string;
    target: string;
    sourcePort: PortAnchor;
    targetPort: PortAnchor;
    waypoints: Pt[];
}

export interface UseEdgeRoutingOptions extends AvoidOptions {
    /** 自动边是否绕开其它节点，默认 true。 */
    avoidNodes?: boolean;
    /** 手动走线覆盖：`edgeId → ManualRoute`。 */
    manualRoutes?: Record<string, ManualRoute>;
    /**
     * 手动边进 / 出端口的最小引出段长度（world px），默认 0。
     * 设为 ≥ 箭头长度可避免折点贴近节点时箭头压住转角（仍保持箭头正常大小）。
     */
    terminalStub?: number;
}

/** 返回值：每条边的折线顶点（含两端，world 坐标）。 */
export type EdgeRoutes = Record<string, { points: Pt[] }>;

function computeRoutes(
    nodes: Record<string, Rect>,
    edges: RoutableEdge[],
    options: UseEdgeRoutingOptions,
): EdgeRoutes {
    const { avoidNodes = true, manualRoutes, terminalStub = 0, ...avoid } = options;
    const anchors = assignPorts(nodes, edges);
    const result: EdgeRoutes = {};

    for (const e of edges) {
        const manual = manualRoutes?.[e.id];
        if (manual) {
            const sNode = nodes[manual.source];
            const tNode = nodes[manual.target];
            if (!sNode || !tNode) continue;
            const anchor: EdgeAnchor = {
                exit: anchorPoint(sNode, manual.sourcePort.side, manual.sourcePort.t),
                exitSide: manual.sourcePort.side,
                entry: anchorPoint(tNode, manual.targetPort.side, manual.targetPort.t),
                entrySide: manual.targetPort.side,
            };
            const pts = connectThroughWaypoints(anchor, manual.waypoints);
            result[e.id] = { points: terminalStub > 0 ? withTerminalStubs(pts, terminalStub) : pts };
            continue;
        }

        const anchor = anchors[e.id];
        if (!anchor?.exit || !anchor?.entry) continue;
        if (avoidNodes) {
            const obstacles: Rect[] = [];
            for (const id in nodes) if (id !== e.source && id !== e.target) obstacles.push(nodes[id]);
            result[e.id] = { points: routeEdge(anchor, obstacles, avoid) };
        } else {
            result[e.id] = { points: routeOrthogonal(anchor) };
        }
    }
    return result;
}

/**
 * 计算一批边的正交走线。纯计算，按内容签名记忆化（A* 较重，且库消费方不一定启用
 * React Compiler —— 属"面向库消费方的稳定化"例外，手写 useMemo 是正当的）。
 *
 * @example
 * const { layout } = useElkLayout(nodes, edges, opts);
 * const routes = useEdgeRouting(layout?.nodes ?? {}, edges);
 * // routes['e1'].points → 折线顶点
 */
export function useEdgeRouting(
    nodes: Record<string, Rect>,
    edges: RoutableEdge[],
    options: UseEdgeRoutingOptions = {},
): EdgeRoutes {
    // 以内容签名为依赖（而非每帧变化的对象引用），仅在节点 / 边 / 选项内容变化时重算
    const signature = JSON.stringify({ nodes, edges, options });
    return useMemo(() => computeRoutes(nodes, edges, options), [signature]);
}

export default useEdgeRouting;
