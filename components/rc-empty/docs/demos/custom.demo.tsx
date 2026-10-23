
export const meta = {
    title: "自定义内容",
    description: "通过 `image`、`title`、`description` 完全自定义内容。传入 `null` 可隐藏对应区域。",
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
    min-width: 200px;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    overflow: hidden;
`;

const emojiStyle = css`
    font-size: 56px;
    line-height: 1;
    user-select: none;
`;

const CustomDemo = () => {
    return (
        <div className={wrapStyle}>
            {/* 自定义图像 */}
            <div className={cardStyle}>
                <Empty
                    image={<span className={emojiStyle}>📭</span>}
                    title="收件箱是空的"
                    description="新邮件会在这里显示"
                />
            </div>

            {/* 隐藏描述 */}
            <div className={cardStyle}>
                <Empty
                    preset="search"
                    title="没有找到「React」"
                    description={null}
                />
            </div>

            {/* 仅图示，无文字 */}
            <div className={cardStyle}>
                <Empty
                    title={null}
                    description={null}
                />
            </div>
        </div>
    );
};

export default CustomDemo;
