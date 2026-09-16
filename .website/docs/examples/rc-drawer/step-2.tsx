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
    const [done, setDone] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setOpen(true)}>处理项目</Button>
            <Drawer title="项目详情" open={open} onOpenChange={setOpen}>
                <p>完成后返回当前列表。</p>
                <Button
                    onClick={() => {
                        setDone(true);
                        setOpen(false);
                    }}
                >
                    标记完成
                </Button>
            </Drawer>
            <output aria-live="polite">{done ? "项目已完成" : "项目进行中"}</output>
        </div>
    );
}
