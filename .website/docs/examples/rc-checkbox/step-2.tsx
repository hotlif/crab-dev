import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Checkbox from "@crab-dev/rc-checkbox";
import "@crab-dev/rc-checkbox/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [checked, setChecked] = useState(true);
    return (
        <div className={layout}>
            <Checkbox checked={checked} onChange={setChecked}>
                接收项目通知
            </Checkbox>
            <output aria-live="polite">通知{checked ? "已开启" : "已关闭"}</output>
        </div>
    );
}
