export const meta = {
    title: "验证状态",
    description: "通过 `status` 属性设置 `error` 或 `warning` 验证状态。失焦时触发校验，边框颜色随状态改变，配合提示文字形成完整反馈闭环",
};

import { css } from "@crab-dev/css";
import { useId, useState } from "react";
import token from "@crab-dev/rc-token-semantic";
import LineEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['group-gap']};
    padding: ${token.space['card-padding']};
    max-width: 300px;
`;

const fieldStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['inline-gap']};
`;

const hintStyle = css`
    font-size: ${token.font.size.caption};
    margin: 0;
`;

const errorHintStyle = css`
    color: ${token.color.feedback.error.text};
`;

const warningHintStyle = css`
    color: ${token.color.feedback.warning.text};
`;

type FieldStatus = "error" | "warning" | undefined;

const validate = (value: string): FieldStatus => {
    if (!value.trim()) return "error";
    if (value.length < 6) return "warning";
    return undefined;
};

const StatusDemo = () => {
    const fieldId = useId();
    const [email, setEmail] = useState("");
    const [emailStatus, setEmailStatus] = useState<FieldStatus>();

    const [name, setName] = useState("");
    const [nameStatus, setNameStatus] = useState<FieldStatus>();

    return (
        <div className={wrapperStyle}>
            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-email`}>邮箱</label>
                <LineEdit
                    id={`${fieldId}-email`}
                    aria-describedby={emailStatus ? `${fieldId}-email-hint` : undefined}
                    value={email}
                    status={emailStatus}
                    placeholder="邮箱（失焦后触发校验）"
                    onChange={(e) => { setEmail(e.target.value); setEmailStatus(undefined); }}
                    onBlur={() => setEmailStatus(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : "error")}
                />
                {emailStatus === "error" && (
                    <p id={`${fieldId}-email-hint`} className={`${hintStyle} ${errorHintStyle}`}>请填写完整邮箱，例如 name@example.com</p>
                )}
            </div>

            <div className={fieldStyle}>
                <label htmlFor={`${fieldId}-name`}>用户名</label>
                <LineEdit
                    id={`${fieldId}-name`}
                    aria-describedby={nameStatus ? `${fieldId}-name-hint` : undefined}
                    value={name}
                    status={nameStatus}
                    placeholder="用户名（至少 6 个字符）"
                    onChange={(e) => { setName(e.target.value); setNameStatus(undefined); }}
                    onBlur={() => setNameStatus(validate(name))}
                />
                {nameStatus === "error" && (
                    <p id={`${fieldId}-name-hint`} className={`${hintStyle} ${errorHintStyle}`}>用户名不能为空</p>
                )}
                {nameStatus === "warning" && (
                    <p id={`${fieldId}-name-hint`} className={`${hintStyle} ${warningHintStyle}`}>用户名过短，建议至少 6 个字符</p>
                )}
            </div>
        </div>
    );
};

export default StatusDemo;
