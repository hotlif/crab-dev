import { type KeyboardEvent, useState } from "react";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import { getViewportForBounds, zoomViewport, type ViewportState } from "@crab-dev/rc-canvas";
import { useConfig } from "@crab-dev/rc-config-provider";
import FlowDiagram, { FlowEdge, FlowNode, type ElkLayoutEdge } from "@crab-dev/rc-flow-diagram";
import token from "@crab-dev/rc-token-semantic";
import { EditorPrototype } from "./editorPrototype.js";

const nodes = [
    { id: "sensor", label: "流量采集", width: 104, height: 45 },
    { id: "service", label: "指标校验", width: 104, height: 45 },
    { id: "operator", label: "工单队列", width: 104, height: 45 },
];
const initialEdges: ElkLayoutEdge[] = [{ id: "sensor-service", source: "sensor", target: "service" }];
const desktopPositions = { sensor: { x: 20, y: 100 }, service: { x: 175, y: 100 }, operator: { x: 330, y: 100 } };
const narrowPositions = { sensor: { x: 75, y: 14 }, service: { x: 75, y: 108 }, operator: { x: 75, y: 202 } };
const height = 270;

function Workflow({ width, empty }: { width: number; empty: boolean }) {
    const { designSystem } = useConfig();
    const [edges, setEdges] = useState(initialEdges);
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    const [selected, setSelected] = useState("sensor");
    const [source, setSource] = useState<string | null>(null);
    const [highlight, setHighlight] = useState<string | null>(null);
    const [manual, setManual] = useState<ViewportState | null>(null);
    const [notice, setNotice] = useState("");
    const compact = width < 500;
    const defaults = compact ? narrowPositions : desktopPositions;
    const positionsOnScreen = { ...defaults, ...positions };
    const fitted = getViewportForBounds(compact
        ? { x: 60, y: 0, width: 140, height: 260 }
        : { x: 0, y: 56, width: 455, height: 136 }, { width, height }, { padding: 12, maxZoom: 1.2 });
    const viewport = manual ?? fitted ?? { zoom: 1, panX: 0, panY: 0 };
    const nodeName = (id: string) => nodes.find((node) => node.id === id)?.label ?? id;

    function select(id: string) {
        setSelected(id);
        setHighlight(null);
        setNotice(`已选中${nodeName(id)}。`);
    }

    function connect() {
        if (!source) return;
        const target = selected;
        if (source === target) {
            setNotice("无法连接到同一节点，请选择下游节点。");
            return;
        }
        if (nodes.findIndex(({ id }) => id === source) > nodes.findIndex(({ id }) => id === target)) {
            setNotice("数据从采集流向工单，当前连线方向无效。");
            return;
        }
        const id = `${source}-${target}`;
        if (edges.some((edge) => edge.id === id)) {
            setNotice("这两个节点已有连线。");
            return;
        }
        setEdges((current) => [...current, { id, source, target }]);
        setHighlight(id);
        setNotice(`${nodeName(source)}已连接到${nodeName(target)}。`);
        setSource(null);
    }

    function move(id: string, dx: number, dy: number) {
        setPositions((current) => {
            const prior = current[id] ?? defaults[id as keyof typeof defaults];
            return { ...current, [id]: { x: Math.min(465, Math.max(0, prior.x + dx)), y: Math.min(230, Math.max(0, prior.y + dy)) } };
        });
    }

    function keyboardMove(event: KeyboardEvent<HTMLButtonElement>, id: string) {
        const offsets = { ArrowUp: [0, -12], ArrowDown: [0, 12], ArrowLeft: [-12, 0], ArrowRight: [12, 0] };
        const offset = offsets[event.key as keyof typeof offsets];
        if (!offset) return;
        event.preventDefault();
        move(id, offset[0], offset[1]);
        select(id);
        setNotice(`${nodeName(id)}位置已调整。`);
    }

    return <>
        <div className="crab-editor-actions">
            <Button size="s" appearance="outlined" onClick={() => setManual(zoomViewport(viewport, Math.min(2.5, viewport.zoom * 1.2), { x: width / 2, y: height / 2 }))}>放大流程</Button>
            <Button size="s" appearance="text" onClick={() => setManual(null)}>定位全图</Button>
            {!empty && <>
                <Button size="s" appearance="tonal" onClick={() => {
                    setSource(selected);
                    setNotice(`已设为起点，${nodeName(selected)}。`);
                }}>设为连线起点</Button>
                <Button size="s" appearance="primary" disabled={!source} onClick={connect}>连接到选中节点</Button>
            </>}
        </div>
        <div className="crab-editor-viewport" aria-label="设备数据流程图" role="region"
            data-flow-zoom={Math.round(viewport.zoom * 100)} data-flow-pan-x={viewport.panX} data-flow-pan-y={viewport.panY}
            data-flow-count={empty ? 0 : edges.length}>
            <FlowDiagram width={width} height={height} layoutMode="manual" nodes={empty ? [] : nodes} edges={empty ? [] : edges}
                nodePositions={positionsOnScreen} viewport={viewport} onViewportChange={setManual}
                onEmptyClick={() => { setHighlight(null); setNotice("已退出连线查看。"); }}>
                {({ nodeRects, routes, crossings, palette }) => <>
                    {empty ? null : edges.flatMap((edge) => {
                        const route = routes[edge.id];
                        return route ? [<FlowEdge key={edge.id} points={route.points} crossings={crossings[edge.id]}
                            lineWidth={highlight === edge.id ? 3 : 1.5} onClick={() => {
                                setHighlight(edge.id);
                                setNotice(`${nodeName(edge.source)}到${nodeName(edge.target)}的连线。`);
                            }} />] : [];
                    })}
                    {!empty && nodes.map((node) => <FlowNode key={node.id} {...nodeRects[node.id]} label={node.label}
                        radius={designSystem === "md3" ? 13 : 6} draggable
                        fill={selected === node.id ? token.color.surface.high : palette.nodeFill}
                        stroke={selected === node.id ? token.color.border.focus : palette.nodeStroke}
                        labelColor={selected === node.id ? token.color.text.primary : palette.nodeLabel}
                        strokeWidth={selected === node.id ? 3 : 1}
                        onClick={() => select(node.id)} onDrag={(dx, dy) => move(node.id, dx, dy)} onDragEnd={() => {
                            setSelected(node.id);
                            setNotice(`${node.label}位置已调整。`);
                        }} />)}
                </>}
            </FlowDiagram>
        </div>
        {!empty && <div className="crab-editor-actions" role="group" aria-label="流程节点">
            {nodes.map((node) => <Button key={node.id} size="s" className="crab-editor-node" data-node-x={Math.round(positionsOnScreen[node.id as keyof typeof defaults].x)}
                appearance={selected === node.id ? "tonal" : "text"} aria-pressed={selected === node.id} onKeyDown={(event) => keyboardMove(event, node.id)}
                onClick={() => select(node.id)}>{node.label}</Button>)}
        </div>}
        <p className="crab-editor-status crab-editor-view-status" role="status" data-flow-status>
            {empty ? "当前流程没有节点。恢复示例可继续操作。" : notice || `已选中${nodeName(selected)}。共 ${edges.length} 条连线。`}
        </p>
    </>;
}

