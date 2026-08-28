export const meta = {
    title: "科学计数法自适应",
    description: "默认十进制；数值大到不好显示时失焦自动切上标科学计数法，聚焦又展开为可编辑 e 记法。试试输入 1e21 或 0.0000000000000001",
};

import { css } from "@crab-dev/css";
import { useState } from "react";

import NumberEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    max-width: 320px;
`;

const ScientificDemo = () => {
    const [value, setValue] = useState<number | null>(1.23e21);
    return (
        <div className={wrapperStyle}>
            <NumberEdit value={value} onChange={setValue} />
            <span>原始值：{value === null ? "（空）" : String(value)}</span>
        </div>
    );
};

export default ScientificDemo;
