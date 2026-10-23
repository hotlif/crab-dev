export const meta = {
    title: "封面与悬停反馈",
    description: "cover 出血铺满顶部；hoverable 显示状态层并提升一级阴影，封面保持原尺寸。",
};

import { css } from '@crab-dev/css';
import Avatar from '@crab-dev/rc-avatar';
import token from '@crab-dev/rc-token-semantic';
import Card from '../../src/index.js';

const cardStyle = css`max-width: calc(${token.size[64]} * 5);`;
const coverArtStyle = css`
    height: calc(${token.size[64]} * 2 + ${token.size[32]});
    background: linear-gradient(135deg, ${token.color.brand.container}, ${token.color.secondary.container});
`;

const CoverDemo = () => {
    return (
        <Card hoverable cover={<div className={coverArtStyle} />} className={cardStyle}>
            <Card.Meta
                avatar={<Avatar variant="primary">曦</Avatar>}
                title="晨曦航线"
                description="穿越晨雾的第一班渡轮, 记录海面苏醒的十五分钟。"
            />
        </Card>
    );
};

export default CoverDemo;
