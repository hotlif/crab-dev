import { useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import CronPicker, { describeCron, nextOccurrences, parseCron } from "@crab-dev/rc-cron-picker";
import { PickerPrototype } from "./pickerPrototype.js";

const presets = [
    { label: "工作日 08:30", value: "30 8 * * 1-5" },
    { label: "每天 06:00", value: "0 6 * * *" },
    { label: "每周一 09:15", value: "15 9 * * 1" },
];
const archived = "0 7 * * 1";
const notes = {
    md3: "MD3 描边输入将表达式、校验和面板编辑集中到同一配置区。工作日预设与接下来执行时间分别呈现。",
    macos: "macOS 使用紧凑的设定字段和表格式预览，方便录入并核对每次执行。",
    shadcn: "shadcn/ui 使用简洁的中性字段和列表，表达式、时区与执行日期分别可读。",
};

export default function CronPickerPrototype() {
    const { designSystem } = useConfig();
    const size = designSystem === "macos" ? "small" : "medium";
    const [expression, setExpression] = useState(presets[0].value);
    const [now] = useState(() => new Date());
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parsed = parseCron(expression);
    const dates = parsed ? nextOccurrences(parsed, now, 4) : [];
    const format = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone });

    return <PickerPrototype route="cron-picker" title="CronPicker 定时表达式" scene="报表生成计划"
        description="选取工作日计划，编辑 Cron 表达式，并核对计算出的执行时间。"
        note={notes[designSystem]} rules={[
            ["输入与预设", "使用分、时、日、月、周五段式。预设立即替换计划；手输按 Enter 或离开输入框提交。"],
            ["无效表达式", "字段显示错误，最近一次有效计划和执行预览保留。Escape 放弃未提交的输入。"],
            ["只读", "归档计划可以查看与复制，在只读面板里无法修改。"],
            ["计算范围", "预览按浏览器时区显示，从进入页面的时间起计算四次。部署前核对调度器时区与夏令时规则。"],
        ]} summary={<>
            <h3>预计执行</h3>
            <dl className="crab-picker-rules">
                <div><dt>时区</dt><dd data-cron-zone>{timeZone}</dd></div>
                <div><dt>预览起点</dt><dd>{format.format(now)}</dd></div>
                <div><dt>已应用规则</dt><dd data-cron-expression><code>{expression}</code></dd></div>
            </dl>
            <div aria-live="polite">
                {dates.length > 0 ? <ol className="crab-picker-occurrences" aria-label="后续执行时间">
                    {dates.map(date => <li key={date.getTime()}><time dateTime={date.toISOString()}>{format.format(date)}</time></li>)}
                </ol> : <p>预览范围内无匹配时间。</p>}
            </div>
        </>}>
        <h3>运行计划</h3>
        <div className="crab-picker-actions" role="group" aria-label="计划预设">
            {presets.map(preset => <Button key={preset.value} size="s" appearance="outlined"
                aria-pressed={expression === preset.value} onClick={() => setExpression(preset.value)}>{preset.label}</Button>)}
        </div>
        <CronPicker label="Cron 表达式" value={expression} onValueChange={setExpression} size={size}
            appearance="outlined" supportingText="五段式：分、时、日、月、周。" previewCount={0} />
        {parsed && <p className="crab-picker-support">{describeCron(parsed)}</p>}
        <div className="crab-picker-readonly">
            <h3>归档计划</h3>
            <CronPicker label="原巡检计划" value={archived} size={size} appearance="outlined" readOnly previewCount={0}
                supportingText="历史计划，仅供查阅。" />
        </div>
    </PickerPrototype>;
}
