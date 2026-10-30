import { css } from "@crab-dev/css";
import Spin from "@crab-dev/rc-spin";
import Switch from "@crab-dev/rc-switch";
import { useConfig } from "@crab-dev/rc-config-provider";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";

export const meta = { title: "三体系加载状态矩阵", description: "环形、Expressive、包裹、延迟、自定义与结束状态；动画保留原始时间序列。" };
const scene = css`
    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; max-inline-size: 36rem;
    background: ${token.color.background.surface}; color: ${token.color.text.primary};
`;
const samples = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-block-size: 8rem; min-inline-size: 0;`;
const content = css`padding: ${token.space['group-gap']}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.medium};`;
const states = ["default", "expressive", "overlay", "idle", "delayed", "custom"] as const;
export default function VisualMatrixDemo() {
    const { size, locale } = useConfig();
    const [state, setState] = useState<typeof states[number]>("default");
    const [started, setStarted] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const id = useId();
    const english = locale === "en-US";
    const wrapped = state === "overlay" || state === "idle";
    return <section className={scene} aria-label="Spin visual matrix" data-visual-scene data-state={state} data-size={size}>
        <div><label htmlFor={id}>验收状态</label>{" "}<select id={id} value={state} onChange={event => {
            const next = event.currentTarget.value;
            if (states.some(item => item === next)) { setState(next as typeof state); setStarted(false); }
        }}>{states.map(item => <option key={item}>{item}</option>)}</select></div>
        {state === "delayed" && <Switch checked={started} onCheckedChange={setStarted} aria-label="Start delayed request">{english ? "Start delayed request" : "开始延迟请求"}</Switch>}
        <div className={samples} data-visual-frame>
            <Spin spinning={state !== "idle" && (state !== "delayed" || started)} delay={state === "delayed" ? 600 : 0}
                variant={state === "expressive" ? "expressive" : "circular"}
                tip={english ? "Refreshing the project list and preserving your current draft" : "正在刷新项目列表，保留当前编辑草稿"}
                indicator={state === "custom" ? <span aria-hidden="true">⌛</span> : undefined}>
                {wrapped ? <div className={content}><p>{english ? "Project draft" : "项目草稿"}</p><Switch checked={enabled} onCheckedChange={setEnabled}>{english ? "Allow editing" : "允许编辑"}</Switch></div> : undefined}
            </Spin>
        </div>
    </section>;
}
