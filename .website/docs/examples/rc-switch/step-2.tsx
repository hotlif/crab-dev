import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Switch from "@crab-dev/rc-switch";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [checked, setChecked] = useState(true);
    return (
        <div className={layout}>
            <Switch checked={checked} onChange={setChecked}>
                接收项目通知
            </Switch>
            <output aria-live="polite">通知{checked ? "已开启" : "已关闭"}</output>
        </div>
    );
}
