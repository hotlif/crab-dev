import { useState } from "react";
import Card from "@crab-dev/rc-card";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-card/css/index.css";
import "@crab-dev/rc-button/css/index.css";
export default function Example() {
    const [saved, setSaved] = useState(false);
    return (
        <Card
            title="设计规范"
            extra={
                <Button onClick={() => setSaved((value) => !value)}>
                    {saved ? "取消收藏" : "收藏"}
                </Button>
            }
        >
            统一团队的组件用法和交互细节。
            <p aria-live="polite">{saved ? "已收藏" : "尚未收藏"}</p>
        </Card>
    );
}
