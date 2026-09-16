import { useState } from "react";
import Empty from "@crab-dev/rc-empty";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-empty/css/index.css";
import "@crab-dev/rc-button/css/index.css";
export default function Example() {
    const [created, setCreated] = useState(false);
    return created ? (
        <p role="status">项目“设计系统”已创建。</p>
    ) : (
        <Empty
            title="还没有项目"
            description="点击下方按钮开始。"
            action={
                <Button appearance="primary" onClick={() => setCreated(true)}>
                    创建项目
                </Button>
            }
        />
    );
}
