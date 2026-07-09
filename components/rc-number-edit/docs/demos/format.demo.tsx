/**
 * title = "千分位与自定义格式化"
 * description = "thousandSeparator 开启千分位分组；formatter/parser 自定义货币、百分比等显示（聚焦编辑时回到原始数值）"
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

const toCurrency = (value: number | null): string =>
    value === null ? "" : `¥ ${value.toLocaleString("zh-CN")}`;

const fromCurrency = (text: string): number | null => {
    const n = Number(text.replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : null;
};

const FormatDemo = () => {
    const [amount, setAmount] = useState<number | null>(1234567);
    const [price, setPrice] = useState<number | null>(8888);
    return (
        <div className={wrapperStyle}>
            <label className={fieldStyle}>
                千分位
                <NumberEdit value={amount} onChange={setAmount} thousandSeparator />
            </label>
            <label className={fieldStyle}>
                货币 formatter
                <NumberEdit value={price} onChange={setPrice} formatter={toCurrency} parser={fromCurrency} />
            </label>
        </div>
    );
};

export default FormatDemo;
