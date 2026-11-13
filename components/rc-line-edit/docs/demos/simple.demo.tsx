export const meta = {
    title: "基础用法",
    description: "使用上置标签编辑单行内容，字段尺寸、表面和焦点反馈继承当前文档主题。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LineEdit from "../../src/index.js";

const wrapperStyle = css`
    padding: ${token.space['card-padding']};
    display: grid;
    gap: ${token.space['group-gap']};
`;

const SimpleDemo = () => {
    return (
        <div className={wrapperStyle}>
            <LineEdit label="项目名称" supportingText="用于团队首页和项目列表。" />
            <LineEdit label="项目编号" defaultValue="CRAB-2026" readOnly supportingText="编号可选择和复制。" />
        </div>
    );
};

export default SimpleDemo;
