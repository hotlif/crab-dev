/**
 * title = "验证状态"
 * description = "`status` 设置 error / warning 边框与焦点光环，为表单校验提供即时反馈；请同时配合错误文案与 `aria-invalid` 使用，不要只靠颜色传达状态"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 480px;
`;

const StatusDemo = () => {
    const [errorValue, setErrorValue] = useState("内容包含敏感词");
    const [warningValue, setWarningValue] = useState("建议补充更多细节");

    return (
        <div className={wrapperStyle}>
            <TextEdit
                status="error"
                rows={2}
                value={errorValue}
                aria-invalid
                onChange={(e) => setErrorValue(e.target.value)}
            />
            <TextEdit
                status="warning"
                rows={2}
                value={warningValue}
                onChange={(e) => setWarningValue(e.target.value)}
            />
        </div>
    );
};

export default StatusDemo;
