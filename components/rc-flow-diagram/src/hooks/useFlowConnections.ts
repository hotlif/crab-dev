import { useRef, useState, type RefObject } from 'react';
import { screenToWorld, type Pt, type RoutingRect, type ViewportState } from '@crab-dev/rc-canvas';
import type { FlowConnectionChange, FlowConnectionEdge, FlowEndpoint, FlowPort, InteractionEvent, InteractionCancelReason } from '../types.js';
import type { EdgeRoutes } from './useEdgeRouting.js';
import { distanceToEdge, moveEdgeSegment } from '../edge-editing.js';
import { useDiagramInteraction } from './useDiagramInteraction.js';

/** React 合成事件与原生 PointerEvent 均可传入。 */
export type FlowPointerEvent = Pick<PointerEvent, 'pointerId' | 'button' | 'clientX' | 'clientY' | 'target' | 'preventDefault' | 'stopPropagation'>;

interface PointerOrigin {
    pointerId: number;
    origin: Pt;
    clientOrigin: Pt;
}

export type FlowInteraction = PointerOrigin & (
    | { kind: 'connection'; fixed: FlowPort; moving: 'source' | 'target'; edgeId?: string; point: Pt; target: FlowPort | null; problem: string | null }
    | { kind: 'route'; edgeId: string; index: number; initial: Pt[]; points: Pt[] }
);

export interface FlowConnectionsOptions {
    ports: readonly FlowPort[];
    edges: readonly FlowConnectionEdge[];
    routes: EdgeRoutes;
    /** 用于节点区域内吸附最近端口；更细的字段行吸附可提供 resolvePort。 */
    nodeRects?: Record<string, RoutingRect>;
    selectedEdgeId?: string | null;
    containerRef: RefObject<HTMLElement | null>;
    viewport: ViewportState;
    revision: string | number | object;
    disabled?: boolean;
    active?: boolean;
    /** 接收世界坐标，返回稳定端口引用。返回 null 时不吸附。 */
    resolvePort?: (point: Pt, moving: 'source' | 'target') => FlowEndpoint | null;
    /** 返回错误说明表示拒绝；null / undefined / 空字符串表示允许。提交时再次校验。 */
    validateConnection?: (change: FlowConnectionChange) => string | null | undefined;
    onConnect?: (change: FlowConnectionChange) => void;
    onRouteChange?: (change: { edgeId: string; points: Pt[] | null }) => void;
    onInteractionChange?: (event: InteractionEvent<FlowInteraction>) => void;
    /** 命中半径、拖动阈值均为屏幕 CSS 像素。 */
    hitRadius?: number;
    dragThreshold?: number;
}

export interface FlowConnectionsResult {
    interaction: FlowInteraction | null;
    routes: EdgeRoutes;
    hoveredNodeId: string | null;
    problem: string | null;
    handlers: {
        onPointerDownCapture: (event: FlowPointerEvent) => boolean;
        onPointerMoveCapture: (event: FlowPointerEvent) => boolean;
        onPointerUpCapture: (event: FlowPointerEvent) => boolean;
        onPointerCancel: (event: FlowPointerEvent) => void;
        onLostPointerCapture: (event: FlowPointerEvent) => void;
        onPointerLeave: () => void;
    };
    cancelInteraction: (reason?: InteractionCancelReason) => void;
    resetRoute: (edgeId: string) => void;
}

export function sameEndpoint(a: FlowEndpoint, b: FlowEndpoint): boolean {
    return a.nodeId === b.nodeId && a.portId === b.portId;
}

