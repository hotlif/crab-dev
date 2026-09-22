export const meta = {
    title: "基础用法",
    description: "最基础的多行文本输入；`rows` 控制初始可视行数，右下角可拖拽调整高度",
};

import { css } from "@crab-dev/css";
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
                label="项目备注"
                supportingText="说明背景、目标和需要关注的限制。"
                appearance="filled"
                value={value}
                rows={3}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default SimpleDemo;
