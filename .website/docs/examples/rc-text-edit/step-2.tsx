import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import TextEdit from "@crab-dev/rc-text-edit";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const fieldStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    width: 100%;
    min-width: 0;
    max-width: calc(${token.space["section-gap"]} * 24);
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.label};
`;
export default function Example() {
    const [value, setValue] = useState("让开发者能够跟着示例学习。");
    return (
        <div className={layout}>
            <label className={fieldStyle}>
                项目说明（最多 120 字）
                <TextEdit
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    maxLength={120}
                    showCount
                />
            </label>
            <output>已输入 {value.length} 字</output>
        </div>
    );
}
