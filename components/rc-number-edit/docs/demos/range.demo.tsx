/**
 * title = "范围、步长与精度"
 * description = "min/max 失焦钳制、到边界步进按钮禁用；step 步长、precision 小数精度；Shift+↑↓ 或 PageUp/Down 走大步长"
 */

import { css } from "@linaria/core";
import { useState } from "react";

import NumberEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 320px;
`;

const fieldStyle = css`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
`;

const RangeDemo = () => {
    const [percent, setPercent] = useState<number | null>(50);
    const [amount, setAmount] = useState<number | null>(1.5);
    return (
        <div className={wrapperStyle}>
            <label className={fieldStyle}>
                0–100，step 5，大步长 25
                <NumberEdit value={percent} onChange={setPercent} min={0} max={100} step={5} largeStep={25} suffix="%" />
            </label>
            <label className={fieldStyle}>
                step 0.1，precision 2
                <NumberEdit value={amount} onChange={setAmount} step={0.1} precision={2} min={0} />
            </label>
        </div>
    );
};

export default RangeDemo;
