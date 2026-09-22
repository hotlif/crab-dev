import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";
const layout = css`
    display: grid;
    gap: ${token.space["section-gap"]};
    min-width: 0;
`;
const result = css`
    display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["component-gap"]};
    padding: ${token.space["stack-gap"]} ${token.space["section-gap"]};
    border-radius: ${token.shape.medium}; background: ${token.color.surface.low};
    font-size: ${token.typography.body.medium["font-size"]}; color: ${token.color.text.secondary};
    & code { color: ${token.color.brand.primary}; }
`;
export default function Example() {
    const [value, setValue] = useState<string | number>("weekly");
    return (
        <div className={layout}>
            <RadioGroup value={value} onChange={setValue} aria-label="摘要频率" name="notificationFrequency">
                <Radio value="daily">每天</Radio>
                <Radio value="weekly">每周</Radio>
                <Radio value="important">仅重要通知</Radio>
            </RadioGroup>
            <output className={result}>当前组值 <code>{value}</code><span>· 同组始终只选一项</span></output>
        </div>
    );
}
