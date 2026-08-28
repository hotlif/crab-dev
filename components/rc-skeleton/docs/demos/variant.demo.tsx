export const meta = {
    title: "形状变体",
    description: "通过 `variant` 选择占位形状：`text` / `rect` / `circle` / `button` / `avatar` / `image`。",
};

import { css } from "@crab-dev/css";

import Skeleton from "../../src/index.js";

const rowStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
`;

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

const VariantDemo = () => {
    return (
        <div className={stackStyle}>
            <div className={rowStyle}>
                <Skeleton variant="avatar" />
                <Skeleton variant="circle" width={56} />
                <Skeleton variant="button" />
                <Skeleton variant="button" width={120} round />
            </div>
            <Skeleton variant="image" height={180} />
            <Skeleton variant="rect" height={64} />
        </div>
    );
};

export default VariantDemo;
