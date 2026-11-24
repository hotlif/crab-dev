import { useEffect, useId, useRef, useState } from "react";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Breadcrumbs from "@crab-dev/rc-breadcrumbs";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { NavigationPrototype } from "./navigationPrototype.js";

const path = [
    { id: "projects", name: "工程项目", detail: "北区运维工作区。" },
    { id: "north", name: "北区输水站改造", detail: "管理本次改造的设备和子系统。" },
    { id: "pump", name: "高压输送设备子系统", detail: "此子系统保留设备、巡检和检修记录。" },
    { id: "device", name: "高压循环输送泵与远程监测设备 P-104", detail: "现场编号 P-104，工作状态正常。" },
    { id: "report", name: "11 月 23 日巡检记录", detail: "已复核入口压力与瞬时流量。" },
];
const notes = {
    md3: "MD3 用当前页字重、着色链接和克制的分隔维持层级。长路径折叠后仍可查看和选择完整层级。",
    macos: "macOS 使用紧凑的路径条，内容标题独立于导航。打开完整路径时保持当前记录上下文。",
    shadcn: "shadcn/ui 采用轻量分隔、次要上级链接和清楚的当前位置标记。",
};

export default function BreadcrumbsPrototype() {
    const { designSystem } = useConfig();
    const fullPathId = useId();
    const heading = useRef<HTMLHeadingElement>(null);
    const shouldFocus = useRef(false);
    const [index, setIndex] = useState(path.length - 1);
    const [expanded, setExpanded] = useState(false);
    const active = path[index];

    useEffect(() => {
        if (!shouldFocus.current) return;
        shouldFocus.current = false;
        heading.current?.focus();
    }, [index]);

    function navigate(nextIndex: number) {
        if (nextIndex === index) return;
        shouldFocus.current = true;
        setIndex(nextIndex);
        setExpanded(false);
    }

    return <NavigationPrototype route="breadcrumbs" title="Breadcrumbs 面包屑导航" scene="工程目录"
        description="从巡检记录返回设备、子系统或项目，切换窄屏查看路径折叠。"
        note={notes[designSystem]} rules={[
            ["当前位置", "末项显示当前页并标记 aria-current。内容区标题保持完整文件名。"],
            ["折叠路径", "窄屏保留项目入口与当前页，中间层级压缩。完整路径提供每个上级入口。"],
            ["键盘顺序", "Tab 按层级顺序经过上级入口。打开完整路径后可以继续 Tab 进入路径选项。"],
            ["导航后焦点", "切换到上级或下级后焦点进入新内容标题，便于继续浏览。"],
        ]}>
        <AutoSizer defaultWidth={360} disableHeight>
            {({ width }) => <Breadcrumbs aria-label="工程位置" maxCount={width < 640 ? 3 : undefined}
                items={path.slice(0, index + 1).map((entry, position) => ({
                    key: entry.id,
                    title: entry.name,
                    onClick: () => navigate(position),
                }))} />}
        </AutoSizer>
        {index > 1 && <Button size="s" appearance="text" aria-expanded={expanded} aria-controls={expanded ? fullPathId : undefined}
            onClick={() => setExpanded(!expanded)}>{expanded ? "收起完整路径" : "查看完整路径"}</Button>}
        {expanded && <ol id={fullPathId} className="crab-navigation-list" aria-label="完整项目路径">
            {path.slice(0, index + 1).map((entry, position) => <li key={entry.id}>
                {position === index ? <span aria-current="page">{entry.name}</span> :
                    <Button appearance="text" size="s" onClick={() => navigate(position)}>
                        <span className="crab-navigation-wrap-label">{entry.name}</span>
                    </Button>}
            </li>)}
        </ol>}
        <div className="crab-navigation-tab-body">
            <h3 tabIndex={-1} ref={heading} data-project-place>{active.name}</h3>
            <p>{active.detail}</p>
            {index < path.length - 1 && <Button appearance="outlined" size="s" onClick={() => navigate(index + 1)}>
                <span className="crab-navigation-wrap-label">打开{path[index + 1].name}</span>
            </Button>}
        </div>
    </NavigationPrototype>;
}
