/**
 * title = "尺寸与偏移"
 * description = "`size` 提供 default / small 两档尺寸；`offset` 可微调角标的定位。"
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

const SizeDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1.5rem;
                flex-wrap: wrap;
            `}
        >
            <Badge count={8} size="default">
                <span className={avatarStyle}>D</span>
            </Badge>
            <Badge count={8} size="small">
                <span className={avatarStyle}>S</span>
            </Badge>
            <Badge count={8} offset={[-6, 6]}>
                <span className={avatarStyle}>O</span>
            </Badge>
        </div>
    );
};

export default SizeDemo;
