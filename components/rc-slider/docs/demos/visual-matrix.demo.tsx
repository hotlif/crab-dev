import { css } from "@crab-dev/css";
import Slider from "@crab-dev/rc-slider";
import { useConfig } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";

export const meta = { title: "三体系轨道状态矩阵", description: "五档视觉尺寸，真实拖动与键盘调整，范围、错误与禁用状态。" };
const scene = css`
    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; max-inline-size: 36rem;
    color: ${token.color.text.primary}; background: ${token.color.background.surface};
`;
const samples = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-inline-size: 0;`;
const limits = css`display: flex; justify-content: space-between; gap: ${token.space['inline-gap']};`;
const sizes = ["xs", "s", "m", "l", "xl"] as const;
const states = ["default", "hover", "focus-visible", "dragging", "minimum", "maximum", "disabled", "error"] as const;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [size, setSize] = useState<typeof sizes[number]>("xs");
    const [state, setState] = useState<typeof states[number]>("default");
    const [value, setValue] = useState(40);
    const id = useId();
    const english = locale === "en-US";
    return <section className={scene} aria-label="Slider visual matrix" data-visual-scene data-size={size} data-state={state}>
        <div><label htmlFor={id + "-size"}>验收尺寸</label>{" "}<select id={id + "-size"} value={size} onChange={event => {
            const next = event.currentTarget.value;
            if (sizes.some(item => item === next)) setSize(next as typeof size);
        }}>{sizes.map(item => <option key={item}>{item}</option>)}</select></div>
        <div><label htmlFor={id + "-state"}>验收状态</label>{" "}<select id={id + "-state"} value={state} onChange={event => {
            const next = event.currentTarget.value;
            if (states.some(item => item === next)) setState(next as typeof state);
        }}>{states.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className={samples} data-visual-frame>
            <span id={id + "-label"}>{english ? "Preview opacity" : "预览不透明度"}</span>
            <Slider aria-labelledby={id + "-label"} size={size} value={value} onValueChange={setValue}
                min={0} max={100} step={5} disabled={state === "disabled"}
                aria-invalid={state === "error" || undefined} aria-describedby={id + "-help"} />
            <div className={limits}><span>0%</span><output>{value}%</output><span>100%</span></div>
            <span id={id + "-help"}>{state === "error" ? (english ? "Review the opacity before publishing." : "发布前请核对不透明度。") : (english ? "Use arrow keys for 5% steps." : "方向键按 5% 调整。")}</span>
        </div>
    </section>;
}

