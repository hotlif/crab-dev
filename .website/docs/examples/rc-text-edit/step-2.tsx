import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import TextEdit from "@crab-dev/rc-text-edit";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useState("让开发者能够跟着示例学习。");
    return (
        <div className={layout}>
            <TextEdit
                label="项目说明"
                supportingText="说明目标和验收范围。"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                maxLength={120}
                showCount
            />
            <output>已输入 {value.length} 字</output>
        </div>
    );
}