/** 无业务状态的连线、改接和正交线段编辑。handlers 放在 Canvas 的 DOM 容器上。 */
export function useFlowConnections(options: FlowConnectionsOptions): FlowConnectionsResult {
    const { ports, edges, routes, nodeRects = {}, selectedEdgeId, containerRef, viewport, revision, disabled = false, active = true,
        resolvePort, validateConnection, onConnect, onRouteChange, onInteractionChange, hitRadius = 10, dragThreshold = 3 } = options;
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [problem, setProblem] = useState<string | null>(null);
    // 可变实例：pointer capture 的 owner 必须是开始手势时的元素。
    const capture = useRef<{ element: HTMLElement; pointerId: number } | null>(null);
    const release = () => {
        const owner = capture.current;
        capture.current = null;
        if (owner?.element.hasPointerCapture?.(owner.pointerId)) owner.element.releasePointerCapture(owner.pointerId);
    };
    const connection = (value: Extract<FlowInteraction, { kind: 'connection' }>, target: FlowPort): FlowConnectionChange => {
        const from = value.moving === 'target' ? value.fixed : target, to = value.moving === 'target' ? target : value.fixed;
        return { source: { nodeId: from.nodeId, portId: from.portId }, target: { nodeId: to.nodeId, portId: to.portId }, ...(value.edgeId === undefined ? {} : { edgeId: value.edgeId }) };
    };
    const transaction = useDiagramInteraction<FlowInteraction>({
        revision, disabled, active,
        onCommit(value) {
            release();
            if (value.kind === 'route') {
                if (JSON.stringify(value.points) !== JSON.stringify(value.initial)) onRouteChange?.({ edgeId: value.edgeId, points: value.points });
            } else if (value.target) {
                const change = connection(value, value.target), error = validateConnection?.(change) || null;
                setProblem(error);
                if (!error) onConnect?.(change);
            }
        },
        onCancel: release,
        onInteractionChange,
    });
    const portById = (endpoint: FlowEndpoint) => ports.find(port => sameEndpoint(port, endpoint));
    const permits = (port: FlowPort, moving: 'source' | 'target') => port.direction === 'both' || port.direction === (moving === 'source' ? 'output' : 'input');
    const canvasBounds = () => (containerRef.current?.querySelector('canvas') ?? containerRef.current)?.getBoundingClientRect();
    const pointAt = (event: FlowPointerEvent): Pt => {
        const bounds = canvasBounds();
        return screenToWorld({ x: event.clientX - (bounds?.left ?? 0), y: event.clientY - (bounds?.top ?? 0) }, viewport);
    };
    const nodeAt = (point: Pt) => Object.entries(nodeRects).reverse().find(([, rect]) => point.x >= rect.x - hitRadius / viewport.zoom && point.x <= rect.x + rect.width + hitRadius / viewport.zoom
        && point.y >= rect.y - hitRadius / viewport.zoom && point.y <= rect.y + rect.height + hitRadius / viewport.zoom)?.[0] ?? null;
    const targetAt = (event: FlowPointerEvent, point: Pt, moving: 'source' | 'target') => {
        const bounds = canvasBounds();
        if (!bounds || event.clientX < bounds.left || event.clientY < bounds.top || event.clientX > bounds.right || event.clientY > bounds.bottom) return null;
        if (resolvePort) {
            const endpoint = resolvePort(point, moving), port = endpoint && portById(endpoint);
            return port && permits(port, moving) ? port : null;
        }
        const nodeId = nodeAt(point);
        return ports.filter(port => permits(port, moving) && (nodeId ? port.nodeId === nodeId : Math.hypot(port.position.x - point.x, port.position.y - point.y) * viewport.zoom <= hitRadius))
            .sort((a, b) => Math.hypot(a.position.x - point.x, a.position.y - point.y) - Math.hypot(b.position.x - point.x, b.position.y - point.y))[0] ?? null;
    };
    const consume = (event: FlowPointerEvent) => { event.preventDefault(); event.stopPropagation(); };
    const begin = (event: FlowPointerEvent, value: FlowInteraction) => {
        if (!transaction.begin(value)) return false;
        consume(event);
        setProblem(null);
        const element = containerRef.current;
        if (element) {
            element.focus({ preventScroll: true });
            element.setPointerCapture?.(event.pointerId);
            capture.current = { element, pointerId: event.pointerId };
        }
        return true;
    };
    const preview = (event: FlowPointerEvent, value: FlowInteraction): FlowInteraction => {
        const point = pointAt(event);
        if (value.kind === 'route') return { ...value, points: moveEdgeSegment(value.initial, value.index, { x: point.x - value.origin.x, y: point.y - value.origin.y }) };
        const target = targetAt(event, point, value.moving);
        return { ...value, point, target, problem: target ? validateConnection?.(connection(value, target)) || null : null };
    };
    const handlers = {
        onPointerDownCapture(event: FlowPointerEvent): boolean {
            if (disabled || !active || event.button !== 0 || transaction.getCurrent() || event.target !== (containerRef.current?.querySelector('canvas') ?? containerRef.current)) return false;
            const point = pointAt(event), base: PointerOrigin = { pointerId: event.pointerId, origin: point, clientOrigin: { x: event.clientX, y: event.clientY } };
            const edge = edges.find(edge => edge.id === selectedEdgeId && edge.editable !== false), route = edge && routes[edge.id];
            if (edge && route && onConnect) {
                for (const moving of ['source', 'target'] as const) {
                    const end = moving === 'source' ? route.points[0] : route.points[route.points.length - 1];
                    const fixed = portById(moving === 'source' ? edge.target : edge.source);
                    if (end && fixed && Math.hypot(point.x - end.x, point.y - end.y) * viewport.zoom <= hitRadius)
                        return begin(event, { ...base, kind: 'connection', fixed, moving, edgeId: edge.id, point, target: null, problem: null });
                }
            }
            const port = ports.filter(port => Math.hypot(point.x - port.position.x, point.y - port.position.y) * viewport.zoom <= hitRadius)
                .sort((a, b) => Math.hypot(point.x - a.position.x, point.y - a.position.y) - Math.hypot(point.x - b.position.x, point.y - b.position.y))[0];
            if (port && onConnect) return begin(event, { ...base, kind: 'connection', fixed: port, moving: port.direction === 'input' ? 'source' : 'target', point, target: null, problem: null });
            if (edge && route && onRouteChange) for (let index = 1; index < route.points.length - 2; index++) {
                if (distanceToEdge(point, route.points.slice(index, index + 2)) * viewport.zoom <= hitRadius)
                    return begin(event, { ...base, kind: 'route', edgeId: edge.id, index, initial: route.points.map(p => ({ ...p })), points: route.points });
            }
            return false;
        },
        onPointerMoveCapture(event: FlowPointerEvent): boolean {
            setHoveredNodeId(disabled || !active ? null : nodeAt(pointAt(event)));
            const current = transaction.getCurrent();
            if (!current || current.pointerId !== event.pointerId) return false;
            consume(event);
            const next = preview(event, current);
            transaction.update(next);
            if (next.kind === 'connection') setProblem(next.problem);
            return true;
        },
        onPointerUpCapture(event: FlowPointerEvent): boolean {
            const current = transaction.getCurrent();
            if (!current || current.pointerId !== event.pointerId) return false;
            consume(event);
            const next = preview(event, current);
            if (Math.hypot(event.clientX - current.clientOrigin.x, event.clientY - current.clientOrigin.y) < dragThreshold || next.kind === 'connection' && (!next.target || next.problem)) {
                if (next.kind === 'connection') setProblem(next.problem);
                transaction.cancel();
            } else transaction.commit(next);
            return true;
        },
        onPointerCancel(event: FlowPointerEvent) { if (transaction.getCurrent()?.pointerId === event.pointerId) transaction.cancel('pointer-cancel'); },
        onLostPointerCapture(event: FlowPointerEvent) { if (transaction.getCurrent()?.pointerId === event.pointerId) transaction.cancel('capture-lost'); },
        onPointerLeave() { if (!transaction.getCurrent()) setHoveredNodeId(null); },
    };
    const interaction = transaction.value;
    const previewRoutes = interaction?.kind === 'route' ? { ...routes, [interaction.edgeId]: { points: interaction.points } } : routes;
    return {
        interaction, routes: previewRoutes, hoveredNodeId, problem, handlers,
        cancelInteraction: transaction.cancel,
        /** 清除持久化覆盖意图；自动路由与历史管理仍由调用方决定。 */
        resetRoute(edgeId: string) {
            if (disabled || !active || !edges.some(edge => edge.id === edgeId && edge.editable !== false)) return;
            transaction.cancel();
            onRouteChange?.({ edgeId, points: null });
        },
    };
}
