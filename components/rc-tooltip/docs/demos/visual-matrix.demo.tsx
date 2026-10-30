import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Tooltip from "@crab-dev/rc-tooltip";
import Button from "@crab-dev/rc-button";

export const meta = { title: "三体系文字提示矩阵", description: "鼠标、键盘、箭头扩展与长文本在真实浮层中验收。" };
const layout = css`padding: calc(${token.space['section-gap']} * 3); min-height: 20rem; display: grid; justify-items: start; gap: ${token.space['section-gap']}; align-content: start; box-sizing: border-box;`;
export default function VisualMatrixDemo() {
    const [state, setState] = useState("default");
    return <section aria-label="Tooltip visual matrix" className={layout}>
        <label>验收状态<select aria-label="验收状态" value={state} onChange={event => setState(event.target.value)}><option>default</option><option>arrow</option><option>long-text</option></select></label>
        <Tooltip title={state === "long-text" ? "保存当前工作区 Save current workspace — LongWorkspaceIdentifier_0123456789_ABCDEFGHIJKLMN。提示补充说明，不承载必要操作。" : "保存当前工作区 Save workspace"} arrow={state === "arrow"} mouseEnterDelay={100} mouseLeaveDelay={150}>
            <Button appearance="outlined">提示触发器</Button>
        </Tooltip>
        <Button appearance="text">后续操作</Button>
    </section>;
}
