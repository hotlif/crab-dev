import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Dialog from "@crab-dev/rc-dialog";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-dialog/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [open, setOpen] = useState(false);
    const [published, setPublished] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setOpen(true)}>准备发布</Button>
            <Dialog title="发布版本" open={open} onOpenChange={setOpen}>
                <p>确认发布当前草稿？</p>
                <Button
                    appearance="primary"
                    onClick={() => {
                        setPublished(true);
                        setOpen(false);
                    }}
                >
                    发布版本
                </Button>
            </Dialog>
            <output aria-live="polite">
                {published ? "版本已发布（本地演示）" : "当前为草稿"}
            </output>
        </div>
    );
}
