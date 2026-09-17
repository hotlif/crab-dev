import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Badge from "@crab-dev/rc-badge";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [count, setCount] = useState(3);
    return (
        <div className={layout}>
            <Badge count={count} showZero>
                <span>未读消息</span>
            </Badge>
            <Button
                disabled={count === 0}
                onClick={() => setCount((value) => Math.max(0, value - 1))}
            >
                读一条
            </Button>
            <output aria-live="polite">剩余 {count} 条未读</output>
        </div>
    );
}
