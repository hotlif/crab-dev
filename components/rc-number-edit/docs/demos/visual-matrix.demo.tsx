import { css, cx } from "@crab-dev/css";
import NumberEdit from "@crab-dev/rc-number-edit";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useId, useState } from "react";
import token from "@crab-dev/rc-token-semantic";

export const meta = { title: "三体系字段状态矩阵", description: "数值草稿、步进、边界、格式化与科学计数法共用公开字段外壳。" };
const scene = css`
    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};
    max-inline-size: 52rem; min-inline-size: 0; color: ${token.color.text.primary}; background: ${token.color.background.surface};
`;
const samples = css`
    display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-inline-size: 0;
`;
const embeddedHost = css`
    background-color: ${token.color.background.elevated};
    border-radius: ${token.shape.control};
`;
const states = ["default","hover","focus-visible","filled","error","filled-error","warning","filled-warning","disabled","read-only","minimum","maximum","scientific","scientific-read-only","scientific-disabled","formatted","clear","keyboard-step","stepper-focus","long-press","borderless-focus","controls-hidden"] as const;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const english = locale === "en-US";
    const [state, setState] = useState<typeof states[number]>("default");
    const [value, setValue] = useState<number | null>(null);
    const id = useId();
    const status = state === "error" || state === "filled-error" ? "error"
        : state === "warning" || state === "filled-warning" ? "warning" : undefined;
    const scientific = state === "scientific" || state === "scientific-read-only" || state === "scientific-disabled";
    const disabled = state === "disabled" || state === "scientific-disabled";
    const readOnly = state === "read-only" || state === "scientific-read-only";
    const embedded = state === "borderless-focus";
    return <section className={scene} aria-label="NumberEdit visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{" "}<select id={id} value={state} onChange={event => {
            const next = event.currentTarget.value;
            if (states.some(item => item === next)) {
                setState(next as typeof state);
                if (next === "scientific") setValue(1.2345e21);
                else if (next === "formatted") setValue(12345.5);
                else if (next === "long-press") setValue(10);
                else if (next === "disabled" || next === "read-only") setValue(1234.5);
                else if (value == null && (next === "filled-error" || next === "filled-warning")) setValue(1234.5);
                else if (value == null && (next === "scientific-read-only" || next === "scientific-disabled")) setValue(1.2345e21);
                else if (value == null && (next === "borderless-focus" || next === "controls-hidden")) setValue(12.5);
            }
        }}>{states.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className={cx(samples, embedded && embeddedHost)} data-visual-frame data-visual-host={embedded || undefined}>
            {(["outlined", "filled"] as const).map(appearance => <NumberEdit key={appearance}
                appearance={appearance} label={`${english ? "Alert threshold" : "预警阈值"} · ${appearance}`} aria-label={`NumberEdit ${appearance}`}
                value={value} onValueChange={setValue} allowClear
                min={scientific ? undefined : 0} max={scientific ? undefined : 100000}
                step={0.5} precision={scientific ? undefined : 1}
                thousandSeparator={state === "formatted"} scientific={scientific ? "always" : "never"}
                suffix={scientific ? undefined : "%"}
                disabled={disabled} readOnly={readOnly}
                bordered={!embedded} controls={state !== "controls-hidden"}
                status={status}
                errorText={status === "error" ? (english ? "Review the number and try again." : "请核对内容并修正后重试。") : undefined}
                supportingText={english ? "Use decimals; arrow keys step by 0.5 and blur commits." : "可输入小数；方向键按 0.5 步进，失焦后提交。"}
            />)}
        </div>
    </section>;
}

