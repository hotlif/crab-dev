import { useId, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@crab-dev/rc-button";
import { ConfigBoundary, useConfig } from "@crab-dev/rc-config-provider";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import LineEdit from "@crab-dev/rc-line-edit";
import { OverlayPrototype, usePositionedFocus } from "./overlayPrototype.js";

const edges = [
    { key: "top-start", text: "左上角" },
    { key: "top-end", text: "右上角" },
    { key: "bottom-start", text: "左下角" },
    { key: "bottom-end", text: "右下角" },
] as const;
const notes = {
    md3: "MD3 以着色弹层区分工具内容与页面，柔和的展开反馈跟随最终放置方向。",
    macos: "macOS 浮层紧凑，表面和阴影向桌面弹出面板靠拢，焦点边界清晰。",
    shadcn: "shadcn/ui 浮层用中性描边和小圆角承载工具，触发器和正文保持视觉独立。",
};

function Trigger({ id, fixed }: { id: string; fixed: boolean }) {
    const { state, refs, dispatch } = useDropdownContext<HTMLButtonElement>();
    return <Button ref={refs.setReference} id={`${id}-trigger`} size="s" appearance="outlined" aria-haspopup="dialog"
        aria-expanded={state.open} aria-controls={state.open ? id : undefined}
        onClick={event => dispatch({ type: "setOpen", payload: !state.open, details: { reason: "trigger", event: event.nativeEvent } })}>
        {fixed ? "测试浮层" : "打开巡检工具"}
    </Button>;
}

function Inspector({ id, draft, update }: { id: string; draft: string; update: (next: string) => void }) {
    const { state, dispatch } = useDropdownContext();
    const field = usePositionedFocus<HTMLInputElement>(state.open);
    return <div className="crab-overlay-inspector">
        <h3>巡检工具</h3>
        <LineEdit ref={field} label="临时筛选词" value={draft} onValueChange={update} size="small" allowClear />
        <p>滚动或缩窄窗口。浮层会根据可用空间翻转，筛选词保留。</p>
        <Button size="s" appearance="text" onClick={event => {
            event.currentTarget.ownerDocument.getElementById(`${id}-trigger`)?.focus();
            dispatch({ type: "setOpen", payload: false, details: { reason: "trigger", event: event.nativeEvent } });
        }}>收起巡检工具</Button>
    </div>;
}

export default function DropdownPrototype() {
    const { designSystem } = useConfig();
    const panelId = useId();
    const [edge, setEdge] = useState<{ key: (typeof edges)[number]["key"]; host: HTMLElement } | null>(null);
    const [draft, setDraft] = useState("");
    const [message, setMessage] = useState("");
    const tools = <DropdownContainer closeOnFocusOut floatingContainerProps={{ id: panelId, role: "dialog", "aria-label": "巡检工具" }}
        onOpenChange={(open, details) => {
            if (!open) setMessage({
                escape: "已收起，焦点返回触发器。",
                "outside-press": "点击外部，浮层已收起。",
                "focus-out": "焦点离开浮层，已收起。",
                trigger: "巡检工具已收起。",
            }[details.reason]);
            else setMessage("");
        }} overlay={<Inspector id={panelId} draft={draft} update={setDraft} />}>
        <Trigger id={panelId} fixed={edge !== null} />
    </DropdownContainer>;
    return <OverlayPrototype route="dropdown-container" title="DropdownContainer 浮层容器" scene="巡检工具栏"
        description="把触发器移到视口四角，检查实测定位、滚动、外部点击和 Escape。"
        note={notes[designSystem]} rules={[
            ["定位", "首选触发器下方，碰到视口边缘时翻转或平移。高内容按可用空间滚动。"],
            ["焦点", "工具打开后聚焦筛选框。Escape 收起并返回触发器；点击外部或将焦点移出时收起，保留目标焦点。"],
            ["状态", "关闭和重开保留输入。滚动和改变窗口宽度会重新计算浮层位置。"],
            ["语义边界", "容器负责位置和关闭条件，面板自己声明角色。命令项的键盘语义由 Menu 决定，选值语义由 Select 决定。"],
        ]}>
        <p>常规位置便于滚动测试。选择一个角落后，触发按钮固定到对应视口边缘。</p>
        <div className="crab-overlay-actions" role="group" aria-label="触发器位置">
            <Button size="s" appearance="outlined" aria-pressed={edge === null} onClick={() => setEdge(null)}>常规位置</Button>
            {edges.map(position => <Button key={position.key} size="s" appearance="outlined" aria-pressed={edge?.key === position.key}
                onClick={event => setEdge({ key: position.key, host: event.currentTarget.ownerDocument.body })}>{position.text}</Button>)}
        </div>
        <div className="crab-overlay-edge-slot">
            {edge
                ? createPortal(<ConfigBoundary className="crab-overlay-edge-wrapper" data-edge={edge.key}>{tools}</ConfigBoundary>, edge.host)
                : tools}
            {edge && <p className="crab-overlay-support">触发器位于{edges.find(position => position.key === edge.key)?.text}。</p>}
        </div>
        <Button size="s" appearance="text" onClick={() => setMessage("浮层外的操作已执行。")}>浮层外操作</Button>
        <p className="crab-overlay-support" role="status">{message}</p>
    </OverlayPrototype>;
}
