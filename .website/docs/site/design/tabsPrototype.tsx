import { useState } from "react";
import { useConfig } from "@crab-dev/rc-config-provider";
import Switch from "@crab-dev/rc-switch";
import Tabs from "@crab-dev/rc-tabs";
import TextEdit from "@crab-dev/rc-text-edit";
import { NavigationPrototype } from "./navigationPrototype.js";

const designs = {
    md3: { type: "line", size: "medium", note: "MD3 使用位置稳定的下划线标记当前区域。只有激活时才替换面板。" },
    macos: { type: "pill", size: "small", note: "macOS 使用紧凑的桌面页签样式，活动项有独立表面，允许切换后回到草稿。" },
    shadcn: { type: "card", size: "medium", note: "shadcn/ui 使用中性背景和清晰的焦点环，页签区与正文保持视觉层级。" },
} as const;
const records = [
    { time: "11 月 23 日 14:20", text: "入口压力 0.62 MPa，采样连续。" },
    { time: "11 月 23 日 10:10", text: "西区流量计已完成零点复核。" },
    { time: "11 月 22 日 18:30", text: "循环泵完成日末停机巡检。" },
];

export default function TabsPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const [active, setActive] = useState("config");
    const [draft, setDraft] = useState("接班后检查入口压力。");
    const [onlyToday, setOnlyToday] = useState(false);
    return <NavigationPrototype route="tabs" title="Tabs 页签" scene="北区输水泵"
        description="在设备配置、运行记录和检修历史间切换，检查页签焦点、溢出和草稿。"
        note={design.note} rules={[
            ["内容边界", "同一设备内的并列内容使用页签，切换时保持设备标题和设备编号。"],
            ["键盘", "方向键、Home 和 End 移动焦点并立即切换面板。Tab 离开页签条后，选中项继续标记当前位置。"],
            ["窄屏", "页签条自身滚动。长标签保持可读，键盘移动时带出对应页签。"],
            ["面板状态", "在配置改备注，切到运行记录设置筛选，再返回。两边的编辑都保留。"],
        ]}>
        <div className="crab-navigation-heading"><h3>设备 P-104</h3><span>北区泵站</span></div>
        <Tabs value={active} onValueChange={setActive} size={design.size} type={design.type} items={[
            { key: "config", label: "配置", children: <div className="crab-navigation-tab-body">
                <TextEdit label="交接草稿" appearance="outlined" value={draft} rows={4} resize="none" onValueChange={setDraft} />
            </div> },
            { key: "activity", label: "运行记录", children: <div className="crab-navigation-tab-body">
                <Switch checked={onlyToday} onCheckedChange={setOnlyToday}>仅看今天</Switch>
                <ul role="list" className="crab-navigation-list" aria-label="运行记录">
                    {records.filter((_, index) => !onlyToday || index < 2).map(record =>
                        <li key={record.time}><strong>{record.time}</strong><p>{record.text}</p></li>)}
                </ul>
            </div> },
            { key: "history", label: "交接与历次设备检修记录", children: <div className="crab-navigation-tab-body">
                <h3>最近检修</h3><p>11 月 12 日更换循环泵滤网，并复测入口压差。</p>
            </div> },
            { key: "permission", label: "权限设置", disabled: true },
        ]} />
    </NavigationPrototype>;
}
