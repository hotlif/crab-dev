export const meta = {
    title: "基础用法",
    description: "三主题统一呈现上置标签，MD3 采用紧凑桌面尺寸并保留色调表面与状态边框。通过顶部外观菜单统一切换。",
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
