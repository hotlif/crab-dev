/**
 * title = "加载骨架"
 * description = "loading 时以骨架占位并标注 aria-busy, 结构与真实内容对应, 完成后无跳动切换。"
 */

import { css } from '@linaria/core';
import { useState } from 'react';
import Avatar from '@crab-dev/rc-avatar';
import Button from '@crab-dev/rc-button';
import Card from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 320px;
`;

const coverArtStyle = css`
    height: 140px;
    background: linear-gradient(135deg, oklch(0.8 0.12 150), oklch(0.7 0.14 200));
`;

const LoadingDemo = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div className={stackStyle}>
            <Button appearance="subtle" onClick={() => setLoading((prev) => !prev)}>
                {loading ? '完成加载' : '重新加载'}
            </Button>
            <Card loading={loading} cover={<div className={coverArtStyle} />}>
                <Card.Meta
                    avatar={<Avatar variant="success">禾</Avatar>}
                    title="内容加载完成"
                    description="骨架的封面 / 标题 / 三行正文与真实内容一一对应。"
                />
            </Card>
        </div>
    );
};

export default LoadingDemo;
