/**
 * title = "一键清除"
 * description = "设置 `allowClear` 后，有内容时右上角出现清除按钮；开启后文本区常驻预留按钮空间，按钮出现或消失不会引起文本回流"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    padding: 1rem;
    max-width: 480px;
`;

const AllowClearDemo = () => {
    const [value, setValue] = useState("点击右上角按钮可一键清空这段内容。");

    return (
        <div className={wrapperStyle}>
            <TextEdit
                value={value}
                rows={3}
                allowClear
                onClear={() => setValue("")}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default AllowClearDemo;
