import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Slider from "@crab-dev/rc-slider";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-slider/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useState(40);
    return (
        <div className={layout}>
            <Slider min={0} max={100} step={10} value={value} onValueChange={setValue} />
            <Button onClick={() => setValue(40)}>恢复 40%</Button>
            <output>亮度：{value}%</output>
        </div>
    );
}
