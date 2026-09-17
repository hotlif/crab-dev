import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useControllableValue } from "@crab-dev/rc-hooks";
import Button from "@crab-dev/rc-button";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [count, setCount] = useState(0);
    const [value, setValue] = useControllableValue({
        value: count,
        onChange: setCount,
    });
    return (
        <div className={layout}>
            <Button onClick={() => setValue(value + 1)}>增加数量</Button>
            <Button onClick={() => setCount(0)}>外部归零</Button>
            <output>业务数量：{count}</output>
        </div>
    );
}
