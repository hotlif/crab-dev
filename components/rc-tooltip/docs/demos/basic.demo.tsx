export const meta = {
    title: "基础用法",
    description: "鼠标悬停或键盘聚焦按钮时展示提示文字，按 Escape 关闭。",
};

import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";
import Tooltip from "../../src/index.js";

const layoutStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space["component-gap"]};
    padding: ${token.space["group-gap"]} ${token.space["component-gap"]};
`;

const BasicDemo = () => {
    return (
        <div className={layoutStyle}>
            <Tooltip title="提示文字">
                <Button>悬停或聚焦</Button>
            </Tooltip>
        </div>
    );
};

export default BasicDemo;
