import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Card from "@crab-dev/rc-card";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [dark, setDark] = useState(false);
    return (
        <div className={layout}>
            <Button onClick={() => setDark((value) => !value)}>
                预览主题：{dark ? "深色" : "浅色"}
            </Button>
            <div data-theme={dark ? "dark" : "light"}>
                <Card title="主题预览">结构和组件属性保持一致，颜色来自语义层。</Card>
            </div>
        </div>
    );
}
