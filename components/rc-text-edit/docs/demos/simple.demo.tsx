/**
 * title = "基础用法"
 * description = "最基础的多行文本输入；`rows` 控制初始可视行数，右下角可拖拽调整高度"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    padding: 1rem;
    max-width: 480px;
`;

const SimpleDemo = () => {
    const [value, setValue] = useState("");

    return (
        <div className={wrapperStyle}>
            <TextEdit
                value={value}
                rows={3}
                placeholder="请输入备注"
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default SimpleDemo;
