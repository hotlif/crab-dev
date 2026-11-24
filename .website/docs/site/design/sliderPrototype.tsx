import { useId, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Slider from "@crab-dev/rc-slider";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import "./sliderPrototype.styles.js";

const initialThreshold = 65;
const samples = [
    { time: "08:00", value: 43 },
    { time: "09:00", value: 65 },
    { time: "10:00", value: 60 },
    { time: "11:00", value: 78 },
    { time: "12:00", value: 72 },
    { time: "13:00", value: 86 },
];
const designs = {
    md3: {
        size: "s",
        decision: "MD3 Expressive 用分段轨道、竖向手柄和终点标记。当前读值在轨道上方固定显示，操作时便于阅读。",
    },
    macos: {
        size: "xs",
        decision: "细轨道配紧凑的胶囊手柄。拖拽手柄时保留桌面视觉反馈，当前百分比在同一位置显示。",
    },
    shadcn: {
        size: "xs",
        decision: "中性轨道与圆形手柄突出当前位置，辅助说明和数值布局保持简洁。",
    },
} as const;

export default function SliderPrototype() {
    const { designSystem } = useConfig();
    const design = designs[designSystem];
    const href = useSiteHref();
    const help = useId();
    const [threshold, setThreshold] = useState(initialThreshold);
    const exceeded = samples.filter(sample => sample.value >= threshold).length;

    return <div className="crab-design-workspace" data-slider-prototype data-prototype-design={designSystem}>
        <DesignHero section="组件原型" title="Slider 滑块"
            description="拖动负载告警阈值，观察读值、趋势图和各时段的告警状态。" />
        <div className="crab-design-body">
            <section id="slider-threshold" aria-labelledby="slider-threshold-title">
                <div className="crab-design-section-head"><h2 id="slider-threshold-title">泵站负载告警</h2></div>
                <div className="crab-slider-layout">
                    <div className="crab-slider-panel crab-slider-control">
                        <div className="crab-slider-heading">
                            <h3>负载告警阈值</h3>
                            <span className="crab-slider-current" data-threshold-value>{threshold}%</span>
                        </div>
                        <div className="crab-slider-track-area">
                            <Slider aria-label="负载告警阈值" aria-describedby={help} aria-valuetext={`${threshold}%`}
                                size={design.size} min={0} max={100} step={1} value={threshold} onValueChange={setThreshold} />
                            <div className="crab-slider-scale" aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
                        </div>
                        <p id={help}>方向键每次调整 1 个百分点，Page Up / Page Down 每次调整 10 个百分点。Home 和 End 到达边界。</p>
                        <Button appearance="text" size="s" onClick={() => setThreshold(initialThreshold)}>恢复默认 65%</Button>
                    </div>
                    <div className="crab-slider-panel crab-slider-chart">
                        <div className="crab-slider-heading">
                            <h3>负载趋势</h3>
                            <p data-threshold-matches>{exceeded} / {samples.length} 个时段达到阈值</p>
                        </div>
                        <div className="crab-slider-graph">
                            <div className="crab-slider-axis" aria-hidden="true"><span>100%</span><span>50%</span><span>0%</span></div>
                            <div className="crab-slider-plot">
                                <div className="crab-slider-threshold-line" aria-hidden="true" style={{ insetBlockEnd: `${threshold}%` }} />
                                <ol className="crab-slider-bars" role="list" aria-label="各时段负载">
                                    {samples.map(sample => <li key={sample.time} data-threshold-crossed={sample.value >= threshold}
                                        aria-label={`${sample.time} 负载 ${sample.value}%，${sample.value >= threshold ? "达到" : "低于"}阈值`}>
                                        <div className="crab-slider-bar" aria-hidden="true" style={{ blockSize: `${sample.value}%` }}>
                                            <span>{sample.value}</span>
                                        </div>
                                        <span className="crab-slider-time" aria-hidden="true">{sample.time}</span>
                                    </li>)}
                                </ol>
                            </div>
                        </div>
                        <p className="crab-slider-legend"><span aria-hidden="true" />虚线为告警阈值，达到阈值的时段计入告警。</p>
                    </div>
                </div>
            </section>
            <section aria-labelledby="slider-disabled-title">
                <div className="crab-design-section-head"><h2 id="slider-disabled-title">维护期间</h2></div>
                <div className="crab-slider-panel crab-slider-control crab-slider-disabled">
                    <div className="crab-slider-heading"><h3>锁定阈值</h3><span>65%</span></div>
                    <Slider aria-label="锁定阈值" aria-valuetext="65%" size={design.size} min={0} max={100}
                        step={1} defaultValue={initialThreshold} disabled />
                    <p>维护期间保留当前阈值，滑块跳过键盘焦点。</p>
                </div>
            </section>
            <section aria-labelledby="slider-rules-title">
                <div className="crab-design-section-head"><h2 id="slider-rules-title">交互规则</h2></div>
                <div className="crab-slider-panel crab-slider-rules">
                    <p>{design.decision}</p>
                    <dl>
                        <dt>适用场景</dt><dd>在有单位、上下限和即时结果的区间内选择单个值。直接键入精确数值可用 NumberEdit。</dd>
                        <dt>步进与边界</dt><dd>初始阈值为 65%，取值范围为 0% 到 100%。拖动、点按轨道和键盘都使用 1 个百分点的精度。</dd>
                        <dt>读值</dt><dd>读值固定在轨道上方。滑块向辅助技术报告百分比，趋势图同时标出每个时段是否达到阈值。</dd>
                        <dt>焦点与动效</dt><dd>Tab 进入滑块，调整时焦点留在手柄。减少动态效果时，数值和图表仍实时更新。</dd>
                    </dl>
                    <Button appearance="text" href={href("components/rc-slider")}>查看 Slider 组件文档</Button>
                </div>
            </section>
        </div>
    </div>;
}
