import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Alert from "@crab-dev/rc-alert";
import "@crab-dev/rc-alert/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [closed, setClosed] = useState(false);
    return (
        <div className={layout}>
            <Alert type="success" title="保存完成" closable onClose={() => setClosed(true)}>
                资料已更新。
            </Alert>
            <output aria-live="polite">{closed ? "提示已关闭" : "试着关闭提示"}</output>
        </div>
    );
}