export default function FlowDiagramPrototype() {
    const [empty, setEmpty] = useState(false);
    return <EditorPrototype route="flow-diagram" title="FlowDiagram 节点与连线" description="选择、移动和连接设备数据处理节点，检查无效连线反馈。"
        scene="设备数据到巡检工单" rules={[
            ["选择与焦点", "点击节点或键盘进入节点按钮可选择对象。焦点环与节点描边都能看到，状态区同步显示对象。"],
            ["拖动与键盘", "拖动节点后重新计算线路。聚焦节点按钮再用方向键也能移动。放大流程和定位全图始终可直接使用。"],
            ["连接反馈", "先选择起点，再选下游节点。连接自身、反向或重复连接会给出原因并保留已存在的线路。"],
            ["主题差异", "MD3 使用着色节点和大圆角，macOS 用紧凑布局与细线，shadcn/ui 用中性表面和清晰方向线。"],
        ]}>
        <div className="crab-editor-actions">
            <Button size="s" appearance="outlined" onClick={() => setEmpty(!empty)}>{empty ? "恢复示例流程" : "查看空流程"}</Button>
        </div>
        <AutoSizer disableHeight defaultWidth={480}>{({ width }) => <Workflow width={width} empty={empty} />}</AutoSizer>
    </EditorPrototype>;
}
