import { useState } from "react";
import Button, { ButtonGroup } from "@crab-dev/rc-button";
import Segmented from "@crab-dev/rc-segmented";
import Select from "@crab-dev/rc-select";
import "./buttonComposition.styles.js";

const presets = [{ value: "标准采样", label: "标准采样" }, { value: "高频采样", label: "高频采样" }];
const deviceStates = ["运行", "告警", "离线"] as const;
const widths = [{ value: "narrow", label: "160 px" }, { value: "wide", label: "280 px" }];
const exportLabel = "导出所有已选设备的运行记录";

function ConfigurationActions() {
    const [draft, setDraft] = useState("高频采样");
    const [applied, setApplied] = useState("标准采样");
    const [result, setResult] = useState("");
    const changed = draft !== applied;
    return <div className="crab-design-composition-card">
        <h3>普通按钮组</h3>
        <p>配置操作各自独立。还原只撤回草稿，导出读取已保存的配置，保存作为同一区域的主操作。</p>
        <Select label="采样配置" value={draft} options={presets} allowClear={false} onValueChange={value => {
            if (value) { setDraft(value); setResult(""); }
        }} />
        <div role="group" aria-label="配置操作">
            <ButtonGroup size="xs" appearance="outlined">
                <Button disabled={!changed} onClick={() => { setDraft(applied); setResult("已还原到 " + applied); }}>还原修改</Button>
                <Button onClick={() => setResult("已导出 " + applied)}>导出已保存配置</Button>
                <Button appearance="primary" disabled={!changed} onClick={() => { setApplied(draft); setResult("已保存 " + draft); }}>保存配置</Button>
            </ButtonGroup>
        </div>
        <p role="status">{result || "已保存 · " + applied}</p>
    </div>;
}

function DeviceFilters() {
    const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set(["运行"]));
    function toggle(state: string) {
        setSelected(previous => {
            const next = new Set(previous);
            if (next.has(state)) next.delete(state);
            else next.add(state);
            return next;
        });
    }
    return <div className="crab-design-composition-card">
        <h3>连接式按钮组</h3>
        <p>同一数据区里的相关筛选采用紧密间距。每项可独立选中，Tab 逐项进入，选中后标签保持原样。</p>
        <div role="group" aria-label="设备状态筛选">
            <ButtonGroup variant="connected" size="xs" appearance="tonal">
                {deviceStates.map(state => <Button key={state} isSelected={selected.has(state)} onClick={() => toggle(state)}>{state}</Button>)}
            </ButtonGroup>
        </div>
        <p role="status">显示 · {deviceStates.filter(state => selected.has(state)).join("、") || "全部状态"}</p>
    </div>;
}

function LabelsAndNavigation() {
    const [width, setWidth] = useState("narrow");
    const [exports, setExports] = useState(0);
    return <div className="crab-design-composition-card crab-design-composition-labels">
        <h3>长标签与链接</h3>
        <p>窄容器可以省略显示，完整标签仍是按钮的可访问名称。执行任务使用按钮，前往目标位置使用链接。</p>
        <Segmented aria-label="样本容器宽度" options={widths} value={width} onValueChange={value => setWidth(String(value))} />
        <div className="crab-design-composition-rail" data-width={width}>
            <Button size="s" appearance="outlined" shouldFitContainer title={exportLabel} onClick={() => setExports(count => count + 1)}>
                {exportLabel}
            </Button>
        </div>
        <div className="crab-design-composition-result">
            <p role="status">{exports ? `已导出运行记录 · ${exports} 次` : "等待导出"}</p>
            <Button appearance="text" href="#button-scenario">查看工作区配置</Button>
        </div>
    </div>;
}

export default function ButtonComposition() {
    return <section id="button-composition" className="crab-design-composition" aria-labelledby="button-composition-heading">
        <div className="crab-design-section-head"><h2 id="button-composition-heading">按钮组合与布局</h2></div>
        <div className="crab-design-composition-grid">
            <ConfigurationActions />
            <DeviceFilters />
            <LabelsAndNavigation />
        </div>
        <details className="crab-design-composition-themes">
            <summary>主题差异与候选决策</summary>
            <p>MD3 候选方案沿用现有状态层。保存时固定按钮宽度，失败后保留草稿并提供重试。连接式筛选使用紧密间距和可辨认的选中形状。</p>
            <p>macOS 按压保持轮廓，加载保留动作标题。连接式组采用共享背板。后续核对工具栏内的组间距与键盘焦点。</p>
            <p>shadcn 候选方案用轻微下沉反馈按压。后续核对密集操作区中的描边、选中形状和窄屏换行。</p>
        </details>
    </section>;
}
