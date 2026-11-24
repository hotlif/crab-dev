import { useState } from "react";
import AppMainLayout, { AppMainLayoutProvider, useAppMainLayoutTabs, type TabItem } from "@crab-dev/rc-app-main-layout";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import { MenuItemType, type MenuItem } from "@crab-dev/rc-menu";
import { LayoutPrototype } from "./layoutPrototype.js";

const devices = [
    { id: "P-104", label: "北区输水泵", state: "运行正常", note: "入口压力 0.62 MPa。" },
    { id: "V-019", label: "进水调节阀", state: "待复核", note: "开度反馈需现场核实。" },
    { id: "M-032", label: "压力监测仪", state: "运行正常", note: "采样间隔为 30 秒。" },
];
const times = [
    "14:20", "13:50", "13:20", "12:50", "12:20", "11:50", "11:20", "10:50", "10:20",
    "09:50", "09:20", "08:50", "08:20", "07:50", "07:20", "06:50", "06:20", "05:50",
];
const menu: MenuItem[] = [
    { type: MenuItemType.Item, key: "devices", title: "设备台账" },
    { type: MenuItemType.Item, key: "jobs", title: "巡检任务" },
    { type: MenuItemType.Item, key: "settings", title: "工作区设置" },
];
const loadMenu = () => Promise.resolve(menu);
const loadOperator = () => Promise.resolve({ name: "林月", roleName: "当班工程师" });
const notes = {
    md3: "MD3 用低层背景、导航表面和当前项强调区分全局与内容。详情在窄屏移到列表下方。",
    macos: "macOS 用紧凑侧栏、顶部工具区和细分隔呈现工程工作台。说明与操作聚焦于当前设备。",
    shadcn: "shadcn/ui 通过中性侧栏、描边列表和简单标题区呈现工作台层级，窄屏保持动作可达。",
};

function DevicePage() {
    const [selected, setSelected] = useState(devices[0]);
    return <div className="crab-layout-page">
        <h3>设备台账</h3>
        <div className="crab-layout-workspace-columns">
            <ul className="crab-layout-list" role="list" aria-label="可查看设备">
                {devices.map(device => <li key={device.id}>
                    <Button size="s" appearance={selected.id === device.id ? "tonal" : "text"}
                        aria-pressed={selected.id === device.id} onClick={() => setSelected(device)}>
                        {device.id} {device.label}
                    </Button>
                </li>)}
            </ul>
            <section className="crab-layout-detail" aria-label="当前设备详情">
                <h4>{selected.label}</h4>
                <p>{selected.state} · {selected.note}</p>
            </section>
        </div>
        <h4>运行快照</h4>
        <ul className="crab-layout-list" role="list" aria-label="运行快照">
            {times.map(time => <li key={time}>{time} · {selected.id} 状态采样</li>)}
        </ul>
    </div>;
}

const pages: TabItem[] = [
    { key: "devices", title: "设备台账", closable: false, children: <DevicePage /> },
    { key: "jobs", title: "巡检任务", children: <div className="crab-layout-page">
        <h3>巡检任务</h3><p>下一次复测将在夜间交接后开始。</p>
        <LineEdit label="巡检备注" appearance="outlined" defaultValue="检查入口压差" />
    </div> },
    { key: "settings", title: "工作区设置", children: <div className="crab-layout-page">
        <h3>工作区设置</h3><LineEdit label="工作区名称" appearance="outlined" defaultValue="北区泵站" />
    </div> },
];

function Workspace() {
    const { openTab } = useAppMainLayoutTabs();
    return <AppMainLayout sidebarTitle="巡检工作台" sidebarLoadMenus={loadMenu} headerLoadUser={loadOperator}
        fullscreenable={false} contentLandmark={{ role: "region", "aria-label": "工作台内容" }}
        onSidebarMenuItemClick={({ item }) => {
            const page = pages.find(entry => entry.key === item.key);
            if (page) openTab(page);
        }} />;
}

export default function AppMainLayoutPrototype() {
    const { designSystem } = useConfig();
    return <LayoutPrototype route="app-main-layout" title="AppMainLayout 应用主布局" scene="北区巡检工作台"
        description="通过侧栏和页签进入设备、任务与设置，核对设备详情和窄屏导航。"
        note={notes[designSystem]} rules={[
            ["全局与详情", "侧栏切换工作区，顶部保留账户和页签。当前设备详情留在内容区内。"],
            ["滚动", "长运行快照在工作台内容区滚动。导航与顶部操作保持可达。"],
            ["宽度断点", "宽屏保留侧栏。视口宽度低于 768 像素时，导航通过顶部按钮打开。详情移到设备列表下方。"],
            ["焦点与草稿", "导航可以用键盘进入与退出。切换已打开的页签，巡检备注仍可继续编辑。"],
        ]}>
        <div className="crab-layout-workspace">
            <AppMainLayoutProvider initialTabs={[pages[0]]}><Workspace /></AppMainLayoutProvider>
        </div>
    </LayoutPrototype>;
}
