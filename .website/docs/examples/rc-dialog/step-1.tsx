import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Dialog from "@crab-dev/rc-dialog";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [open, setOpen] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setOpen(true)}>查看说明</Button>
            <Dialog title="发布说明" open={open} onOpenChange={setOpen}>
                发布后团队成员可以查看当前版本。
            </Dialog>
        </div>
    );
}
