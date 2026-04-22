/**
 * title = "动画形态"
 * description = "`pulse` 透明度脉动，性能开销最小；`wave` 高亮带从左向右扫过。"
 */

import { css } from "@linaria/core";

import Skeleton from "../../src/index.js";

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

const labelStyle = css`
    font-size: 12px;
    color: oklch(0.55 0.01 286);
    margin-bottom: 4px;
`;

const AnimationDemo = () => {
    return (
        <div className={stackStyle}>
            <div>
                <div className={labelStyle}>animation = {"\u201cpulse\u201d"}（默认）</div>
                <Skeleton rows={2} animation="pulse" />
            </div>
            <div>
                <div className={labelStyle}>animation = {"\u201cwave\u201d"}</div>
                <Skeleton rows={2} animation="wave" />
            </div>
            <div>
                <div className={labelStyle}>active = false（静态）</div>
                <Skeleton rows={2} active={false} />
            </div>
        </div>
    );
};

export default AnimationDemo;
