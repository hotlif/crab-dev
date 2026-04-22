/**
 * title = "组合占位"
 * description = "搭配不同 `variant` 可以拼出卡片、列表项等复合占位形态。"
 */

import { css } from "@linaria/core";

import Skeleton from "../../src/index.js";

const cardStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid oklch(0.9 0.004 286);
    border-radius: 8px;
    width: 100%;
    max-width: 360px;
`;

const headerStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const metaStyle = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
`;

const CardDemo = () => {
    return (
        <div className={cardStyle}>
            <div className={headerStyle}>
                <Skeleton variant="avatar" />
                <div className={metaStyle}>
                    <Skeleton size="medium" width="50%" />
                    <Skeleton size="small" width="30%" />
                </div>
            </div>
            <Skeleton variant="image" height={140} />
            <Skeleton rows={3} />
        </div>
    );
};

export default CardDemo;
