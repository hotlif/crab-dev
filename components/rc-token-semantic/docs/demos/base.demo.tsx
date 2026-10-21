export const meta = {
    title: "语义颜色与边界",
    description: "表面、文本与边框使用语义令牌，随设计风格和明暗主题同步切换。",
};

import { css } from "@crab-dev/css";
import token from "../../src/index.js";

const surfaceStyle = css`
    display: grid;
    place-items: center;
    width: ${token.size[96]};
    min-height: ${token.size[96]};
    color: ${token.color.text.primary};
    background-color: ${token.color.background.surface};
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.shape.control};
    font-size: ${token.font.size.body};
`;

const BaseDemo = () => <div className={surfaceStyle}>语义表面</div>;

export default BaseDemo;
