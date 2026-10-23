export const meta = {
    title: "标签、边界与状态",
    description: "切换文档站的 macOS、MD3 或 shadcn 主题，对照同一组字段的标签、焦点、错误和禁用反馈。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LineEdit from "../../src/index.js";

const layout = css`
    display: grid;
    gap: ${token.space['group-gap']};
    padding: ${token.space['section-gap']};
`;

export default function FieldStatesDemo() {
    return <div className={layout}>
        <LineEdit label="项目名称" placeholder="例如 Atlas" supportingText="名称将显示在工作区列表。" allowClear defaultValue="Atlas" />
        <LineEdit label="工作邮箱" appearance="filled" placeholder="name@example.com" required errorText="请补全 @ 后的域名。" defaultValue="name@" />
        <LineEdit label="项目编号" readOnly defaultValue="ATLAS-1024" supportingText="只读内容仍可聚焦、选择和复制。" />
        <LineEdit label="组织名称" disabled defaultValue="Atlas Studio" supportingText="只有组织管理员可修改。" />
        <LineEdit aria-label="搜索项目" placeholder="搜索项目" allowClear />
    </div>;
}
