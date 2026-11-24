import { useState } from "react";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import SplitPane from "@crab-dev/rc-split-pane";
import { LayoutPrototype } from "./layoutPrototype.js";

const entries = [
    { id: "P-104", name: "北区输水泵", detail: "入口压力在正常范围内。", value: "0.62 MPa" },
    { id: "V-019", name: "二号进水调节阀", detail: "阀门保持打开。", value: "开度 60%" },
    { id: "M-032", name: "远程压力监测终端", detail: "等待下一次同步。", value: "30 秒采样" },
];
const designs = {
    md3: { step: 16, note: "MD3 用色彩清楚标记分隔条，拖动时始终保留两侧面板内容和键盘焦点。" },
    macos: { step: 12, note: "macOS 使用紧凑分隔和较细步进，便于在桌面环境逐步调节。" },
    shadcn: { step: 16, note: "shadcn/ui 以中性细线和抓手呈现分隔条，键盘焦点通过边界样式可见。" },
} as const;
const defaultWidth = 245;
const defaultHeight = 145;

export default function SplitPanePrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const [leftWidth, setLeftWidth] = useState(defaultWidth);
    const [topHeight, setTopHeight] = useState(defaultHeight);
    const [selected, setSelected] = useState(entries[0]);
    return <LayoutPrototype route="split-pane" title="SplitPane 分栏" scene="设备列表与详情"
        description="用拖拽、触控或键盘调整列表区大小，观察变窄后的上下分栏。"
        note={design.note} rules={[
            ["尺寸边界", "列表至少保留 158 像素宽或 105 像素高，详情留有可阅读区域。"],
            ["宽度变化", "容器窄于 510 像素时改为上下分栏，宽度与高度分别记忆。"],
            ["键盘与指针", "Tab 可到达分隔条。用方向键按当前主题步进调整，Enter 或双击恢复默认。"],
            ["辅助输入", "分隔条用 separator 语义报告方向和当前尺寸。旁边的恢复动作可用于触控。"],
        ]}>
        <AutoSizer defaultWidth={700} disableHeight>
            {({ width }) => {
                const compact = width < 510;
                const min = compact ? 105 : 158;
                const max = compact ? 226 : Math.min(392, Math.max(min, width - 220));
                const initial = compact ? defaultHeight : defaultWidth;
                const setSize = compact ? setTopHeight : setLeftWidth;
                const size = Math.min(max, Math.max(min, compact ? topHeight : leftWidth));
                return <div className="crab-layout-split-scope" data-split-direction={compact ? "vertical" : "horizontal"}>
                    <div className="crab-layout-actions">
                        <p className="crab-layout-secondary" data-split-reading>列表{compact ? "高度" : "宽度"} {size} px</p>
                        <Button size="s" appearance="text" onClick={() => setSize(initial)}>恢复默认</Button>
                    </div>
                    <SplitPane className="crab-layout-split-frame" direction={compact ? "vertical" : "horizontal"}
                        size={size} defaultSize={initial} min={min} max={max} step={design.step} onSizeChange={setSize}
                        aria-label="调整设备列表大小">
                        <div className="crab-layout-page"><h3>设备列表</h3><ul className="crab-layout-list" role="list">
                            {entries.map(entry => <li key={entry.id}><Button size="s" appearance="text"
                                aria-pressed={selected.id === entry.id} onClick={() => setSelected(entry)}>{entry.name}</Button></li>)}
                        </ul></div>
                        <div className="crab-layout-page"><h3>{selected.name}</h3><p>{selected.id} · {selected.value}</p><p>{selected.detail}</p></div>
                    </SplitPane>
                </div>;
            }}
        </AutoSizer>
    </LayoutPrototype>;
}
