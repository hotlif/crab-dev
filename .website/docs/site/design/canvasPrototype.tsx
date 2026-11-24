import { type KeyboardEvent, useEffect, useState } from "react";
import Alert from "@crab-dev/rc-alert";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import Canvas, { InfiniteGrid, Line, Rect, Text, Viewport, getViewportForBounds, zoomViewport, type ViewportState } from "@crab-dev/rc-canvas";
import { useConfig } from "@crab-dev/rc-config-provider";
import Spin from "@crab-dev/rc-spin";
import token from "@crab-dev/rc-token-semantic";
import { EditorPrototype } from "./editorPrototype.js";

const equipment = [
    { id: "pump", name: "输水泵", x: 34, y: 70, width: 106 },
    { id: "valve", name: "调节阀", x: 172, y: 70, width: 106 },
    { id: "meter", name: "流量计", x: 103, y: 162, width: 106 },
];
const contentBounds = { x: 16, y: 32, width: 280, height: 206 };
const height = 268;
type Mode = "pan" | "select";
type Phase = "ready" | "empty" | "loading" | "error";

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(min, value), max);
}

function PlantCanvas({ width, phase }: { width: number; phase: "ready" | "empty" }) {
    const { designSystem } = useConfig();
    const [manual, setManual] = useState<ViewportState | null>(null);
    const [mode, setMode] = useState<Mode>("pan");
    const [selected, setSelected] = useState<string | null>(null);
    const center = { x: width / 2, y: height / 2 };
    const fitted = getViewportForBounds(contentBounds, { width, height }, { padding: 10, minZoom: .5, maxZoom: 1 }) ?? { zoom: 1, panX: 0, panY: 0 };
    const viewport = manual ?? fitted;
    const chosen = equipment.find(({ id }) => id === selected);
    const zoom = Math.round(viewport.zoom * 100);

    function update(next: ViewportState) {
        setManual({ zoom: clamp(next.zoom, .5, 2), panX: clamp(next.panX, -530, width - 32), panY: clamp(next.panY, -395, height - 32) });
    }

    function magnify(multiplier: number) {
        update(zoomViewport(viewport, clamp(viewport.zoom * multiplier, .5, 2), center));
    }

    function keyDown(event: KeyboardEvent<HTMLDivElement>) {
        const motion = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] };
        const delta = motion[event.key as keyof typeof motion];
        if (delta) update({ ...viewport, panX: viewport.panX + delta[0], panY: viewport.panY + delta[1] });
        else if (event.key === "+" || event.key === "=") magnify(1.2);
        else if (event.key === "-") magnify(1 / 1.2);
        else if (event.key === "0") setManual(null);
        else if (event.key === "Escape") setSelected(null);
        else return;
        event.preventDefault();
    }

    return <>
        <div className="crab-editor-actions">
            <Button size="s" appearance={mode === "pan" ? "tonal" : "text"} aria-pressed={mode === "pan"} onClick={() => setMode("pan")}>平移画布</Button>
            <Button size="s" appearance={mode === "select" ? "tonal" : "text"} aria-pressed={mode === "select"} onClick={() => setMode("select")}>选择对象</Button>
            <Button size="s" appearance="outlined" disabled={zoom <= 50} onClick={() => magnify(1 / 1.2)}>缩小</Button>
            <Button size="s" appearance="outlined" disabled={zoom >= 200} onClick={() => magnify(1.2)}>放大</Button>
            <Button size="s" appearance="text" onClick={() => setManual(null)}>适应视图</Button>
        </div>
        <div className="crab-editor-viewport" tabIndex={0} role="region" aria-label="泵站布置画布"
            onKeyDown={keyDown} data-canvas-zoom={zoom} data-canvas-pan-x={Math.round(viewport.panX)}>
            <Canvas width={width} height={height} tabIndex={-1} aria-hidden="true" onEmptyClick={() => setSelected(null)}>
                <Viewport {...viewport} minZoom={.5} maxZoom={2} onViewportChange={update} mode={mode}>
                    <InfiniteGrid baseSpacing={40} subdivisions={4} />
                    {phase === "ready" && <>
                        <Line x1={140} y1={90} x2={172} y2={90} color={token.color.text.secondary} lineWidth={2} />
                        <Line x1={86} y1={110} x2={86} y2={181} color={token.color.text.secondary} lineWidth={2} />
                        <Line x1={86} y1={181} x2={103} y2={181} color={token.color.text.secondary} lineWidth={2} />
                        {equipment.map((item) => <Rect key={item.id} x={item.x} y={item.y} width={item.width} height={42}
                            radius={designSystem === "md3" ? 14 : 6} fill={selected === item.id ? token.color.surface.high : token.color.surface.low}
                            stroke={selected === item.id ? token.color.border.focus : token.color.border.default} strokeWidth={selected === item.id ? 3 : 1}
                            cursor={mode === "select" ? "pointer" : undefined} onClick={mode === "select" ? () => setSelected(item.id) : undefined} />)}
                        {equipment.map((item) => <Text key={item.id} x={item.x + item.width / 2} y={item.y + 21}
                            textAlign="center" textBaseline="middle" mode="auto" fill={token.color.text.primary} fontSize={15}>{item.name}</Text>)}
                    </>}
                </Viewport>
            </Canvas>
        </div>
        {phase === "empty" ? <p className="crab-editor-status" role="status">画布中还没有对象。</p>
            : <div className="crab-editor-actions" aria-label="可选对象">
                {equipment.map(({ id, name }) => <Button key={id} size="s" appearance={id === selected ? "tonal" : "text"} aria-pressed={id === selected}
                    onClick={() => { setMode("select"); setSelected(id); }}>{name}</Button>)}
            </div>}
        <p className="crab-editor-hint crab-editor-view-status" role="status" data-canvas-status>
            {mode === "pan" ? "平移" : "选择"}模式 · {zoom}% · {chosen && phase === "ready" ? `已选择${chosen.name}` : "未选对象"}
        </p>
    </>;
}

