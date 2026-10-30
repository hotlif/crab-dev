import { css } from "@crab-dev/css";
import Segmented from "@crab-dev/rc-segmented";
import { useConfig } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";

export const meta = { title: "三体系分段状态矩阵", description: "并列文字、图标与禁用选项，实际选择保留在同一组件实例。" };
const scene = css`
    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};
    max-inline-size: 42rem; min-inline-size: 0;
    background: ${token.color.background.surface}; color: ${token.color.text.primary};
`;
const samples = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-inline-size: 0;`;
const icon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
const states = ["default", "hover", "focus-visible", "pressed", "selected", "selected-hover", "selected-pressed", "disabled", "item-disabled"] as const;
export default function VisualMatrixDemo() {
    const { size, locale } = useConfig();
    const [value, setValue] = useState<string | number>("day");
    const [state, setState] = useState<typeof states[number]>("default");
    const id = useId();
    const english = locale === "en-US";
    return <section className={scene} aria-label="Segmented visual matrix" data-visual-scene data-state={state} data-size={size}>
        <div><label htmlFor={id}>验收状态</label>{" "}<select id={id} value={state} onChange={event => {
            const next = event.currentTarget.value;
            if (states.some(item => item === next)) setState(next as typeof state);
        }}>{states.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className={samples} data-visual-frame>
            <Segmented aria-label="Time range" block disabled={state === "disabled"} value={value} onValueChange={setValue}
                options={[
                    { value: "day", label: english ? "Day" : "日视图", "aria-label": "Day" },
                    { value: "week", label: english ? "Week · shared project activity" : "周视图 · 团队共享项目动态", "aria-label": "Week", icon },
                    { value: "month", label: english ? "Month" : "月视图", "aria-label": "Month", disabled: true },
                ]} />
            <Segmented aria-label="Icon views" defaultValue="list" options={[
                { value: "list", label: "", icon, "aria-label": "List" },
                { value: "detail", label: "", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16v16H4zM10 4v16" /></svg>, "aria-label": "Detail" },
            ]} />
            <output aria-live="polite">{english ? "Range" : "当前范围"}: {value}</output>
        </div>
    </section>;
}

