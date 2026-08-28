export const meta = {
    title: "字符计数",
    description: "设置 `showCount` 后在右下角实时显示已输入字符数；配合 `maxLength` 使用时显示「已输入 / 上限」格式，并在输入层直接阻止超出上限（输入约束前置）",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    padding: 1rem;
    max-width: 480px;
`;

const ShowCountDemo = () => {
    const [value, setValue] = useState("一段不超过一百字的简介。");

    return (
        <div className={wrapperStyle}>
            <TextEdit
                value={value}
                rows={3}
                showCount
                maxLength={100}
                placeholder="简介（100 字以内）"
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default ShowCountDemo;
