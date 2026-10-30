import { cx } from '@crab-dev/css';
import { bodyStyle } from './card-body.styles.js';
import type { CardBodyProps } from '../types.js';

// 内容区：flex:1 让 footer 在等高卡片网格中沉底；
// 紧跟标题区时顶距压缩为区块间距，避免 pad + pad 的双倍留白。

const CardBody = ({ children, className, ref, ...restProps }: CardBodyProps) => (
    <div {...restProps} ref={ref} className={cx(bodyStyle, className)}>
        {children}
    </div>
);

export default CardBody;
