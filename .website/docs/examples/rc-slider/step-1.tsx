import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Slider from "@crab-dev/rc-slider";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useState(40);
    return (
        <div className={layout}>
            <Slider min={0} max={100} value={value} onValueChange={setValue} />
            <output>亮度：{value}%</output>
        </div>
    );
}
