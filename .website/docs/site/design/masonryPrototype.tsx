import { useEffect, useState } from "react";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Masonry from "@crab-dev/rc-masonry";
import { useSiteHref } from "../siteContext.js";
import { LayoutPrototype } from "./layoutPrototype.js";

const snapshots = [
    { id: "P-104", title: "北区输水泵", time: "14:20", position: "left top", detail: "机组外观正常，护罩和底座可见。" },
    { id: "M-032", title: "入口压力表", time: "13:50", position: "right top", detail: "记录表盘外观。现场数值应以巡检读数为准。" },
    { id: "V-019", title: "进水调节阀", time: "12:40", position: "left bottom", detail: "已查看执行器、连接线和法兰。" },
    { id: "F-026", title: "流量计", time: "11:20", position: "right bottom", detail: "数字显示和管道连接完好。下次请补拍接线与识别标记。" },
];
const notes = {
    md3: "MD3 使用柔和表面和大圆角承载设备快照。图片和文字都占有稳定空间。",
    macos: "macOS 使用紧凑边距及细描边，设备型号、时间和现场摘要易于快速浏览。",
    shadcn: "shadcn/ui 将中性卡片、简洁标题和设备照片组合，沿用一致的键盘顺序。",
};

export default function MasonryPrototype() {
    const { designSystem } = useConfig();
    const href = useSiteHref();
    const asset = href("prototype-assets/inspection-equipment.png");
    const [request, setRequest] = useState(0);
    const [phase, setPhase] = useState<"loading" | "ready" | "failed">("loading");
    const [selected, setSelected] = useState<string | null>(null);
    const active = snapshots.find(item => item.id === selected);

    useEffect(() => {
        const image = new Image();
        image.onload = () => setPhase("ready");
        image.onerror = () => setPhase("failed");
        const timer = window.setTimeout(() => { image.src = asset; }, 950);
        return () => {
            window.clearTimeout(timer);
            image.onload = null;
            image.onerror = null;
        };
    }, [asset, request]);

    return <LayoutPrototype route="masonry" title="Masonry 瀑布流" scene="设备巡检快照"
        description="观察列数、图片异步载入和按采集时间浏览卡片的顺序。"
        note={notes[designSystem]} rules={[
            ["列数", "容器宽度不足 410 像素时用一列，410 至 719 像素用两列，更宽时用三列。"],
            ["稳定布局", "图片载入前先保留原比例空间。实际图片到达后，卡片的位置与焦点保持稳定。"],
            ["阅读顺序", "快照按采集时间从新到旧进入 DOM。按视觉顶端位置排列，键盘与读屏沿相同顺序经过设备。"],
            ["加载失败", "摘要和操作仍可读，重新模拟加载可重试图片。"],
        ]}>
        <div className="crab-layout-actions crab-layout-snapshot-toolbar">
            <Button appearance="outlined" size="s" loading={phase === "loading"} onClick={() => {
                setRequest(value => value + 1);
                setPhase("loading");
            }}>重新模拟图片加载</Button>
            <p role="status" className="crab-layout-secondary" data-snapshot-status>{
                phase === "loading" ? "图片载入中…" : phase === "failed" ? "图片载入失败，可以重试。" : "设备图片已载入。"
            }</p>
        </div>
        <AutoSizer defaultWidth={750} disableHeight>
            {({ width }) => {
                const columns = width < 410 ? 1 : width < 720 ? 2 : 3;
                return <Masonry columns={columns} data-snapshot-columns={columns} aria-label="设备快照">
                    {snapshots.map(item => <article className="crab-layout-snapshot" key={item.id} data-snapshot={item.id}>
                        <div className="crab-layout-snapshot-image" data-load-state={phase}
                            role={phase === "ready" ? "img" : undefined} aria-label={phase === "ready" ? item.title + "设备照片" : undefined}
                            style={{ backgroundImage: phase === "ready" ? `url("${asset}")` : undefined, backgroundPosition: item.position }} />
                        <h3>{item.title}</h3><p className="crab-layout-secondary">{item.id} · {item.time}</p><p>{item.detail}</p>
                        <Button appearance="text" size="s" aria-label={`查看 ${item.id} 快照`} aria-pressed={selected === item.id}
                            onClick={() => setSelected(item.id)}>查看快照</Button>
                    </article>)}
                </Masonry>;
            }}
        </AutoSizer>
        {active && <p role="status" className="crab-layout-secondary" data-active-snapshot>当前快照 {active.title} · {active.time}</p>}
    </LayoutPrototype>;
}
