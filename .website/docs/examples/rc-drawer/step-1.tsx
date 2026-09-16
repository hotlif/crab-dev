import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Drawer from "@crab-dev/rc-drawer";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-drawer/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [open, setOpen] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setOpen(true)}>查看项目详情</Button>
            <Drawer title="项目详情" open={open} onOpenChange={setOpen}>
                <p>名称：设计系统</p>
            </Drawer>
        </div>
    );
}
