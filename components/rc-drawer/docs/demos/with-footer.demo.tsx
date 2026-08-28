export const meta = {
    title: "底部操作区",
    description: "通过 `footer` 传入操作按钮，适合承载表单提交场景。",
};

import { useState } from "react";
import Button from "@crab-dev/rc-button";

import Drawer from "../../src/index.js";

const WithFooterDemo = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>提交表单</Button>
            <Drawer
                open={open}
                onOpenChange={setOpen}
                title="编辑信息"
                size="large"
                footer={
                    <>
                        <Button onClick={() => setOpen(false)}>取消</Button>
                        <Button appearance="primary" onClick={() => setOpen(false)}>
                            保存
                        </Button>
                    </>
                }
            >
                <p>将表单内容放在这里。底部操作区会贴合抽屉下沿，始终可见。</p>
            </Drawer>
        </>
    );
};

export default WithFooterDemo;
