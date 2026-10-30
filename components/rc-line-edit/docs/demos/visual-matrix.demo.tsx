import { css, cx } from "@crab-dev/css";
import LineEdit from "@crab-dev/rc-line-edit";
import { useConfig } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";

export const meta = {
    title: "输入状态矩阵",
    description: "同一字段树对照 outlined 与 filled，尺寸、设计和明暗变化保留已输入的草稿。",
};
const scene = css`
    display: grid; gap: ${token.space['group-gap']};
    padding: ${token.space['group-gap']};
    max-width: calc(${token.size[40]} * 18);
    background-color: ${token.color.background.surface}; color: ${token.color.text.primary};
`;
const fields = css`
    display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
    /* The sampled stage includes floating labels and outer focus rings. */
    box-sizing: border-box; padding: ${token.space['group-gap']};
    min-inline-size: 0;
    align-items: start; gap: ${token.space['group-gap']};
`;
const embeddedHost = css`
    background-color: ${token.color.background.elevated};
    border-radius: ${token.shape.control};
`;
const states = ["default", "hover", "focus-visible", "filled", "clear", "error", "filled-error", "warning", "filled-warning", "disabled", "disabled-filled", "read-only", "read-only-filled", "password-hidden", "password-visible", "borderless-focus"] as const;

export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [state, setState] = useState<typeof states[number]>("default");
    const [value, setValue] = useState("");
    const id = useId();
    const english = locale === "en-US";
    const disabled = state === "disabled" || state === "disabled-filled";
    const readOnly = state === "read-only" || state === "read-only-filled";
    const password = state === "password-hidden" || state === "password-visible";
    const embedded = state === "borderless-focus";
    const status = state === "error" || state === "filled-error" ? "error"
        : state === "warning" || state === "filled-warning" ? "warning" : undefined;
    return <section className={scene} aria-label="LineEdit visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{" "}<select id={id} value={state} onChange={event => {
            const next = event.currentTarget.value;
            if (states.some(item => item === next)) {
                setState(next as typeof state);
                if (next === "filled" || (value === "" && ["read-only-filled", "disabled-filled", "filled-error", "filled-warning", "borderless-focus"].includes(next))) {
                    setValue(english ? "Design workspace" : "设计工作台");
                }
                if (value === "" && (next === "password-hidden" || next === "password-visible")) setValue("Crab-visual-42");
            }
        }}>{states.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className={cx(fields, embedded && embeddedHost)} data-visual-frame data-visual-host={embedded || undefined}>
            {(["outlined", "filled"] as const).map(appearance => <LineEdit key={appearance}
                appearance={appearance} label={`${english ? "Project name" : "项目名称"} · ${appearance}`}
                placeholder={english ? "Enter a project name" : "请输入项目名称"}
                value={value}
                type={password ? "password" : "text"} bordered={!embedded}
                onValueChange={setValue} allowClear
                disabled={disabled} readOnly={readOnly}
                status={status}
                errorText={status === "error" ? (english ? "Enter a valid project name." : "请填写有效的项目名称。") : undefined}
                supportingText={english ? "The name appears in the shared project list." : "名称将显示在团队共享项目列表中。"}
            />)}
        </div>
    </section>;
}
