import { css } from "@crab-dev/css";
import Radio from "@crab-dev/rc-radio";
import { useConfig } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";

export const meta = {
    title: "三体系状态矩阵",
    description: "真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。",
};
const scene = css`
    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};
    max-inline-size: 36rem; color: ${token.color.text.primary}; background: ${token.color.background.surface};
`;
const samples = css`
    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};
    min-inline-size: 0; overflow-wrap: anywhere;
`;
const states = ["default","hover","focus-visible","pressed","selected","selected-hover","selected-focus-visible","selected-pressed","error","selected-error","disabled","disabled-selected"] as const;

export default function VisualMatrixDemo() {
    const { size, locale } = useConfig();
    const [state, setState] = useState<typeof states[number]>("default");
    const [checked, setChecked] = useState(false);
    const id = useId();
    const english = locale === "en-US";
    const effectiveChecked = state === "disabled-selected" || checked;
    return <section className={scene} aria-label="Radio visual matrix" data-visual-scene data-size={size} data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{" "}<select id={id} value={state} onChange={event => {
            const next = event.currentTarget.value;
            if (states.some(item => item === next)) setState(next as typeof state);
        }}>{states.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className={samples} data-visual-frame>
            <Radio aria-label="Primary option" checked={effectiveChecked}
                onCheckedChange={setChecked} disabled={state.startsWith("disabled")}
                aria-invalid={state.includes("error") || undefined}
                aria-describedby={state.includes("error") ? id + "-error" : undefined}
            >{english ? "Include archived projects and keep this selection when changing themes" : "包含归档项目，并在切换主题时保留选择"}</Radio>
            <Radio checked disabled aria-label="Unavailable selected option">{english ? "Selected · unavailable" : "已选择 · 暂不可用"}</Radio>
            {state.includes("error") && <span id={id + "-error"} role="alert">{english ? "Review this selection before applying changes." : "应用更改前请核对这一选择。"}</span>}
            <output aria-live="polite">{english ? "Selection" : "当前选择"}: {effectiveChecked ? "on" : "off"}</output>
        </div>
    </section>;
}

