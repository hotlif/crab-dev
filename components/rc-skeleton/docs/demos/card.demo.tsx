export const meta = {
    title: "组合占位",
    description: "搭配不同 `variant` 可以拼出卡片、列表项等复合占位形态。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

import Skeleton from "../../src/index.js";

const cardStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["stack-gap"]};
    padding: ${token.space["card-padding"]};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background-color: ${token.color.background.surface};
    color: ${token.color.text.primary};
    width: 100%;
    max-width: 360px;
`;

const headerStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.space["component-gap"]};
`;

const metaStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["inline-gap"]};
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
