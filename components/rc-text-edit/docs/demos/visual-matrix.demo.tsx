import { css } from "@crab-dev/css";
import TextEdit from "@crab-dev/rc-text-edit";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useId, useState } from "react";
import token from "@crab-dev/rc-token-semantic";

export const meta = { title: "三体系字段状态矩阵", description: "同一文本域保留多行草稿，实际验证清除、字数、原生只读与自动高度。" };
const scene = css`
    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};
    max-inline-size: 52rem; min-inline-size: 0; color: ${token.color.text.primary}; background: ${token.color.background.surface};
`;
const samples = css`
    display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-inline-size: 0;
`;
const states = ["default","hover","focus-visible","filled","error","filled-error","warning","filled-warning","disabled","read-only","clear","auto-size","borderless"] as const;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const english = locale === "en-US";
    const [state, setState] = useState<typeof states[number]>("default");
    const [value, setValue] = useState("");
    const id = useId();
    const status = state === "error" || state === "filled-error" ? "error"
        : state === "warning" || state === "filled-warning" ? "warning" : undefined;
    return <section className={scene} aria-label="TextEdit visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{" "}<select id={id} value={state} onChange={event => {
            const next = event.currentTarget.value;
            if (states.some(item => item === next)) {
                setState(next as typeof state);
                if (next === "disabled" || next === "read-only") setValue("保留的多行草稿\nSelected project notes.");
                else if (value === "" && (next === "filled-error" || next === "filled-warning")) setValue("保留的多行草稿\nSelected project notes.");
            }
        }}>{states.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className={samples} data-visual-frame>
            {(["outlined", "filled"] as const).map(appearance => <TextEdit key={appearance}
                appearance={appearance} label={`${english ? "Project notes" : "项目备注"} · ${appearance}`} aria-label={`TextEdit ${appearance}`}
                value={value} onValueChange={setValue} allowClear
                rows={2} maxLength={240} showCount autoSize={state === "auto-size"} bordered={state !== "borderless"}
                disabled={state === "disabled"} readOnly={state === "read-only"}
                status={status}
                errorText={status === "error" ? (english ? "Review your notes and try again." : "请核对内容并修正后重试。") : undefined}
                supportingText={english ? "Share notes in Chinese or English; up to 240 characters." : "用于团队交接，可输入中英文和长文本；最多 240 字。"}
            />)}
        </div>
    </section>;
}

