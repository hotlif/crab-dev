export const meta = {
    title: "动画形态",
    description: "`pulse` 透明度脉动，性能开销最小；`wave` 高亮带从左向右扫过。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

import Skeleton from "../../src/index.js";

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["section-gap"]};
    width: 100%;
`;

const labelStyle = css`
    font-size: ${token.font.size.caption};
    color: ${token.color.text.secondary};
    margin-bottom: ${token.space["inline-gap"]};
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
