import { useState } from "react";
import Button, { ButtonGroup } from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import Segmented from "@crab-dev/rc-segmented";
import Select from "@crab-dev/rc-select";
import "./buttonComposition.styles.js";

const widths = [{ value: "narrow", label: "160 px" }, { value: "wide", label: "280 px" }];
const compositionDesigns = {
    md3: {
        chooser: "采样配置", presets: { standard: "标准采样", detail: "高频采样" }, reset: "还原修改", export: "导出已保存配置", save: "保存配置",
        ordinary: "配置操作各自独立。还原只撤回草稿，导出读取已保存的配置，保存作为同一区域的主操作。",
        filters: ["运行", "告警", "离线"], filterGroup: "设备状态筛选",
        connected: "同一数据区里的相关筛选采用紧密间距。每项可独立选中，Tab 逐项进入，选中后标签保持原样。",
        longLabel: "导出所有已选设备的运行记录", link: "查看工作区配置",
        decision: "按压和选中时圆角保持原样，由状态层和填色反馈操作。保存时保持宽度，失败后保留草稿，并在同一位置提供重试。",
    },
    macos: {
        chooser: "窗口显示", presets: { standard: "简洁视图", detail: "详细视图" }, reset: "放弃修改", export: "导出已存设置", save: "存储设置",
        ordinary: "桌面设置使用紧凑普通按钮。放弃和导出在左侧，着色的存储在右侧。导出读取已存设置。",
        filters: ["最近", "收藏", "共享"], filterGroup: "桌面工具栏筛选",
        connected: "桌面工具栏使用一块共享玻璃背板。最近、收藏和共享可以独立切换，按下时保持轮廓。",
        longLabel: "导出当前窗口中所有已选项目的显示设置", link: "查看个人资料设置",
        decision: "存储期间保留标题，⌘S 可从设置表单提交。按住时压暗表面，释放后边缘淡出。",
    },
    shadcn: {
        chooser: "数据视图", presets: { standard: "摘要视图", detail: "详细视图" }, reset: "放弃更改", export: "导出已存视图", save: "保存更改",
        ordinary: "卡片操作栏使用幽灵按钮放弃修改，描边按钮导出，实心按钮保存。导出读取上一次保存的视图。",
        filters: ["待处理", "已完成", "已归档"], filterGroup: "结果视图筛选",
        connected: "把相关过滤条件放在相邻的细描边按钮中。焦点环标识当前操作，独立选中状态标识已启用的条件。",
        longLabel: "导出当前筛选结果的所有可见数据列", link: "查看账户资料",
        decision: "按下时稳定布局，用填色与边缘表达反馈。失败提示留在卡片内，原位置提供宽度稳定的重试按钮。",
    },
} as const;

type Preset = "standard" | "detail";
type CompositionDesign = (typeof compositionDesigns)[DesignSystem];

function ConfigurationActions({ design, system }: { design: CompositionDesign; system: DesignSystem }) {
    const [draft, setDraft] = useState<Preset>("detail");
    const [applied, setApplied] = useState<Preset>("standard");
    const [result, setResult] = useState<{ action: string; preset: Preset }>();
    const changed = draft !== applied;
    const presets = Object.entries(design.presets).map(([value, label]) => ({ value, label }));
    return <div className="crab-design-composition-card">
        <h3>普通按钮组</h3>
        <p>{design.ordinary}</p>
        <Select label={design.chooser} value={draft} options={presets} allowClear={false} onValueChange={value => {
            if (value === "standard" || value === "detail") { setDraft(value); setResult(undefined); }
        }} />
        <div role="group" aria-label="配置操作">
            <ButtonGroup size="xs" appearance="outlined">
                <Button appearance={system === "shadcn" ? "text" : undefined} disabled={!changed}
                    onClick={() => { setDraft(applied); setResult({ action: "已还原到", preset: applied }); }}>{design.reset}</Button>
                <Button onClick={() => setResult({ action: "已导出", preset: applied })}>{design.export}</Button>
                <Button appearance="primary" disabled={!changed}
                    onClick={() => { setApplied(draft); setResult({ action: "已保存", preset: draft }); }}>{design.save}</Button>
            </ButtonGroup>
        </div>
        <p role="status">{result ? result.action + " " + design.presets[result.preset] : "已保存 · " + design.presets[applied]}</p>
    </div>;
}

function DeviceFilters({ design, system }: { design: CompositionDesign; system: DesignSystem }) {
    const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set([0]));
    function toggle(state: number) {
        setSelected(previous => {
            const next = new Set(previous);
            if (next.has(state)) next.delete(state);
            else next.add(state);
            return next;
        });
    }
    return <div className="crab-design-composition-card">
        <h3>连接式按钮组</h3>
        <p>{design.connected}</p>
        <div role="group" aria-label={design.filterGroup}>
            <ButtonGroup variant="connected" size="xs" appearance={system === "shadcn" ? "outlined" : "tonal"}>
                {design.filters.map((state, index) => <Button key={index} isSelected={selected.has(index)} onClick={() => toggle(index)}>{state}</Button>)}
            </ButtonGroup>
        </div>
        <p role="status">显示 · {design.filters.filter((_, index) => selected.has(index)).join("、") || "全部状态"}</p>
    </div>;
}

function LabelsAndNavigation({ design, system }: { design: CompositionDesign; system: DesignSystem }) {
    const [width, setWidth] = useState("narrow");
    const [exports, setExports] = useState(0);
    return <div className="crab-design-composition-card crab-design-composition-labels">
        <h3>长标签与链接</h3>
        <p>窄容器可以省略显示，完整标签仍是按钮的可访问名称。执行任务使用按钮，前往目标位置使用链接。</p>
        <Segmented aria-label="样本容器宽度" options={widths} value={width} onValueChange={value => setWidth(String(value))} />
        <div className="crab-design-composition-rail" data-width={width}>
            <Button size="s" shape={system === "md3" ? "round" : undefined}
                appearance="outlined" shouldFitContainer title={design.longLabel} onClick={() => setExports(count => count + 1)}>
                {design.longLabel}
            </Button>
        </div>
        <div className="crab-design-composition-result">
            <p role="status">{exports ? `已导出 · ${exports} 次` : "等待导出"}</p>
            <Button appearance="text" href="#button-scenario">{design.link}</Button>
        </div>
    </div>;
}

export default function ButtonComposition() {
    const { designSystem } = useConfig();
    const design = compositionDesigns[designSystem];
    return <section id="button-composition" className="crab-design-composition" aria-labelledby="button-composition-heading">
        <div className="crab-design-section-head"><h2 id="button-composition-heading">按钮组合与布局</h2></div>
        <div className="crab-design-composition-grid">
            <ConfigurationActions design={design} system={designSystem} />
            <DeviceFilters design={design} system={designSystem} />
            <LabelsAndNavigation design={design} system={designSystem} />
        </div>
        <details className="crab-design-composition-themes">
            <summary>当前主题的设计决策</summary>
            <p>{design.decision}</p>
        </details>
    </section>;
}
