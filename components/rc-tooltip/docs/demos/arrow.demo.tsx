export const meta = {
    title: "箭头",
    description: "默认无箭头；设置 arrow={true} 可启用项目扩展的箭头样式。",
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

const ArrowDemo = () => {
    return (
        <div className={layoutStyle}>
            <Tooltip title="带箭头" arrow={true}>
                <Button>带箭头</Button>
            </Tooltip>
            <Tooltip title="无箭头" arrow={false}>
                <Button>无箭头（默认）</Button>
            </Tooltip>
        </div>
    );
};

export default ArrowDemo;
