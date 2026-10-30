import { cx } from '@crab-dev/css';
import { metaStyle, avatarStyle, textStyle, titleStyle, descriptionStyle } from './card-meta.styles.js';
import type { CardMetaProps } from '../types.js';

// Meta 组合：头像 + (标题 / 描述) 横排，文本列 min-width:0 保证长文本可截断。





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