export default function CanvasPrototype() {
    const [phase, setPhase] = useState<Phase>("ready");
    useEffect(() => {
        if (phase !== "loading") return;
        const timer = setTimeout(() => setPhase("ready"), 760);
        return () => clearTimeout(timer);
    }, [phase]);

    return <EditorPrototype route="canvas" title="Canvas 工程画布" description="用指针和键盘平移、缩放和定位泵站设备。"
        scene="泵站设备布置图" rules={[
            ["操作模式", "平移模式支持拖动空白。选择模式可以点击设备，也可从对象按钮中直接选择。当前模式和选中对象都有文字反馈。"],
            ["键盘与边界", "Tab 进入画布后，方向键平移，加减键缩放，0 恢复适应视图，Esc 清除选择。缩放限制为 50% 至 200%。"],
            ["状态恢复", "空画布继续保留网格。初始化期间显示加载进度，读取异常提供重试。"],
            ["主题差异", "MD3 使用着色表面和较圆的节点，macOS 使用紧凑边界，shadcn/ui 以中性表面突出当前对象。"],
        ]}>
        <div className="crab-editor-actions">
            <Button size="s" appearance="primary" loading={phase === "loading"} onClick={() => setPhase("loading")}>读取示例布置图</Button>
            <Button size="s" appearance="outlined" onClick={() => setPhase("empty")}>新建空白画布</Button>
            <Button size="s" appearance="text" onClick={() => setPhase("error")}>模拟初始化失败</Button>
        </div>
        {phase === "error" && <div className="crab-editor-placeholder">
            <Alert type="error" title="无法初始化布置图">示例模型读取失败，重新读取可恢复画布。</Alert>
        </div>}
        {phase === "loading" && <div className="crab-editor-placeholder"><Spin tip="正在初始化工程画布" /></div>}
        {(phase === "ready" || phase === "empty") && <AutoSizer disableHeight defaultWidth={460}>
            {({ width }) => <PlantCanvas key={phase} width={width} phase={phase} />}
        </AutoSizer>}
    </EditorPrototype>;
}
