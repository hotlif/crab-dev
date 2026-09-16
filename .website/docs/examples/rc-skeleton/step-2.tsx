import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Skeleton from "@crab-dev/rc-skeleton";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-skeleton/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [loading, setLoading] = useState(true);
    return (
        <div className={layout}>
            <Button onClick={() => setLoading((value) => !value)}>
                {loading ? "显示内容" : "显示骨架"}
            </Button>
            <Skeleton loading={loading} rows={3}>
                <p>设计系统帮助团队统一组件、样式与交互。</p>
            </Skeleton>
        </div>
    );
}
