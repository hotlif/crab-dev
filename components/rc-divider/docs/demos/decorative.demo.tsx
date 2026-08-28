export const meta = {
    title: "语义线与装饰线",
    description: "默认线会被读屏播报为「分隔线」; 当线只是重复了已有的视觉分组时, 用 decorative 把它移出无障碍树, 避免噪声反馈。",
};

import { css } from '@crab-dev/css';
import Divider from '../../src/index.js';

const cardStyle = css`
    padding: 16px;
    border: 1px solid oklch(0.9 0.004 286);
    border-radius: 8px;
`;

const titleStyle = css`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
`;

const bodyStyle = css`
    margin: 0;
    color: oklch(0.44 0.01 286);
    font-size: 14px;
`;

const DecorativeDemo = () => {
    return (
        <div className={cardStyle}>
            <h4 className={titleStyle}>卡片标题</h4>
            {/* 标题与正文的从属关系已由排版表达, 这条线纯属修饰 —— 让读屏跳过它 */}
            <Divider decorative spacing="small" />
            <p className={bodyStyle}>
                正文内容。这条线不进入无障碍树, 读屏不会在标题与正文之间插入一句「分隔线」。
            </p>
        </div>
    );
};

export default DecorativeDemo;
