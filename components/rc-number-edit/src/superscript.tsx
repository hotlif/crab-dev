import { css } from "@crab-dev/css";

import token from "./token.js";

export interface SuperscriptProps {
    /** 尾数，如 `"1.23"` */
    mantissa: string;
    /** 10 的幂指数 */
    exponent: number;
}

// Keep the main text's input line box and align the semantic exponent within it.
const rootStyle = css`
    display: inline-flex;
    align-items: baseline;
    white-space: nowrap;
`;

const expStyle = css`
    font-size: ${token.display.superscript['font-size']};
    /* Flex alignment replaces native super positioning without inheriting the fixed input line-height. */
    align-self: flex-start;
    line-height: normal;
`;

/** 科学计数法上标呈现：mantissa × 10^exponent，用真正的 <sup> 渲染指数。 */
function Superscript({ mantissa, exponent }: SuperscriptProps) {
    return (
        <span className={rootStyle}>
            {mantissa}
            {"×10"}
            <sup className={expStyle}>{exponent}</sup>
        </span>
    );
}

export default Superscript;
