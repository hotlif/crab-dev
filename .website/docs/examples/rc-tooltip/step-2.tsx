import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Tooltip from "@crab-dev/rc-tooltip";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-tooltip/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [bottom, setBottom] = useState(false);
    return (
        <div className={layout}>
            <Tooltip title="保存后团队成员可看到修改" placement={bottom ? "bottom" : "top"}>
                <Button>保存</Button>
            </Tooltip>
            <Button onClick={() => setBottom((value) => !value)}>切换提示位置</Button>
        </div>
    );
}
