import { css, cx } from '@crab-dev/css';
import { use, type MouseEvent } from 'react';
import token from '../token.js';
import { CardContext } from '../context.js';
import type { CardFooterProps } from '../types.js';

// 操作区：分割线 + 靠右排布；margin-top:auto 保证在等高网格中沉底。
// L2 无 divider 令牌，分割线颜色复用 border.default（库内既定 workaround）。
const footerStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.footer.gap};
    margin-top: auto;
    padding: ${token.footer['padding-y']} var(--rc-card-pad, ${token.size.middle.padding});
    border-top: 1px solid ${token.footer['divider-color']};
`;

const CardFooter = ({ children, className, ref, ...restProps }: CardFooterProps) => {
    const { clickable } = use(CardContext);

    // 整卡可点击时, 操作区内点击不得冒泡触发整卡 onClick（事件隔离）。
    // 键盘路径由焦点所在控件自行消费 Enter / Space, 无需等价处理。
    const stopBubble = clickable
        ? (e: MouseEvent<HTMLDivElement>) => e.stopPropagation()
        : undefined;

    return (
        <div {...restProps} ref={ref} className={cx(footerStyle, className)} onClick={stopBubble}>
            {children}
        </div>
    );
};

export default CardFooter;
