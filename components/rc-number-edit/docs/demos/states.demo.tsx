export const meta = {
    title: "尺寸与状态",
    description: "large / middle / small 三档尺寸；error / warning 校验状态；disabled 禁用、readOnly 只读，均透传自 rc-line-edit",
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

const StatesDemo = () => {
    const [value, setValue] = useState<number | null>(42);
    return (
        <div className={wrapperStyle}>
            <NumberEdit value={value} onChange={setValue} size="large" />
            <NumberEdit value={value} onChange={setValue} size="middle" />
            <NumberEdit value={value} onChange={setValue} size="small" />
            <NumberEdit value={value} onChange={setValue} status="error" />
            <NumberEdit value={value} onChange={setValue} status="warning" />
            <NumberEdit value={value} onChange={setValue} disabled />
            <NumberEdit value={value} onChange={setValue} readOnly />
        </div>
    );
};

export default StatesDemo;
