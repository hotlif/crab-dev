import { useEffect, useState } from "react";
import Alert from "@crab-dev/rc-alert";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import BarChart, { type BarClickInfo } from "@crab-dev/rc-bar-chart";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Spin from "@crab-dev/rc-spin";
import { DataPrototype } from "./dataPrototype.js";

const categories = ["北区输水泵", "进水调节阀", "东侧远程监测设备支线", "回流管"];
const series = [
    { name: "日班", data: [24, 8, 15, 11] },
    { name: "夜班", data: [19, 0, 13, 7] },
];
const chartName = "泵站分班用水量（立方米）";
type Phase = "ready" | "loading" | "empty" | "error";

export default function BarChartPrototype() {
    const { designSystem } = useConfig();
    const [phase, setPhase] = useState<Phase>("ready");
    const [stacked, setStacked] = useState(false);
    const [active, setActive] = useState<BarClickInfo | null>(null);

    useEffect(() => {
        if (phase !== "loading") return;
        const timer = setTimeout(() => setPhase("ready"), 720);
        return () => clearTimeout(timer);
    }, [phase]);

    function change(next: Phase) {
        setActive(null);
        setPhase(next);
    }

    return <DataPrototype route="bar-chart" title="BarChart 柱状图读值" description="比较班次用水量，查看零值和长标签，并试用加载和错误恢复。"
        scene="泵站分班用水量" rules={[
            ["图例与坐标", "图表统一标注计量单位 m³。图例开关和柱共用班次名称，切换堆叠可对照总量与班次差异。"],
            ["读值路径", "按 Tab 进入图表，用方向键移动到柱，Enter 固定读值。零值可在原始数据表和图表文本中核对。"],
            ["数据状态", "真实的 0 m³ 仍保留在数据表中。无数据、正在读取和接口失败显示各自的状态与恢复操作。"],
            ["主题差异", "MD3 使用语义系列色与参考线，macOS 优先按设备横向浏览，shadcn/ui 以中性边界突出图例与读值。窄屏统一横向显示长标签。"],
        ]}>
        <div className="crab-data-actions">
            <Button appearance="primary" loading={phase === "loading"} onClick={() => change("loading")}>重新读取用水量</Button>
            <Button appearance="outlined" aria-pressed={stacked} onClick={() => { setStacked(!stacked); setActive(null); }}>按班次堆叠</Button>
            <Button appearance="text" onClick={() => change("empty")}>模拟无数据</Button>
            <Button appearance="text" onClick={() => change("error")}>模拟读取失败</Button>
        </div>
        {phase === "error" && <Alert type="error" title="无法读取用水量">计量服务未响应。重新读取可恢复当前班次。</Alert>}
        <div className="crab-data-viewport crab-data-chart" data-chart-phase={phase} aria-busy={phase === "loading"}>
            {phase === "loading" && <Spin tip="正在读取分班用水量" />}
            {phase === "empty" && <BarChart width="auto" aria-label={chartName} categories={[]} series={[]} />}
            {phase === "ready" && <>
                <p className="crab-data-chart-unit">计量单位 m³</p>
                <AutoSizer defaultWidth={430} disableHeight>
                    {({ width }) => <BarChart width={width} height={width < 440 ? 280 : 295} aria-label={chartName}
                        orientation={width < 440 || designSystem === "macos" ? "horizontal" : "vertical"} categories={categories} series={series}
                        labels={{ legend: "班次图例", category: "设备" }} referenceLines={[{ value: 20 }]}
                        stacked={stacked} showValues onBarClick={setActive} />}
                </AutoSizer>
            </>}
        </div>
        <p className="crab-data-status" role="status" data-chart-reading>
            {active ? `${active.category} · ${active.seriesName} · ${active.value} m³` : phase === "ready" ? "进水调节阀夜班为 0 m³。" : ""}
        </p>
    </DataPrototype>;
}
