import { cx } from '@crab-dev/css';
import { coverStyle } from './card-cover.styles.js';
import type { CardCoverProps } from '../types.js';

// 封面出血容器：占位底色垫在媒体加载前；媒体随卡片悬浮同步缩放
// （--rc-card-cover-scale 由卡片容器驱动），overflow 由卡片根节点裁切。

const CardCover = ({ children, className, ref, ...restProps }: CardCoverProps) => (
    <div {...restProps} ref={ref} data-card-cover="" className={cx(coverStyle, className)}>
        {children}
    </div>
);

export default CardCover;
