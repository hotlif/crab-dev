import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";
import "@crab-dev/rc-radio/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useState<string | number>("weekly");
    return (
        <div className={layout}>
            <RadioGroup value={value} onChange={setValue}>
                <Radio value="daily">每天</Radio>
                <Radio value="weekly">每周</Radio>
            </RadioGroup>
            <output>提交值：{value}</output>
        </div>
    );
}
