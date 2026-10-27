export const meta = {
    title: "尺寸与状态",
    description: "large / medium / small 三档尺寸；error / warning 校验状态；disabled 禁用、readOnly 只读，均透传自 rc-line-edit",
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

const StatesDemo = () => {
    const fieldId = useId();
    const [value, setValue] = useState<number | null>(42);
    return (
        <div className={wrapperStyle}>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-0`}>大尺寸</label>
                <NumberEdit id={`${fieldId}-0`} value={value} onValueChange={setValue} size="large" />
            </div>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-1`}>中尺寸</label>
                <NumberEdit id={`${fieldId}-1`} value={value} onValueChange={setValue} size="medium" />
            </div>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-2`}>小尺寸</label>
                <NumberEdit id={`${fieldId}-2`} value={value} onValueChange={setValue} size="small" />
            </div>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-3`}>错误状态</label>
                <NumberEdit id={`${fieldId}-3`} value={value} onValueChange={setValue} status="error" />
            </div>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-4`}>警告状态</label>
                <NumberEdit id={`${fieldId}-4`} value={value} onValueChange={setValue} status="warning" />
            </div>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-5`}>禁用状态</label>
                <NumberEdit id={`${fieldId}-5`} value={value} onValueChange={setValue} disabled />
            </div>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-6`}>只读状态</label>
                <NumberEdit id={`${fieldId}-6`} value={value} onValueChange={setValue} readOnly />
            </div>
        </div>
    );
};

export default StatesDemo;
