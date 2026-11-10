import { useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import { Canvas, Viewport, InfiniteGrid, Circle, routeEdge, type Pt, type ViewportState } from '@crab-dev/rc-canvas';
import { FlowNode, FlowEdge, makeEditableRoute, useFlowConnections, sameEndpoint, SEMANTIC_FLOW_DIAGRAM_PALETTE as palette,
    type FlowPort, type FlowConnectionEdge, type FlowConnectionChange } from '@crab-dev/rc-flow-diagram';

export const meta = { title: '受控连线与单次撤销', description: '拖动端口建立连接，选中连线后拖动端点或内部线段。Esc 取消；预览不会写入历史。键盘按钮使用相同的提交协议。' };
const scroll = css`max-width: 100%; overflow: auto;`;
const toolbar = css`display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 8px;`;
const nodeRects = { a: { x: 35, y: 125, width: 110, height: 50 }, b: { x: 310, y: 40, width: 110, height: 50 }, c: { x: 310, y: 225, width: 110, height: 50 } };
const ports: FlowPort[] = [
    { nodeId: 'a', portId: 'result', position: { x: 145, y: 150 }, direction: 'output', side: 'right' },
    { nodeId: 'b', portId: 'input', position: { x: 310, y: 65 }, direction: 'input', side: 'left' },
    { nodeId: 'c', portId: 'input', position: { x: 310, y: 250 }, direction: 'input', side: 'left' },
];
interface Document { edges: FlowConnectionEdge[]; manual: Record<string, Pt[]> }
const initial: Document = { edges: [{ id: 'edge', source: ports[0], target: ports[1] }], manual: {} };

export default function EditingDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState([initial]);
    const document = history[history.length - 1];
    const [selected, setSelected] = useState<string | null>('edge');
    const [viewport, setViewport] = useState<ViewportState>({ zoom: 1, panX: 0, panY: 0 });
    const [readonly, setReadonly] = useState(false);
    const commit = (next: Document) => setHistory([...history, next]);
    const connect = (change: FlowConnectionChange) => {
        const id = change.edgeId ?? crypto.randomUUID(), manual = { ...document.manual };
        delete manual[id];
        const edge = { id, source: change.source, target: change.target };
        commit({ edges: change.edgeId ? document.edges.map(previous => previous.id === id ? edge : previous) : [...document.edges, edge], manual });
        setSelected(id);
    };
    const routes = Object.fromEntries(document.edges.map(edge => {
        const source = ports.find(port => sameEndpoint(port, edge.source))!, target = ports.find(port => sameEndpoint(port, edge.target))!;
        return [edge.id, { points: document.manual[edge.id] ?? makeEditableRoute(routeEdge({ exit: source.position, exitSide: source.side, entry: target.position, entrySide: target.side }, [])) }];
    }));
    const editor = useFlowConnections({ ports, edges: document.edges, routes, nodeRects, selectedEdgeId: selected, containerRef, viewport, revision: document, disabled: readonly,
        validateConnection: change => document.edges.some(edge => edge.id !== change.edgeId && sameEndpoint(edge.source, change.source) && sameEndpoint(edge.target, change.target)) ? '这两个端口已连接' : null,
        onConnect: connect,
        onRouteChange: ({ edgeId, points }) => {
            const manual = { ...document.manual };
            if (points) manual[edgeId] = points; else delete manual[edgeId];
            commit({ ...document, manual });
        },
    });
    const pending = editor.interaction?.kind === 'connection' ? editor.interaction : null;
    return <>
        <div className={toolbar}>
            <button type="button" disabled={readonly} onClick={() => connect({ edgeId: 'edge', source: ports[0], target: ports[2] })}>改接到 C</button>
            <button type="button" disabled={readonly || !selected} onClick={() => selected && editor.resetRoute(selected)}>恢复自动走线</button>
            <button type="button" disabled={readonly || history.length < 2} onClick={() => { editor.cancelInteraction(); setHistory(history.slice(0, -1)); }}>撤销</button>
            <label><input type="checkbox" checked={readonly} onChange={event => setReadonly(event.target.checked)} />只读</label>
            <span role="status">{editor.problem || `已提交 ${history.length - 1} 次操作`}</span>
        </div>
        <div className={scroll} role="region" aria-label="连线编辑画布" tabIndex={0}>
            <div ref={containerRef} tabIndex={-1} {...editor.handlers}>
                <Canvas width={480} height={320} onEmptyClick={() => setSelected(null)}>
                    <Viewport {...viewport} onViewportChange={setViewport} pannable={!editor.interaction} zoomable={!editor.interaction}>
                        <InfiniteGrid />
                        {Object.entries(editor.routes).map(([id, route]) => <FlowEdge key={id} points={route.points} lineWidth={selected === id ? 3 : 1.5} onClick={() => setSelected(id)} />)}
                        {Object.entries(nodeRects).map(([id, rect]) => <FlowNode key={id} {...rect} label={id.toUpperCase()} />)}
                        {ports.map(port => <Circle key={port.nodeId} cx={port.position.x} cy={port.position.y} r={6 / viewport.zoom} fill={palette.nodeFill} stroke={palette.edge} strokeWidth={2 / viewport.zoom} zIndex={5} />)}
                        {pending && <FlowEdge points={[pending.fixed.position, pending.target?.position ?? pending.point]} dashLength={5} gapLength={4} zIndex={6} arrowEnd={false} />}
                    </Viewport>
                </Canvas>
            </div>
        </div>
    </>;
}
