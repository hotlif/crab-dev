export const meta = {
    title: "科学计数法自适应",
    description: "默认十进制；数值大到不好显示时失焦自动切上标科学计数法，聚焦又展开为可编辑 e 记法。试试输入 1e21 或 0.0000000000000001",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";

import NumberEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["section-gap"]};
    min-width: 0;
    max-width: 320px;
`;

const fieldStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["inline-gap"]};
`;

const ScientificDemo = () => {
    const fieldId = useId();
    const [value, setValue] = useState<number | null>(1.23e21);
    return (
        <div className={wrapperStyle}>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-0`}>科学计数法数值</label>
                <NumberEdit id={`${fieldId}-0`} value={value} onChange={setValue} />
            </div>
            <span>原始值：{value === null ? "（空）" : String(value)}</span>
        </div>
    );
};

export default ScientificDemo;
