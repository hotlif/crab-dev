import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Segmented from "@crab-dev/rc-segmented";
import "@crab-dev/rc-segmented/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useState<string | number>("周");
    return (
        <div className={layout}>
            <Segmented options={["日", "周", "月"]} value={value} onChange={setValue} />
            <output>当前统计粒度：{value}</output>
        </div>
    );
}
