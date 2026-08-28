export const meta = {
    title: "形态与尺寸",
    description: "支持 `circle` / `square` 形态与三档尺寸。",
};

import { css } from "@crab-dev/css";
import Avatar from "../../src/index.js";

const wrapStyle = css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
`;

const ShapeSizeDemo = () => {
    return (
        <div className={wrapStyle}>
            <Avatar size="small">sm</Avatar>
            <Avatar size="middle">md</Avatar>
            <Avatar size="large">lg</Avatar>
            <Avatar shape="square" size="small">sm</Avatar>
            <Avatar shape="square" size="middle">md</Avatar>
            <Avatar shape="square" size="large">lg</Avatar>
        </div>
    );
};

export default ShapeSizeDemo;
