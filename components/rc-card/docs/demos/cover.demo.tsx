export const meta = {
    title: "封面与悬浮浮起",
    description: "cover 出血铺满顶部; hoverable 悬浮时卡片浮起、封面同步微缩放。",
};

import { css } from '@crab-dev/css';
import Avatar from '@crab-dev/rc-avatar';
import Card from '../../src/index.js';

const coverArtStyle = css`
    height: 160px;
    background: linear-gradient(135deg, oklch(0.72 0.15 250), oklch(0.62 0.19 300));
`;

const CoverDemo = () => {
    return (
        <Card hoverable cover={<div className={coverArtStyle} />} style={{ maxWidth: 320 }}>
            <Card.Meta
                avatar={<Avatar variant="primary">曦</Avatar>}
                title="晨曦航线"
                description="穿越晨雾的第一班渡轮, 记录海面苏醒的十五分钟。"
            />
        </Card>
    );
};

export default CoverDemo;
