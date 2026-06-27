/**
 * title = "验证状态"
 * description = "通过 `status` 属性设置 `error` 或 `warning` 验证状态。失焦时触发校验，边框颜色随状态改变，配合提示文字形成完整反馈闭环"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import LineEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1rem;
    max-width: 300px;
`;

const fieldStyle = css`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const hintStyle = css`
    font-size: 12px;
    margin: 0;
`;

const errorHintStyle = css`
    color: oklch(0.637 0.237 24);
`;

const warningHintStyle = css`
    color: oklch(0.769 0.188 75);
`;

type FieldStatus = "error" | "warning" | undefined;

const validate = (value: string): FieldStatus => {
    if (!value.trim()) return "error";
    if (value.length < 6) return "warning";
    return undefined;
};

const StatusDemo = () => {
    const [email, setEmail] = useState("");
    const [emailStatus, setEmailStatus] = useState<FieldStatus>();

    const [name, setName] = useState("");
    const [nameStatus, setNameStatus] = useState<FieldStatus>();

    return (
        <div className={wrapperStyle}>
            <div className={fieldStyle}>
                <LineEdit
                    value={email}
                    status={emailStatus}
                    placeholder="邮箱（失焦后触发校验）"
                    onChange={(e) => { setEmail(e.target.value); setEmailStatus(undefined); }}
                    onBlur={() => setEmailStatus(validate(email))}
                />
                {emailStatus === "error" && (
                    <p className={`${hintStyle} ${errorHintStyle}`}>邮箱不能为空</p>
                )}
                {emailStatus === "warning" && (
                    <p className={`${hintStyle} ${warningHintStyle}`}>邮箱过短，请检查是否填写完整</p>
                )}
            </div>

            <div className={fieldStyle}>
                <LineEdit
                    value={name}
                    status={nameStatus}
                    placeholder="用户名（至少 6 个字符）"
                    onChange={(e) => { setName(e.target.value); setNameStatus(undefined); }}
                    onBlur={() => setNameStatus(validate(name))}
                />
                {nameStatus === "error" && (
                    <p className={`${hintStyle} ${errorHintStyle}`}>用户名不能为空</p>
                )}
                {nameStatus === "warning" && (
                    <p className={`${hintStyle} ${warningHintStyle}`}>用户名过短，建议至少 6 个字符</p>
                )}
            </div>
        </div>
    );
};

export default StatusDemo;
