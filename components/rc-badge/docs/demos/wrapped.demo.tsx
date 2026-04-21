/**
 * title = "包裹子节点"
 * description = "将 Badge 包裹在按钮、头像等元素外部，角标会自动定位到右上角。"
 */

import { css } from "@linaria/core";
import Badge from "../../src/index.js";

const avatarStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: oklch(0.9 0 0);
    color: oklch(0.3 0 0);
    font-size: 14px;
    font-weight: 500;
`;

const WrappedDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1.5rem;
                flex-wrap: wrap;
            `}
        >
            <Badge count={5}>
                <span className={avatarStyle}>U</span>
            </Badge>
            <Badge count={99}>
                <span className={avatarStyle}>A</span>
            </Badge>
            <Badge count={200} overflowCount={99}>
                <span className={avatarStyle}>B</span>
            </Badge>
            <Badge dot>
                <span className={avatarStyle}>C</span>
            </Badge>
        </div>
    );
};

export default WrappedDemo;
