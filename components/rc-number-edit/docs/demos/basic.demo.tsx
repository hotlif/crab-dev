export const meta = {
    title: "基础用法",
    description: "受控数字输入：右侧步进按钮、键盘 ↑↓ 步进、长按连续加速",
};

import { css } from "@crab-dev/css";
import { useState } from "react";

import NumberEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
`;

const BasicDemo = () => {
    const [value, setValue] = useState<number | null>(3);
    return (
        <div className={wrapperStyle}>
            <NumberEdit value={value} onChange={setValue} min={0} max={100} />
            <span>当前值：{value === null ? "（空）" : value}</span>
        </div>
    );
};

export default BasicDemo;
