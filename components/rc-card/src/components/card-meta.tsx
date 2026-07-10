import { css, cx } from '@linaria/core';
import token from '../token.js';
import type { CardMetaProps } from '../types.js';

// Meta 组合：头像 + (标题 / 描述) 横排，文本列 min-width:0 保证长文本可截断。
const metaStyle = css`
    display: flex;
    align-items: flex-start;
    gap: ${token.meta.gap};
    min-width: 0;
`;

const avatarStyle = css`
    flex-shrink: 0;
`;

const textStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.meta['text-gap']};
    min-width: 0;
`;

const titleStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${token.meta['title-color']};
    font-size: ${token.meta['title-size']};
    font-weight: ${token.meta['title-weight']};
    line-height: 1.5;
`;

const descriptionStyle = css`
    color: ${token.meta['desc-color']};
    font-size: ${token.meta['desc-size']};
    line-height: 1.5;
`;

const CardMeta = ({ avatar, title, description, className, ref, ...restProps }: CardMetaProps) => (
    <div {...restProps} ref={ref} className={cx(metaStyle, className)}>
        {avatar != null && <div className={avatarStyle}>{avatar}</div>}
        <div className={textStyle}>
            {title != null && <div className={titleStyle}>{title}</div>}
            {description != null && <div className={descriptionStyle}>{description}</div>}
        </div>
    </div>
);

export default CardMeta;
