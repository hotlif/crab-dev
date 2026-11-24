import { useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import Tag, { CheckableTag } from "@crab-dev/rc-tag";
import { useConfig } from "@crab-dev/rc-config-provider";
import { ContentPrototype } from "./contentPrototype.js";

const filters = [
    { value: "review", label: "待复核" },
    { value: "gateway", label: "远程网关" },
    { value: "intake", label: "进水调节阀与远程监测终端" },
] as const;
type Filter = (typeof filters)[number]["value"];
const devices = [
    { name: "北区输水泵", state: "运行正常", color: "success", filters: ["gateway"] },
    { name: "进水调节阀", state: "待复核", color: "warning", filters: ["review", "intake"] },
    { name: "远程监测终端", state: "离线", color: "error", filters: ["gateway", "intake"] },
];

export default function TagPrototype() {
    const { designSystem } = useConfig();
    const [selected, setSelected] = useState<Filter[]>(["review", "intake"]);
    const choices = useRef<HTMLDivElement>(null);
    const chips = useRef<HTMLDivElement>(null);
    const matches = devices.filter((device) => selected.length === 0 || selected.some((key) => device.filters.includes(key)));
    const active = filters.filter((filter) => selected.includes(filter.value));
    const size = designSystem === "macos" ? "small" : "medium";

    function toggle(value: Filter, checked: boolean) {
        setSelected((current) => checked ? [...current, value] : current.filter((key) => key !== value));
    }

    function remove(value: Filter) {
        const index = active.findIndex((item) => item.value === value);
        const next = active[index + 1] ?? active[index - 1];
        const focusTarget = next
            ? chips.current?.querySelector<HTMLElement>(`[data-filter-chip="${next.value}"] button`)
            : choices.current?.querySelector<HTMLElement>(`[data-tag-choice="${value}"]`);
        focusTarget?.focus();
        toggle(value, false);
    }

    return <ContentPrototype route="tag" title="Tag 状态与筛选标签" description="试用只读状态、可选标签和可移除筛选条件。"
        scene="巡检设备筛选" rules={[
            ["只读状态", "设备状态写在标签中。读屏可以读取文字，键盘按 Tab 时跳过纯信息标签。"],
            ["选择", "条件列表以复选语义呈现。空格切换，选中后设备列表和已应用条件同步更新。"],
            ["移除", "每个关闭按钮有独立名称。移除后去相邻条件的关闭按钮，最后一项移除后回到原条件。"],
            ["主题差异", "MD3 选中用着色层和选中符号，macOS 使用紧凑标签，shadcn/ui 用描边和正文保留清晰状态。"],
        ]}>
        <div className="crab-content-region crab-content-tag-groups">
            <h3>可选条件</h3>
            <div ref={choices} className="crab-content-actions" role="group" aria-label="设备筛选条件">
                {filters.map((filter) => <CheckableTag key={filter.value} data-tag-choice={filter.value}
                    checked={selected.includes(filter.value)} onCheckedChange={(checked) => toggle(filter.value, checked)}>
                    <span className="crab-content-tag-long">{filter.label}</span>
                </CheckableTag>)}
            </div>
        </div>
        <div className="crab-content-region">
            <h3>已应用条件</h3>
            <div ref={chips} className="crab-content-actions" role="group" aria-label="已应用的筛选">
                {active.map((filter) => <Tag key={filter.value} size={size} closable closeAriaLabel={`移除${filter.label}`}
                    bordered={designSystem !== "md3"} onClose={() => remove(filter.value)} data-filter-chip={filter.value}>
                    <span className="crab-content-tag-long">{filter.label}</span>
                </Tag>)}
                {active.length > 0 && <Button size="s" appearance="text" onClick={() => {
                    choices.current?.querySelector<HTMLElement>('[data-tag-choice]')?.focus();
                    setSelected([]);
                }}>清除所有条件</Button>}
            </div>
            <p role="status" className="crab-content-status">显示 {matches.length} 台设备{active.length === 0 && " · 全部条件已清除"}</p>
        </div>
        <ul className="crab-content-roster crab-content-device-tags" role="list" aria-label="筛选结果">
            {matches.map((device) => <li key={device.name}><strong>{device.name}</strong>
                <Tag size={size} color={device.color} bordered={designSystem === "shadcn"}>{device.state}</Tag></li>)}
        </ul>
    </ContentPrototype>;
}
