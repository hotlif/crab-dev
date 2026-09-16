import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { CheckableTag } from "@crab-dev/rc-tag";
import "@crab-dev/rc-tag/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [checked, setChecked] = useState(false);
    return (
        <div className={layout}>
            <CheckableTag checked={checked} onChange={setChecked}>
                只看设计任务
            </CheckableTag>
            <output>{checked ? "已启用设计任务筛选" : "显示全部任务"}</output>
        </div>
    );
}
