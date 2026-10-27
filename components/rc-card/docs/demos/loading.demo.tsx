export const meta = {
    title: "加载骨架",
    description: "用 loadingContent 让封面、头像和文字占位共享真实布局，加载完成后无跳动切换。",
};

import { css } from '@crab-dev/css';
import { useState } from 'react';
import Avatar from '@crab-dev/rc-avatar';
import Button from '@crab-dev/rc-button';
import Card from '@crab-dev/rc-card';
import Skeleton from '@crab-dev/rc-skeleton';
import token from '@crab-dev/rc-token-semantic';

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['section-gap']};
    width: 100%;
    max-width: calc(${token.size[64]} * 5);
`;

const coverStyle = css`
    block-size: calc(${token.size[64]} * 2 + ${token.space['inline-gap']});
`;

const coverArtStyle = css`
    block-size: 100%;
    background: linear-gradient(135deg, ${token.color.brand.container}, ${token.color.secondary.container});
`;

const avatarSlotStyle = css`
    display: flex;
    inline-size: ${token.size[32]};
    block-size: ${token.size[32]};
`;

// Each slot follows Card.Meta's actual title/description line-height. The ink
// occupies less than the slot so adjacent loading lines remain distinguishable.
// Text can ellipsize; neither branch fixes the whole Card height.
const lineStyle = css`
    display: block;
    block-size: 1lh;
    min-inline-size: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const textPlaceholderStyle = css`
    margin-block: 0.2lh;
`;

const description = ['骨架与封面对应。', '标题与头像对齐。', '三行正文保持位置。'];

function content(placeholder: boolean) {
    return [
        <Card.Cover key="cover" className={coverStyle} data-card-loading-cover="">
            {placeholder
                ? <Skeleton variant="rect" width="100%" height="100%" data-card-loading-placeholder="true" />
                : <div className={coverArtStyle} data-card-loading-content="true" />}
        </Card.Cover>,
        <Card.Body key="body" data-card-loading-body="">
            <Card.Meta
                data-card-loading-meta=""
                avatar={<span className={avatarSlotStyle} data-card-loading-slot="avatar">
                    {placeholder
                        ? <Skeleton variant="circle" width={32} height={32} data-card-loading-placeholder="true" />
                        : <Avatar size={32} variant="success" data-card-loading-content="true">禾</Avatar>}
                </span>}
                title={<span className={lineStyle} data-card-loading-slot="title">
                    {placeholder
                        ? <Skeleton variant="rect" width="55%" height="0.6lh" className={textPlaceholderStyle} data-card-loading-placeholder="true" />
                        : <span data-card-loading-content="true">内容加载完成</span>}
                </span>}
                description={description.map((line, index) => <span
                    key={line}
                    className={lineStyle}
                    data-card-loading-slot={`description-${index + 1}`}
                >
                    {placeholder
                        ? <Skeleton variant="rect" width={index === 2 ? '75%' : '100%'} height="0.6lh" className={textPlaceholderStyle} data-card-loading-placeholder="true" />
                        : <span data-card-loading-content="true">{line}</span>}
                </span>)}
            />
        </Card.Body>,
    ];
}

const LoadingDemo = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div className={stackStyle} data-card-loading-demo="">
            <Button appearance="outlined" data-card-loading-toggle="" onClick={() => setLoading((prev) => !prev)}>
                {loading ? '完成加载' : '重新加载'}
            </Button>
            <Card loading={loading} loadingContent={content(true)} data-card-loading-card="">
                {content(false)}
            </Card>
            <span role="status" data-card-loading-status="">{loading ? '正在加载卡片内容。' : '卡片内容已加载。'}</span>
        </div>
    );
};

export default LoadingDemo;
