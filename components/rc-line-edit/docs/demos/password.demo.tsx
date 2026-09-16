export const meta = {
    title: "密码输入",
    description: "设置 `type=\\\"password\\\"` 时右侧自动出现可见性切换按钮（眼睛图标），用户可随时核查已输入的密码内容，降低因误输入导致的挫败感",
};

import { css } from "@crab-dev/css";
import { useId, useState } from "react";
import LineEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 300px;
`;

const PasswordDemo = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const hintId = useId();

    const mismatch = confirm.length > 0 && password !== confirm;

    return (
        <div className={wrapperStyle}>
            <LineEdit
                aria-label="密码"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
            />
            <LineEdit
                aria-label="确认密码"
                aria-describedby={mismatch ? hintId : undefined}
                type="password"
                value={confirm}
                status={mismatch ? "error" : undefined}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="确认密码"
            />
            {mismatch && <p id={hintId}>两次输入的密码不同，请核对后重新输入。</p>}
            <LineEdit type="password" aria-label="禁用密码示例" value="disabled-example" disabled />
            <LineEdit type="password" aria-label="只读密码示例" value="readonly-example" readOnly />
        </div>
    );
};

export default PasswordDemo;
