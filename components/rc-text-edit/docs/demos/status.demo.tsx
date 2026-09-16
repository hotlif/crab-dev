export const meta = {
    title: "验证状态",
    description: "此示例固定展示 error / warning 两种状态，配合可见文字与 aria-describedby；error 默认提供 aria-invalid。实际业务按校验结果更新 status",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useId, useState } from "react";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['section-gap']};
    padding: ${token.space['card-padding']};
    max-width: 480px;
`;
const fieldStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['inline-gap']};
    > p { margin: 0; font-size: ${token.font.size.caption}; }
`;

const StatusDemo = () => {
    const fieldId = useId();
    const [errorValue, setErrorValue] = useState("内容包含敏感词");
    const [warningValue, setWarningValue] = useState("建议补充更多细节");

    return (
        <div className={wrapperStyle}>
            <div className={fieldStyle}>
            <label htmlFor={`${fieldId}-error`}>备注 · 错误状态示例</label>
            <TextEdit
                id={`${fieldId}-error`}
                aria-describedby={`${fieldId}-error-hint`}
                status="error"
                rows={2}
                value={errorValue}
                onChange={(e) => setErrorValue(e.target.value)}
            />
            <p id={`${fieldId}-error-hint`}>请移除不允许的内容，再重新提交。</p>
            </div>
            <div className={fieldStyle}>
            <label htmlFor={`${fieldId}-warning`}>备注 · 警告状态示例</label>
            <TextEdit
                id={`${fieldId}-warning`}
                aria-describedby={`${fieldId}-warning-hint`}
                status="warning"
                rows={2}
                value={warningValue}
                onChange={(e) => setWarningValue(e.target.value)}
            />
            <p id={`${fieldId}-warning-hint`}>建议补充背景和预期结果，便于团队理解。</p>
            </div>
        </div>
    );
};

export default StatusDemo;
