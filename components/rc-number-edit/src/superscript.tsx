import { css } from "@crab-dev/css";

import token from "./token.js";

export interface SuperscriptProps {
    /** 尾数，如 `"1.23"` */
    mantissa: string;
    /** 10 的幂指数 */
    exponent: number;
}

// 普通 inline 容器（非 flex），以便 <sup> 的原生 vertical-align: super 生效
const rootStyle = css`
    color: ${token.display.color};
    white-space: nowrap;
`;

const expStyle = css`
    font-size: ${token.display.superscript['font-size']};
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
