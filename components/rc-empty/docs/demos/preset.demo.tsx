
export const meta = {
    title: "预置场景",
    description: "三种内置场景：`default`（无数据）、`search`（搜索无结果）、`no-permission`（无权限）。每种预置均内置图示与文案，基于设计心理学为不同情绪场景匹配合适的视觉传达。",
};

import Empty from "../../src/index.js";
import { css } from "@crab-dev/css";
import token from '@crab-dev/rc-token-semantic';

const wrapStyle = css`
    display: flex;
    gap: ${token.space['section-gap']};
    flex-wrap: wrap;
    align-items: flex-start;
`;

const cardStyle = css`
    flex: 1;
    min-width: 220px;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    overflow: hidden;
`;

const PresetDemo = () => {
    return (
        <div className={wrapStyle}>
            <div className={cardStyle}>
                <Empty preset="default" />
            </div>
            <div className={cardStyle}>
                <Empty preset="search" />
            </div>
            <div className={cardStyle}>
                <Empty preset="no-permission" />
            </div>
        </div>
    );
};

export default PresetDemo;
