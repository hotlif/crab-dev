import { useEffect, useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import { useConfig } from "@crab-dev/rc-config-provider";
import Tag from "@crab-dev/rc-tag";
import { ContentPrototype } from "./contentPrototype.js";

const details = {
    pump: { name: "北区输水泵详情", body: "P-104 当前运行平稳，最近一次采样为 14:20。检修责任班组为北区运行组。" },
    alarm: { name: "进水调节阀告警记录", body: "V-019 在 13:50 上报开度反馈偏差，已发至当班人员待复核。" },
};

export default function CardPrototype() {
    const { designSystem } = useConfig();
    const [active, setActive] = useState<keyof typeof details | null>(null);
    const [tracked, setTracked] = useState(false);
    const heading = useRef<HTMLHeadingElement>(null);
    const detail = active ? details[active] : null;
    const summaryVariant = designSystem === "md3" ? "elevated" : "outlined";
    const staticVariant = designSystem === "md3" ? "filled" : "outlined";
    const size = designSystem === "macos" ? "small" : "medium";

    useEffect(() => {
        if (active) heading.current?.focus();
    }, [active]);

    function open(key: keyof typeof details) {
        if (active === key) heading.current?.focus();
        else setActive(key);
    }

    return <ContentPrototype route="card" title="Card 内容卡片" description="对照纯信息卡、单一入口卡和有独立动作的设备卡。"
        scene="值班设备摘要" rules={[
            ["整卡行动", "只有一个主要入口时，可点击整卡。鼠标、Enter 与 Space 到达同一份详情。"],
            ["多个动作", "卡片容器保持静态。查看告警与关注各有独立按钮、焦点与状态，避免点击边缘时误触。"],
            ["长内容", "窄屏改为一列，设备标识和长描述可换行。动作顺序保持先查看、再关注。"],
            ["主题差异", "MD3 使用填充和轻抬升区分信息与入口，macOS 强调紧凑描边与浅层级，shadcn/ui 保留统一描边及明确动作。"],
        ]}>
        <div className="crab-content-card-grid">
            <Card size={size} variant={staticVariant} title={<h3 className="crab-content-card-title">当班摘要</h3>} data-static-card>
                <p>两台设备运行正常，一台待复核。已安排夜班复测。</p>
            </Card>
            <Card size={size} variant={summaryVariant} title="北区输水泵" clickable aria-label="打开北区输水泵详情" onClick={() => open("pump")}>
                <Tag color="success" size="small">运行正常</Tag>
                <p>查看压力、运行时间和现场记录。</p>
            </Card>
            <Card size={size} variant="outlined" title={<h3 className="crab-content-card-title">进水调节阀</h3>} actions={[
                <Button key="alarm" appearance="outlined" size="s" onClick={() => open("alarm")}>查看告警</Button>,
                <Button key="track" appearance="text" size="s" aria-pressed={tracked} onClick={() => setTracked(!tracked)}>
                    {tracked ? "取消关注" : "关注设备"}
                </Button>,
            ]}>
                <Tag color="warning" size="small">待复核</Tag>
                <p className="crab-content-code-key">NORTH-INTAKE-CIRCULATION-VALVE-V019-FEEDBACK</p>
                <p>交接时请先确认现场开度，再对照控制台的反馈记录。</p>
            </Card>
        </div>
        {detail && <div className="crab-content-region">
            <h3 tabIndex={-1} ref={heading} data-content-focus>{detail.name}</h3>
            <p>{detail.body}</p>
        </div>}
        <p className="crab-content-caption" role="status">{tracked ? "已关注进水调节阀。" : ""}</p>
    </ContentPrototype>;
}
