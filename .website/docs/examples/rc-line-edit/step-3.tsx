import LineEdit from "@crab-dev/rc-line-edit";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useState } from "react";

const grid = css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${token.space['group-gap']};
    width: 100%;
    padding-block: ${token.space['section-gap']};
    @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`;

export default function Example() {
    const [email, setEmail] = useState("hello@");
    const [checked, setChecked] = useState(true);
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return <div className={grid}>
        <LineEdit label="联系邮箱" type="email" value={email}
            onChange={event => { setEmail(event.target.value); setChecked(false); }}
            onBlur={() => setChecked(true)}
            supportingText="用于接收项目邀请。"
            errorText={checked && !valid ? "邮箱不完整，请补全域名，例如 hello@crab.dev。" : undefined} />
        <LineEdit label="访问密码" type="password" defaultValue="Crab-design-3" supportingText="点击眼睛图标核对内容。" />
        <LineEdit label="项目编号" readOnly defaultValue="CRAB-2026-001" supportingText="只读：仍可聚焦、选择与复制。" />
        <LineEdit appearance="filled" label="团队空间" disabled defaultValue="设计工作室" supportingText="暂不可编辑，请联系空间管理员。" />
    </div>;
}
