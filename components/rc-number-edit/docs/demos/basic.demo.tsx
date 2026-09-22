export const meta = {
    title: "基础用法",
    description: "受控数字输入：编辑保留草稿，失焦或步进时提交；支持键盘 ↑↓ 与长按连续加速。",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import token from "@crab-dev/rc-token-semantic";

import NumberEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['stack-gap']};
    padding: ${token.space['section-gap']};
`;

const BasicDemo = () => {
    const [value, setValue] = useState<number | null>(3);
    return (
        <div className={wrapperStyle}>
            <NumberEdit
                label="项目数量"
                supportingText="范围 0–100；也可用方向键调整。"
                appearance="filled"
                value={value}
                onChange={setValue}
                min={0}
                max={100}
            />
            <span>已提交值：{value === null ? "（空）" : value}</span>
        </div>
    );
};

export default BasicDemo;
