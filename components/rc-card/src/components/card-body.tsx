import { css, cx } from '@linaria/core';
import token from '../token.js';
import type { CardBodyProps } from '../types.js';

// 内容区：flex:1 让 footer 在等高卡片网格中沉底；
// 紧跟标题区时顶距压缩为区块间距，避免 pad + pad 的双倍留白。
const bodyStyle = css`
    flex: 1 1 auto;
    padding: var(--rc-card-pad, ${token.size.middle.padding});
    color: ${token.body.color};
    font-size: ${token.body['font-size']};
    line-height: ${token.body['line-height']};

    [data-card-header] + & {
        padding-top: var(--rc-card-gap, ${token.size.middle.gap});
    }
`;

const CardBody = ({ children, className, ref, ...restProps }: CardBodyProps) => (
    <div {...restProps} ref={ref} className={cx(bodyStyle, className)}>
        {children}
    </div>
);

export default CardBody;
