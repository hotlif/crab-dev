export const meta = {
    title: "加载骨架",
    description: "loading 时以骨架占位并标注 aria-busy, 结构与真实内容对应, 完成后无跳动切换。",
};

import { css } from '@crab-dev/css';
import { useState } from 'react';
import Avatar from '@crab-dev/rc-avatar';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';
import Card from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['section-gap']};
    max-width: calc(${token.size[64]} * 5);
`;

const coverArtStyle = css`
    height: calc(${token.size[64]} * 2 + ${token.space['inline-gap']});
    background: linear-gradient(135deg, ${token.color.brand.container}, ${token.color.secondary.container});
`;

const LoadingDemo = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div className={stackStyle}>
            <Button appearance="outlined" onClick={() => setLoading((prev) => !prev)}>
                {loading ? '完成加载' : '重新加载'}
            </Button>
            <Card loading={loading} cover={<div className={coverArtStyle} />}>
                <Card.Meta
                    avatar={<Avatar variant="success">禾</Avatar>}
                    title="内容加载完成"
                    description="骨架的封面 / 标题 / 三行正文与真实内容一一对应。"
                />
            </Card>
            <span role="status">{loading ? '正在加载卡片内容。' : '卡片内容已加载。'}</span>
        </div>
    );
};

export default LoadingDemo;
