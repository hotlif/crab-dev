export const meta = {
    title: "基础用法",
    description: "Material 呈现浮动标签与描边缺口，Apple 与 shadcn 呈现上置标签和紧凑输入。通过顶部外观菜单统一切换。",
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
