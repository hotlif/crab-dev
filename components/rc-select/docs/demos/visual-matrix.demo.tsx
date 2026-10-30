import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Select from "@crab-dev/rc-select";

export const meta = { title: "三体系状态矩阵", description: "同一字段对照真实键盘、选择、搜索、校验与加载状态。" };
const layout = css`
    display: grid;
    gap: ${token.space['section-gap']};
    padding: ${token.space['section-gap']};
    width: min(100%, 28rem);
    min-height: 24rem;
    box-sizing: border-box;
`;
const options = [
    { label: "设计 Design", value: "design" },
    { label: "工程 Engineering", value: "engineering" },
    { label: "归档 Archived", value: "archived", disabled: true },
];
export default function VisualMatrixDemo() {
    const [state, setState] = useState("default");
    return <section aria-label="Select visual matrix" className={layout}>
        <label>验收状态<select aria-label="验收状态" value={state} onChange={event => setState(event.target.value)}>
            {["default", "error", "warning", "disabled", "multiple", "empty", "loading"].map(value => <option key={value}>{value}</option>)}
        </select></label>
        {state === "multiple" ? <Select aria-label="团队" label="团队 Team" multiple options={options} allowClear defaultValue={["design", "engineering"]} /> : <Select
            aria-label="团队" label="团队 Team" options={state === "empty" || state === "loading" ? [] : options}
            disabled={state === "disabled"} loading={state === "loading"} searchable allowClear
            errorText={state === "error" ? "请选择一个有效团队。" : undefined} status={state === "warning" ? "warning" : undefined}
            supportingText="选择负责本次交付的团队。" placeholder="搜索或选择团队"
        />}
        <Select aria-label="填充团队" label="填充团队" options={options} appearance="filled" defaultValue="design" supportingText="同一配置边界内的填充外观。" />
        <output aria-label="状态说明">配置切换保留当前选择和输入草稿。</output>
    </section>;
}
