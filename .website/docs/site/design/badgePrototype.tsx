import { useState } from "react";
import Badge from "@crab-dev/rc-badge";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { ContentPrototype } from "./contentPrototype.js";

const counts = [0, 3, 99, 100, 1234];

export default function BadgePrototype() {
    const { designSystem } = useConfig();
    const [count, setCount] = useState(3);
    const [zero, setZero] = useState(false);
    const [active, setActive] = useState<"tasks" | "devices">("tasks");
    const [online, setOnline] = useState(true);
    const status = online ? "网关在线" : "网关离线";

    return <ContentPrototype route="badge" title="Badge 角标" description="切换零值、临界值和大数字，核对任务角标与设备状态点。"
        scene="巡检任务导航" rules={[
            ["计数", "0 默认隐藏，可打开零值显示。达到 99 仍显示完整数字，超过 99 统一显示 99+。"],
            ["准确数量", "导航按钮的可访问名称包含准确数字。角标装饰与导航共享同一入口，避免读屏重复读数。"],
            ["状态点", "有连接状态时在列表内容显示文字。状态点与文字一起呈现，颜色变化不会成为唯一线索。"],
            ["主题差异", "MD3 计数靠右并保持着色，macOS 缩小数字角标，shadcn/ui 使用清楚的描边与状态文字分组。"],
        ]}>
        <div className="crab-content-actions" aria-label="模拟未读计数">
            {counts.map((value) => <Button key={value} size="s" appearance={count === value ? "tonal" : "text"}
                aria-pressed={count === value} onClick={() => setCount(value)}>{value}</Button>)}
            <Button size="s" appearance="outlined" aria-pressed={zero} onClick={() => setZero(!zero)}>显示零值</Button>
        </div>
        <nav className="crab-content-nav" aria-label="任务和设备">
            <Button className="crab-content-unread-tab" appearance={active === "tasks" ? "primary" : "outlined"}
                aria-current={active === "tasks" ? "page" : undefined} aria-label={`巡检任务，未读 ${count} 条`}
                onClick={() => setActive("tasks")}>
                <span className="crab-content-actions">巡检任务
                    <Badge count={count} overflowCount={99} showZero={zero} size={designSystem === "macos" ? "small" : "default"}
                        aria-hidden="true" data-task-badge />
                </span>
            </Button>
            <Button appearance={active === "devices" ? "primary" : "outlined"} aria-current={active === "devices" ? "page" : undefined}
                aria-label={`设备中心，${status}`} onClick={() => setActive("devices")}>设备中心</Button>
        </nav>
        <div className="crab-content-region" aria-label={active === "tasks" ? "任务详情" : "设备详情"} role="region">
            <h3>{active === "tasks" ? "待处理巡检" : "泵站网关"}</h3>
            {active === "tasks" ? <p className="crab-content-status" role="status">当前未读 {count} 条</p>
                : <>
                    <Badge status={online ? "success" : "error"} text={status} />
                    <Button appearance="text" size="s" onClick={() => setOnline(!online)}>模拟{online ? "离线" : "恢复在线"}</Button>
                </>}
        </div>
    </ContentPrototype>;
}
