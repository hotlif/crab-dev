export const meta = {
    title: "基础用法",
    description: "通过 `open` 控制显示；点击遮罩、关闭按钮或按 `Esc` 均可关闭。",
};

import { useState } from "react";
import Button from "@crab-dev/rc-button";

import Drawer from "../../src/index.js";

const BasicDemo = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>打开抽屉</Button>
            <Drawer open={open} onOpenChange={setOpen} title="基本信息">
                <p>这里是抽屉的主体内容，可承载任意 React 节点。</p>
                <p>内容区自带滚动，超出部分会在内部滚动而不影响底部页面。</p>
            </Drawer>
        </>
    );
};

export default BasicDemo;
