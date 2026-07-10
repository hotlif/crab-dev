import { css, cx } from '@linaria/core';
import token from '../token.js';
import type { CardCoverProps } from '../types.js';

// 封面出血容器：占位底色垫在媒体加载前；媒体随卡片悬浮同步缩放
// （--rc-card-cover-scale 由卡片容器驱动），overflow 由卡片根节点裁切。
const coverStyle = css`
    position: relative;
    overflow: hidden;
    background-color: ${token.cover.background};

    & > img,
    & > video {
        display: block;
        width: 100%;
        object-fit: cover;
        transform: scale(var(--rc-card-cover-scale, 1));
        transition: ${token.motion.cover};
    }

    @media (prefers-reduced-motion: reduce) {
        & > img,
        & > video {
            transform: none;
            transition: none;
        }
    }
`;

const CardCover = ({ children, className, ref, ...restProps }: CardCoverProps) => (
    <div {...restProps} ref={ref} data-card-cover="" className={cx(coverStyle, className)}>
        {children}
    </div>
);

export default CardCover;
