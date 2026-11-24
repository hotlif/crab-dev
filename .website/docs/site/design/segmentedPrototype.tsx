import { useState, type FocusEvent } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Segmented, { type SegmentedValue } from "@crab-dev/rc-segmented";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./segmentedPrototype.styles.js";

const periodOptions = [
    { value: "day", label: "日", "aria-label": "日视图" },
    { value: "week", label: "周", "aria-label": "周视图" },
    { value: "month", label: "月", "aria-label": "月视图" },
];

const periods = {
    day: { range: "11 月 23 日", samples: [["6时", 7], ["8时", 12], ["10时", 24], ["12时", 15], ["14时", 18], ["16时", 8]] },
    week: { range: "11 月 17–23 日", samples: [["17日", 62], ["18日", 78], ["19日", 59], ["20日", 80], ["21日", 71], ["22日", 86], ["23日", 84]] },
    month: { range: "11 月 1–23 日", samples: [["1–4", 380], ["5–8", 411], ["9–12", 368], ["13–16", 420], ["17–20", 377], ["21–23", 241]] },
} as const;

const longOptions = [
    { value: "shift", label: "工作区当前班次", className: "crab-segmented-long-item" },
    { value: "archive", label: "已归档的原始记录", className: "crab-segmented-long-item", disabled: true },
    { value: "handover", label: "跨班组交接巡检记录", className: "crab-segmented-long-item" },
];

const designs = {
    md3: {
        size: "medium",
        decision: "MD3 原型使用连续胶囊描边和分隔线，选中项显示色调底和勾记。日、周、月始终居中，按下时通过状态层反馈。",
    },
    macos: {
        size: "small",
        decision: "用紧凑轨道和浮起的选中块呈现时间范围。标题与控制器共享一行，空间不足时控制器移到标题下方。",
    },
    shadcn: {
        size: "medium",
        decision: "用中性轨道和低对比边界区分分组，选中项使用较清晰的表面，图表延续同一套中性色层级。",
    },
} as const;

function revealLongOption(event: FocusEvent<HTMLDivElement>) {
    event.target.closest(".crab-segmented-long-item")?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

export default function SegmentedPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const [period, setPeriod] = useState<SegmentedValue>("day");
    const [scope, setScope] = useState<SegmentedValue>("shift");
    const data = period === "week" ? periods.week : period === "month" ? periods.month : periods.day;
    const total = data.samples.reduce<number>((sum, [, count]) => sum + count, 0);
    const peak = Math.max(...data.samples.map(([, count]) => count));
    const scopeLabel = longOptions.find(option => option.value === scope)?.label;

    return <div className="crab-design-workspace" data-segmented-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="Segmented 分段控制器" description="在同一组巡检记录中切换日、周、月，比较不同时间范围的数据。">
            <nav className="crab-design-jump-links" aria-label="原型章节">
                <a href="#segmented-trend">巡检记录</a>
                <a href="#segmented-overflow">长标签与溢出</a>
                <a href="#segmented-rules">交互规则</a>
            </nav>
        </DesignHero>
        <div className="crab-design-body">
            <section id="segmented-trend" aria-labelledby="segmented-trend-title">
                <div className="crab-segmented-panel">
                    <header className="crab-segmented-toolbar">
                        <h2 id="segmented-trend-title">巡检记录</h2>
                        <Segmented options={periodOptions} value={period} onValueChange={setPeriod}
                            className="crab-segmented-period" size={design.size} aria-label="巡检时间范围" />
                    </header>
                    <div className="crab-segmented-data">
                        <div className="crab-segmented-stats" role="status" aria-atomic="true">
                            <p className="crab-segmented-detail">{data.range}</p>
                            <p><strong>{total}</strong> 条巡检记录</p>
                        </div>
                        <ol className="crab-segmented-chart" role="list" aria-label="各时段巡检条数">
                            {data.samples.map(([label, count]) => <li key={label}>
                                <span className="crab-segmented-tick">{label}</span>
                                <span className="crab-segmented-count">{count}</span>
                                <span className="crab-segmented-plot" aria-hidden="true">
                                    <span className="crab-segmented-bar" style={{ blockSize: `${count / peak * 100}%` }} />
                                </span>
                            </li>)}
                        </ol>
                    </div>
                </div>
            </section>
            <section id="segmented-overflow" aria-labelledby="segmented-overflow-title">
                <div className="crab-design-section-head"><h2 id="segmented-overflow-title">长标签与溢出</h2></div>
                <div className="crab-segmented-panel crab-segmented-overflow-panel">
                    <p id="segmented-overflow-help" className="crab-segmented-detail">窄屏可横向滑动。用方向键切换时，当前项会滚入可见区。</p>
                    <div className="crab-segmented-overflow-scroll">
                        <Segmented options={longOptions} value={scope} onValueChange={setScope} onFocus={revealLongOption}
                            className="crab-segmented-long-control" size={design.size} aria-label="长标签记录范围"
                            aria-describedby="segmented-overflow-help segmented-archive-note" />
                    </div>
                    <p className="crab-segmented-detail" role="status">当前范围 <strong>{scopeLabel}</strong></p>
                    <p id="segmented-archive-note" className="crab-segmented-detail">查看归档原始记录需要归档权限。</p>
                </div>
            </section>
            <section id="segmented-rules" aria-labelledby="segmented-rules-title">
                <div className="crab-design-section-head"><h2 id="segmented-rules-title">交互规则</h2></div>
                <div className="crab-segmented-panel crab-segmented-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>使用场景</dt><dd>同一区域内的少量视图模式或筛选值用 Segmented。不同内容面板用 Tabs。需要逐项解释或随表单提交的互斥选项用 Radio。</dd>
                        <dt>标签与溢出</dt><dd>首选短标签。必须保留长标签时，在组内横向滚动，并保证当前项和焦点可见。选项过多时考虑 Select。</dd>
                        <dt>键盘和禁用</dt><dd>Tab 进入当前选中项，方向键切换并跳过禁用项，空格或回车可选中焦点项。再次按 Tab 离开整组。</dd>
                        <dt>选中与动效</dt><dd>数据随单选值立即更新。切换时组件保持尺寸稳定，减少动态效果时直接显示最终选中状态。</dd>
                    </dl>
                </div>
            </section>
            <div><Button appearance="text" href={href("components/rc-segmented")}>查看 Segmented 组件文档 →</Button></div>
        </div>
    </div>;
}
