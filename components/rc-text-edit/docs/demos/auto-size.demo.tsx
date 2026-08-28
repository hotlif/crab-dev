export const meta = {
    title: "高度自适应",
    description: "设置 `autoSize` 后高度随内容自动增长（CSS field-sizing，浏览器不支持时按 `rows` 回退）；开启后手动拖拽调整被禁用，两种高度控制方式不会互相冲突",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    padding: 1rem;
    max-width: 480px;
`;

const AutoSizeDemo = () => {
    const [value, setValue] = useState("继续输入更多行，输入框会随内容自动长高。");

    return (
        <div className={wrapperStyle}>
            <TextEdit
                value={value}
                rows={2}
                autoSize
                placeholder="输入多行内容试试"
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default AutoSizeDemo;
